/* jshint -W097 */// jshint strict:false
/*jslint node: true */

"use strict";
var utils   = require(__dirname + '/lib/utils'); // Get common adapter utils

var adapter = utils.adapter({
    name: 'feiertage',
    //useFormatDate: true,
    systemConfig:  true,
    
    unload: function (callback) {
        adapter.log.info("adapter feiertage is unloading");
    },
    discover: function (callback) {
        adapter.log.info("adapter feiertage discovered");
    },
    install: function (callback) {
        adapter.log.info("adapter feiertage installed");
    },
    uninstall: function (callback) {
        adapter.log.info("adapter feiertage UN-installed");
    },
    ready: function () {
        adapter.log.debug("Adapter feiertage got 'Ready' Signal");
        adapter.log.debug("adapter feiertage initializing objects");
        checkHolidays();
        adapter.log.info("adapter feiertage objects written");

        setTimeout(function () {
            adapter.log.info('force terminating after 4 minutes');
            adapter.stop();
        }, 240000);
    }
});
 
var neujahr,
    dreikoenige,
    maifeiertag,
    mhimmelfahrt,
    einheitstag,
    reformationstag,
    allerheiligen,
    heiligabend,
    weihnachtstag1,
    weihnachtstag2,
    silvester,
    rosenmontag,
    karfreitag,
    ostersonntag,
    ostermontag,
    chimmelfahrt,
    pfingssonntag,
    pfingstmontag,
    fronleichnam;
 
function readSettings() {
    neujahr =         adapter.config.enable_neujahr;
    dreikoenige =     adapter.config.enable_dreikoenige;
    maifeiertag =     adapter.config.enable_maifeiertag;
    mhimmelfahrt =    adapter.config.enable_mhimmelfahrt;
    einheitstag =     adapter.config.enable_einheitstag;
    reformationstag = adapter.config.enable_reformationstag;
    allerheiligen =   adapter.config.enable_allerheiligen;
    heiligabend =     adapter.config.enable_heiligabend;
    weihnachtstag1 =  adapter.config.enable_weihnachtstag1;
    weihnachtstag2 =  adapter.config.enable_weihnachtstag2;
    silvester =       adapter.config.enable_silvester;
    rosenmontag =     adapter.config.enable_rosenmontag;
    karfreitag =      adapter.config.enable_karfreitag;
    ostersonntag =    adapter.config.enable_ostersonntag;
    ostermontag =     adapter.config.enable_ostermontag;
    chimmelfahrt =    adapter.config.enable_chimmelfahrt;
    pfingssonntag =   adapter.config.enable_pfingstsonntag;
    pfingstmontag =   adapter.config.enable_pfingstmontag;
    fronleichnam =    adapter.config.enable_fronleichnam;    
} 

// Script ermittelt, ob heute oder morgen ein Feiertag ist
var sj;                 // Schaltjahr
var ostern;             // Ostersonntag: Tag im Jahr

// Regional nicht relevante Feiertage auskommentieren oder löschen !!
function feiertag(day) {
    var Name = '';
         if (day == 1        && neujahr)           Name = 'Neujahr';
    else if (day == 6        && dreikoenige)       Name = 'Heilige Drei Könige (BW,BY,ST)';
    else if (day == sj + 121 && maifeiertag)       Name = 'Maifeiertag';
    else if (day == sj + 227 && mhimmelfahrt)      Name = 'Maria Himmelfahrt (BY (nicht überall), SL)';
    else if (day == sj + 276 && einheitstag)       Name = 'Tag der dt. Einheit';
    else if (day == sj + 304 && reformationstag)   Name = 'Reformationstag (BB, MV, SA, ST,TH)';
    else if (day == sj + 305 && allerheiligen)     Name = 'Allerheiligen (BW, BY, NW, RP, SL)';
    else if (day == sj + 358 && heiligabend)       Name = 'Heiligabend';
    else if (day == sj + 359 && weihnachtstag1)    Name = '1. Weihnachtstag';
    else if (day == sj + 360 && weihnachtstag2)    Name = '2. Weihnachtstag';
    else if (day == sj + 365 && silvester)         Name = 'Silvester';
     
    else if (day == ostern - 48 && rosenmontag)    Name = 'Rosenmontag';
    else if (day == ostern -  2 && karfreitag)     Name = 'Karfreitag';
    else if (day == ostern      && ostersonntag)   Name = 'Ostersonntag';
    else if (day == ostern +  1 && ostermontag)    Name = 'Ostermontag';
    else if (day == ostern + 39 && chimmelfahrt)   Name = 'Christi Himmelfahrt';
    else if (day == ostern + 49 && pfingstsonntag) Name = 'Pfingstsonntag';
    else if (day == ostern + 50 && pfingstmontag)  Name = 'Pfingstmontag';
    else if (day == ostern + 60 && fronleichnam)   Name = 'Fronleichnam (BW, BY, HE, NW, RP, SL (SA, TH nicht überall))';
    else Name = '';
    return (Name);
} 

