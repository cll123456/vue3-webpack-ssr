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