# 引言
> 2022年都过去两月了，是时候开始学起来了。从哪里开始呢？那就从未来的趋势 ssr来动手吧，现在vue3也出来这么久了，ssr怎么搭建呢？那咋就一起来康康吧🎉。
项目源码：https://github.com/cll123456/vue3-webpack-ssr
项目演示地址：http://chenliangliang.top:9022/ （这个地址不能保证长期有效，但是上面的源码地址一般不会删除，有兴趣的可以直接clone源码跑起来）;

# 正文
## 流程
ssr的流程，有一张经典的图，如下：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/998147aceae14fc5a0a3c6e34538b20e~tplv-k3u1fbpfcp-watermark.image?)

从上面的这张图咋们可以得出以下结论：

- 图中包含source(资源)，webpack, 服务端,这里是说资源通过webpack打包放到服务端；
- 在资源这里咋们可以看到store, router,components 等都会通过咋们的app.js(main.js)来分为两个入口，一个是服务端入口，另一个是客户端入口来通过webpack进行打包；
- 在服务端中先拿到给服务端打包的静态资源，然后通过一个render方法生成静态的html,此时咋们的页面结构就生成了，然后会发现有了结构里面所有vue的功能都用不了了，所以最后需要通过客户端来进行激活。
- 最后就ok了 🎉🎉🎉

## 依赖安装
> 咋们来分析下，需要实现上面的功能，咋们需要安装哪些包？

服务端： `express` (koa，egg，等搭建服务的都行)、`nodemon`(监听服务启动)

客户端： `vue`、`vue-router`、`vuex`、`sass`、`@vue/server-renderer`(把服务端的bundle转成html)

构建包的工具：`webpack`、`webpack-cli`、`webpack-dev-server`(可选)、`webpack-merge`(合并webpack的配置项)

loader:`babel-loader`、`@babel/core`、`@babel/preset-env`、`vue-loader``css-loader`、`vue-style-loader`、`sass-loader`

plugins:`@vue/compiler-sfc`、`html-webpack-plugin`

> 暂时咋们就先用这些基本的，把项目的结构先搭建起来，等一下遇到问题按需安装对应的依赖

## 建立项目结构
```
vue3-webpack-ssr
├─ entry
│  ├─ app.js
│  ├─ client.entry.js
│  ├─ router.js
│  ├─ server.entry.js
│  └─ store.js
├─ package.json
├─ public
│  ├─ favicon.ico
│  └─ index.html
├─ server
│  └─ index.js
├─ src
│  ├─ App.vue
│  ├─ components
│  │  └─ Hello.vue
│  ├─ Index.vue
│  └─ Mine.vue
└─ webpack
   ├─ base.config.js
   ├─ client.dev.config.js
   ├─ client.pro.config.js
   └─ server.config.js

```

咋们先把src里面的东西先写好吧,src里面的东西都是非常基本的,**可以自己来随便写哦**，详情查看gitup里面的内容: https://github.com/cll123456/vue3-webpack-ssr/tree/master/src
## 开发入口文件
> 入口分为客户端和服务端的两个入口

- 在上图中咋们得知，两个入口都用到了`app.js`， 那么咋们就先来做这个.
```js
import { createSSRApp } from 'vue';
import App from './../src/App.vue';

// 对外导出一个函数，使用vue3的createSSRApp这个函数，详情请查看文档 https://v3.cn.vuejs.org/guide/ssr/hydration.html#%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%BF%80%E6%B4%BB-hydration
export default function(){
  return createSSRApp(App);
}
```

- 然后咋们先写客户端的,新建`client.entry.js`:

```javascript

import myCreateApp from './app';
const app = myCreateApp();
// 挂载节点
app.mount('#app')
```

- 最后是服务端的代码，`server.entry.js`
```javascript
import myCreateApp from './app';
import { renderToString } from '@vue/server-renderer'
export default function (ctx) {
  return new Promise(async (resolve, reject) => {
    const app = myCreateApp();
    // 把app变成html的代码给服务端调用
    let html = await renderToString(app);
    resolve(html)
  });
```

## `webpack`的配置项

>既然有两个入口，那肯定是webpack需要打包多端，个人的喜好是分开来进行打包，这样更不会那么混乱，想要合并到一个文件夹的也行，就行区分环境即可。

- 项目新建 `webpack文件夹`；

- 在里面新增 `base.config.js` 这里面放的是服务端和客户端共有的配置，如下

