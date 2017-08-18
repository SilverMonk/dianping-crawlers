var { BloomFilter } = require('BloomFilter');
var bloom = new BloomFilter(
    32 * 256, // number of bits to allocate.
    16 // number of hash functions.
);

function TaskQueue(key) {
    this.queue = [];
    this.key = key;
    // this.qIndex = {};
    this.bloom = new BloomFilter(32 * 256, 16);
    this.init = function(data) {
        this.queue.push = data;
        data.eachFor(function(item) {
            item[key] && this.bloom.add(item[key])
        })
    };
    this.add = function(task) {
        /// 任务类型判断 togo
        // this.qIndex[task[idname]] = task;
        this.queue.push(task);
        if (!this.bloom.test(task[this.key])) {
            this.bloom.add(task[this.key]);
        } else {
            console.log('[任务重复] ' + this.key + ':' + task[this.key]);
        }

    }.bind(this);

    this.next = function() {
        var task = this.queue.shift();
        // delete this.qIndex[idname];
        return task;
    }.bind(this);
}


module.exports = TaskQueue;