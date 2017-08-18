var url = require('url');

var api = require('./db/api');
var db = require('./db/api');
var TaskQueue = require('./scripts/taskqueue');
var works = require('./scripts/worker');

var spideQrueue = new TaskQueue('url');
var memberQrueue = new TaskQueue('dpid');
var shopQrueue = new TaskQueue('url');

var htmlworker = new works.HtmlWorker();
var reviewsworker = new works.ReviewsWorker();

spideQrueue.add({
    dpid: 43014967,
    url: 'http://www.dianping.com/member/43014967/reviews'
});
spideQrueue.add({
    dpid: 43014967,
    url: 'https://www.dianping.com/member/2516395/reviews'
});
(async() => {
    console.info('-----系统启动-----');
    while (spideQrueue.queue.length > 0) {
        try {
            var task = spideQrueue.next();
            console.info('进行作业', task.url);
            var urlobj = url.parse(task.url);

            var $ = await htmlworker.do(task);
            var data = await reviewsworker.do($, {
                url: 'http://' + urlobj.host + urlobj.pathname
            });
            //缓存队列
            if (memberQrueue.qIndex[data.member.dpid] == null) {
                memberQrueue.add(data.member);
                await api.creatMember(element);
            }
            for (i = 0, len = data.shops.length; i < len; i++) {
                shopQrueue.add(data.shops[i]);
                await api.creatShop(element);
            }
            for (j = 0, len = data.paging.length; j < len; j++) {
                spideQrueue.add(data.paging[j]);
            }

            //批量入库

        } catch (err) {}
    }
    // (async() => {
    //     for (let element of memberQrueue.queue) {
    //         await api.creatMember(element);
    //     }
    //     for (let element of shopQrueue.queue) {
    //         await api.creatShop(element);
    //     }
    // })();

    console.info(`全部爬取完毕`);
    // console.info('DATA', {
    //     member: memberQrueue.queue,
    //     shop: shopQrueue.queue
    // });

})();


// 错误处理
process.on('unhandledRejection', function(err) {
    console.error(err.stack);
});
process.on(`uncaughtException`, console.error);