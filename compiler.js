function Compiler(el, vm) {
    //生成一个
    this.el = document.querySelector(el);
    this.vm = vm;
    this.init();
}
Compiler.prototype = {
    init: function() {
        let self = this;
        if(self.el) {
            this.fragement = self.nodeToFragement(self.el);
            self.compileElement(this.fragement);
            this.el.appendChild(this.fragement)//操作完之后的documentFragement 需要重新操作一下真实的dom才能去赋值成功
        }
    },
    /**
     * 把实际的dom变成虚拟的dom对象，减少对dom的操作，提高性能
     * documentFragement 有一个特性 ：如果使用appendChid方法将原dom树中的节点添加到DocumentFragment中时，会删除原来的节点。 
     */
    nodeToFragement: function(el) {
        let documentFragement = document.createDocumentFragment();
        let firstChild = el.firstChild; 
        while(firstChild){

            documentFragement.appendChild(firstChild);
            firstChild = el.firstChild;
        }
        return documentFragement;
    },
    /**
     * 递归扫描fragement 对符合制定规则的dom元素，添加订阅者
     */
    compileElement: function(el) {
        let self = this;
        let reg = /\{\{(.*)\}\}/; //{{}}规则
        let nodes = el.childNodes;
        nodes.forEach(node => {
            let text = node.textContent;
            //如果是元素的话，就去遍历元素,如果是文本节点，并且是{{}}的话，添加订阅器
            if(self.isElementNode(node) ) {
                self.compileNode(node);
            }else if(self.isTextNode(node) && reg.test(text)) {
                console.log(reg.exec(text));
                let exp =  reg.exec(text)[1];//获得属性
                self.compileTextNode(node,exp);
            }
            //如果还有子节点，递归
            if(node.childNodes && node.childNodes.lengths ) {
                self.compileElement(node);
            }
        });
    },
    /**
     * 遍历元素节点，判断属性中v-开头，再是否有v-on开头，如果有：处理事件添加事件监听
     * 如果是v-model的话，初始化数据，包装成 订阅者， 并添加更新事件
     */
    compileNode(node) {
        let attrs = node.attributes;
        [].forEach.call(attrs,(attr) => {
            let attrName = attr.name;
            if(this.isDirective(attrName)) {
                let exp = attr.value;
                if(this.isEventDirective(attrName)) {
                    this.compileEventNode(node, this.vm, exp, attrName);
                }else {
                    this.compileModelNode(node, this.vm, exp, attrName);
                }

            }
        })
    },
    /**
     * 编译文本节点
     */
    compileTextNode: function(node, exp) {
        let self = this;
        //初始化数据
        self.updateNode(node,self.vm[exp]);
        //添加订阅者
        new Watcher(self.vm, exp, (value) => {
            self.updateNode(node,value);
        })
    },

    /**
     * 编译事件节点
     */
    compileEventNode(node,vm,exp,attrName) {
        let type = attrName.split(':')[1];
        let cb = vm.methods && vm.methods[exp];
        if(type && cb) {
            node.addEventListener(type, cb.bind(vm),false) //https://www.cnblogs.com/libin-1/p/6069031.html
        }
    },

    /**
     * 编译v-model节点
     */
    compileModelNode(node, vm, exp, attrName) {
        let self = this;
        let value = self.vm[exp];
        self.updateModelNode(node, value);
        new Watcher(vm, exp, (value) => {
            self.updateModelNode(node,value);
        })
        node.addEventListener('input', (event)=> {
            let target = event.target;
            let newValue = target.value;
            if(value == newValue) {
                return ;
            }
            this.vm[exp] = newValue;
            value = newValue;
        })
    },
    /**
     * 判断节点的类型
     */
    isTextNode:function(node) {
        return node.nodeType == 3; //http://www.w3school.com.cn/jsref/prop_node_nodetype.asp
    },

     /**
     * 元素节点 返回1 
     * 属性节点 返回2
     * 文本节点 返回3
     */
    isElementNode: function (node) {
        return node.nodeType == 1;
    },


    /**
     * 给节点赋值
     */
    updateNode: function(node,value ) {
        node.textContent = value == 'undefined' ? '' : value;
    },

     /**
     * 给v-model节点赋值
     */
    updateModelNode: function(node,value ) {
        node.value = value == 'undefined' ? '' : value;
    },

    /**
     * 判断是不是v-
     */
    isDirective(attrName) {
        return attrName.indexOf('v-') == 0;
    },

    /**
     * 判断是否是事件v-no
     */
    isEventDirective(attrName) {
        console.log( attrName.indexOf('on') > -1);
        return attrName.indexOf('on') > -1;
    }
}