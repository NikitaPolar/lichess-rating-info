// ==UserScript==
// @name         Lichess rating info
// @version      0.1
// @description  Displays information about opponent's rating.
// @author       NikitaPolar
// @include      /^https://lichess\.org/([a-zA-Z0-9]{7,12})
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var loadfunction = window.onload;
    window.onload = function(event){
        var username = $('#user_tag').text();
        var type = $('span.hint--top, a.hint--top.variant-link').text();
        switch(type) {
            case 'KING OF THE HILL':
                type = 'kingOfTheHill';
                break;
            case 'THREE-CHECK':
                type = 'threeCheck';
                break;
            case 'RACING KINGS':
                type = 'racingKings';
                break;
            default:
                type = type.toLowerCase();
        }
        $('div.players .player a.user_link').each(function() {
            if ($(this).attr('href').indexOf(username) == -1) {
                $.get('https://lichess.org'+$(this).attr('href')+'/perf/'+type, function(htmlstr) {
                    var infostr = htmlstr.match(/data: (.*)\}/);
                    var info = JSON.parse(infostr[1]+'}');
                    if (info != undefined) {
                        var WR = ~~((info.stat.count.win/info.stat.count.all)*100);
                        $(".username.user_link:first").after('<div class="username user_link" style="text-align:center;display: block;margin-bottom: 7px;"><rating>Max: '+info.stat.highest.int+', WR: '+WR+'%, G: '+info.stat.count.all+'</rating></div>');
                    }
                });
                return false;
            }
        });
        if(loadfunction) loadfunction(event);
    }
})();
