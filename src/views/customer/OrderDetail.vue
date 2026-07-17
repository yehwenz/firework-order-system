<template>
  <div v-if="order" style="max-width:640px; margin:0 auto;">
    <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-4 px-0" @click="$router.back()">返回訂單列表</v-btn>

    <v-card class="pa-5 mb-5" style="box-shadow:0 2px 10px rgba(61,43,34,0.06);">
      <div class="text-caption" style="color:#B08B6A;">{{ order.id }}</div>
      <div class="text-h6 font-weight-bold" style="color:#3D2B22;">{{ order.createdAt }}</div>

      <!-- 狀態進度條（火花軌跡風格） -->
      <div v-if="order.status !== 'CANCELLED'" class="my-6">
        <div class="d-flex justify-space-between">
          <div v-for="(s, idx) in steps" :key="s.key" class="text-center flex-grow-1">
            <v-avatar :color="idx <= currentStepIndex ? 'primary' : 'surface-variant'" size="34">
              <v-icon size="18" :color="idx <= currentStepIndex ? 'white' : '#B08B6A'">{{ s.icon }}</v-icon>
            </v-avatar>
            <div class="text-caption mt-1" :style="{ color: idx <= currentStepIndex ? '#E8734A' : '#B08B6A' }">
              {{ s.label }}
            </div>
          </div>
        </div>
        <v-progress-linear
          :model-value="progressPercent"
          color="primary"
          bg-color="surface-variant"
          rounded
          height="6"
          class="mt-2"
        />
      </div>
      <v-alert v-else type="error" variant="tonal" class="my-4">此訂單已取消</v-alert>

      <v-divider class="my-4" />

      <div class="text-subtitle-1 font-weight-bold mb-2" style="color:#3D2B22;">品項明細</div>
      <div v-for="item in order.items" :key="item.name" class="d-flex justify-space-between py-1">
        <span style="color:#5A4A3E;">{{ item.name }} × {{ item.qty }}</span>
        <span style="color:#3D2B22;">${{ item.qty * item.price }}</span>
      </div>
      <v-divider class="my-3" />
      <div class="d-flex justify-space-between text-h6 font-weight-bold">
        <span style="color:#3D2B22;">合計</span>
        <span style="color:#E8734A;">${{ orderStore.orderTotal(order) }}</span>
      </div>
    </v-card>

    <v-card class="pa-5" style="box-shadow:0 2px 10px rgba(61,43,34,0.06);">
      <div class="text-subtitle-1 font-weight-bold mb-3" style="color:#3D2B22;">取貨資訊</div>
      <div class="text-body-2" style="color:#5A4A3E;">取貨人：{{ order.pickupName }}</div>
      <div class="text-body-2" style="color:#5A4A3E;">手機末三碼：{{ order.pickupPhone3 }}</div>
      <div class="text-body-2" style="color:#5A4A3E;">取貨方式：{{ order.pickupMethod }}</div>
    </v-card>

    <v-btn
      v-if="['PENDING', 'PREPARING'].includes(order.status)"
      block
      variant="text"
      color="error"
      class="mt-5"
      @click="cancelDialog = true"
    >取消此訂單</v-btn>

    <v-dialog v-model="cancelDialog" max-width="360">
      <v-card class="pa-5" rounded="xl">
        <div class="text-subtitle-1 font-weight-bold mb-2" style="color:#3D2B22;">確定要取消這筆訂單嗎？</div>
        <div class="d-flex ga-3 mt-4">
          <v-btn variant="tonal" style="flex:1" @click="cancelDialog = false">再想想</v-btn>
          <v-btn color="error" variant="flat" style="flex:1" @click="doCancel">確定取消</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>

  <div v-else class="empty-state">
    <v-icon size="56" color="#E4D4BE">mdi-help-circle-outline</v-icon>
    <div class="text-h6 mt-3">找不到這筆訂單</div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useOrderStore, ORDER_STATUS } from '@/stores/orders'

const route = useRoute()
const orderStore = useOrderStore()
const cancelDialog = ref(false)

const order = computed(() => orderStore.getById(route.params.id))

const steps = [
  { key: 'PENDING', label: '待確認', icon: 'mdi-clock-outline' },
  { key: 'PREPARING', label: '備貨中', icon: 'mdi-package-variant' },
  { key: 'READY', label: '可取貨', icon: 'mdi-map-marker-check' },
  { key: 'COMPLETED', label: '已完成', icon: 'mdi-check-decagram' }
]

const currentStepIndex = computed(() => steps.findIndex((s) => s.key === order.value?.status))
const progressPercent = computed(() => ((currentStepIndex.value + 1) / steps.length) * 100)

function doCancel() {
  orderStore.cancelOrder(order.value.id)
  cancelDialog.value = false
}
</script>
