
import myCreateApp from './app';
import { createWebHistory } from 'vue-router'
import createRouter from './router.js'
import createStore from './store';
const router = createRouter(createWebHistory())

const app = myCreateApp();
app.use(router);
const store = createStore();
// 判断window.__INITIAL_STATE__是否存在，存在的替换store的值
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}
app.use(store)

// 在客户端和服务端我们都需要等待路由器先解析异步路由组件以合理地调用组件内的钩子。为此我们会使用 router.isReady 方法
router.isReady().then(() => {
  app.mount('#app')
})


