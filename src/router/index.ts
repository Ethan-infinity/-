import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/vectors',
      name: 'vectors',
      component: () => import('../views/VectorsView.vue'),
    },
    {
      path: '/matrices',
      name: 'matrices',
      component: () => import('../views/MatricesView.vue'),
    },
    {
      path: '/determinants',
      name: 'determinants',
      component: () => import('../views/DeterminantsView.vue'),
    },
    {
      path: '/systems',
      name: 'systems',
      component: () => import('../views/SystemsView.vue'),
    },
    {
      path: '/eigen',
      name: 'eigen',
      component: () => import('../views/EigenView.vue'),
    },
    {
      path: '/quadratic',
      name: 'quadratic',
      component: () => import('../views/QuadraticView.vue'),
    },
    {
      path: '/relations',
      name: 'relations',
      component: () => import('../views/RelationsView.vue'),
    },
  ],
})

export default router
