<template>
  <div>
    <h1 class="font-display text-h4 mb-1" style="color:#3D2B22;">我的訂單</h1>
    <p class="text-body-2 mb-6" style="color:#8A7361;">查看訂單狀態、取消未備貨的訂單</p>

    <div class="d-flex flex-wrap ga-2 mb-6">
      <v-chip
        v-for="f in filters"
        :key="f.value"
        :color="filter === f.value ? 'primary' : undefined"
        :variant="filter === f.value ? 'flat' : 'tonal'"
        @click="filter = f.value"
      >{{ f.label }}</v-chip>
    </div>

    <div v-if="filteredOrders.length">
      <v-card
        v-for="order in filteredOrders"
        :key="order.id"
        class="pa-4 mb-3"
        style="box-shadow:0 2px 10px rgba(61,43,34,0.06); cursor:pointer;"
        @click="$router.push(`/orders/${order.id}`)"
      >
        <div class="d-flex justify-space-between align-start">
          <div>
            <div class="text-caption" style="color:#B08B6A;">{{ order.id }}｜{{ order.createdAt }}</div>
            <div class="font-weight-bold mt-1" style="color:#3D2B22;">
              {{ order.items.map((i) => i.name).join('、') }}
            </div>
            <div class="text-caption mt-1" style="color:#8A7361;">
              取貨人 {{ order.pickupName }}（末三碼 {{ order.pickupPhone3 }}）｜{{ order.pickupMethod }}
            </div>
          </div>
          <v-chip :color="ORDER_STATUS[order.status].color" variant="flat" size="small" class="font-weight-bold">
            <v-icon start size="16">{{ ORDER_STATUS[order.status].icon }}</v-icon>
            {{ ORDER_STATUS[order.status].label }}
          </v-chip>
        </div>

        <v-divider class="my-3" />

        <div class="d-flex justify-space-between align-center">
          <span class="font-weight-bold" style="color:#E8734A;">${{ orderStore.orderTotal(order) }}</span>
          <v-btn
            v-if="['PENDING', 'PREPARING'].includes(order.status)"
            size="small"
            variant="text"
            color="error"
            @click.stop="confirmCancel(order.id)"
          >取消訂單</v-btn>
        </div>
      </v-card>
    </div>

    <div v-else class="empty-state">
      <v-icon size="56" color="#E4D4BE">mdi-receipt-text-remove-outline</v-icon>
      <div class="text-h6 mt-3" style="color:#8A7361;">目前沒有這個狀態的訂單</div>
    </div>

    <v-dialog v-model="cancelDialog" max-width="360">
      <v-card class="pa-5" rounded="xl">
        <div class="text-subtitle-1 font-weight-bold mb-2" style="color:#3D2B22;">確定要取消這筆訂單嗎？</div>
        <div class="text-body-2 mb-5" style="color:#8A7361;">取消後無法復原，需要的話請重新下單</div>
        <div class="d-flex ga-3">
          <v-btn variant="tonal" style="flex:1" @click="cancelDialog = false">再想想</v-btn>
          <v-btn color="error" variant="flat" style="flex:1" @click="doCancel">確定取消</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOrderStore, ORDER_STATUS } from '@/stores/orders'

const orderStore = useOrderStore()
const filter = ref('ALL')
const cancelDialog = ref(false)
const targetOrderId = ref(null)

const filters = [
  { label: '全部', value: 'ALL' },
  { label: '待確認', value: 'PENDING' },
  { label: '備貨中', value: 'PREPARING' },
  { label: '可取貨', value: 'READY' },
  { label: '已完成', value: 'COMPLETED' },
  { label: '已取消', value: 'CANCELLED' }
]

const filteredOrders = computed(() => {
  if (filter.value === 'ALL') return orderStore.orders
  return orderStore.orders.filter((o) => o.status === filter.value)
})

function confirmCancel(id) {
  targetOrderId.value = id
  cancelDialog.value = true
}
function doCancel() {
  orderStore.cancelOrder(targetOrderId.value)
  cancelDialog.value = false
}
</script>
