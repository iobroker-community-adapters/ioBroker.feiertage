'use strict';

const utils = require('@iobroker/adapter-core');
const holidays = require('./admin/holidays').holidays; // Get common adapter utils
const adapterName = require('./package.json').name.split('.').pop();

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

class Feiertage extends utils.Adapter {

    constructor(options) {
        super({
            ...options,
            name: adapterName,
            useFormatDate: true
        });

        this.lang = 'de';

        this.on('ready', this.onReady.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }

    async onReady() {
        const data = await this.getForeignObjectAsync('system.config');
        if (data && data.common) {
            this.lang = data.common.language;
            this.log.debug(`Using language "${this.lang}" from system config`);
        }

        await this.checkHolidays();
        this.stop();
    }

    // check the holidays
    async checkHolidays() {
        if (!this.readSettings()) {
            this.log.error('No holiday is enabled');
            return false;
        }

        const now = new Date();
        let year = now.getFullYear();
        let isLeap = this.getIsLeap(year);

        // Easter sunday: day of the year
        let easter = this.getEastern(year);

        // Day of the year
        const todayStart = new Date(now.setHours(0, 0, 0, 0));
        const newYear = new Date(year, 0, 1);
        const diffDays = (todayStart.getTime() - newYear.getTime()) / ONE_DAY_MS + 1;
        let day = Math.ceil(diffDays);
        const todayIs = Math.ceil(diffDays);

        // 4th advent (sunday before first christmas day)
        let advent4 = this.getAdvent4(year);

        // today (day)
        let hd = this.getHoliday(day, isLeap, easter, advent4, year);
        this.setState('heute.Name', {ack: true, val: this.getHoliday(day, isLeap, easter, advent4, year, 'de')});
        this.setState('heute.boolean', {ack: true, val: !!hd});
        this.setState('today.name', {ack: true, val: hd});
        this.setState('today.boolean', {ack: true, val: !!hd});

        // tomorrow (tommo)
        let tommo = day + 1;
        let tommoYear = year;
        let tommoIsLeap = isLeap;
        let tommoEaster = easter;
        let tommoAdvent4 = advent4;
        if (tommo > 365 + isLeap) {
            tommo = 1;
        }
        if (tommo < todayIs) {
            tommoYear++;
            tommoIsLeap = this.getIsLeap(tommoYear);
            tommoEaster = this.getEastern(tommoYear);
            tommoAdvent4 = this.getAdvent4(tommoYear);
        }
        hd = this.getHoliday(tommo, tommoIsLeap, tommoEaster, tommoAdvent4, tommoYear);
        await this.setStateAsync('morgen.Name', {ack: true, val: this.getHoliday(tommo, tommoIsLeap, tommoEaster, tommoAdvent4, tommoYear, 'de')});
        await this.setStateAsync('morgen.boolean', {ack: true, val: !!hd});
        await this.setStateAsync('tomorrow.name', {ack: true, val: hd});
        await this.setStateAsync('tomorrow.boolean', {ack: true, val: !!hd});

        // the day after tomorrow (datommo)
        let datommo = day + 2;
        let datommoYear = year;
        let datommoIsLeap = isLeap;
        let datommoEaster = easter;
        let datommoAdvent4 = advent4;
        if (datommo > 365 + isLeap) {
            datommo = 2;
        }
        if (datommo < todayIs) {
            datommoYear++;
            datommoIsLeap = this.getIsLeap(datommoYear);
            datommoEaster = this.getEastern(datommoYear);
            datommoAdvent4 = this.getAdvent4(datommoYear);
        }
        hd = this.getHoliday(datommo, datommoIsLeap, datommoEaster, datommoAdvent4, datommoYear);
        await this.setStateAsync('uebermorgen.Name', {ack: true, val: this.getHoliday(datommo, datommoIsLeap, datommoEaster, datommoAdvent4, datommoYear, 'de')});
        await this.setStateAsync('uebermorgen.boolean', {ack: true, val: !!hd});
        await this.setStateAsync('aftertomorrow.name', {ack: true, val: hd});
        await this.setStateAsync('aftertomorrow.boolean', {ack: true, val: !!hd});

        // next holiday
        let duration = 0;
        do {
            day++;
            if (day > 365 + isLeap) {
                day = 1;
            }
            duration = duration + 1;
            hd = this.getHoliday(day, isLeap, easter, advent4, year);

            if (hd) {
                if (day < todayIs) {
                    year++;
                    isLeap = this.getIsLeap(year);
                    easter = this.getEastern(year);
                    advent4 = this.getAdvent4(year);
                }
                const date = this.getDateFromYearsDay(day, year);
                await this.setStateAsync('naechster.Name', {ack: true, val: this.getHoliday(day, isLeap, easter, advent4, year, 'de')});
                await this.setStateAsync('next.name', {ack: true, val: hd});

                const nextHoliday = this.formatDate(date);
                this.log.info(`Next holiday: ${hd} is in ${duration} days on ${nextHoliday}`);

                await this.setStateAsync('naechster.Datum', nextHoliday, true);
                await this.setStateAsync('next.date', nextHoliday, true);

                await this.setStateAsync('naechster.Dauer', duration, true);
                await this.setStateAsync('next.duration', duration, true);
                break;
            }
        } while (!hd);

        this.log.info('all objects written');

        return true;
    }

    readSettings() {
        let isOneEnabled = false;

        for (const h in holidays) {
            holidays[h].enabled = (this.config[`enable_${h}`] !== undefined) ?
                (this.config[`enable_${h}`] === true || this.config[`enable_${h}`] === 'true') :
                holidays[h].enabled;

            if (holidays[h].enabled) {
                isOneEnabled = true;
            }
        }

        return isOneEnabled;
    }

    // Get the name of holiday for the day of the year
    getHoliday(day, isLeap, easter, advent4, year, _lang) {
        _lang = _lang || this.lang;

        for (const h in holidays) {
            if (holidays[h].enabled) {
                if (holidays[h].offset !== 'undefined' && (1 + holidays[h].offset + (holidays[h].offset >= 59 ? isLeap : 0)) === day) {
                    return holidays[h][_lang] + (holidays[h]['comment_' + _lang] ? ' ' + holidays[h]['comment_' + _lang] : '');
                }
                if (holidays[h].easterOffset !== 'undefined' && (easter + holidays[h].easterOffset) === day) {
                    return holidays[h][_lang] + (holidays[h]['comment_' + _lang] ? ' ' + holidays[h]['comment_' + _lang] : '');
                }
                if (holidays[h].advent4Offset !== 'undefined' && (advent4 + holidays[h].advent4Offset) === day) {
                    return holidays[h][_lang] + (holidays[h]['comment_' + _lang] ? ' ' + holidays[h]['comment_' + _lang] : '');
                }
                if (holidays[h].april30Offset !== 'undefined') {
                    const newYear = new Date(year, 0, 1);
                    const april30date = new Date(year, 3, 30, 0, 0, 0);
                    const april30num = Math.ceil((april30date.getTime() - newYear.getTime()) / ONE_DAY_MS + 1);
                    const mday = april30num - april30date.getDay() + holidays[h].april30Offset;

                    if (mday === day) {
                        return holidays[h][_lang] + (holidays[h]['comment_' + _lang] ? ' ' + holidays[h]['comment_' + _lang] : '');
                    }
                }
                if (holidays[h].michaelisOffset !== 'undefined') {
                    const newYear = new Date(year, 0, 1);
                    const michaelisDate = new Date(year, 8, 29, 0, 0, 0);
                    const michaelisNum = Math.ceil((michaelisDate.getTime() - newYear.getTime()) / ONE_DAY_MS + 1);

                    if ((michaelisNum + (holidays[h].michaelisOffset - michaelisDate.getDay())) === day) {
                        return holidays[h][_lang] + (holidays[h]['comment_' + _lang] ? ' ' + holidays[h]['comment_' + _lang] : '');
                    }
                }
            }
        }

        return '';
    }

    getDateFromYearsDay(day, year) {
        const dayMs = (day - 1) * ONE_DAY_MS; // Day of the year in ms from 01.01 00:00:00
        const newYear = new Date(year, 0, 1, 0, 0, 0, 0); // This year 01.01 00:00:00
        const newYearMs = newYear.getTime();
        const date = new Date();

        date.setTime(newYearMs + dayMs); // Add to current New year the ms
        return date;
    }

    getIsLeap(year) {
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0) ? 1 : 0;
    }

    getEastern(year) {
        // The modified Gauss-Formula to calculate catholic eastern, valid till 2048
        const A = 120 + (19 * (year % 19) + 24) % 30;
        const B = (A + Math.floor(5 * year / 4)) % 7;
        // Easter sunday: day of the year
        return A - B - 33 + this.getIsLeap(year);
    }

    getAdvent4(year) {
        // 4th advent (sunday before first christmas day)
        const newYear = new Date(year, 0, 1);
        const christmas1 = new Date(year, 11, 25, 12, 0, 0);
        const advent4date = new Date(christmas1.getTime() - ((!christmas1.getDay() ? 7 : christmas1.getDay()) * ONE_DAY_MS));
        return Math.ceil((advent4date.setHours(0, 0, 0, 0) - newYear.getTime()) / ONE_DAY_MS + 1);
    }

    onUnload(callback) {
        try {
            this.log.debug('cleaned everything up...');
            callback();
        } catch (e) {
            callback();
        }
    }
}

// @ts-ignore parent is a valid property on module
if (module.parent) {
    // Export the constructor in compact mode
    /**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */
    module.exports = (options) => new Feiertage(options);
} else {
    // otherwise start the instance directly
    new Feiertage();
}
