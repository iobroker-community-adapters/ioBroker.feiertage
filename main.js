/* jshint -W097 */// jshint strict:false
/*jslint node: true */

'use strict';
const utils = require('@iobroker/adapter-core'); // Get common adapter utils
const holidays = require('./admin/holidays').holidays; // Get common adapter utils
const adapterName  = require('./package.json').name.split('.').pop();
let terminatingTimer;
let lang = 'de';
let adapter;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function startAdapter(options) {
    options = options || {};

    Object.assign(options, {
        name: adapterName,
        useFormatDate: true,
        ready: async () => await main(),
    });

    adapter = new utils.Adapter(options);

    return adapter;
}

function readSettings() {
    let isOneEnabled = false;
    for (const h in holidays) {
        holidays[h].enabled = (adapter.config['enable_' + h] !== undefined) ?
            (adapter.config['enable_' + h] === true || adapter.config['enable_' + h] === 'true') :
            holidays[h].enabled;

        if (holidays[h].enabled) {
            isOneEnabled = true;
        }
    }
    return isOneEnabled;
}

// Get the name of holiday for the day of the year
function getHoliday(day, isLeap, easter, advent4, year, _lang) {
    _lang = _lang || lang;

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
                const april30num = Math.ceil((april30date - newYear) / ONE_DAY_MS + 1);
                const mday = april30num - april30date.getDay() + holidays[h].april30Offset;

                if (mday === day) {
                    return holidays[h][_lang] + (holidays[h]['comment_' + _lang] ? ' ' + holidays[h]['comment_' + _lang] : '');
                }
            }
            if (holidays[h].michaelisOffset !== 'undefined') {
                const newYear = new Date(year, 0, 1);
                const michaelisDate = new Date(year, 8, 29, 0, 0, 0);
                const michaelisNum = Math.ceil((michaelisDate - newYear) / ONE_DAY_MS + 1);

                if ((michaelisNum + (holidays[h].michaelisOffset - michaelisDate.getDay())) === day) {
                    return holidays[h][_lang] + (holidays[h]['comment_' + _lang] ? ' ' + holidays[h]['comment_' + _lang] : '');
                }
            }
        }
    }
    return '';
}

function getDateFromYearsDay(day, year) {
    const dayMs = (day - 1) * ONE_DAY_MS; // Day of the year in ms from 01.01 00:00:00
    const newYear = new Date(year, 0, 1, 0, 0, 0, 0);     // This year 01.01 00:00:00
    const newYearMs = newYear.getTime();
    const date = new Date();

    date.setTime(newYearMs + dayMs);                      // Add to current New year the ms
    return date;
}

function getIsLeap(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0) ? 1 : 0;
}

function getEastern(year) {
    // The modified Gauss-Formula to calculate catholic eastern, valid till 2048
    const A = 120 + (19 * (year % 19) + 24) % 30;
    const B = (A + Math.floor(5 * year / 4)) % 7;
    // Easter sunday: day of the year
    return A - B - 33 + getIsLeap(year);
}

function getAdvent4(year) {
    // 4th advent (sunday before first christmas day)
    const newYear = new Date(year, 0, 1);
    const christmas1 = new Date(year, 11, 25, 12, 0, 0);
    const advent4date = new Date(christmas1.getTime() - ((!christmas1.getDay() ? 7 : christmas1.getDay()) * ONE_DAY_MS));
    return Math.ceil((advent4date.setHours(0, 0, 0, 0) - newYear) / ONE_DAY_MS + 1);
}

