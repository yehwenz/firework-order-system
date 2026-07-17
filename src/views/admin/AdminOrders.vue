<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6 flex-column flex-sm-row ga-3">
      <div>
        <h1 class="font-display text-h4" style="color:#3D2B22;">訂單管理</h1>
        <p class="text-body-2" style="color:#8A7361;">確認訂單、更新備貨狀態、推播通知顧客</p>
      </div>
    </div>

    <!-- 狀態篩選 -->
    <div class="d-flex flex-wrap ga-2 mb-4 overflow-x-auto pb-2">
      <v-chip
        v-for="f in statusFilters"
        :key="f.value"
        :color="statusFilter === f.value ? 'primary' : undefined"
        :variant="statusFilter === f.value ? 'flat' : 'tonal'"
        @click="statusFilter = f.value"
      >{{ f.label }}</v-chip>
    </div>

    <!-- 取貨方式篩選 -->
    <div class="d-flex flex-wrap ga-2 mb-6 overflow-x-auto pb-2">
      <v-btn-toggle v-model="methodFilter" color="primary" divided>
        <v-btn value="" variant="tonal">全部取貨方式</v-btn>
        <v-btn value="現場取貨" variant="tonal">現場取貨</v-btn>
        <v-btn value="外送" variant="tonal">外送</v-btn>
      </v-btn-toggle>
    </div>

    <!-- 桌面版表格 -->
    <v-card v-if="$vuetify.display.mdAndUp" style="box-shadow:0 2px 10px rgba(61,43,34,0.06);">
      <v-table>
        <thead>
          <tr>
            <th>訂單編號</th>
            <th>取貨人</th>
            <th>品項</th>
            <th>金額</th>
            <th>取貨方式</th>
            <th>狀態</th>
            <th class="text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td>
              <div class="font-weight-bold" style="color:#3D2B22;">{{ order.id }}</div>
              <div class="text-caption" style="color:#B08B6A;">{{ order.createdAt }}</div>
            </td>
            <td>{{ order.pickupName }}（{{ order.pickupPhone3 }}）</td>
            <td style="max-width:220px;">{{ order.items.map((i) => `${i.name} x${i.qty}`).join('、') }}</td>
            <td class="font-weight-bold" style="color:#E8734A;">${{ orderStore.orderTotal(order) }}</td>
            <td>
              <v-chip size="small" variant="tonal">{{ order.pickupMethod }}</v-chip>
            </td>
            <td>
              <v-chip :color="ORDER_STATUS[order.status].color" variant="flat" size="small" class="font-weight-bold">
                {{ ORDER_STATUS[order.status].label }}
              </v-chip>
            </td>
            <td class="text-right">
              <v-menu v-if="order.status !== 'COMPLETED' && order.status !== 'CANCELLED'">
                <template #activator="{ props }">
                  <v-btn v-bind="props" size="small" variant="tonal" color="primary">
                    更新狀態
                  </v-btn>
                </template>
                <v-list density="compact">
                  <v-list-item
                    v-for="s in availableStatuses"
                    :key="s.key"
                    :title="s.label"
                    @click="updateStatus(order, s.key)"
                  />
                </v-list>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- 手機版卡片 -->
    <div v-else class="d-flex flex-column ga-3">
      <v-card v-for="order in filteredOrders" :key="order.id" class="pa-4" style="box-shadow:0 2px 10px rgba(61,43,34,0.06);">
        <div class="d-flex justify-space-between align-start mb-3">
          <div>
            <div class="font-weight-bold text-h6" style="color:#3D2B22;">{{ order.id }}</div>
            <div class="text-caption" style="color:#B08B6A;">{{ order.createdAt }}</div>
          </div>
          <v-chip :color="ORDER_STATUS[order.status].color" variant="flat" size="small" class="font-weight-bold">
            {{ ORDER_STATUS[order.status].label }}
          </v-chip>
        </div>

        <v-divider class="my-3" />

        <div class="mb-3">
          <div class="text-caption font-weight-bold" style="color:#8A7361;">取貨人</div>
          <div style="color:#3D2B22;">{{ order.pickupName }}（{{ order.pickupPhone3 }}）</div>
        </div>

        <div class="mb-3">
          <div class="text-caption font-weight-bold" style="color:#8A7361;">取貨方式</div>
          <v-chip size="small" variant="tonal">{{ order.pickupMethod }}</v-chip>
        </div>

        <div class="mb-3">
          <div class="text-caption font-weight-bold mb-2" style="color:#8A7361;">品項</div>
          <div class="pl-2">
            <div v-for="item in order.items" :key="item.name" class="text-body-2" style="color:#5A4A3E;">
              {{ item.name }} × {{ item.qty }} 件
            </div>
          </div>
        </div>

        <div class="mb-4">
          <div class="text-subtitle-2 font-weight-bold" style="color:#E8734A;">
            小計：${{ orderStore.orderTotal(order) }}
          </div>
        </div>

        <v-menu v-if="order.status !== 'COMPLETED' && order.status !== 'CANCELLED'">
          <template #activator="{ props }">
            <v-btn v-bind="props" size="small" variant="flat" color="primary" block>
              更新狀態
            </v-btn>
          </template>
          <v-list density="compact">
            <v-list-item
              v-for="s in availableStatuses"
              :key="s.key"
              :title="s.label"
              @click="updateStatus(order, s.key)"
            />
          </v-list>
        </v-menu>
      </v-card>
    </div>

    <v-snackbar v-model="showPush" color="success" location="top" timeout="2000">
      <v-icon start>mdi-bell-ring-outline</v-icon> 已透過 LINE 推播通知顧客訂單狀態更新
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOrderStore, ORDER_STATUS } from '@/stores/orders'

const orderStore = useOrderStore()
const statusFilter = ref('ALL')
const methodFilter = ref('')
const showPush = ref(false)

const statusFilters = [
  { label: '全部', value: 'ALL' },
  { label: '待確認', value: 'PENDING' },
  { label: '備貨中', value: 'PREPARING' },
  { label: '可取貨', value: 'READY' },
  { label: '已完成', value: 'COMPLETED' },
  { label: '已取消', value: 'CANCELLED' }
]

// 只允許轉換到 READY 和 CANCELLED，不允許轉到 COMPLETED
const availableStatuses = computed(() => [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.READY,
  ORDER_STATUS.CANCELLED
].filter(s => s.key !== 'COMPLETED'))

const filteredOrders = computed(() => {
  let result = orderStore.orders

  // 按狀態篩選
  if (statusFilter.value !== 'ALL') {
    result = result.filter((o) => o.status === statusFilter.value)
  }

  // 按取貨方式篩選
  if (methodFilter.value) {
    result = result.filter((o) => o.pickupMethod === methodFilter.value)
  }

  return result
})

function updateStatus(order, statusKey) {
  orderStore.setStatus(order.id, statusKey)
  showPush.value = true
}
</script>
