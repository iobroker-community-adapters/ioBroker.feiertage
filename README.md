![Logo](admin/feiertage.png)
# ioBroker.feiertage
=================

[![NPM version](http://img.shields.io/npm/v/iobroker.feiertage.svg)](https://www.npmjs.com/package/iobroker.feiertage)
[![Downloads](https://img.shields.io/npm/dm/iobroker.feiertage.svg)](https://www.npmjs.com/package/iobroker.feiertage)
[![Tests](https://travis-ci.org/ioBroker/ioBroker.feiertage.svg?branch=master)](https://travis-ci.org/ioBroker/ioBroker.feiertage)

[![NPM](https://nodei.co/npm/iobroker.feiertage.png?downloads=true)](https://nodei.co/npm/iobroker.feiertage/)

## Beschreibung / Description
Deutsch  | English
------------- | -------------
Dieser Adapter liefert das Datum, die Dauer bis zu diesem Datum in Tagen und den Namen des nächsten deutschen Feiertages und gibt Auskunft, ob heute, morgen oder übermorgen ein Feiertag ist.  | This adapter delivers date, distance in days to this date and name of the next German holiday. Furthermore it tells if today, tommorw or the day after tommorow is a holiday in Germany.



##  Datenpunkte

Feiertag __heute.booelan__  (*false/true*)

Feiertag __heute.Name__  (z.B. "*1. Weihnachtsfeiertag*")

Feiertag __morgen.booelan__  (*false/true*)

Feiertag __morgen.Name__  (z.B. "*2. Weihnachtsfeiertag*")

Feiertag __uebermorgen.booelan__  (*false/true*)

Feiertag __uebermorgen.Name__  (z.B. "")

Feiertag __naechster.Name__  (z.B. "*Maifeiertag*")

Feiertag __naechster.Datum__  (z.B. "*01.05.2016*")

Feiertag __naechster.Dauer__  (z.B. "*2 Tage*")

##  Datapoints

Holiday __today.booelan__  (*false/true*)

Holiday __today.name__  (e.g. "*Christmas Day*")

Holiday __tomorrow.booelan__  (*false/true*)

Holiday __tomorrow.name__  (e.g. "*2nd Christmas Day*")

Holiday __aftertomorrow.booelan__  (*false/true*)

Holiday __aftertomorrow.name__  (e.g. "")

Holiday __next.Name__  (e.g. "*New Year's Day*")

Holiday __next.Datum__  (e.g. "*01.05.2016*")

Holiday __next.Dauer__  (e.g. "*4 days*")

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
### 0.3.1 (2016-05-04)
* (bluefox) fix error with tomorrow holiday

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
* Einstellungsdatei / config file
* Optin/optout besondere Tage, die keine Feiertage sind (Heiligabend, Rosenmontag, ...)
* Auswahl nach Bundesland

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
