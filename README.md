![Logo](admin/feiertage.png)
# ioBroker.feiertage
=================

[![NPM version](http://img.shields.io/npm/v/iobroker.feiertage.svg)](https://www.npmjs.com/package/iobroker.feiertage)
[![Downloads](https://img.shields.io/npm/dm/iobroker.feiertage.svg)](https://www.npmjs.com/package/iobroker.feiertage)
[![Tests](https://travis-ci.org/Pix---/ioBroker.feiertage.svg?branch=master)](https://travis-ci.org/Pix---/ioBroker.feiertage)

[![NPM](https://nodei.co/npm/iobroker.feiertage.png?downloads=true)](https://nodei.co/npm/iobroker.feiertage/)

**Tests:** Linux/Mac: [![Travis-CI](http://img.shields.io/travis/Pix---/ioBroker.feiertage/master.svg)](https://travis-ci.org/Pix---/ioBroker.feiertage)
Windows: [![AppVeyor](https://ci.appveyor.com/api/projects/status/github/Pix---/ioBroker.feiertage?branch=master&svg=true)](https://ci.appveyor.com/project/Pix---/ioBroker-feiertage/)


## Beschreibung / Description
Deutsch  | English
------------- | -------------
Dieser Adapter liefert das Datum, die Dauer bis zu diesem Datum in Tagen und den Namen des nächsten deutschen Feiertages und gibt Auskunft, ob heute, morgen oder übermorgen ein Feiertag ist.  | This adapter delivers date, distance in days to this date and name of the next German holiday. Furthermore it tells if today, tommorw or the day after tommorow is a holiday in Germany.



##  Datenpunkte / Datapoints

![alt text](img/DatapointsScreenshot.jpg "Screenshot Datapoints")

## Einstellungen / Configuration
Deutsch  | English
------------- | -------------
Feiertage, die bei der Befüllung der Datenpunkte berücksichtigt werden sollen, können ausgewählt werden. | Only selected holidays count in the process.

![alt text](img/SettingScreenshot.jpg "Screenshot Settings")


## Aktivierung / Schedule
Deutsch  | English
------------- | -------------
Der Adapter startet jeden Tag um Mitternacht. Ein häufigeres Starten ist nicht erforderlich. | The adapter starts daily at midnight. Due to the nature of the subject, no higher frequency is required.

## Changelog
### 1.0.0 (2017-10-15)
* (pix) End of Beta. Nodejs 4 or higher required

### 0.4.1 (2017-06-08)
* (jens-maus) added "Kid's Day" for 01.06. and added "Vatertag" beside "Christi Himmelfahrt"

### 0.4.0 (2017-01-05)
* (pix) Travis CI and appveyor Windows testing supported

### 0.3.6 (2017-01-04)
* (jens-maus) offset fix in non-leap years

### 0.3.5 (2016-11-13)
* (pix) fixed version issue
* updated screenshots in readme

### 0.3.4 (2016-11-10)
* (jens-maus) fixed calculation of "next holiday" which was shifted by one day. Thus on the day before a holiday it already showed the next one.

### 0.3.3 (2016-11-08)
* (jens-maus) added advent ѕundays, "Buß- und Bettag" and many more german holidays
* (jens-maus) code fix (multilingual reference)

### 0.3.2 (2016-05-07)
* (bluefox) fix first start of adapter

### 0.3.1 (2016-05-07)
* (pix) Start file fixed

### 0.3.0 (2016-05-03)
* (bluefox) add english objects

### 0.2.0 (2016-05-02)
* (bluefox) use common file for holidays

### 0.1.1 (2016-04-30)
* (pix) Next holiday calculation corrected

### 0.1.0 (2016-04-30)
* (pix) Holidays can be opted out now

### 0.0.7 (2016-04-30)
* (bluefox) Settings structure optimized
* (bluefox) Translations

### 0.0.6 (2016-04-29)
* (pix) Corrections on appearance of settings window
* (pix) Readme

### 0.0.5 (2016-04-29)
* (pix) Selectable Holidays in settings

### 0.0.4 (2016-04-27)
* (pix) Corrected number of days till next holiday

### 0.0.3 (2016-04-27)
* (pix) Writing to objects corrected
* (pix) Workaround for formatDate

### 0.0.2 (2016-04-27)
* (pix) Title and description corrected
* (pix) English translation of readme file

### 0.0.1 (2016-04-26)
* (pix) Adapter created

## Todo
* Übersetzungen / Translation

## Roadmap
* Erkennung Brückentage

## License

The MIT License (MIT)

Copyright (c) 2016 pix

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---
*Logo is crafted by CHALLENGER*

*Thank you, paul53, for the inspiration!*
