<template>
  <v-app-bar color="background" class="px-2 px-md-8" height="72">
    <router-link to="/" class="d-flex align-center text-decoration-none">
      <div class="burst-badge mr-3" style="width:40px;height:40px;">
        <span style="font-size:20px;">🎆</span>
      </div>
      <div>
        <div class="font-display text-h6" style="color:#3D2B22; line-height:1.1;">灣裡彈珠臺煙火下單平台</div>
        <div class="text-caption" style="color:#B08B6A;">Fireworks Order Platform</div>
      </div>
    </router-link>

    <v-spacer />

    <v-btn
      v-if="$vuetify.display.mdAndUp"
      variant="text"
      to="/"
      class="mr-1"
      :class="{ 'text-primary': isActive('ProductList') }"
    >商品</v-btn>
    <v-btn
      v-if="$vuetify.display.mdAndUp"
      variant="text"
      to="/orders"
      class="mr-1"
      :class="{ 'text-primary': isActive('Orders') }"
    >我的訂單</v-btn>

    <v-btn icon variant="text" to="/cart" class="mr-1">
      <v-badge :content="cart.totalQty" :model-value="cart.totalQty > 0" color="secondary" offset-x="2" offset-y="2">
        <v-icon>mdi-shopping-outline</v-icon>
      </v-badge>
    </v-btn>

    <v-btn v-if="!auth.isLoggedIn" rounded="pill" color="primary" variant="flat" to="/login" class="ml-1">
      <v-icon start size="18">mdi-line</v-icon> 登入
    </v-btn>
    <router-link v-else to="/account" class="ml-1">
      <v-avatar size="36">
        <v-img :src="auth.user.avatar" />
      </v-avatar>
    </router-link>
  </v-app-bar>

  <v-main style="background:#FBF3E7; min-height:100vh;">
    <v-container class="pb-16 pb-md-8" :class="$vuetify.display.mdAndUp ? 'pa-8' : 'pa-3'">
      <router-view />
    </v-container>
  </v-main>

  <!-- 手機版底部導航 -->
  <v-bottom-navigation
    v-if="$vuetify.display.smAndDown"
    v-model="bottomNav"
    grow
    color="primary"
    bg-color="surface"
    elevation="8"
    height="64"
  >
    <v-btn value="products" @click="$router.push('/')">
      <v-icon>mdi-firework</v-icon>
      商品
    </v-btn>
    <v-btn value="cart" @click="$router.push('/cart')">
      <v-badge :content="cart.totalQty" :model-value="cart.totalQty > 0" color="secondary">
        <v-icon>mdi-shopping-outline</v-icon>
      </v-badge>
      購物車
    </v-btn>
    <v-btn value="orders" @click="$router.push('/orders')">
      <v-icon>mdi-receipt-text-outline</v-icon>
      訂單
    </v-btn>
    <v-btn value="account" @click="auth.isLoggedIn ? $router.push('/account') : $router.push('/login')">
      <v-icon>mdi-account-circle-outline</v-icon>
      我的
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const cart = useCartStore()
const auth = useAuthStore()
const bottomNav = ref(null)

// 根據當前路由動態更新底部導航選中項
watch(
  () => route.name,
  (name) => {
    if (name === 'ProductList' || name === 'ProductDetail') bottomNav.value = 'products'
    else if (name === 'Cart' || name === 'Checkout') bottomNav.value = 'cart'
    else if (name === 'Orders' || name === 'OrderDetail') bottomNav.value = 'orders'
    else if (name === 'Account' || name === 'Login') bottomNav.value = 'account'
  },
  { immediate: true }
)

function isActive(name) {
  return route.name === name
}
</script>
