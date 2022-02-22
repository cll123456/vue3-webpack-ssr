import { createRouter } from 'vue-router'


const routes = [
  { path: '/', component: ()=> import('./../src/Index.vue') },
  { path: '/mine', component: ()=> import('./../src/Mine.vue') },
]

export default function (history) {
  return createRouter({
    history,
    routes
  }) 
}