/* jshint -W097 */// jshint strict:false
/*jslint node: true */

"use strict";

var utils   = require(__dirname + '/lib/utils'); // Get common adapter utils

var channels = [];
var iopkg;

var adapter = utils.adapter({
    name: 'feiertage',
    useFormatDate: true,
    /*
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
    }, */
    ready: function () {
        adapter.log.debug("Adapter feiertage got 'Ready' Signal");
        adapter.log.debug("adapter feiertage initializing objects");
        checkHolidays();

        setTimeout(function () {
            adapter.log.info('force terminating after 4 minutes');
            adapter.stop();
        }, 240000);
    }
});

// Script ermittelt, ob heute oder morgen ein Feiertag ist
var sj;                 // Schaltjahr
var ostern;             // Ostersonntag: Tag im Jahr

// Regional nicht relevante Feiertage auskommentieren oder löschen !!
function feiertag(day) {
    var Name = '';
    if (day == 1) Name = 'Neujahr';
    else if (day == 6) Name = 'Heilige Drei Könige (BW,BY,ST)';
    else if (sj + 121 == day) Name = 'Maifeiertag';
    else if (day == sj + 227) Name = 'Maria Himmelfahrt (BY (nicht überall), SL)';
    else if (day == sj + 276) Name = 'Tag der dt. Einheit';
    else if (day == sj + 304) Name = 'Reformationstag (BB, MV, SA, ST,TH)';
    else if (day == sj + 305) Name = 'Allerheiligen (BW, BY, NW, RP, SL)';
    else if (day == sj + 358) Name = 'Heiligabend';
    else if (day == sj + 359) Name = '1. Weihnachtstag';
    else if (day == sj + 360) Name = '2. Weihnachtstag';
    else if (day == sj + 365) Name = 'Silvester';
     
    else if (day == ostern - 48) Name = 'Rosenmontag';
    else if (day == ostern -  2) Name = 'Karfreitag';
    else if (day == ostern)      Name = 'Ostersonntag';
    else if (day == ostern +  1) Name = 'Ostermontag';
    else if (day == ostern + 39) Name = 'Christi Himmelfahrt';
    else if (day == ostern + 49) Name = 'Pfingstsonntag';
    else if (day == ostern + 50) Name = 'Pfingstmontag';
    else if (day == ostern + 60) Name = 'Fronleichnam (BW, BY, HE, NW, RP, SL (SA, TH nicht überall))';
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
   adapter.setState("heute.Name", feiertag(tag));
   istFeiertag = (feiertag(tag).length < 2) ? false : true;
   adapter.setState("heute.boolean", istFeiertag);
   
   // morgen
   tag = tag + 1;
   if (tag > 365 + sj) tag = 1;
   adapter.setState("morgen.Name", feiertag(tag));
   istFeiertag = (feiertag(tag).length < 2) ? false : true;
   adapter.setState("morgen.boolean", istFeiertag);
   
   // übermorgen
   tag = tag + 1;
   if (tag > 365 + sj) tag = 1;
   adapter.setState("uebermorgen.Name", feiertag(tag));
   istFeiertag = (feiertag(tag).length < 2) ? false : true;
   adapter.setState("uebermorgen.boolean", istFeiertag);
   
   // nächster Feiertag
   var noch = 0;
   while (feiertag(tag).length < 2) {
       tag = tag + 1;
       noch = noch + 1;
       istFeiertag = (feiertag(tag).length < 2) ? false : true;
       if (istFeiertag) {
           var datum_tdj = tagdesjahresZudatum(tag);
           adapter.setState("naechster.Name", feiertag(tag));
           adapter.setState("naechster.Datum", formatDate(datum_tdj));
           adapter.log.info('Nächster Feiertag: '  + feiertag(tag) + ' in ' + noch + ' Tagen am ' + formatDate(datum_tdj));
           adapter.setState("naechster.Dauer", noch);
       }
   }
}
