var {
    BloomFilter
} = require('BloomFilter');

function TaskQueue(key) {
    this.queue = [];
    this.key = key;
    // this.qIndex = {};
    this.bloom = new BloomFilter(32 * 256, 16);
    this.init = function (data) {
        this.queue = data || [];
        this.queue.forEach(function (item) {
            item[key] && this.bloom.add(item[key])
        }.bind(this))
    };
    this.add = function (task) {
        /// 任务类型判断 togo
        // this.qIndex[task[idname]] = task;        
        if (!this.bloom.test(task[this.key])) {
            this.bloom.add(task[this.key]);
            this.queue.push(task);
            return true;
        } else {
            //console.log('[任务重复] ' + this.key + ':' + task[this.key]);
            return false;
        }

    }.bind(this);

    this.next = function () {
        var task = this.queue.shift();
        // delete this.qIndex[idname];
        return task;
    }.bind(this);
}


module.exports = TaskQueue;