var url = require('url');
var moment = require('moment');

var api = require('./db/api');
var db = require('./db/api');
var TaskQueue = require('./scripts/taskqueue');
var works = require('./scripts/worker');

var spiderQueue = new TaskQueue('url');

spiderQueue.init();
var memberQrueue = new TaskQueue('dpid');
var shopQrueue = new TaskQueue('dpid');

var htmlworker = new works.HtmlWorker();
var reviewsworker = new works.ReviewsWorker();
var followsworker = new works.FollowsWorker();
const memberPix = 'https://www.dianping.com/member/';

var seedlist = [{
    dpid: 43014967
}, {
    dpid: 2516395
}];
var injectseed = false;
var cfg = {
    seachTimeLimit: 0,
};

(async() => {
    console.log('数据初始中。。。');
    var now = moment();
    var _members = await api.getMembers();
    memberQrueue.init(_members);
    shopQrueue.init(await api.getShops());

    if (injectseed) {
        _members = _members.concat(seedlist);
    }
    _members.map((item) => {
        if (item.dpid && moment(item.updatedAt).diff(now, 'hour') >= cfg.seachTimeLimit) {
            spiderQueue.add({
                type: 'reviews',
                url: 'http://www.dianping.com/member/' + item.dpid + '/reviews'
            });
        }
    });


    console.log('数据初始化完成（¯﹃¯）口水');

    console.info('-----系统启动-----');
    var count = 0;
    var handel = setInterval(() => {
        (async() => {
            try {
                var task = spiderQueue.next();
                console.info('进行作业', task.url);
                var urlobj = url.parse(task.url);
                var $ = await htmlworker.do(task);
                const baseurl = 'http://' + urlobj.host + urlobj.pathname;

                if (task.type == 'reviews') {
                    var data = await reviewsworker.do($, {
                        url: baseurl
                    });
                    if (memberQrueue.add(data.member)) {
                        await api.creatMember(data.member);
                    }

                    spiderQueue.add({
                        type: 'follows',
                        url: memberPix + data.member.dpid + '/follows'
                    });
                    //缓存队列
                    data.shops.map(async(shop) => {
                        if (shopQrueue.add(shop)) {
                            await api.creatShop(shop);
                        }
                    });

                    //分页待处理
                    // data.paging.eachFor(function (element) {
                    //     spiderQueue.add(data.paging[j]);
                    // });
                } else if (task.type == 'follows') {

                    var data = await followsworker.do($);

                    data.map(async(follow) => {
                        if (follow.rank && follow.rank > 15000) {
                            if (memberQrueue.add(follow)) {
                                await api.creatMember(follow);
                                spiderQueue.add({
                                    type: 'follows',
                                    url: memberPix + follow.dpid + '/follows'
                                });
                            }
                        }
                    });
                }

                //


            } catch (err) {}
        })();

        if (spiderQueue.queue.length == 0) {
            count++;
        }
        if (count >= 10) {
            clearInterval(handel);
            console.info(`全部爬取完毕`, '耗时：' + moment(moment().diff(now)).format("mm:ss"));
        }
    }, 1000);

})();

// 错误处理
process.on('unhandledRejection', function (err) {
    console.error(err.stack);
});
process.on(`uncaughtException`, console.error);