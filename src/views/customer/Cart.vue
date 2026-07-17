<template>
  <div>
    <h1 class="font-display text-h4 mb-1" style="color:#3D2B22;">購物車</h1>
    <p class="text-body-2 mb-6" style="color:#8A7361;">確認品項與數量後即可前往結帳</p>

    <div v-if="cart.items.length">
      <v-card v-for="item in cart.items" :key="item.lineId" class="pa-4 mb-3" variant="flat" style="box-shadow:0 2px 10px rgba(61,43,34,0.06);">
        <v-row align="center" no-gutters>
          <v-col cols="3" sm="2">
            <v-img :src="item.image" height="72" width="72" cover rounded="lg" />
          </v-col>
          <v-col cols="9" sm="4" class="pl-3">
            <div class="font-weight-bold" style="color:#3D2B22;">{{ item.name }}</div>
            <div class="text-caption" style="color:#8A7361;">
              ${{ item.price }} / {{ item.unitLabel }}
              <v-chip size="x-small" class="ml-1" :color="item.mode === 'bundle' ? 'secondary' : undefined">
                {{ item.mode === 'bundle' ? '整組' : '單買' }}
              </v-chip>
            </div>
          </v-col>
          <v-col cols="7" sm="4" class="d-flex align-center mt-3 mt-sm-0">
            <v-btn icon="mdi-minus" size="x-small" variant="tonal" color="primary" @click="cart.updateQty(item.lineId, item.qty - 1)" />
            <span class="mx-3 font-weight-bold">{{ item.qty }}</span>
            <v-btn icon="mdi-plus" size="x-small" variant="tonal" color="primary" @click="cart.updateQty(item.lineId, item.qty + 1)" />
          </v-col>
          <v-col cols="3" sm="1" class="text-right mt-3 mt-sm-0">
            <span class="font-weight-bold" style="color:#E8734A;">${{ item.qty * item.price }}</span>
          </v-col>
          <v-col cols="2" sm="1" class="text-right mt-3 mt-sm-0">
            <v-btn icon="mdi-trash-can-outline" size="small" variant="text" color="error" @click="cart.removeItem(item.lineId)" />
          </v-col>
        </v-row>
      </v-card>

      <v-card variant="tonal" color="surface-variant" class="pa-5 mt-6">
        <div class="d-flex justify-space-between text-h6 font-weight-bold" style="color:#3D2B22;">
          <span>合計</span>
          <span style="color:#E8734A;">${{ cart.totalPrice }}</span>
        </div>
        <v-btn block size="large" color="primary" variant="flat" class="mt-4" to="/checkout">
          前往結帳（{{ cart.totalQty }} 件）
        </v-btn>
      </v-card>
    </div>

    <div v-else class="empty-state">
      <v-icon size="56" color="#E4D4BE">mdi-cart-off</v-icon>
      <div class="text-h6 mt-3" style="color:#8A7361;">購物車還是空的</div>
      <div class="text-body-2 mb-4">去逛逛有什麼好玩的煙火吧</div>
      <v-btn color="primary" variant="flat" to="/">瀏覽商品</v-btn>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
const cart = useCartStore()
</script>
