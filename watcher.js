
/**
 * 订阅者，用来数据变换的时候更新对应的视图，但是这里不能直接去和视图联系，为什么？
 * 因为这个每次都要在视图的时候调用订阅者而，并且也调用观察者，那么这里就需要一个公共的方法去联系 观察者和订阅者，这个公共的方法就像是桥梁
 * 这个桥梁里面有 属性 属性的值，并且有dom元素 
 * 
 */

 /**
  * vm:只这里的桥梁 包含有属性的值
  * exp:属性
  * 回调函数:用来更新真正的视图
  */
function Watcher(vm, exp,cb) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    this.value = this.get()//获取原来的数据
}
/**
 * update用来更新视图
 */
Watcher.prototype.update = function() {
    let newValue = this.vm.data[this.exp];
    if(newValue != this.value) {
        this.cb.call(this.vm, newValue, this.value);
    }
}

/**
 * get用来把订阅者添加把自己添加到消息订阅器中，怎样添加，通过获取属性的值来添加
 */
Watcher.prototype.get = function() {
    Dep.target = this;//Dep.target主要是为了在获取属性值时，判断是否添加自己到订阅器中
    let value = this.vm.data[this.exp];
    Dep.target = null;
    return value;
}


