/**
 * 实现一个消息订阅器，用来存放属性的所有订阅者，并且在数据变化的时候通知订阅者，执行订阅着的更新函数
 */

 function Dep() {
    this.subs = [];
}
Dep.prototype.addSub = function(sub) {
    this.subs.push(sub);
}
Dep.prototype.notify = function() {
    this.subs.forEach((sub) => {
        sub.update();
    })
}


