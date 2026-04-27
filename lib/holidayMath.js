'use strict';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// The Gauss-Easter algorithm used here is documented to be accurate up to 2048.
// Beyond that year, the result starts to drift (off by one week in some years).
// Callers should check via isEasterYearSupported() and warn the user.
const EASTER_ALGORITHM_VALID_UNTIL = 2048;

/**
 * Returns 1 if the given year is a leap year, 0 otherwise.
 *
 * @param {number} year - Calendar year
 * @returns {0|1} 1 if leap, 0 otherwise
 */
function getIsLeap(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 1 : 0;
}

/**
 * Modified Gauss-Formula for catholic Easter Sunday, returned as day-of-year (1-based).
 * Documented valid up to 2048. For 2049+ use isEasterYearSupported() to detect drift.
 *
 * @param {number} year - Calendar year
 * @returns {number} Day of year of Easter Sunday (1-based)
 */
function getEastern(year) {
    const A = 120 + ((19 * (year % 19) + 24) % 30);
    const B = (A + Math.floor((5 * year) / 4)) % 7;
    return A - B - 33 + getIsLeap(year);
}

/**
 * Whether the Easter algorithm is documented to produce correct results for the given year.
 * Beyond {@link EASTER_ALGORITHM_VALID_UNTIL} the algorithm starts to drift.
 *
 * @param {number} year - Calendar year
 * @returns {boolean} true if the algorithm is documented to be accurate for that year
 */
function isEasterYearSupported(year) {
    return year <= EASTER_ALGORITHM_VALID_UNTIL;
}

/**
 * Day-of-year (1-based) of the 4th advent (the Sunday before Christmas Day, 24 December at the latest).
 *
 * @param {number} year - Calendar year
 * @returns {number} Day of year of the 4th advent (1-based)
 */
function getAdvent4(year) {
    const newYear = new Date(year, 0, 1);
    const christmas1 = new Date(year, 11, 25, 12, 0, 0);
    const advent4date = new Date(christmas1.getTime() - (!christmas1.getDay() ? 7 : christmas1.getDay()) * ONE_DAY_MS);
    return Math.ceil((advent4date.setHours(0, 0, 0, 0) - newYear.getTime()) / ONE_DAY_MS + 1);
}

/**
 * Convert a 1-based day-of-year + year into a JS Date (local timezone, midnight).
 *
 * @param {number} day - Day of year, 1-based
 * @param {number} year - Calendar year
 * @returns {Date} Local-midnight Date object for the given (year, day)
 */
function getDateFromYearsDay(day, year) {
    const dayMs = (day - 1) * ONE_DAY_MS;
    const newYear = new Date(year, 0, 1, 0, 0, 0, 0);
    const date = new Date();
    date.setTime(newYear.getTime() + dayMs);
    return date;
}

/**
 * For a given day-of-year, return the localised name of the holiday on that day,
 * or an empty string if none of the configured holidays match.
 *
 * Holiday entries support five date-resolution strategies:
 *   - `offset`         : fixed day-of-year (with leap-day adjustment past Feb 29)
 *   - `easterOffset`   : days relative to Easter Sunday
 *   - `advent4Offset`  : days relative to the 4th advent
 *   - `april30Offset`  : Mother's Day pattern (offset from 30 April, picks the matching weekday)
 *   - `michaelisOffset`: Erntedankfest pattern (offset from 29 September)
 *
 * Holidays without `enabled === true` are skipped.
 *
 * @param {Record<string, any>} holidaysData - Map of holiday-key → holiday-definition
 * @param {number} day - Day of year, 1-based
 * @param {0|1} isLeap - Leap-year flag for the same year
 * @param {number} easter - Day-of-year of Easter Sunday (from getEastern())
 * @param {number} advent4 - Day-of-year of the 4th advent (from getAdvent4())
 * @param {number} year - Calendar year (needed for april30Offset/michaelisOffset)
 * @param {string} lang - Language code: looks up holidaysData[h][lang] and holidaysData[h]['comment_'+lang]
 * @returns {string} Holiday name + optional comment, or empty string
 */
function getHoliday(holidaysData, day, isLeap, easter, advent4, year, lang) {
    for (const h in holidaysData) {
        const entry = holidaysData[h];
        if (!entry.enabled) {
            continue;
        }

        // Each holiday entry uses exactly one of the five offset strategies.
        // The original code tested `entry.offset !== 'undefined'` which compared against the
        // string literal "undefined" — always truthy. We replaced that with proper `typeof`
        // checks so the dispatch is now actually selective.

        if (typeof entry.offset !== 'undefined') {
            // Fixed day-of-year. The +isLeap shift handles the fact that days after Feb 29
            // are pushed back by one in non-leap years.
            if (1 + entry.offset + (entry.offset >= 59 ? isLeap : 0) === day) {
                return _formatHolidayName(entry, lang);
            }
            continue;
        }

        if (typeof entry.easterOffset !== 'undefined') {
            if (easter + entry.easterOffset === day) {
                return _formatHolidayName(entry, lang);
            }
            continue;
        }

        if (typeof entry.advent4Offset !== 'undefined') {
            if (advent4 + entry.advent4Offset === day) {
                return _formatHolidayName(entry, lang);
            }
            continue;
        }

        if (typeof entry.april30Offset !== 'undefined') {
            const newYear = new Date(year, 0, 1);
            const april30 = new Date(year, 3, 30, 0, 0, 0);
            const april30num = Math.ceil((april30.getTime() - newYear.getTime()) / ONE_DAY_MS + 1);
            const mday = april30num - april30.getDay() + entry.april30Offset;
            if (mday === day) {
                return _formatHolidayName(entry, lang);
            }
            continue;
        }

        if (typeof entry.michaelisOffset !== 'undefined') {
            const newYear = new Date(year, 0, 1);
            const michaelis = new Date(year, 8, 29, 0, 0, 0);
            const michaelisNum = Math.ceil((michaelis.getTime() - newYear.getTime()) / ONE_DAY_MS + 1);
            if (michaelisNum + (entry.michaelisOffset - michaelis.getDay()) === day) {
                return _formatHolidayName(entry, lang);
            }
            continue;
        }
    }

    return '';
}

/**
 * Format a holiday entry: name plus optional comment for the requested language.
 *
 * @param {Record<string, any>} entry - Holiday-definition object as in admin/holidays.js
 * @param {string} lang - Language code (e.g. "de", "en", "ru")
 * @returns {string} Localised holiday name, with comment appended when present
 */
function _formatHolidayName(entry, lang) {
    const name = entry[lang];
    const comment = entry[`comment_${lang}`];
    return comment ? `${name} ${comment}` : name;
}

module.exports = {
    ONE_DAY_MS,
    EASTER_ALGORITHM_VALID_UNTIL,
    getIsLeap,
    getEastern,
    isEasterYearSupported,
    getAdvent4,
    getDateFromYearsDay,
    getHoliday,
};
