import { createSSRApp } from 'vue';
import App from './../src/App.vue';


export default function(){
  return createSSRApp(App);
}