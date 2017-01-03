/* jshint -W097 */// jshint strict:false
/*jslint node: true */

"use strict";
var utils    = require(__dirname + '/lib/utils'); // Get common adapter utils
var holidays = require(__dirname + '/admin/holidays').holidays; // Get common adapter utils

var lang = 'de';

var adapter = utils.adapter({
    name:           'feiertage',
    useFormatDate:  true
});

adapter.on('ready', function () {
    adapter.getForeignObject('system.config', function (err, data) {
        if (data && data.common) {
            lang  = data.common.language;
        }

        adapter.log.debug('adapter feiertage initializing objects');
        checkHolidays();
        adapter.log.info('adapter feiertage objects written');

        setTimeout(function () {
            adapter.log.info('force terminating after 1 minute');
            adapter.stop();
        }, 60000);

    });
});
 
function readSettings() {
    var isOneEnabled = false;
    for (var h in holidays) {
        holidays[h].enabled = (adapter.config['enable_' + h] !== undefined) ? (adapter.config['enable_' + h] === true || adapter.config['enable_' + h] === 'true') : holidays[h].enabled;
        if (holidays[h].enabled) isOneEnabled = true;
    }
    return isOneEnabled;
} 

// Get the name of holiday for the day of the year
function getHoliday(day, isLeap, easter, advent4, year, _lang) {
    _lang = _lang || lang;

    for (var h in holidays) {
        if (holidays[h].enabled) {
            if (holidays[h].offset !== 'undefined' && (1 + holidays[h].offset + (holidays[h].offset >= 59 ? isLeap : 0)) == day) {
                return holidays[h][_lang] + (holidays[h]['comment_' + _lang] ? ' ' + holidays[h]['comment_' + _lang] : '');
            }
            if (holidays[h].easterOffset !== 'undefined' && (easter + holidays[h].easterOffset) == day) {
                return holidays[h][_lang] + (holidays[h]['comment_' + _lang] ? ' ' + holidays[h]['comment_' + _lang] : '');
            }
            if (holidays[h].advent4Offset !== 'undefined' && (advent4 + holidays[h].advent4Offset) == day) {
                return holidays[h][_lang] + (holidays[h]['comment_' + _lang] ? ' ' + holidays[h]['comment_' + _lang] : '');
            }
            if (holidays[h].april30Offset !== 'undefined') {
                var newYear = new Date(year, 0, 1);
                var april30date = new Date(year, 3, 30, 0, 0, 0);
                var april30num = Math.ceil((april30date - newYear) / (24 * 60 * 60 * 1000) + 1);
                var mday = april30num - april30date.getDay() + holidays[h].april30Offset;

                if (mday == day) {
                  return holidays[h][_lang] + (holidays[h]['comment_' + _lang] ? ' ' + holidays[h]['comment_' + _lang] : '');
                }
            }
            if (holidays[h].michaelisOffset !== 'undefined') {
                var newYear = new Date(year, 0, 1);
                var michaelisDate = new Date(year, 8, 29, 0, 0, 0);
                var michaelisNum = Math.ceil((michaelisDate - newYear) / (24 * 60 * 60 * 1000) + 1);

                if ((michaelisNum + (holidays[h].michaelisOffset - michaelisDate.getDay())) == day) {
                  return holidays[h][_lang] + (holidays[h]['comment_' + _lang] ? ' ' + holidays[h]['comment_' + _lang] : '');
                }
            }
        }
    }
    return '';
} 

function getDateFromYearsDay(day, year) {
    var dayMs     = (day-1) * 24 * 60 * 60 * 1000; // Day of the year in ms from 01.01 00:00:00
    var newYear   = new Date(year, 0, 1, 0, 0, 0, 0);     // This year 01.01 00:00:00
    var newYearMs = newYear.getTime();
    var date      = new Date();
    
    date.setTime(newYearMs + dayMs);                      // Add to current New year the ms
    return date;    
}

