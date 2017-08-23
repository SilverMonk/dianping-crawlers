/**
 * Created by Administrator on 2017/2/25/025.
 */
var request = require('superagent');
var cheerio = require('cheerio');

function BaseWorker(name) {
    this.name = name || "default";
    this.type = "Base";
    this.init = function() {};
    this.do = function(data) {
        return data;
    };
    this.commit = function() {};
}

function ReviewsWorker(name) {
    BaseWorker.call(this, name);
    this.type = 'reviews';
    this.do = async($) => {
        var pathname = location.host + location.pathname;
        var member = {
            name: $('.head-user .name').text(),
            dpid: $('.head-user .pic a').attr('href').replace('/member/', ''),
            pic: $('.head-user .pic img').attr('src')
        };

        var shops = [];
        $('.pic-txt ul li .J_rptlist h6 a').each(function(i, e) {
            shops.push({
                url: $(e).attr('href'),
                name: $(e).text(),
            });
        });

        var paging = [];
        $('.pages-num a').each(function(i, e) {
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

function HtmlWorker(name) {
    BaseWorker.call(this, name);
    this.type = 'html';
    this.do = async(data) => {
        return request.get(data.url).then(function(res) {
            return cheerio.load(res.text);
        });
    };
}
module.exports = {
    BaseWorker,
    ReviewsWorker,
    HtmlWorker
}