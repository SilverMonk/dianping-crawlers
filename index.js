var util = require("util");
var request = require("superagent");
var cheerio = require("cheerio");
var async = require("async");
var fs = require('fs');
var db = require('./db/index');

var cfg = {
    type: 'silent', //debug
}
var data = {
    member: {},
    shop: {},
}
/// init params
db.do('select id,dpid from dp_shop', null, function(err, res) {
    if (err) {
        console.log('[INIT SHOP LIST ERROR] - ', err.message);
        return;
    }
    for (var i = res.length - 1; i >= 0; i--) {
        var row = res[i];
        if (data.shop[row.dpid] == null) {
            data.shop[row.dpid] = row.id;
        }
    }
});
db.do('select id,dpid from dp_member', null, function(err, res) {
    if (err) {
        console.log('[INT MEMBER LIST ERROR] - ', err.message);
        return;
    }
    for (var i = res.length - 1; i >= 0; i--) {
        var row = res[i];
        if (data.member[row.dpid] == null) {
            data.member[row.dpid] = row.id;
        }
    }
});

function getMByID(id) {
    var url = `http://www.dianping.com/member/${id}/wishlists?favorTag=s10_c-1_t-1`;
    request.get(url).end(function(err, res) {
        var $ = cheerio.load(res.text);
        var data = {};
        var member = {
            name: $('.head-user .name').text(),
            dpid: id,
            pic: $('.head-user .pic img').attr('src'),
        };
        // console.log('[用户信息]', member);
        // addmember(member);

        var shoplist = [];
        $('.favor-list .txt').each(function(i, e) {
            var t_shop = {
                dpid: $('h6 a', e).attr('href').replace('/shop/', ''),
                name: $('h6 a', e).text(),
                adds: $('.addres p', e).text(),
                url: $('h6 a', e).attr('href'),
            }
            shoplist.push(t_shop);
            addshops(t_shop);
        });
        // console.log('[店铺信息]', shoplist);

    });
}

function addmember(opts) {
    opts.creat_date = new Date();
    db.do('insert dp_member set ?', opts, function(err, res) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
        if (cfg.type == 'debug') {
            console.log('-------INSERT----------');
            console.log('INSERT ID:', res.insertId);
            console.log('AffectedRows:', res.affectedRows);
        }
    });
}

function addshops(opts) {
    opts.creat_date = new Date();
    db.do('insert dp_shop set ?', opts, function(err, res) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
        if (cfg.type == 'debug') {
            console.log('-------INSERT----------');
            console.log('INSERT ID:', res.insertId);
            console.log('AffectedRows:', res.affectedRows);
        }
        return;
    });
}
