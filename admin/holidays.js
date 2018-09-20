"use strict";

var holidays = {
    neujahr:        {enabled: true,  "en": "New Year's Day",      "de": "Neujahr",                      "ru": "Новый Год",                              desc: "calender",    date: "01.01", offset: 0},
    dreikoenige:    {enabled: true,  "en": "Epiphany",            "de": "Heilige Drei Könige",          "ru": "День трёх Королей",                      desc: "religion",    date: "06.01", offset: 5, comment_en: "(BW, BY, ST)", comment_de: "(BW, BY, ST)", comment_ru: "(BW, BY, ST)"},
    weiberfastnacht:{enabled: true,  "en": "Old Maids' Day",      "de": "Weiberfastnacht",              "ru": "ба́бий четве́рг",                          desc: "calender",    easterOffset: -52},
    rosenmontag:    {enabled: true,  "en": "Rose Monday",         "de": "Rosenmontag",                  "ru": "Розовый понедельник",                    desc: "calender",    easterOffset: -48},
    faschingsdienstag: {enabled: true,  "en": "Mardi Gras",       "de": "Faschingsdienstag",            "ru": "???",                                    desc: "calender",    easterOffset: -47},
    aschermittwoch: {enabled: true,  "en": "Ash Wednesday",       "de": "Aschermittwoch",               "ru": "Пе́пельная среда́",                        desc: "calender",    easterOffset: -46},
    valentinstag:   {enabled: false, "en": "Valentine's Day",     "de": "Valentinstag",                 "ru": "Валенти́нов день",                        desc: "calender",    date: "14.02", offset: 44},
    weltfrauentag:  {enabled: false, "en": "International Women's Day", "de": "Weltfrauentag",          "ru": "междунаро́дный же́нский день",             desc: "political",   date: "08.03", offset: 66},
    palmsonntag:    {enabled: false, "en": "Palm Sunday",         "de": "Palmsonntag",                  "ru": "Ве́рбное Воскресе́нье",                    desc: "religion",    easterOffset: -7},
    gruendonnerstag:{enabled: false, "en": "Holy Thursday",       "de": "Gründonnerstag",               "ru": "Вели́кий четве́рг",                        desc: "religion",    easterOffset: -3},
    karfreitag:     {enabled: true,  "en": "Good Friday",         "de": "Karfreitag",                   "ru": "Великая пятница",                        desc: "religion",    easterOffset: -2},
    ostersonntag:   {enabled: true,  "en": "Easter Sunday",       "de": "Ostersonntag",                 "ru": "Католическая пасха - Воскресение",       desc: "religion",    easterOffset: 0},
    ostermontag:    {enabled: true,  "en": "Easter Monday",       "de": "Ostermontag",                  "ru": "Католическая пасха - Понедельник",       desc: "religion",    easterOffset: 1},
    walpurgisnacht: {enabled: false, "en": "Walpurgis Night",     "de": "Walpurgisnacht",               "ru": "???",                                    desc: "calender",    date: "30.04", offset: 119},
    maifeiertag:    {enabled: true,  "en": "Labour Day",          "de": "Tag der Arbeit", "ru": "День Труда",                             desc: "political",   date: "01.05", offset: 120},
    chimmelfahrt:   {enabled: false, "en": "Ascension of Christ", "de": "Christi Himmelfahrt (Vatertag)", "ru": "Католическое Вознесение ",               desc: "religion",    easterOffset: 39},
    muttertag:      {enabled: false, "en": "Mother's Day",        "de": "Muttertag",                    "ru": "День ма́тери",                            desc: "calender",    april30Offset: 14},
    kindertag:      {enabled: false, "en": "Kid's Day",           "de": "Kindertag",                    "ru": "???",                                    desc: "calender",    date: "01.06", offset: 151},
    pfingstsonntag: {enabled: true,  "en": "Whitsunday",          "de": "Pfingstsonntag",               "ru": "Католическая Троица - Воскресение",      desc: "religion",    easterOffset: 49},
    pfingstmontag:  {enabled: true,  "en": "Whit Monday",         "de": "Pfingstmontag",                "ru": "Католическая Троица - Понедельник",      desc: "religion",    easterOffset: 50},
    siebenschlaefer:{enabled: false, "en": "St Swtithin's Day",   "de": "Siebenschläfertag",            "ru": "сеногно́й",                               desc: "calender",    date: "27.06", offset: 177},
    fronleichnam:   {enabled: false, "en": "Corpus Christi",      "de": "Fronleichnam",                 "ru": "Праздник Тела и Крови Христовых",        desc: "religion",    easterOffset: 60,                       comment_en: "(BW, BY, HE, NW, RP, SL (SA, TH not everywhere))", comment_de: "(BW, BY, HE, NW, RP, SL (SA, TH nicht überall))", comment_ru: "(BW, BY, HE, NW, RP, SL (SA, TH не везде))"},
    friedensfest:   {enabled: false, "en": "Peace Festival",      "de": "Friedensfest",                 "ru": "???",                                    desc: "religion",    date: "08.08", offset: 219},
    mhimmelfahrt:   {enabled: false, "en": "Assumption of Mary",  "de": "Mariä Himmelfahrt",            "ru": "Вознесение Девы Марии",                  desc: "religion",    date: "15.08", offset: 226, comment_en: "(BY (not everywhere), SL)",                        comment_de: "(BY (nicht überall), SL)",                        comment_ru: "(BY (не везде), SL)"},
    michaelistag:   {enabled: false, "en": "Michaelmas",          "de": "Michaelistag",                 "ru": "???",                                    desc: "religion",    date: "29.09", offset: 271},
    erntedankfest:  {enabled: false, "en": "Harvest festival",    "de": "Erntedankfest",                "ru": "пра́здник урожа́я",                        desc: "religion",    michaelisOffset: 7},
    einheitstag:    {enabled: true,  "en": "Day of German unity", "de": "Tag der deutschen Einheit",    "ru": "День объединения Германии",              desc: "political",   date: "03.10", offset: 275},
    autnationaltag: {enabled: false, "en": "National Day Austria","de": "Nationalfeiertag in Österreich", "ru": "Австрийский национальный день",        desc: "political",   date: "26.10", offset: 298},
    reformationstag:{enabled: false, "en": "Reformation Day",     "de": "Reformationstag",              "ru": "День Реформации (Хэллоуин)",             desc: "religion",    date: "31.10", offset: 303, comment_en: "(BB, MV, SA, ST, TH)",                             comment_de: "(BB, MV, SA, ST, TH)",                            comment_ru: "(BB, MV, SA, ST, TH)"},
    allerheiligen:  {enabled: true,  "en": "All Saints' Day",     "de": "Allerheiligen",                "ru": "День всех святых (Хэллоуин)",            desc: "religion",    date: "01.11", offset: 304, comment_en: "(BW, BY, NW, RP, SL)",                             comment_de: "(BW, BY, NW, RP, SL)",                            comment_ru: "(BW, BY, NW, RP, SL)"},
    allerseelen:    {enabled: false, "en": "All Souls' Day",      "de": "Allerseelen",                  "ru": "День Всех Душ",                          desc: "religion",    date: "02.11", offset: 305},
    martinstag:     {enabled: true,  "en": "Saint Martin's Day",  "de": "Martinstag",                   "ru": "???",                                    desc: "religion",    date: "11.11", offset: 314},
    volkstrauertag: {enabled: false, "en": "Remembrance Day",     "de": "Volkstrauertag",               "ru": "???",                                    desc: "political",   advent4Offset: -35},
    bussbettag:     {enabled: true,  "en": "Penance Day",         "de": "Buß- und Bettag",              "ru": "день покая́ния и моли́твы",                desc: "religion",    advent4Offset: -32,             comment_en: "(SA)", comment_de: "(SA)", comment_ru: "(SA)"},
    totensonntag:   {enabled: true,  "en": "Sunday of the Dead",  "de": "Totensonntag",                 "ru": "???",                                    desc: "religion",    advent4Offset: -28},
    nikolaustag:    {enabled: true,  "en": "St Nicholas' Day",    "de": "Nikolaustag",                  "ru": "День Свято́го Никола́я",                   desc: "religion",    date: "06.12", offset: 339},
    advent1:        {enabled: false, "en": "1st Advent",          "de": "1. Advent",                    "ru": "1. адве́нт",                              desc: "religion",    advent4Offset: -21},
    advent2:        {enabled: false, "en": "2nd Advent",          "de": "2. Advent",                    "ru": "2. адве́нт",                              desc: "religion",    advent4Offset: -14},
    advent3:        {enabled: false, "en": "3rd Advent",          "de": "3. Advent",                    "ru": "3. адве́нт",                              desc: "religion",    advent4Offset: -7},
    advent4:        {enabled: false, "en": "4th Advent",          "de": "4. Advent",                    "ru": "4. адве́нт",                              desc: "religion",    advent4Offset: 0},
    heiligabend:    {enabled: true,  "en": "Christmas Eve",       "de": "Heiligabend",                  "ru": "Католическое Рождество",                 desc: "religion",    date: "24.12", offset: 357},
    weihnachtstag1: {enabled: false, "en": "Christmas Day",       "de": "1. Weihnachtstag",             "ru": "Католическое Рождество - Первый день",   desc: "religion",    date: "25.12", offset: 358},
    weihnachtstag2: {enabled: true,  "en": "2nd Christmas Day",   "de": "2. Weihnachtstag",             "ru": "Католическое Рождество - Второй день",   desc: "religion",    date: "26.12", offset: 359},
    silvester:      {enabled: true,  "en": "New Year's Eve",      "de": "Silvester",                    "ru": "Новый год",                              desc: "calender",    date: "31.12", offset: 364}
};

if (typeof module !== "undefined" && module.parent) {
    module.exports = {
        holidays: holidays
    };
}






