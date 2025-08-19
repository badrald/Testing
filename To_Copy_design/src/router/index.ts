import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'الرئيسية - نظام إدارة المكتبة'
      }
    },
    {
      path: '/books',
      name: 'books',
      component: () => import('../views/BooksView.vue'),
      meta: {
        title: 'الكتب - نظام إدارة المكتبة'
      }
    },
    {
      path: '/members',
      name: 'members',
      component: () => import('../views/MembersView.vue'),
      meta: {
        title: 'الأعضاء - نظام إدارة المكتبة'
      }
    },
    {
      path: '/authors',
      name: 'authors',
      component: () => import('../views/AuthorsView.vue'),
      meta: {
        title: 'المؤلفون - نظام إدارة المكتبة'
      }
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/CategoriesView.vue'),
      meta: {
        title: 'التصنيفات - نظام إدارة المكتبة'
      }
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('../views/TransactionsView.vue'),
      meta: {
        title: 'المعاملات - نظام إدارة المكتبة'
      }
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../views/ReportsView.vue'),
      meta: {
        title: 'التقارير - نظام إدارة المكتبة'
      }
    },
  ],
})

// Update page title on route change
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

export default router