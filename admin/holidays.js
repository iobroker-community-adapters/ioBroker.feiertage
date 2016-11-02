"use strict";

var holidays = {
    neujahr:        {enabled: true,  "en": "New Year's Day",      "de": "Neujahr",                      "ru": "Новый Год",                              desc: "calender",    date: "01.01", leap: false, offset: 1},
    dreikoenige:    {enabled: true,  "en": "Epiphany",            "de": "Dreikönigstag",                "ru": "День трёх Королей",                      desc: "religion",    date: "06.01", leap: false, offset: 6, comment_en: "(BW, BY, ST)", comment_de: "(BW, BY, ST)", comment_ru: "(BW, BY, ST)"},
    rosenmontag:    {enabled: true,  "en": "Rose Monday",         "de": "Rosenmontag",                  "ru": "Розовый понедельник",                    desc: "calender",    easterOffset: -48},
    karfreitag:     {enabled: true,  "en": "Good Friday",         "de": "Karfreitag",                   "ru": "Великая пятница",                        desc: "religion",    easterOffset: -2},
    ostersonntag:   {enabled: true,  "en": "Easter Sunday",       "de": "Ostersonntag",                 "ru": "Католическая пасха - Воскресение",       desc: "religion",    easterOffset: 0},
    ostermontag:    {enabled: true,  "en": "Easter Monday",       "de": "Ostermontag",                  "ru": "Католическая пасха - Понедельник",       desc: "religion",    easterOffset: 1},
    maifeiertag:    {enabled: true,  "en": "May Day",             "de": "Maifeiertag - Tag der Arbeit", "ru": "День Труда",                             desc: "political",   date: "01.05", offset: 121, leap: true},
    chimmelfahrt:   {enabled: false, "en": "Ascension of Christ", "de": "Christi Himmelfahrt",          "ru": "Католическое Вознесение ",               desc: "religion",    easterOffset: 39},
    pfingstsonntag: {enabled: true,  "en": "Whitsunday",          "de": "Pfingstsonntag",               "ru": "Католическая Троица - Воскресение",      desc: "religion",    easterOffset: 49},
    pfingstmontag:  {enabled: true,  "en": "Whit Monday",         "de": "Pfingstmontag",                "ru": "Католическая Троица - Понедельник",      desc: "religion",    easterOffset: 50},
    fronleichnam:   {enabled: false, "en": "Corpus Christi",      "de": "Fronleichnam",                 "ru": "Праздник Тела и Крови Христовых",        desc: "religion",    easterOffset: 60,                       comment_en: "(BW, BY, HE, NW, RP, SL (SA, TH not everywhere))", comment_de: "(BW, BY, HE, NW, RP, SL (SA, TH nicht überall))", comment_ru: "(BW, BY, HE, NW, RP, SL (SA, TH не везде))"},
    mhimmelfahrt:   {enabled: false, "en": "Assumption of Mary",  "de": "Mariä Himmelfahrt",            "ru": "Вознесение Девы Марии",                  desc: "religion",    date: "15.08", offset: 227, leap: true, comment_en: "(BY (not everywhere), SL)",                        comment_de: "(BY (nicht überall), SL)",                        comment_ru: "(BY (не везде), SL)"},
    einheitstag:    {enabled: true,  "en": "Day of German unity", "de": "Tag der deutschen Einheit",    "ru": "День объединения Германии",              desc: "political",   date: "03.10", offset: 276, leap: true},
    reformationstag:{enabled: false, "en": "Reformation Day",     "de": "Reformationstag",              "ru": "День Реформации (Хэллоуин)",             desc: "religion",    date: "31.10", offset: 304, leap: true, comment_en: "(BB, MV, SA, ST, TH)",                             comment_de: "(BB, MV, SA, ST, TH)",                            comment_ru: "(BB, MV, SA, ST, TH)"},
    allerheiligen:  {enabled: true,  "en": "All Saints' Day",     "de": "Allerheiligen",                "ru": "День всех святых (Хэллоуин)",            desc: "religion",    date: "01.11", offset: 305, leap: true, comment_en: "(BW, BY, NW, RP, SL)",                             comment_de: "(BW, BY, NW, RP, SL)",                            comment_ru: "(BW, BY, NW, RP, SL)"},
    bussbettag:     {enabled: true,  "en": "Penance Day",         "de": "Buß- und Bettag",              "ru": "день покая́ния и моли́твы",                desc: "religion",    advent4Offset: -32,             comment_en: "(SA)", comment_de: "(SA)", comment_ru: "(SA)"},
    advent1:        {enabled: false, "en": "1st Advent",          "de": "1. Advent",                    "ru": "1. адве́нт",                              desc: "religion",    advent4Offset: -21},
    advent2:        {enabled: false, "en": "2nd Advent",          "de": "2. Advent",                    "ru": "2. адве́нт",                              desc: "religion",    advent4Offset: -14},
    advent3:        {enabled: false, "en": "3rd Advent",          "de": "3. Advent",                    "ru": "3. адве́нт",                              desc: "religion",    advent4Offset: -7},
    advent4:        {enabled: false, "en": "4th Advent",          "de": "4. Advent",                    "ru": "4. адве́нт",                              desc: "religion",    advent4Offset: 0},
    heiligabend:    {enabled: true,  "en": "Christmas Eve",       "de": "Heiligabend",                  "ru": "Католическое Рождество",                 desc: "religion",    date: "24.12", offset: 358, leap: true},
    weihnachtstag1: {enabled: false, "en": "Christmas Day",       "de": "1. Weihnachtstag",             "ru": "Католическое Рождество - Первый день",   desc: "religion",    date: "25.12", offset: 359, leap: true},
    weihnachtstag2: {enabled: true,  "en": "2nd Christmas Day",   "de": "2. Weihnachtstag",             "ru": "Католическое Рождество - Второй день",   desc: "religion",    date: "26.12", offset: 360, leap: true},
    silvester:      {enabled: true,  "en": "New Year's Eve",      "de": "Silvester",                    "ru": "Новый год",                              desc: "calender",    date: "31.12", offset: 365, leap: true}
};

if (typeof module !== 'undefined' && module.parent) {
    module.exports = {
        holidays: holidays
    };
}