```javascript
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
module.exports = {
  // 输出
  output: {
    path: path.resolve(__dirname, './../dist'), 
    filename: '[name].bundle.js',
  },
  //  loader
  module: {
    rules: [
    // 匹配 .vue文件用vue-loader
      { test: /\.vue$/, use: 'vue-loader' },
      // 解析css,这个loader是从后往前执行，就是说 先执行  css-loader,然后在执行 vue-style-loader
      {
        test: /\.css$/, use: [
           'vue-style-loader',
          'css-loader'
        ]
      },
      // 解析sass
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
           "vue-style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      // 对js使用loader来进行转换，配置对应的预设和排除一些不需要转换的文件
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          },
         
        },
        exclude: /node_modules/
      }
    ],
  },
  plugins: [
  // 不管服务端，还是客户端都需要打包vue的结构
    new VueLoaderPlugin(),
  ]
}
```

公共的配置写好后，咋们来写客户端的配置，建立文件 `client.pro.config.js`
内容如下：
```javascript
const { default: merge } = require('webpack-merge');
const base =  require('./base.config.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 合并默认的配置
module.exports = merge(base, {
  mode: "production",
  // devtool: 'source-map',
  entry: {
     'client' : path.resolve(__dirname, '../entry/client.entry.js')
  },
  output:{
  // 清除元宵打包的结果
    clean: true,
    // 客户端的文件名命
    filename: '[name].client.bundle.js',
  },
  plugins: [
  // 使用html作为挂载的模板模板
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve('public/index.html')
    })
  ]
  
})
```
最后还差服务端，那咋们就来写，新建： `server.congif.js`
```javascript
const { default: merge } = require('webpack-merge');
const base = require('./base.config.js');
const path = require('path');
const nodeExternals = require("webpack-node-externals");
module.exports = merge(base, {
// 模式是生产模式，
  mode: "production",
  entry: {
    'server': path.resolve(__dirname, '../entry/server.entry.js')
  },
 
  output: {
    filename: '[name].server.bundle.js',
    // node的代码环境是commonjs哦
    library: {
      type: 'commonjs2'
    }
  },
  // 需要忽略css哦
  externals: nodeExternals({
    allowlist: [/\.css$/],
  }),
  // 打包的环境是node
  target: 'node',
})
```

## 开发服务端
> 客户端好了，接下来就是服务端了，咋们启动一个服务，来调用我们对应的结果。

在server目录中新建`index.js`
```javascript
const express = require('express')
const server = express();
const path = require('path');
// 获取服务端打包的结果，一个获取html的函数
const createApp = require(path.join(__dirname, './../dist/server.server.bundle.js')).default;

const fs = require('fs');

// 搭建静态资源目录
server.use(
  '/',
  express.static(path.join(__dirname, '../dist'), { index: false })
);
// 获取模板
const indexTemplate = fs.readFileSync(
  path.join(__dirname, './../dist/index.html'),
  'utf-8'
);
// 匹配所有的路径，搭建服务
server.get('*', async (req, res) => {

  try {
    const appContent = await createApp(req);

    const html = indexTemplate
      .toString()
      .replace('<div id="app">', `<div id="app">${appContent}`)

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.log(error);
    if (error.code == 404) {
      res.status(404).send('页面去火星了，找不到了，404啦');
      return;
    }
    res.status(500).send('服务器错误');
  }

})

server.listen(9022, () => console.log('the server is running 9022'));
```

> 此时咋们就可以进行客户端打包和服务端打包，并且可以在服务端看到对应的效果了。



![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/374b24094b7e460b97988c4efda4d6fd~tplv-k3u1fbpfcp-watermark.image?)

> 看到这里有人就要说了，你页面怎么是带有颜色的，并且v-moel和事件也有了。我这里为了方便演示是进行了的。或者是说为了方便后面的同学在学习的时候有成就感，不会知道那么难，敢下手。😁😁😁

### 激活流程

1. 我们仔细看配置，在打包服务端的时候咋们是不是会把客户端的`js`自动注入到`dist/index.html`中，并且在创建应用的时候咋们就告诉vue了（使用createSSRApp）
2. 在服务端只是构建了一个静态的html结构给服务端让服务端去拼接的同时，咋们也使用了`dist/index.html`作为模板来拼接其他的`html`.
3. 当咋们访问服务端的服务的时候，咋们还搭建了一个`静态服务`来提供其他资源的访问
4. 当这些步骤下来，客户端就会使用`服务端的html`的结构并且去**激活**它，拥有vue的特性。


> 走到这里一个基本的ssr就完成了，接下来是加入vue-router了。

## 加入`vue-router`
> 加入路由的第一步是先随便加入些页面，使用路由来进行控制，然后咋们在来做下一步。