// check the holidays
async function checkHolidays() {
    if (!readSettings()) {
        adapter.log.error('No one holiday is enabled');
        return stopAdapter();
    }
    const now = new Date();
    let year = now.getFullYear();
    let isLeap = getIsLeap(year);

    // Easter sunday: day of the year
    let easter = getEastern(year);

    // Day of the year
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const newYear = new Date(year, 0, 1);
    const diffDays = (todayStart - newYear) / ONE_DAY_MS + 1;
    let day = Math.ceil(diffDays);
    const todayIs = Math.ceil(diffDays);

    // 4th advent (sunday before first christmas day)
    let advent4 = getAdvent4(year);

    // today (day)
    let hd = getHoliday(day, isLeap, easter, advent4, year);
    adapter.setState('heute.Name', {ack: true, val: getHoliday(day, isLeap, easter, advent4, year, 'de')});
    adapter.setState('heute.boolean', {ack: true, val: !!hd});
    adapter.setState('today.name', {ack: true, val: hd});
    adapter.setState('today.boolean', {ack: true, val: !!hd});

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
        tommoIsLeap = getIsLeap(tommoYear);
        tommoEaster = getEastern(tommoYear);
        tommoAdvent4 = getAdvent4(tommoYear);
    }
    hd = getHoliday(tommo, tommoIsLeap, tommoEaster, tommoAdvent4, tommoYear);
    await adapter.setStateAsync('morgen.Name', {ack: true, val: getHoliday(tommo, tommoIsLeap, tommoEaster, tommoAdvent4, tommoYear, 'de')});
    await adapter.setStateAsync('morgen.boolean', {ack: true, val: !!hd});
    await adapter.setStateAsync('tomorrow.name', {ack: true, val: hd});
    await adapter.setStateAsync('tomorrow.boolean', {ack: true, val: !!hd});

    // the day after tomorrow (datommo)
    let datommo = day + 2;
    let datommoYear = year;
    let datommoIsLeap = isLeap;
    let datommoEaster = easter;
    let datommoAdvent4 = advent4;
    if (datommo > 365 + isLeap) {
        datommo = 1;
    }
    if (datommo < todayIs) {
        datommoYear++;
        datommoIsLeap = getIsLeap(datommoYear);
        datommoEaster = getEastern(datommoYear);
        datommoAdvent4 = getAdvent4(datommoYear);
    }
    hd = getHoliday(datommo, datommoIsLeap, datommoEaster, datommoAdvent4, datommoYear);
    await adapter.setStateAsync('uebermorgen.Name', {ack: true, val: getHoliday(datommo, datommoIsLeap, datommoEaster, datommoAdvent4, datommoYear, 'de')});
    await adapter.setStateAsync('uebermorgen.boolean', {ack: true, val: !!hd});
    await adapter.setStateAsync('aftertomorrow.name', {ack: true, val: hd});
    await adapter.setStateAsync('aftertomorrow.boolean', {ack: true, val: !!hd});

    // next holiday
    let duration = 0;
    do {
        day++;
        if (day > 365 + isLeap) {
            day = 1;
        }
        duration = duration + 1;
        hd = getHoliday(day, isLeap, easter, advent4, year);

        if (hd) {
            if (day < todayIs) {
                year++;
                isLeap = getIsLeap(year);
                easter = getEastern(year);
                advent4 = getAdvent4(year);
            }
            const date = getDateFromYearsDay(day, year);
            await adapter.setStateAsync('naechster.Name', {ack: true, val: getHoliday(day, isLeap, easter, advent4, year, 'de')});
            await adapter.setStateAsync('next.name', {ack: true, val: hd});

            const nextHoliday = adapter.formatDate(date);
            adapter.log.info(`Next holiday: ${hd} is in ${duration} days on ${nextHoliday}`);

            await adapter.setStateAsync('naechster.Datum', nextHoliday, true);
            await adapter.setStateAsync('next.date', nextHoliday, true);

            await adapter.setStateAsync('naechster.Dauer', duration, true);
            await adapter.setStateAsync('next.duration', duration, true);
            break;
        }
    } while (!hd);

    adapter.log.info('adapter feiertage objects written');
    stopAdapter();
}

function stopAdapter(isTimeout) {
    clearTimeout(terminatingTimer);
    if (isTimeout) {
        adapter.log.info('force terminating after 1 minute');
    }
    adapter.stop();
}

async function main() {
    terminatingTimer = setTimeout(() =>
        stopAdapter(true), 60000);

    const data = await adapter.getForeignObjectAsync('system.config');
    if (data && data.common) {
        lang = data.common.language;
    }

    adapter.log.debug('adapter feiertage initializing objects');
    await checkHolidays();
}

// If started as allInOne mode => return function to create instance
// @ts-ignore
if (module.parent) {
    module.exports = startAdapter;
} else {
    // or start the instance directly
    startAdapter();
}
