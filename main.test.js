'use strict';

const fs = require('fs');
const path = require('path');
const { expect } = require('chai');

const { holidays } = require('./admin/holidays.js');

describe('admin jsonConfig migration', () => {
    const ioPackagePath = path.join(__dirname, 'io-package.json');
    const jsonConfigPath = path.join(__dirname, 'admin', 'jsonConfig.json');
    const ioPackage = JSON.parse(fs.readFileSync(ioPackagePath, 'utf8'));
    const jsonConfig = JSON.parse(fs.readFileSync(jsonConfigPath, 'utf8'));

    it('should configure json admin UI in io-package', () => {
        expect(ioPackage.common.adminUI).to.deep.equal({ config: 'json' });
    });

    it('should expose all holiday enable keys as boolean checkboxes in jsonConfig', () => {
        for (const holidayId of Object.keys(holidays)) {
            const key = `enable_${holidayId}`;
            const field = jsonConfig.items[key];
            expect(field, `missing config field: ${key}`).to.be.an('object');
            expect(field.type, `unexpected type for ${key}`).to.equal('checkbox');
        }
    });
});