// check the holidays
function checkHolidays() {
    if (!readSettings()) {
        adapter.log.error('No one holiday is enabled');
        adapter.stop();
        return;
    }
    var now    = new Date();
    var year   = now.getFullYear();
    var isLeap = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0) ? 1 : 0;

    // THe modified Gauss-Formula to calculate catholic eastern, valid till 2048
    var A = 120 + (19 * (year % 19) + 24) % 30;
    var B = (A + parseInt(5 * year / 4)) % 7;
    // Easter sunday: day of the year
    var easter = A - B - 33 + isLeap;

    // Day of the year
    var todayStart = new Date(now.setHours(0, 0, 0, 0));
    var newYear    = new Date(year, 0, 1);
    var diffDays   = (todayStart - newYear) / (24 * 60 * 60 * 1000) + 1;
    var day        = Math.ceil(diffDays);

    // 4th advent (sunday before first christmas day)
    var christmas1 = new Date(year, 11, 25, 12, 0, 0);
    var advent4date = new Date(christmas1.getTime() - (((christmas1.getDay() == 0) ? 7 : christmas1.getDay()) * (24 * 60 * 60 * 1000)));
    var advent4 = Math.ceil((advent4date.setHours(0, 0, 0, 0) - newYear) / (24 * 60 * 60 * 1000) + 1);

    // today
    var hd = getHoliday(day, isLeap, easter, advent4, year);
    adapter.setState('heute.Name',    {ack: true, val: getHoliday(day, isLeap, easter, advent4, year, 'de')});
    adapter.setState('heute.boolean', {ack: true, val: !!hd});
    adapter.setState('today.name',    {ack: true, val: hd});
    adapter.setState('today.boolean', {ack: true, val: !!hd});

    // tomorrow
    day = day + 1;
    if (day > 365 + isLeap) day = 1;
    hd = getHoliday(day, isLeap, easter, advent4, year);
    adapter.setState('morgen.Name',      {ack: true, val: getHoliday(day, isLeap, easter, advent4, year, 'de')});
    adapter.setState('morgen.boolean',   {ack: true, val: !!hd});
    adapter.setState('tomorrow.name',    {ack: true, val: hd});
    adapter.setState('tomorrow.boolean', {ack: true, val: !!hd});

    // the day after tomorrow
    day = day + 1;
    if (day > 365 + isLeap) day = 1;
    hd = getHoliday(day, isLeap, easter, advent4, year);
    adapter.setState('uebermorgen.Name',      {ack: true, val: getHoliday(day, isLeap, easter, advent4, year, 'de')});
    adapter.setState('uebermorgen.boolean',   {ack: true, val: !!hd});
    adapter.setState('aftertomorrow.name',    {ack: true, val: hd});
    adapter.setState('aftertomorrow.boolean', {ack: true, val: !!hd});

    // next holiday
    var duration = 0;
    day = day - 2; // shift back to "today" so that we calculate everything relative to it
    do {
        day = day + 1;
        if (day > 365 + isLeap) day = 1;
        duration = duration + 1;
        hd = getHoliday(day, isLeap, easter, advent4, year);

        if (hd) {
            var date = getDateFromYearsDay(day, year);
            adapter.setState('naechster.Name', {ack: true, val: getHoliday(day, isLeap, easter, advent4, year, 'de')});
            adapter.setState('next.name',      {ack: true, val: hd});

            var nextHoliday = adapter.formatDate(date);
            adapter.log.info('Next holiday: ' + hd + ' is in ' + duration + ' days on ' + nextHoliday);

            adapter.setState('naechster.Datum', nextHoliday, true);
            adapter.setState('next.date',       nextHoliday, true);

            adapter.setState('naechster.Dauer', duration, true);
            adapter.setState('next.duration',   duration, true, function () {
                adapter.stop();
            });
            break;
        }
    } while (!hd);
}
