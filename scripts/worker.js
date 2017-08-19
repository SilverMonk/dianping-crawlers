/**
 * Created by Administrator on 2017/2/25/025.
 */
var co = require('co');
var request = require('superagent');
var cheerio = require('cheerio');

function BaseWorker(name) {
    this.name = name || "default";
    this.type = "Base";
    this.init = function () {};
    this.do = function (data) {
        return data;
    };
    this.commit = function () {};
}

function ReviewsWorker(name) {
    BaseWorker.call(this, name);
    this.type = 'reviews';
    this.do = async($, opts) => {
        var pathname = opts.url || '';
        var member = {
            name: $('.head-user .name').text(),
            dpid: $('.head-user .pic a').attr('href').replace('/member/', ''),
            pic: $('.head-user .pic img').attr('src')
        };

        var shops = [];
        $('.pic-txt ul li .J_rptlist').each(function (i, e) {
            shops.push({
                dpid: $(e).find('.J_report').attr('data-sid'),
                url: $(e).find('h6 a').attr('href'),
                name: $(e).find('h6 a').text(),
            });
        });

        var paging = [];
        $('.pages-num a').each(function (i, e) {
            paging.push({                
                url: (pathname) + $(e).attr('href'),
            });
        });
        return {
            member,
            shops,
            paging
        };
    };

}

function FollowsWorker(name) {
    BaseWorker.call(this, name);
    this.type = 'follows';
    this.do = async($, opts) => {
        var follows = [];
        $('.fllow-list .pic-txt ul li').each((i, e) => {
            var name = $(e).find('.pic img').attr('title');
            var dpid = $(e).find('.pic img').attr('user-id');
            var pic = $(e).find('.pic img').attr('data-lazyload');
            var rank = $(e).find('.user-rank-rst').attr('title');
            follows.push({
                name,
                dpid,
                pic,
                rank
            });
        })
        return follows;
    };
}

function HtmlWorker(name) {
    BaseWorker.call(this, name);
    this.type = 'html';
    this.do = co.wrap(function* (data) {
        return request.get(data.url).then(function (res) {
            return cheerio.load(res.text);
        });
    });
}
module.exports = {
    // init:function(workname){
    //     var worker={};
    //     if('html'==workname){
    //         worker=new HtmlWorker(workname);
    //     }else if(){

    //     }
    //     return worker;
    // },
    BaseWorker,
    ReviewsWorker,
    FollowsWorker,
    HtmlWorker
}