/* jshint -W097 */// jshint strict:false
/*jslint node: true */

"use strict";
var utils    = require(__dirname + '/lib/utils'); // Get common adapter utils
var holidays = require(__dirname + '/admin/holidays').holidays; // Get common adapter utils

var lang = 'de';

var adapter = utils.adapter({
    name: 'feiertage',
    //useFormatDate: true,
    systemConfig:  true,
    ready: function () {
        adapter.getForeignObject('system.config', function (err, data) {
            if (data && data.common) {
                lang  = data.common.language;
            }

            adapter.log.debug('adapter feiertage initializing objects');
            checkHolidays();
            adapter.log.info('adapter feiertage objects written');

            setTimeout(function () {
                adapter.log.info('force terminating after 1 minute');
                adapter.stop();
            }, 60000);

        });
    }
});
 
function readSettings() {
    for (var h in holidays) {
        holidays[h].enabled = adapter.config['enable_' + h];
    }
} 

// Script ermittelt, ob heute oder morgen ein Feiertag ist
var sj;                 // Schaltjahr
var ostern;             // Ostersonntag: Tag im Jahr

// Regional nicht relevante Feiertage auskommentieren oder löschen !!
function feiertag(day) {
    for (var h in holidays) {
        if (holidays[h].enabled) {
            if (holidays[h].offset && (holidays[h].offset + (holidays[h].leap ? sj : 0)) == day) {
                return holidays[h][lang] + (holidays[h].comment ? ' ' + holidays[h].comment : '');
            }
            if (holidays[h].osternOffset && (ostern + holidays[h].osternOffset) == day) {
                return holidays[h][lang] + (holidays[h].comment ? ' ' + holidays[h].comment : '');
            }
        }
    }
    return '';
} 

function tagdesjahresZudatum (day) {
    var day_ms = (day - sj) * 24 * 60 * 60 * 1000;                              // Tag des Jahres in Millisekunden seit Neujahr Mitternacht
    var jetzt = new Date();
    var Jahr = jetzt.getFullYear();
    var neujahr = new Date(Jahr, 0, 1, 0, 0, 0, 0);                             // Dies Jahr Neujahr Mitternacht
    var neujahr_ms = neujahr.getTime();
    var datum = new Date();
    datum.setTime(neujahr_ms + day_ms);                                         // Addition Neujahr in ms plus Tag des Jahres in ms = gesuchtes Datum in ms
    return(datum);    
}


// auf Feiertag testen
function checkHolidays() {
    readSettings();
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
   adapter.setState('heute.Name', {ack: true, val: feiertag(tag)});
   istFeiertag = (feiertag(tag).length < 2) ? false : true;
   adapter.setState('heute.boolean', {ack: true, val: istFeiertag});
   
   // morgen
   tag = tag + 1;
   if (tag > 365 + sj) tag = 1;
   adapter.setState('morgen.Name', {ack: true, val: feiertag(tag)});
   istFeiertag = (feiertag(tag).length < 2) ? false : true;
   adapter.setState('morgen.boolean', {ack: true, val: istFeiertag});
   
   // übermorgen
   tag = tag + 1;
   if (tag > 365 + sj) tag = 1;
   adapter.setState('uebermorgen.Name', {ack: true, val: feiertag(tag)});
   istFeiertag = (feiertag(tag).length < 2) ? false : true;
   adapter.setState('uebermorgen.boolean', {ack: true, val: istFeiertag});
   
   // nächster Feiertag
   var noch = 0;
   tag = tag - 1; // zurück setzen auf morgen, da morgen erst nächster Tag
   do {
       tag = tag + 1;
       if (tag > 365 + sj) tag = 1;
       noch = noch + 1;
       istFeiertag = !!feiertag(tag);

       if (istFeiertag) {
           var datum_tdj = tagdesjahresZudatum(tag);
           adapter.setState('naechster.Name', {ack: true, val: feiertag(tag)});
           
           // Workaround für formatDate
           var next_ft_jahr = datum_tdj.getFullYear();
           var next_ft_monat = ( (datum_tdj.getMonth() + 1) < 10) ? '0' + (datum_tdj.getMonth() + 1) : (datum_tdj.getMonth() + 1);
           var next_ft_tag = ( datum_tdj.getDate() < 10) ? '0' + datum_tdj.getDate() : datum_tdj.getDate();
           var next_ft = next_ft_tag + '.' + next_ft_monat + '.' + next_ft_jahr;
           adapter.log.info('Nächster Feiertag: '  + feiertag(tag) + ' in ' + noch + ' Tagen am ' + next_ft);
           adapter.setState('naechster.Datum', {ack: true, val: next_ft});
           // Ende Workaround
           
           //adapter.setState("naechster.Datum", adapter.formatDate(datum_tdj));
           //adapter.log.info('Nächster Feiertag: '  + feiertag(tag) + ' in ' + noch + ' Tagen am ' + adapter.formatDate(datum_tdj));
           adapter.setState('naechster.Dauer', {ack: true, val: noch}, function () {
               adapter.stop();
           });
       }
   } while (!istFeiertag);
}
