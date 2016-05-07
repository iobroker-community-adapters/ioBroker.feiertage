/* jshint -W097 */// jshint strict:false
/*jslint node: true */

"use strict";
var utils       = require(__dirname + '/lib/utils'); // Get common adapter utils
var parseString = require('xml2js').parseString;
var request     = require('request');

var lang = 'de';

var adapter = utils.adapter({
    name:           'tvspielfilm',
    useFormatDate:  true
});

adapter.on('ready', function () {
    adapter.getForeignObject('system.config', function (err, data) {
        if (data && data.common) {
            lang  = data.common.language;
        }

        adapter.log.debug('adapter tvspielfilm initializing objects');
        main();
        adapter.log.info('adapter tvspielfilm objects written');

        setTimeout(function () {
            adapter.log.info('force terminating after 1 minute');
            adapter.stop();
        }, 60000);

    });
});
 
function readSettings() {
    var path = __dirname;
        /*if (typeof blacklist == 'function') {
            callback = blacklist;
            blacklist = undefined;
        }
    adapter.log.info('Blacklist: ' + blacklist);*/
    var blacklist = adapter.config.stations;
    adapter.log.info('Stationen aus Blacklist: ' + blacklist);
    
} 

function check_sender (ueberschrift) { //  wird so übergeben "16:50 | Sky Cinema | Kill the Boss 2"
    var ueberschrift_teile = ueberschrift.split(' | ');
    var sender = ueberschrift_teile[1];
    var empfangbar;
    
    /*var blacklist = [];
    blacklist = ['Silverline',
                 'Sky Action',
                 'Sky Cinema',
                 'Sky Comedy',
                 'MGM HD',
                 'Sky Nostalgie',
                 'KinoweltTV',
                 'Sky Emotion',
                 'Sky 007 HD',
                 'Disney Channel',
                 'Sony E. Television',
                 'TNT Film',
                 'Sky Hits HD',
                 'Disney Cinemagic',
                 'AXN',
                 'Syfy',
                 'Sky Atlantic HD'
                ];
    var suchergebnis = blacklist.indexOf(sender,0);  // Ergebnis ist die Position im Array oder "-1", wenn nicht gefunden
    empfangbar = (suchergebnis == -1) ? true : false; // Sender nicht in der Blacklist, also empfangbar*/
    return(true);//return(empfangbar); 
}


var rss_options = {
    jetzt : { feedname: 'Jetzt',
              url: 'http://www.tvspielfilm.de/tv-programm/rss/jetzt.xml',
              state: 'rss.jetzt',
              cssclass:  'tv_jetzt'
            },
    tipps:  { feedname: 'Tipps',
              url: 'http://www.tvspielfilm.de/tv-programm/rss/filme.xml',
              state: 'rss.tipps',
              cssclass:  'tv_tipps'
            }
}


function readFeed (x) {
    var link = rss_options[x].url;
    adapter.log.info('RSS Feed wird eingelesen: ' + link);
    request(link, function (error, response, body) {
        if (!error && response.statusCode == 200) {
    
            parseString(body, {
                explicitArray: false,
                mergeAttrs: true
            }, function (err, result) {
                var data = JSON.stringify(result, null, 2);
                var table = [];
                if (err) {
                    adapter.log.warn("Fehler: " + err);
                } else {                                                               
                    var sender_empfangbar = false;
                    if (result.rss.channel.item.length !== null) { // gelegentlicher Fehler bei nächtlicher Abfrage durch length (undefined) soll hier abgefangen werden
                        // Array durchzaehlen von 0 bis Zahl der items
                        for(var i = 0; i < result.rss.channel.item.length; i++) {
                            sender_empfangbar = check_sender(result.rss.channel.item[i].title);
                            if (sender_empfangbar) {
                                var entry = {
                                    image: result.rss.channel.item[i].enclosure ? '<img width="100%" src="' + result.rss.channel.item[i].enclosure.url + '" />' : '',
                                    text:  '<table class="' + rss_options[x].cssclass + '"><tr><td class="' + rss_options[x].cssclass + '_text" style="text-align: left; padding-left: 5px; font-weight: bold"><a href="' +
                                       result.rss.channel.item[i].link + '" target="_blank">' + result.rss.channel.item[i].title +
                                       '</a></td></tr><tr><td style="text-align: left; padding-left: 5px">' +
                                       result.rss.channel.item[i].description +'</td></tr></table>',
                                    _Bild: result.rss.channel.item[i].enclosure ? '<img class="' + rss_options[x].cssclass + '_bild" width="100%" src="' + result.rss.channel.item[i].enclosure.url + '" />' : 'no image'
                                };
                                table.push(entry);
                            } // Ende Abfrage, ob Sender empfangbar
                        }
                    } else adapter.log.warn('LENGTH in TV Programm (' + rss_options[x].feedname + ') nicht definiert'); // ende if ungleich
                }
                adapter.setState(rss_options[x].state, {val: JSON.stringify(table), ack: true});// ganze XML in Objekt für Table Widget
            });
        } else adapter.log.warn(error,'error');
    });   // Ende request 
    adapter.log.info('XML-Daten aus TV Spielfilm (' + rss_options[x].feedname + ') eingelesen');
}
function main() {
    for (var j in rss_options) {
        readFeed(j);
    }
    adapter.stop();
}
