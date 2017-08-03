// var dbdata = require('./db/api');
var co = require('co');
var TaskQueue = require('./scripts/taskqueue');
var works = require('./scripts/worker');
// var cfg = {};
//control
// var initData = dbdata.getInitData();
// const getTest =co.wrap(function*(){
//     return Promise.resolve({test:1});
// })
// co(function*(){
//    var ts=yield getTest();
//    console.log(ts.test);
// });
var spideQrueue = new TaskQueue('url');
var memberQrueue = new TaskQueue('dpid');
var shopQrueue = new TaskQueue('url');

var htmlworker = new works.HtmlWorker();
var reviewsworker = new works.ReviewsWorker();
spideQrueue.add({
    dpid: 43014967,
    url: 'http://www.dianping.com/member/43014967/reviews'
});

co(function*() {
    console.info('-----系统启动-----');
    while (spideQrueue.queue.length > 0) {
        try {
            var task = spideQrueue.next();
            console.info('进行作业', task.url);
            var $ = yield htmlworker.do(task);
            var data = yield reviewsworker.do($, { pathname: task.url });
            //缓存队列
            if (memberQrueue.qIndex[data.member.dpid] == null) {
                memberQrueue.add(data.member);
            }
            for (i = 0, len = data.shops.length; i < len; i++) {
                if (shopQrueue.qIndex[data.shops[i].url] == null) {
                    shopQrueue.add(data.shops[i]);
                }
            }
            for (j = 0, len = data.paging.length; j < len; j++) {
                if (spideQrueue.qIndex[data.paging[j].url] == null) {
                    spideQrueue.add(data.paging[j]);
                }
            }

            //批量入库
        } catch (err) {}
    }
    console.info(`全部爬取完毕`);
    console.info('DATA', { member: memberQrueue.queue });
});
// 错误处理
process.on('unhandledRejection', function(err) {
    console.error(err.stack);
});

process.on(`uncaughtException`, console.error);