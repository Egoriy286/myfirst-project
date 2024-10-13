import { createRouter, createWebHistory } from 'vue-router'
import HomeView  from '../views/HomeView.vue'
import AboutView  from '../views/AboutView.vue'
import StorageView from '../views/StorageView.vue'
import TestView from '../views/TestView.vue'
import ContactView from '../views/ContactView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/storage',
      name: 'storage',
      component: StorageView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/test',
      name: 'test',
      component: TestView
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView
    }
  ]
})

export default router
