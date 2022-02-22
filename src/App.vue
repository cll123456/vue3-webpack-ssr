<script setup>
import { ref } from 'vue'
import Hello from './components/Hello.vue'
import {useRouter} from 'vue-router'
const val = ref(123);
const clickMe = () => {
  alert(val.value);
}
const router = useRouter();

const goToIndex = () => {
  router.push('/')
}

const goToMine = () => {
  router.push('/mine')
}
</script>
<template>
  <div>
    <div>
      <input v-model="val" />
    </div>
    <div>{{ val }}</div>
    <div class="click-container" @click="clickMe">click Me</div>
    <div>
      <Hello></Hello>
    </div>
    <div>使用路由</div>
    <div>
      <router-link to="/">Go to index</router-link>|
      <router-link to="/mine">Go to mine</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
div {
  margin-top: 10px;
  text-align: center;
}

.click-container {
  background-color: #f40;
  width: 100px;
  height: 100px;
  margin: 10px auto;
}
</style>