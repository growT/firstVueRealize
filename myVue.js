
/**
 * 创建 观察者和订阅者之间的桥梁
 * 
 * 
 */

 /**
  * data:需要进行观测的数据
  * el： 对应的dom元素
  * exp ：对应的属性
  */
 function MyVue(options) {
    this.data = options.data;
    this.methods = options.methods;
    Object.keys(this.data).forEach((key) => {
        this.proxyKey(key);
    })
    observe(this.data);//添加数据观测
    // el.innerHTML = this.data[exp];//初始化数据
    // new Watcher(this,exp,(value) => {
    //     el.innerHTML = value;
    // })  
    new Compiler(options.el, this);
    options.mounted.call(this);
    return this; 
 }
 MyVue.prototype = {
     //用来去掉 myVue.data.属性名 变成：vue.属性名
     //只是在 myVue实例中 使用Object.defineProperty添加了对应的属性
     proxyKey: function(key) {
        let self = this;
        Object.defineProperty(self, key,{
            configurable: true,
            enumerable: false,
            get: function proxyGetter(){
                return self.data[key]
            },
            set: function proxySetter(value) {
                self.data[key] = value;
            }
        })
     }
 }

 
