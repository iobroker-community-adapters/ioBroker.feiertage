'use strict';

const utils = require('@iobroker/adapter-core');
const holidays = require('./admin/holidays').holidays; // Get common adapter utils
const holidayMath = require('./lib/holidayMath');
const adapterName = require('./package.json').name.split('.').pop();

const ONE_DAY_MS = holidayMath.ONE_DAY_MS;

class Feiertage extends utils.Adapter {
    constructor(options) {
        super({
            ...options,
            name: adapterName,
            useFormatDate: true,
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

        if (!holidayMath.isEasterYearSupported(year)) {
            this.log.warn(
                `Easter calculation may be inaccurate for year ${year} ` +
                    `(Gauss algorithm is documented as valid until ${holidayMath.EASTER_ALGORITHM_VALID_UNTIL}). ` +
                    `Holiday-related dates derived from Easter (Karfreitag, Ostermontag, Pfingsten, Fronleichnam, ...) ` +
                    `may be off by up to one week.`,
            );
        }

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
        this.setState('heute.Name', { ack: true, val: this.getHoliday(day, isLeap, easter, advent4, year, 'de') });
        this.setState('heute.boolean', { ack: true, val: !!hd });
        this.setState('today.name', { ack: true, val: hd });
        this.setState('today.boolean', { ack: true, val: !!hd });

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
        await this.setStateAsync('morgen.Name', {
            ack: true,
            val: this.getHoliday(tommo, tommoIsLeap, tommoEaster, tommoAdvent4, tommoYear, 'de'),
        });
        await this.setStateAsync('morgen.boolean', { ack: true, val: !!hd });
        await this.setStateAsync('tomorrow.name', { ack: true, val: hd });
        await this.setStateAsync('tomorrow.boolean', { ack: true, val: !!hd });

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
        await this.setStateAsync('uebermorgen.Name', {
            ack: true,
            val: this.getHoliday(datommo, datommoIsLeap, datommoEaster, datommoAdvent4, datommoYear, 'de'),
        });
        await this.setStateAsync('uebermorgen.boolean', { ack: true, val: !!hd });
        await this.setStateAsync('aftertomorrow.name', { ack: true, val: hd });
        await this.setStateAsync('aftertomorrow.boolean', { ack: true, val: !!hd });

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
                await this.setStateAsync('naechster.Name', {
                    ack: true,
                    val: this.getHoliday(day, isLeap, easter, advent4, year, 'de'),
                });
                await this.setStateAsync('next.name', { ack: true, val: hd });

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
            holidays[h].enabled =
                this.config[`enable_${h}`] !== undefined
                    ? this.config[`enable_${h}`] === true || this.config[`enable_${h}`] === 'true'
                    : holidays[h].enabled;

            if (holidays[h].enabled) {
                isOneEnabled = true;
            }
        }

        return isOneEnabled;
    }

    // Holiday calculations are delegated to lib/holidayMath.js (pure functions, unit-tested).
    // The wrapper methods preserve the original instance-method API so existing internal
    // call sites (and any subclassing or external monkey-patching) keep working.

    /**
     * Wrapper around the pure {@link holidayMath.getHoliday} function which
     * supplies the global `holidays` table and `this.lang` as defaults.
     *
     * @param {number} day - Day of year, 1-based
     * @param {0|1} isLeap - Leap-year flag for the same year
     * @param {number} easter - Day-of-year of Easter Sunday
     * @param {number} advent4 - Day-of-year of the 4th advent
     * @param {number} year - Calendar year
     * @param {string} [_lang] - Language code; falls back to this.lang
     * @returns {string} Localised holiday name, or empty string if none
     */
    getHoliday(day, isLeap, easter, advent4, year, _lang) {
        return holidayMath.getHoliday(holidays, day, isLeap, easter, advent4, year, _lang || this.lang);
    }

    getDateFromYearsDay(day, year) {
        return holidayMath.getDateFromYearsDay(day, year);
    }

    getIsLeap(year) {
        return holidayMath.getIsLeap(year);
    }

    getEastern(year) {
        return holidayMath.getEastern(year);
    }

    getAdvent4(year) {
        return holidayMath.getAdvent4(year);
    }

    onUnload(callback) {
        try {
            this.log.debug('cleaned everything up...');
            callback();
        } catch {
            callback();
        }
    }
}

// @ts-expect-error parent is a valid property on module
if (module.parent) {
    // Export the constructor in compact mode
    /**
     * @param {Partial<utils.AdapterOptions>} [options] - The adapter options
     */
    module.exports = options => new Feiertage(options);
} else {
    // otherwise start the instance directly
    new Feiertage();
}
