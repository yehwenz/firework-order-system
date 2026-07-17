import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    // items: [{ productId, name, price, unit, image, qty }]
    items: JSON.parse(localStorage.getItem('pom_cart') || '[]')
  }),
  getters: {
    totalQty: (state) => state.items.reduce((sum, i) => sum + i.qty, 0),
    totalPrice: (state) => state.items.reduce((sum, i) => sum + i.qty * i.price, 0)
  },
  actions: {
    persist() {
      localStorage.setItem('pom_cart', JSON.stringify(this.items))
    },
    addItem(product, qty = 1, mode = 'single') {
      const lineId = `${product.id}_${mode}`
      const existing = this.items.find((i) => i.lineId === lineId)
      if (existing) {
        existing.qty += qty
      } else {
        this.items.push({
          lineId,
          productId: product.id,
          name: product.name,
          mode,
          price: mode === 'bundle' ? product.bundle.price : product.price,
          unitLabel: mode === 'bundle' ? product.bundle.label : product.unit,
          image: product.image,
          qty
        })
      }
      this.persist()
    },
    updateQty(lineId, qty) {
      const item = this.items.find((i) => i.lineId === lineId)
      if (!item) return
      if (qty <= 0) {
        this.removeItem(lineId)
        return
      }
      item.qty = qty
      this.persist()
    },
    removeItem(lineId) {
      this.items = this.items.filter((i) => i.lineId !== lineId)
      this.persist()
    },
    clear() {
      this.items = []
      this.persist()
    }
  }
})
