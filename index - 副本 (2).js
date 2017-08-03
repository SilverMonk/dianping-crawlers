var dbdata = require('./db/api');
var co = require('co');
var cfg = {
    violence: 0,
};
//control
var initData = dbdata.getInitData();
const getTest = co.wrap(function*() {
    return Promise.resolve({ test: 1 });
})
co(function*() {
    var ts = yield getTest();
    console.log(ts.test);
});

process.on('unhandledRejection', function(err) {
    console.error(err.stack);
});

process.on(`uncaughtException`, console.error);
