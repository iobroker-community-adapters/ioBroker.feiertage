var holidays = {
    neujahr:        {enabled: true,  "en": "New Year's Day",      "de": "Neujahr",                      "ru": "Новый Год",                              desc: "kalendarischer Feiertag",    date: "01.01", leap: false, offset: 1},
    dreikoenige:    {enabled: true,  "en": "Epiphany",            "de": "Dreikönigstag",                "ru": "День трёх Королей",                      desc: "kirchlicher Feiertag",       date: "06.01", leap: false, offset: 6, comment: "(BW, BY, ST)"},
    rosenmontag:    {enabled: true,  "en": "Rose Monday",         "de": "Rosenmontag",                  "ru": "Розовый понедельник",                    desc: "kalendarischer Feiertag",    osternOffset: -48},
    karfreitag:     {enabled: true,  "en": "Good Friday",         "de": "Karfreitag",                   "ru": "Великая пятница",                        desc: "kirchlicher Feiertag",       osternOffset: -2},
    ostersonntag:   {enabled: true,  "en": "Easter Sunday",       "de": "Ostersonntag",                 "ru": "Католическая пасха - Воскресение",       desc: "kirchlicher Feiertag",       osternOffset: 0},
    ostermontag:    {enabled: true,  "en": "Easter Monday",       "de": "Ostermontag",                  "ru": "Католическая пасха - Понедельник",       desc: "kirchlicher Feiertag",       osternOffset: 1},
    maifeiertag:    {enabled: true,  "en": "May Day",             "de": "Maifeiertag - Tag der Arbeit", "ru": "День Труда",                             desc: "politischer Feiertag",       date: "01.05", offset: 121, leap: true},
    chimmelfahrt:   {enabled: false, "en": "Ascension of Christ", "de": "Christi Himmelfahrt",          "ru": "Католическое Вознесение ",               desc: "kirchlicher Feiertag",       osternOffset: 39},
    pfingstsonntag: {enabled: true,  "en": "Whitsunday",          "de": "Pfingstsonntag",               "ru": "Католическая Троица - Воскресение",      desc: "kirchlicher Feiertag",       osternOffset: 49},
    pfingstmontag:  {enabled: true,  "en": "Whit Monday",         "de": "Pfingstmontag",                "ru": "Католическая Троица - Понедельник",      desc: "kirchlicher Feiertag",       osternOffset: 50},
    fronleichnam:   {enabled: false, "en": "Corpus Christi",      "de": "Fronleichnam",                 "ru": "Праздник Тела и Крови Христовых",        desc: "kirchlicher Feiertag",       osternOffset: 60,                       comment: "(BW, BY, HE, NW, RP, SL (SA, TH nicht überall))"},
    mhimmelfahrt:   {enabled: false, "en": "Assumption of Mary",  "de": "Mariä Himmelfahrt",            "ru": "Вознесение Девы Марии",                  desc: "kirchlicher Feiertag",       date: "15.08", offset: 227, leap: true, comment: "(BY (nicht überall), SL)"},
    einheitstag:    {enabled: true,  "en": "Day of German unity", "de": "Tag der deutschen Einheit",    "ru": "День объединения Германии",              desc: "politischer Feiertag",       date: "03.10", offset: 276, leap: true},
    reformationstag:{enabled: false, "en": "Reformation Day",     "de": "Reformationstag",              "ru": "День Реформации (Хэллоуин)",             desc: "kirchlicher Feiertag",       date: "31.10", offset: 304, leap: true, comment: "(BB, MV, SA, ST, TH)"},
    allerheiligen:  {enabled: true,  "en": "All Saints' Day",     "de": "Allerheiligen",                "ru": "День всех святых (Хэллоуин)",            desc: "kirchlicher Feiertag",       date: "01.11", offset: 305, leap: true, comment: "(BW, BY, NW, RP, SL)"},
    heiligabend:    {enabled: true,  "en": "Christmas Eve",       "de": "Heiligabend",                  "ru": "Католическое Рождество",                 desc: "kirchlicher Feiertag",       date: "24.12", offset: 358, leap: true},
    weihnachtstag1: {enabled: false, "en": "Christmas Day",       "de": "1. Weihnachtstag",             "ru": "Католическое Рождество - Первый день",   desc: "kirchlicher Feiertag",       date: "25.12", offset: 359, leap: true},
    weihnachtstag2: {enabled: true,  "en": "2nd Christmas Day",   "de": "2. Weihnachtstag",             "ru": "Католическое Рождество - Второй день",   desc: "kirchlicher Feiertag",       date: "26.12", offset: 360, leap: true},
    silvester:      {enabled: true,  "en": "ew Year's Eve",       "de": "Silvester",                    "ru": "Новый год",                              desc: "kalendarischer Feiertag",    date: "31.12", offset: 365, leap: true}
};

if (typeof module !== 'undefined' && module.parent) {
    module.exports = {
        holidays:    holidays
    };
}


