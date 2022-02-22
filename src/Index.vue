<script>
// 声明额外的选项
export default {
   // 对外暴露方法,执行store
   asyncData: (store) => {
      return store.dispatch('asyncSetMsg');
   },
}
</script>
<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
// 获取异步数据
store.dispatch('asyncSetMsg');
// 得到后赋值
const storeMsg = computed(() => store.state.msg);

</script>
<template>
   <div>首页</div>
   <div>store: {{ storeMsg }}</div>
</template>

<style lang='scss' scoped>
</style>