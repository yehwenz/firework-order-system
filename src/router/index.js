import { createRouter, createWebHistory } from 'vue-router'
import CustomerLayout from '@/layouts/CustomerLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    component: CustomerLayout,
    children: [
      { path: '', name: 'ProductList', component: () => import('@/views/customer/ProductList.vue') },
      { path: 'product/:id', name: 'ProductDetail', component: () => import('@/views/customer/ProductDetail.vue') },
      { path: 'cart', name: 'Cart', component: () => import('@/views/customer/Cart.vue') },
      { path: 'checkout', name: 'Checkout', meta: { requiresAuth: true }, component: () => import('@/views/customer/Checkout.vue') },
      { path: 'orders', name: 'Orders', component: () => import('@/views/customer/Orders.vue') },
      { path: 'orders/:id', name: 'OrderDetail', component: () => import('@/views/customer/OrderDetail.vue') },
      { path: 'login', name: 'Login', component: () => import('@/views/customer/Login.vue') },
      { path: 'account', name: 'Account', component: () => import('@/views/customer/Account.vue') }
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', redirect: '/admin/orders' },
      { path: 'orders', name: 'AdminOrders', component: () => import('@/views/admin/AdminOrders.vue') },
      { path: 'products', name: 'AdminProducts', component: () => import('@/views/admin/AdminProducts.vue') },
      { path: 'accounts', name: 'AdminAccounts', component: () => import('@/views/admin/AdminAccounts.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})


// 訪客不可下單：requiresAuth 的頁面一律導向登入頁，並帶上原本要去的路徑
router.beforeEach((to) => {
  if (to.meta?.requiresAuth) {
    const auth = useAuthStore()
    if (!auth.isLoggedIn) {
      return { name: 'Login', query: { redirect: to.fullPath } }
    }
  }
  return true
})
export default router
