/**
 * 实现一个观察者来观察数据变化，那么就需要用递归的方法来把每个对象的属性上添加Object.defineProperty()方法
 */

 function defineReactive(data, key, value) {
    //因为这里的value 也许也是对象所以需要给它的属性加上Object.defineProperty()
    observe(value);

    let dep = new Dep();//创建属性的订阅器

    //给当前对象的属性加上 Object.defineProperty()
    Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true,
        get: function(val) {
            //把订阅者添加到订阅器中
            if(Dep.target) {
                dep.addSub(Dep.target);
            }
            return value;
        },
        set: function(newVal) {
            value = newVal;
            //数据发生变化时，去更行所有订阅的订阅者
            dep.notify();
            console.log('属性已经被观测了,新的值为：' + newVal.toString());
        }
    })
 }

 /**
  * 
  * @param {*} data 
  * 观测 val值
  */
 function observe(data) {
     //如果值为空或者 不是对象的话，返回
     if(!data || typeof data != 'object') {
        return ;
     }
     //遍历对象的属性为每个属性添加 Object.defineProperty()
     Object.keys(data).forEach((key) => {
        defineReactive(data, key, data[key])
     }) 
 }

 /**
  * 测试
  */

  let  obj1 = {
      key1: 'value1',
      key2: 'value2',
      key3: {
        cKey1: 'valueckey31',
        ckey2: 'valueckey32'
      }
  }

  observe(obj1);
  console.log(obj1);
  obj1.key1 = 'testValue1';
  obj1.key3.cKey1 = 'testvalueckey31';

