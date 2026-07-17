<template>
  <div style="max-width:640px; margin:0 auto;">
    <h1 class="font-display text-h4 mb-1" style="color:#3D2B22;">結帳資訊</h1>
    <p class="text-body-2 mb-6" style="color:#8A7361;">不需要輸入金流資料，取貨時直接付款即可</p>

    <v-card class="pa-5 mb-5" style="box-shadow:0 2px 10px rgba(61,43,34,0.06);">
      <div class="text-subtitle-1 font-weight-bold mb-3" style="color:#3D2B22;">訂單品項</div>
      <div v-for="item in cart.items" :key="item.productId" class="d-flex justify-space-between py-1">
        <span style="color:#5A4A3E;">{{ item.name }} × {{ item.qty }}</span>
        <span style="color:#3D2B22;">${{ item.qty * item.price }}</span>
      </div>
      <v-divider class="my-3" />
      <div class="d-flex justify-space-between text-h6 font-weight-bold">
        <span style="color:#3D2B22;">合計</span>
        <span style="color:#E8734A;">${{ cart.totalPrice }}</span>
      </div>
    </v-card>

    <v-card class="pa-5" style="box-shadow:0 2px 10px rgba(61,43,34,0.06);">
      <div class="text-subtitle-1 font-weight-bold mb-4" style="color:#3D2B22;">取貨人資訊</div>

      <template v-if="auth.isLoggedIn && auth.savedPickups.length">
        <v-chip
          v-for="sp in auth.savedPickups"
          :key="sp.id"
          class="mr-2 mb-4"
          :color="selectedSavedId === sp.id ? 'primary' : undefined"
          :variant="selectedSavedId === sp.id ? 'flat' : 'tonal'"
          @click="applySaved(sp)"
        >
          {{ sp.name }}（末三碼 {{ sp.phone3 }}）
        </v-chip>
      </template>

      <v-text-field v-model="form.pickupName" label="取貨人暱稱" prepend-inner-icon="mdi-account-outline" />
      <v-text-field
        v-model="form.pickupPhone3"
        label="手機末三碼"
        prepend-inner-icon="mdi-phone-outline"
        maxlength="3"
        :rules="[(v) => /^\d{3}$/.test(v) || '請輸入3碼數字']"
      />

      <div class="text-subtitle-2 font-weight-bold mb-2 mt-2" style="color:#3D2B22;">取貨方式</div>
      <v-btn-toggle v-model="form.pickupMethod" mandatory color="primary" rounded="pill" class="mb-2">
        <v-btn value="現場取貨" variant="tonal">現場取貨</v-btn>
        <v-btn value="外送" variant="tonal">外送</v-btn>
      </v-btn-toggle>

      <v-alert
        v-if="!auth.isLoggedIn"
        type="info"
        variant="tonal"
        class="mt-4"
        density="comfortable"
      >
        登入 LINE 會員可儲存常用取貨人資訊，下次結帳更快速。
      </v-alert>

      <v-btn
        block
        size="large"
        color="primary"
        variant="flat"
        class="mt-6"
        :disabled="!isValid"
        @click="submitOrder"
      >
        送出訂單
      </v-btn>
    </v-card>

    <v-dialog v-model="showSuccess" max-width="420">
      <v-card class="pa-6 text-center" rounded="xl">
        <v-icon size="56" color="success">mdi-check-decagram</v-icon>
        <div class="font-display text-h5 mt-3" style="color:#3D2B22;">訂單已送出！</div>
        <div class="text-body-2 mt-2 mb-5" style="color:#8A7361;">
          小幫手確認後會通知您備貨進度，請留意 LINE 通知
        </div>
        <v-btn block color="primary" variant="flat" @click="goToOrder">查看訂單</v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useOrderStore } from '@/stores/orders'

const router = useRouter()
const cart = useCartStore()
const auth = useAuthStore()
const orderStore = useOrderStore()

const form = ref({ pickupName: '', pickupPhone3: '', pickupMethod: '現場取貨' })
const selectedSavedId = ref(null)
const showSuccess = ref(false)
const lastOrderId = ref(null)

if (auth.isLoggedIn) {
  const def = auth.savedPickups.find((p) => p.isDefault) || auth.savedPickups[0]
  if (def) applySaved(def)
}

function applySaved(sp) {
  selectedSavedId.value = sp.id
  form.value.pickupName = sp.name
  form.value.pickupPhone3 = sp.phone3
}

const isValid = computed(
  () => form.value.pickupName.trim().length > 0 && /^\d{3}$/.test(form.value.pickupPhone3) && cart.items.length > 0
)

function submitOrder() {
  const order = orderStore.createOrder({
    items: cart.items.map((i) => ({ name: i.name, unit: i.unit, qty: i.qty, price: i.price })),
    pickupName: form.value.pickupName,
    pickupPhone3: form.value.pickupPhone3,
    pickupMethod: form.value.pickupMethod
  })
  lastOrderId.value = order.id
  cart.clear()
  showSuccess.value = true
}

function goToOrder() {
  router.push(`/orders/${lastOrderId.value}`)
}
</script>