function tagdesjahresZudatum (day) {
    var day_ms = (day - sj) * 24 * 60 * 60 * 1000;                              // Tag des Jahres in Millisekunden seit Neujahr Mitternacht
    var jetzt = new Date();
    var Jahr = jetzt.getFullYear();
    var neujahr = new Date(Jahr,0,1,0,0,0,0);                                   // Dies Jahr Neujahr Mitternacht
    var neujahr_ms = neujahr.getTime();
    var datum = new Date();
    datum.setTime(neujahr_ms + day_ms);                                         // Addition Neujahr in ms plus Tag des Jahres in ms = gesuchtes Datum in ms
    return(datum);    
}


// auf Feiertag testen
function checkHolidays() {
    readSettings();
    adapter.log.info('testlog: ' + maifeiertag);
    // checkVariables();
    var jetzt = new Date();
    var Jahr = jetzt.getFullYear();
    sj = (Jahr % 4 === 0) ? 1 : 0;

// Die modifizierte Gauss-Formel nach Lichtenberg, gültig bis 2048
    var A = 120 + (19 * (Jahr % 19) + 24) % 30;
    var B = (A + parseInt(5 * Jahr / 4)) % 7;
    ostern = A - B - 33 + sj;

// Tag des Jahres
   var heutestart = new Date(jetzt.setHours(0,0,0,0));
   var neujahr = new Date(Jahr,0,1);
   var difftage = (heutestart - neujahr) / (24*60*60*1000) + 1;
   var tag = Math.ceil(difftage);

   // heute 
   var istFeiertag;
   adapter.setState("heute.Name", {ack: true, val: feiertag(tag)});
   istFeiertag = (feiertag(tag).length < 2) ? false : true;
   adapter.setState("heute.boolean", {ack: true, val: istFeiertag});
   
   // morgen
   tag = tag + 1;
   if (tag > 365 + sj) tag = 1;
   adapter.setState("morgen.Name", {ack: true, val: feiertag(tag)});
   istFeiertag = (feiertag(tag).length < 2) ? false : true;
   adapter.setState("morgen.boolean", {ack: true, val: istFeiertag});
   
   // übermorgen
   tag = tag + 1;
   if (tag > 365 + sj) tag = 1;
   adapter.setState("uebermorgen.Name", {ack: true, val: feiertag(tag)});
   istFeiertag = (feiertag(tag).length < 2) ? false : true;
   adapter.setState("uebermorgen.boolean", {ack: true, val: istFeiertag});
   
   // nächster Feiertag
   var noch = 0;
   tag = tag - 2; // zurück setzen auf heute
   while (feiertag(tag).length < 2) {
       tag = tag + 1;
       noch = noch + 1;
       istFeiertag = (feiertag(tag).length < 2) ? false : true;
       if (istFeiertag) {
           var datum_tdj = tagdesjahresZudatum(tag);
           adapter.setState("naechster.Name", {ack: true, val: feiertag(tag)});
           
           // Workaround für formatDate
           var next_ft_jahr = datum_tdj.getFullYear();
           var next_ft_monat = ( (datum_tdj.getMonth() + 1) < 10) ? '0' + (datum_tdj.getMonth() + 1) : (datum_tdj.getMonth() + 1);
           var next_ft_tag = ( datum_tdj.getDate() < 10) ? '0' + datum_tdj.getDate() : datum_tdj.getDate();
           var next_ft = next_ft_tag + '.' + next_ft_monat + '.' + next_ft_jahr;
           adapter.log.info('Nächster Feiertag: '  + feiertag(tag) + ' in ' + noch + ' Tagen am ' + next_ft);
           adapter.setState("naechster.Datum", {ack: true, val: next_ft});
           // Ende Workaround
           
           //adapter.setState("naechster.Datum", adapter.formatDate(datum_tdj));
           //adapter.log.info('Nächster Feiertag: '  + feiertag(tag) + ' in ' + noch + ' Tagen am ' + adapter.formatDate(datum_tdj));
           adapter.setState("naechster.Dauer", {ack: true, val: noch});
       }
   }
}
/*
function checkVariables() {
    adapter.log.info("init conditions objects (checkVariables)");
    //heute
    adapter.setObjectNotExists('heute', {
        type: 'channel',
        //role: 'day',
        common: {name: 'heute'},
        native: {}
    });
    adapter.setObjectNotExists('heute.Name', {
        type: 'state',
        common: {name: 'Feiertag heute - Name',
                desc:  "Welcher Feiertag ist heute?",
                type: "string",
                read: true,
                write: false
        },
        native: {}
    });
    adapter.setObjectNotExists('heute.boolean', {
        type: 'state',
        common: {name: 'Feiertag heute?',
                desc:  "Ist heute ein Feiertag?",
                type: "string",
                read: true,
                write: false
        },
        native: {}
    });
    //morgen
    adapter.setObjectNotExists('morgen', {
        type: 'channel',
        //role: 'day',
        common: {name: 'morgen'},
        native: {}
    });
    adapter.setObjectNotExists('morgen.Name', {
        type: 'state',
        common: {name: 'Feiertag morgen - Name',
                desc:  "Welcher Feiertag ist morgen?",
                type: "string",
                read: true,
                write: false
        },
        native: {}
    });
    adapter.setObjectNotExists('morgen.boolean', {
        type: 'state',
        common: {name: 'Feiertag morgen?',
                desc:  "Ist morgen ein Feiertag?",
                type: "string",
                read: true,
                write: false
        },
        native: {}
    });
    //übermorgen
    adapter.setObjectNotExists('uebermorgen', {
        type: 'channel',
        //role: 'day',
        common: {name: 'uebermorgen'},
        native: {}
    });
    adapter.setObjectNotExists('uebermorgen.Name', {
        type: 'state',
        common: {name: 'Feiertag übermorgen - Name',
                desc:  "Welcher Feiertag ist übermorgen?",
                type: "string",
                read: true,
                write: false
        },
        native: {}
    });
    adapter.setObjectNotExists('uebermorgen.boolean', {
        type: 'state',
        common: {name: 'Feiertag übermorgen?',
                desc:  "Ist übermorgen ein Feiertag?",
                type: "string",
                read: true,
                write: false
        },
        native: {}
    });
    //nächster
    adapter.setObjectNotExists('naechster', {
        type: 'channel',
        //role: 'day',
        common: {name: 'naechster'},
        native: {}
    });
    adapter.setObjectNotExists('naechster.Name', {
        type: 'state',
        common: {name: 'naechster Feiertag - Name',
                desc:  "Welcher ist der nächste Feiertag?",
                type: "string",
                read: true,
                write: false
        },
        native: {}
    });
    adapter.setObjectNotExists('naechster.Datum', {
        type: 'state',
        common: {name: 'Naechster Feiertag - Datum?',
                desc:  "Wann ist der naechste Feiertag?",
                type: "datetime", // ggf. string
                read: true,
                write: false
        },
        native: {}
    });
    adapter.setObjectNotExists('naechster.Dauer', {
        type: 'state',
        common: {name: 'Naechster Feiertag - Dauer bis dahin',
                desc:  "Zahl der Tage bis zum nächsten Feiertag",
                type: "number",
                unit: "Tage", // ggf übersetzen
                read: true,
                write: false
        },
        native: {}
    });
}
*/