- 在enter中加入 `router.js`,并且导出一个路由函数：
```javascript
import { createRouter } from 'vue-router'
const routes = [
  { path: '/', component: ()=> import('./../src/Index.vue') },
  { path: '/mine', component: ()=> import('./../src/Mine.vue') },
]
// 传入不同的模式来进行配置
export default function (history) {
  return createRouter({
    history,
    routes
  }) 
}
```

- 在客户端加入路由的配置，在 `client.entry.js` 新增如下：
```javascript
import createRouter from './router.js'
import { createWebHistory } from 'vue-router'
const router = createRouter(createWebHistory())
app.use(router);
// 原来的配置...

// 在客户端和服务端我们都需要等待路由器先解析异步路由组件以合理地调用组件内的钩子。为此我们会使用 router.isReady 方法
router.isReady().then(() => {
  app.mount('#app')
})
```

- 客户端变了，咋们的服务端的入口也需要做出改变，在`server.enter.js`新增如下：
```javascript
import { createMemoryHistory } from 'vue-router'
import createRouter from './router.js'
// ...原来的promise内
 const router = createRouter(createMemoryHistory())
 app.use(router);
 await router.push(ctx.url);
 await router.isReady();
    // 匹配路由是否存在
 const matchedComponents = router.currentRoute.value.matched.flatMap(record => Object.values(record.components))
    // 不存在路由
    if (!matchedComponents.length) {
      return reject({ code: 404 });
    }
// ... 其他的配置
```

> 注意✨✨✨！
>这里客户端和服务端的是哟个的路由模式是不一样的，为啥呢？
>`因为hash模式的路由提交不到服务器上`，并且服务端也可以有自己的路由，和客户端是不一样的哦 

接下来就是欢快的打包环节了。
结果就报错了……😂😂😂


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b35e9ffa5f1d40f7b5bccd1ce3ebcb23~tplv-k3u1fbpfcp-watermark.image?)

> 这个问题是老生常谈的babel的转换问题，就是我们使用了`awync,  await`.那咋们给转转去

加入依赖：`@babel/plugin-transform-runtime` 、 `@babel/runtime-corejs3` 然后修改webpack中服务端的配置，在`server.config.js` 新增如下：
```javascript
// ...原来的配置
module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [["@babel/plugin-transform-runtime", {
              "corejs": 3
            }]]
          },

        },
        exclude: /node_modules/
      }
    ]
  },
```

然后`vue-router`就可以使用啦!


![ssr-vue-router.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef9060710e234a668beab22873ed5bf9~tplv-k3u1fbpfcp-watermark.image?)

## 加入`vuex`
> 加入vuex还是一样的，建立store,修改客户端入口文件和服务端入口文件。

在`enter`文件夹中加入`store.js`;
```javascript
import { createStore as _createStore } from 'vuex';

// 对外导出一个仓库
export default function createStore() {
  return _createStore({
    state: {
      // 状态数据
      msg: ''
    },
    mutations: {
      // 同步数据
      SET_MSG(state, mgs){
        state.msg = mgs;
      }
    },
    actions: {
      // 异步数据
      asyncSetMsg({commit}){
        return new Promise((resolve) => {
          setTimeout(() => {
            commit('SET_MSG', '我是store中的msg');
            resolve();
          }, 300)
        })
      },
    },
    modules: {}
  });
}
```

- 修改客户端入口, 在 `client.entry.js`新增：
```javascript
const store = createStore();
// 判断window.__INITIAL_STATE__是否存在，存在的替换store的值
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}
app.use(store)
```

- 修改服务端入口，在`server.entry.js`新增：
```javasccript
 // 处理store
    Promise.all(matchedComponents.map(component => {
      if (component.asyncData) {
        return component.asyncData(store)
      }
    })).then(async (res) => {
      let html = await renderToString(app);

      html += `<script>window.__INITIAL_STATE__ = ${replaceHtmlTag(JSON.stringify(store.state))}</script>`

      resolve(html);
    }).catch(() => {
      reject(html)
    })
```

> 上面的asyncData是怎么做的呢？在setup外部直接定义哦！


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d12968cb464403795901578b9a44994~tplv-k3u1fbpfcp-watermark.image?)


那咱们就可以欢快的打包，到最后时刻了！

# 结果

![ssr-vuex.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e1b948ba8dd436690b2ae51acba28aa~tplv-k3u1fbpfcp-watermark.image?)

这里判断store有没有服务端渲染的条件是 刷新页面，store里面的值是一起出来的哦！

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e5f0e7e8bf04f509ccfb0858c1376ca~tplv-k3u1fbpfcp-watermark.image?)

