<template>
  <div v-if="product">
    <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-4 px-0" @click="$router.back()">
      返回商品列表
    </v-btn>

    <v-row>
      <v-col cols="12" md="6">
        <v-img :src="product.image" height="360" cover rounded="xl" />
      </v-col>

      <v-col cols="12" md="6">
        <v-chip v-if="product.tag" size="small" color="secondary" class="mb-3 font-weight-bold">{{ product.tag }}</v-chip>
        <div class="text-caption" style="color:#B08B6A;">{{ product.category }}</div>
        <h1 class="font-display text-h4 mt-1" style="color:#3D2B22;">{{ product.name }}</h1>

        <div class="spark-trail my-4"><span /><span /><span /><span /><span /></div>

        <p class="text-body-1" style="color:#5A4A3E; line-height:1.8;">{{ product.desc }}</p>

        <v-card variant="tonal" color="surface-variant" class="pa-4 my-5">
          <div class="d-flex align-center justify-space-between">
            <div>
              <span class="text-h4 font-weight-bold" style="color:#E8734A;">${{ unitPrice }}</span>
              <span class="text-body-2" style="color:#8A7361;"> / {{ mode === 'bundle' ? product.bundle.label : product.unit }}</span>
            </div>
          </div>
        </v-card>

        <div v-if="product.bundle?.enabled" class="mb-4">
          <div class="font-weight-bold mb-2" style="color:#3D2B22;">購買方式</div>
          <v-btn-toggle v-model="mode" mandatory color="primary" rounded="pill">
            <v-btn value="single" variant="tonal">單買（{{ product.unit }}）</v-btn>
            <v-btn value="bundle" variant="tonal">{{ product.bundle.label }}</v-btn>
          </v-btn-toggle>
        </div>

        <div class="d-flex align-center ga-4 mb-6">
          <span class="font-weight-bold" style="color:#3D2B22;">數量</span>
          <v-btn icon="mdi-minus" size="small" variant="tonal" color="primary" @click="qty > 1 && qty--" />
          <span class="text-h6 font-weight-bold" style="min-width:32px; text-align:center;">{{ qty }}</span>
          <v-btn icon="mdi-plus" size="small" variant="tonal" color="primary" @click="qty < 99 && qty++" />
        </div>

        <div class="d-flex flex-column flex-sm-row ga-3">
          <v-btn
            size="large"
            color="primary"
            variant="flat"
            @click="addToCart"
          >
            <v-icon start>mdi-cart-plus</v-icon> 加入購物車
          </v-btn>
          <v-btn
            size="large"
            color="primary"
            variant="outlined"
            @click="buyNow"
          >
            直接前往結帳
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-snackbar v-model="showSnack" color="success" timeout="1800" location="top">
      <v-icon start>mdi-check-circle</v-icon> 已加入購物車
    </v-snackbar>
  </div>

  <div v-else class="empty-state">
    <v-icon size="56" color="#E4D4BE">mdi-help-circle-outline</v-icon>
    <div class="text-h6 mt-3">找不到這項商品</div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

const product = computed(() => productStore.getById(route.params.id))
const qty = ref(1)
const showSnack = ref(false)
const mode = ref('single')
const unitPrice = computed(() =>
  mode.value === 'bundle' ? product.value.bundle.price : product.value.price
)

// 切換單買/整組時數量歸1，避免帶著另一模式的數量搞混
watch(mode, () => { qty.value = 1 })

function requireLogin() {
  if (authStore.isLoggedIn) {
    return true
  }
  router.push('/login')
  return false
}

function addToCart() {
  if (!requireLogin()) return
  cartStore.addItem(product.value, qty.value, mode.value)
  showSnack.value = true
}

function buyNow() {
  if (!requireLogin()) return
  cartStore.addItem(product.value, qty.value, mode.value)
  router.push('/checkout')
}
</script>
