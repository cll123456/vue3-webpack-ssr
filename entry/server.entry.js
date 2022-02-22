
import myCreateApp from './app';
// 服务器端路由与客户端使用不同的历史记录
import { createMemoryHistory } from 'vue-router'
import createRouter from './router.js'
import createStore from './store';
import { renderToString } from '@vue/server-renderer'

export default function (ctx) {
  return new Promise(async (resolve, reject) => {
    const app = myCreateApp();
    const router = createRouter(createMemoryHistory())
    const store = createStore();
    app.use(router);
    app.use(store);

    await router.push(ctx.url);
    await router.isReady();
    // 匹配路由是否存在
    const matchedComponents = router.currentRoute.value.matched.flatMap(record => Object.values(record.components))
    // 不存在路由
    if (!matchedComponents.length) {
      return reject({ code: 404 });
    }
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
  })
}



/**
 * 替换标签
 * @param {*} html 
 * @returns 
 */
function replaceHtmlTag(html) {
  return html.replace(/<script(.*?)>/gi, '&lt;script$1&gt;').replace(/<\/script>/g, '&lt;/script&gt;')
}
