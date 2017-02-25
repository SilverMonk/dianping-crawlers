/**
 * Created by Administrator on 2017/2/25/025.
 */
function TaskQueue(idname) {
    this.queue = [];
    this.qIndex = {};

    this.add = function (task) {
        /// 任务类型判断 togo
        this.qIndex[task[idname]] = task;
        this.queue.push(task);
    }.bind(this);

    this.next = function () {
        var task = this.queue.shift();
        delete this.qIndex[idname];
        return task;
    }.bind(this);
}


module.exports = TaskQueue;
