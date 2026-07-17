import { defineStore } from 'pinia'

// 訂單狀態機：待確認 -> 備貨中 -> 可取貨 -> 已完成 （或 -> 已取消）
export const ORDER_STATUS = {
  PENDING: { key: 'PENDING', label: '待確認', color: 'warning', icon: 'mdi-clock-outline' },
  PREPARING: { key: 'PREPARING', label: '備貨中', color: 'info', icon: 'mdi-package-variant' },
  READY: { key: 'READY', label: '可取貨', color: 'secondary', icon: 'mdi-map-marker-check' },
  COMPLETED: { key: 'COMPLETED', label: '已完成', color: 'success', icon: 'mdi-check-decagram' },
  CANCELLED: { key: 'CANCELLED', label: '已取消', color: 'error', icon: 'mdi-close-circle-outline' }
}

const MOCK_ORDERS = [
  {
    id: 'FW20260710001',
    createdAt: '2026-07-10 14:22',
    status: 'READY',
    pickupName: '阿蓬',
    pickupPhone3: '678',
    pickupMethod: '現場取貨',
    items: [
      { name: '金蔥瀑布煙火', unit: '支', qty: 4, price: 350 },
      { name: '仙女棒禮盒（30入）', unit: '盒', qty: 1, price: 180 }
    ]
  },
  {
    id: 'FW20260712002',
    createdAt: '2026-07-12 09:05',
    status: 'PREPARING',
    pickupName: '小美',
    pickupPhone3: '321',
    pickupMethod: '外送',
    items: [{ name: '彩色旋轉煙火', unit: '支', qty: 6, price: 220 }]
  },
  {
    id: 'FW20260715003',
    createdAt: '2026-07-15 20:41',
    status: 'PENDING',
    pickupName: '阿蓬',
    pickupPhone3: '678',
    pickupMethod: '現場取貨',
    items: [{ name: '沖天炮組合包', unit: '組', qty: 2, price: 450 }]
  },
  {
    id: 'FW20260701009',
    createdAt: '2026-07-01 11:00',
    status: 'COMPLETED',
    pickupName: '阿蓬',
    pickupPhone3: '678',
    pickupMethod: '現場取貨',
    items: [{ name: '煙霧彈套組（彩煙）', unit: '組', qty: 3, price: 280 }]
  }
]

export const useOrderStore = defineStore('orders', {
  state: () => ({
    orders: MOCK_ORDERS
  }),
  getters: {
    orderTotal: () => (order) => order.items.reduce((s, i) => s + i.qty * i.price, 0)
  },
  actions: {
    createOrder({ items, pickupName, pickupPhone3, pickupMethod }) {
      const id = 'FW' + Date.now()
      const newOrder = {
        id,
        createdAt: new Date().toLocaleString('zh-TW', { hour12: false }),
        status: 'PENDING',
        pickupName,
        pickupPhone3,
        pickupMethod,
        items
      }
      this.orders.unshift(newOrder)
      return newOrder
    },
    cancelOrder(orderId) {
      const order = this.orders.find((o) => o.id === orderId)
      if (order && ['PENDING', 'PREPARING'].includes(order.status)) {
        order.status = 'CANCELLED'
      }
    },
    setStatus(orderId, statusKey) {
      const order = this.orders.find((o) => o.id === orderId)
      if (order) order.status = statusKey
    },
    getById(orderId) {
      return this.orders.find((o) => o.id === orderId)
    }
  }
})
