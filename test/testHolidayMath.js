'use strict';

const { expect } = require('chai');
const {
    ONE_DAY_MS,
    EASTER_ALGORITHM_VALID_UNTIL,
    getIsLeap,
    getEastern,
    isEasterYearSupported,
    getAdvent4,
    getDateFromYearsDay,
    getHoliday,
} = require('../lib/holidayMath');
const { holidays } = require('../admin/holidays');

/**
 * Convert (day-of-year, year) to a yyyy-mm-dd string for readable assertions.
 *
 * @param {number} day
 * @param {number} year
 * @returns {string}
 */
function dayOfYearAsIsoDate(day, year) {
    const d = getDateFromYearsDay(day, year);
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${dd}`;
}

describe('lib/holidayMath - getIsLeap', () => {
    it('returns 1 for years divisible by 4 but not by 100', () => {
        expect(getIsLeap(2024)).to.equal(1);
        expect(getIsLeap(2020)).to.equal(1);
        expect(getIsLeap(2028)).to.equal(1);
    });

    it('returns 0 for years divisible by 100 but not by 400', () => {
        expect(getIsLeap(1900)).to.equal(0);
        expect(getIsLeap(2100)).to.equal(0);
        expect(getIsLeap(2200)).to.equal(0);
    });

    it('returns 1 for years divisible by 400', () => {
        expect(getIsLeap(2000)).to.equal(1);
        expect(getIsLeap(2400)).to.equal(1);
    });

    it('returns 0 for normal odd years', () => {
        expect(getIsLeap(2023)).to.equal(0);
        expect(getIsLeap(2025)).to.equal(0);
        expect(getIsLeap(2026)).to.equal(0);
        expect(getIsLeap(2027)).to.equal(0);
    });
});

describe('lib/holidayMath - getEastern', () => {
    // Reference Easter Sundays from the Vatican / public-domain Easter tables.
    // The format is yyyy-mm-dd in the Gregorian calendar (catholic Easter).
    // Source: https://en.wikipedia.org/wiki/List_of_dates_for_Easter (cross-checked
    // against the canonical Computus tables).
    const referenceEaster = {
        2020: '2020-04-12',
        2021: '2021-04-04',
        2022: '2022-04-17',
        2023: '2023-04-09',
        2024: '2024-03-31',
        2025: '2025-04-20',
        2026: '2026-04-05',
        2027: '2027-03-28',
        2028: '2028-04-16',
        2029: '2029-04-01',
        2030: '2030-04-21',
        2031: '2031-04-13',
        2032: '2032-03-28',
        2033: '2033-04-17',
        2034: '2034-04-09',
        2035: '2035-03-25',
        2036: '2036-04-13',
        2037: '2037-04-05',
        2038: '2038-04-25',
        2039: '2039-04-10',
        2040: '2040-04-01',
        2041: '2041-04-21',
        2042: '2042-04-06',
        2043: '2043-03-29',
        2044: '2044-04-17',
        2045: '2045-04-09',
        2046: '2046-03-25',
        2047: '2047-04-14',
        2048: '2048-04-05',
    };

    Object.entries(referenceEaster).forEach(([year, expected]) => {
        it(`computes Easter ${year} as ${expected}`, () => {
            const doy = getEastern(Number(year));
            expect(dayOfYearAsIsoDate(doy, Number(year))).to.equal(expected);
        });
    });

    it('returns a positive integer', () => {
        for (let year = 2020; year <= 2048; year++) {
            const doy = getEastern(year);
            expect(doy).to.be.a('number');
            expect(Number.isInteger(doy)).to.equal(true);
            expect(doy).to.be.greaterThan(0);
        }
    });
});

describe('lib/holidayMath - isEasterYearSupported', () => {
    it('returns true up to and including 2048', () => {
        expect(isEasterYearSupported(2024)).to.equal(true);
        expect(isEasterYearSupported(2030)).to.equal(true);
        expect(isEasterYearSupported(2048)).to.equal(true);
    });

    it('returns false beyond 2048', () => {
        expect(isEasterYearSupported(2049)).to.equal(false);
        expect(isEasterYearSupported(2050)).to.equal(false);
        expect(isEasterYearSupported(2100)).to.equal(false);
    });

    it('exposes the boundary as a constant', () => {
        expect(EASTER_ALGORITHM_VALID_UNTIL).to.equal(2048);
    });
});

describe('lib/holidayMath - getAdvent4', () => {
    // 4th Advent is the Sunday before December 25. Reference dates from a calendar.
    const referenceAdvent4 = {
        2020: '2020-12-20',
        2021: '2021-12-19',
        2022: '2022-12-18',
        2023: '2023-12-24',
        2024: '2024-12-22',
        2025: '2025-12-21',
        2026: '2026-12-20',
        2027: '2027-12-19',
        2028: '2028-12-24',
        2029: '2029-12-23',
        2030: '2030-12-22',
    };

    Object.entries(referenceAdvent4).forEach(([year, expected]) => {
        it(`computes 4th Advent ${year} as ${expected}`, () => {
            const doy = getAdvent4(Number(year));
            expect(dayOfYearAsIsoDate(doy, Number(year))).to.equal(expected);
        });
    });

    it('always lands on a Sunday', () => {
        for (let year = 2020; year <= 2050; year++) {
            const doy = getAdvent4(year);
            const date = getDateFromYearsDay(doy, year);
            expect(date.getDay()).to.equal(0); // 0 = Sunday
        }
    });
});

describe('lib/holidayMath - getDateFromYearsDay', () => {
    it('returns Jan 1 for day 1', () => {
        const d = getDateFromYearsDay(1, 2026);
        expect(d.getFullYear()).to.equal(2026);
        expect(d.getMonth()).to.equal(0);
        expect(d.getDate()).to.equal(1);
    });

    it('returns Dec 31 for day 365 in non-leap year', () => {
        const d = getDateFromYearsDay(365, 2026);
        expect(d.getFullYear()).to.equal(2026);
        expect(d.getMonth()).to.equal(11);
        expect(d.getDate()).to.equal(31);
    });

    it('returns Dec 31 for day 366 in leap year', () => {
        const d = getDateFromYearsDay(366, 2024);
        expect(d.getFullYear()).to.equal(2024);
        expect(d.getMonth()).to.equal(11);
        expect(d.getDate()).to.equal(31);
    });

    it('exposes ONE_DAY_MS as 86400000', () => {
        expect(ONE_DAY_MS).to.equal(24 * 60 * 60 * 1000);
    });
});

describe('lib/holidayMath - getHoliday', () => {
    /**
     * Build a minimal holidays-data object containing only the keys we want enabled.
     * Every entry is force-enabled so we don't depend on the live default state.
     */
    function pickHolidays(...keys) {
        const data = {};
        keys.forEach(k => {
            const src = holidays[k];
            if (!src) {
                throw new Error(`Test setup error: unknown holiday "${k}"`);
            }
            data[k] = { ...src, enabled: true };
        });
        return data;
    }

    /**
     * Look up the holiday matched on the given calendar date. Internally translates
     * (year, month, day) to day-of-year and feeds the same Easter/Advent4 the adapter would.
     */
    function holidayOnDate(data, year, month, day, lang = 'de') {
        const newYear = new Date(year, 0, 1);
        const target = new Date(year, month - 1, day);
        const dayOfYear = Math.ceil((target.getTime() - newYear.getTime()) / ONE_DAY_MS + 1);
        const isLeap = getIsLeap(year);
        const easter = getEastern(year);
        const advent4 = getAdvent4(year);
        return getHoliday(data, dayOfYear, isLeap, easter, advent4, year, lang);
    }

    describe('fixed-date holidays (offset)', () => {
        const data = pickHolidays('neujahr', 'maifeiertag', 'einheitstag', 'silvester');

        it('matches Neujahr on Jan 1 in non-leap year', () => {
            expect(holidayOnDate(data, 2026, 1, 1)).to.equal('Neujahr');
        });

        it('matches Neujahr on Jan 1 in leap year', () => {
            expect(holidayOnDate(data, 2024, 1, 1)).to.equal('Neujahr');
        });

        it('matches Tag der Arbeit on May 1', () => {
            expect(holidayOnDate(data, 2026, 5, 1)).to.equal('Tag der Arbeit');
        });

        it('matches Tag der deutschen Einheit on Oct 3 in non-leap year', () => {
            expect(holidayOnDate(data, 2026, 10, 3)).to.equal('Tag der deutschen Einheit');
        });

        it('matches Tag der deutschen Einheit on Oct 3 in leap year (leap-day shift)', () => {
            expect(holidayOnDate(data, 2024, 10, 3)).to.equal('Tag der deutschen Einheit');
        });

        it('matches Silvester on Dec 31', () => {
            expect(holidayOnDate(data, 2026, 12, 31)).to.equal('Silvester');
        });

        // Regression for Issue #289 + #132: 2.1. was previously returned as Neujahr.
        // Root cause was the broken `!== 'undefined'` string-compare in the original
        // getHoliday — every offset branch fell through to the easterOffset/advent4Offset/...
        // branches even for entries that shouldn't take that path. Fixed by typeof checks
        // in lib/holidayMath.js.
        it('does NOT match Neujahr on Jan 2 (regression for Issue #289 / #132)', () => {
            expect(holidayOnDate(data, 2026, 1, 2)).to.equal('');
        });

        it('returns empty string on a regular weekday', () => {
            expect(holidayOnDate(data, 2026, 2, 11)).to.equal('');
            expect(holidayOnDate(data, 2026, 7, 15)).to.equal('');
        });
    });

    describe('Easter-relative holidays (easterOffset)', () => {
        const data = pickHolidays('karfreitag', 'ostersonntag', 'ostermontag', 'pfingstsonntag', 'pfingstmontag');

        it('matches Karfreitag two days before Easter Sunday 2026 (April 3)', () => {
            expect(holidayOnDate(data, 2026, 4, 3)).to.equal('Karfreitag');
        });

        it('matches Ostersonntag on Easter Sunday 2026 (April 5)', () => {
            expect(holidayOnDate(data, 2026, 4, 5)).to.equal('Ostersonntag');
        });

        it('matches Ostermontag the day after Easter 2026 (April 6)', () => {
            expect(holidayOnDate(data, 2026, 4, 6)).to.equal('Ostermontag');
        });

        it('matches Pfingstsonntag 49 days after Easter 2026 (May 24)', () => {
            expect(holidayOnDate(data, 2026, 5, 24)).to.equal('Pfingstsonntag');
        });

        it('matches Pfingstmontag 50 days after Easter 2026 (May 25)', () => {
            expect(holidayOnDate(data, 2026, 5, 25)).to.equal('Pfingstmontag');
        });

        it('matches across years: Karfreitag 2024 (March 29), 2025 (April 18), 2027 (March 26)', () => {
            expect(holidayOnDate(data, 2024, 3, 29)).to.equal('Karfreitag');
            expect(holidayOnDate(data, 2025, 4, 18)).to.equal('Karfreitag');
            expect(holidayOnDate(data, 2027, 3, 26)).to.equal('Karfreitag');
        });
    });

    describe('Advent-relative holidays (advent4Offset)', () => {
        const data = pickHolidays('volkstrauertag', 'totensonntag', 'bussbettag', 'advent1', 'advent4');

        it('matches 4th Advent 2026 on Dec 20', () => {
            expect(holidayOnDate(data, 2026, 12, 20)).to.equal('4. Advent');
        });

        it('matches Totensonntag (Advent4 - 28 days) 2026', () => {
            expect(holidayOnDate(data, 2026, 11, 22)).to.equal('Totensonntag');
        });

        it('matches Buß- und Bettag (Advent4 - 32) 2026', () => {
            // Buß- und Bettag is Wednesday before Totensonntag, 2026-11-18
            expect(holidayOnDate(data, 2026, 11, 18)).to.contain('Buß- und Bettag');
        });

        it('matches 1st Advent 2026 (Nov 29)', () => {
            expect(holidayOnDate(data, 2026, 11, 29)).to.equal('1. Advent');
        });
    });

    describe("Mother's Day (april30Offset, 2nd Sunday of May)", () => {
        const data = pickHolidays('muttertag');

        it('returns Muttertag on the 2nd Sunday of May 2026 (May 10)', () => {
            expect(holidayOnDate(data, 2026, 5, 10)).to.equal('Muttertag');
        });

        it('returns Muttertag on the 2nd Sunday of May 2024 (May 12)', () => {
            expect(holidayOnDate(data, 2024, 5, 12)).to.equal('Muttertag');
        });

        it('does not match the 1st Sunday of May', () => {
            expect(holidayOnDate(data, 2026, 5, 3)).to.equal('');
        });
    });

    describe('Erntedankfest (michaelisOffset)', () => {
        const data = pickHolidays('erntedankfest');

        it('matches Erntedankfest on the first Sunday of October 2026 (Oct 4)', () => {
            // Algorithm: michaelisOffset 7 starting from 29.9., adjusted to Sunday alignment.
            // Catholic tradition: 1st Sunday of October.
            expect(holidayOnDate(data, 2026, 10, 4)).to.equal('Erntedankfest');
        });
    });

    describe('language fallback and comments', () => {
        const data = pickHolidays('neujahr', 'allerheiligen');

        it('returns the German name for lang="de"', () => {
            expect(holidayOnDate(data, 2026, 1, 1, 'de')).to.equal('Neujahr');
        });

        it('returns the English name for lang="en"', () => {
            expect(holidayOnDate(data, 2026, 1, 1, 'en')).to.equal("New Year's Day");
        });

        it('appends the comment when present (Allerheiligen carries Bundesland-Liste)', () => {
            expect(holidayOnDate(data, 2026, 11, 1)).to.contain('Allerheiligen');
            expect(holidayOnDate(data, 2026, 11, 1)).to.contain('(BW, BY, NW, RP, SL)');
        });
    });

    describe('disabled holidays', () => {
        it('does not match an entry with enabled=false', () => {
            const disabled = { neujahr: { ...holidays.neujahr, enabled: false } };
            expect(holidayOnDate(disabled, 2026, 1, 1)).to.equal('');
        });
    });

    describe('empty / no-match cases', () => {
        it('returns empty string when nothing matches', () => {
            const data = pickHolidays('neujahr');
            expect(holidayOnDate(data, 2026, 7, 4)).to.equal('');
        });

        it('returns empty string for an empty holidays-data object', () => {
            expect(holidayOnDate({}, 2026, 1, 1)).to.equal('');
        });
    });
});

describe('lib/holidayMath - integration sanity (full year scan)', () => {
    it('finds at least one matched holiday per year for the default-enabled set', () => {
        // Sanity check: with all holidays at their default `enabled` flag, every year
        // between 2024 and 2030 must produce at least one positive match across the year.
        for (let year = 2024; year <= 2030; year++) {
            const isLeap = getIsLeap(year);
            const easter = getEastern(year);
            const advent4 = getAdvent4(year);
            let matches = 0;
            for (let day = 1; day <= 365 + isLeap; day++) {
                if (getHoliday(holidays, day, isLeap, easter, advent4, year, 'de')) {
                    matches++;
                }
            }
            expect(matches, `year ${year}`).to.be.greaterThan(10);
        }
    });
});
