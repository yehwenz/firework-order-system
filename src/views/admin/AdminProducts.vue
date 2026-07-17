<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="font-display text-h4" style="color:#3D2B22;">商品管理</h1>
        <p class="text-body-2" style="color:#8A7361;">管理商品上下架、價格與庫存</p>
      </div>
      <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" @click="openCreate">新增商品</v-btn>
    </div>

    <v-card style="box-shadow:0 2px 10px rgba(61,43,34,0.06);">
      <v-table>
        <thead>
          <tr>
            <th></th>
            <th>商品名稱</th>
            <th>分類</th>
            <th>價格</th>
            <th>標籤</th>
            <th class="text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in store.products" :key="p.id">
            <td class="py-2"><v-img :src="p.image" width="48" height="48" cover rounded="lg" /></td>
            <td class="font-weight-bold" style="color:#3D2B22;">{{ p.name }}</td>
            <td>{{ p.category }}</td>
            <td style="color:#E8734A;">${{ p.price }} / {{ p.unit }}</td>
            <td><v-chip v-if="p.tag" size="small" color="secondary">{{ p.tag }}</v-chip></td>
            <td class="text-right">
              <v-btn icon="mdi-pencil-outline" size="small" variant="text" color="primary" @click="openEdit(p)" />
              <v-btn icon="mdi-trash-can-outline" size="small" variant="text" color="error" @click="remove(p)" />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="480">
      <v-card class="pa-5" rounded="xl">
        <div class="text-subtitle-1 font-weight-bold mb-4" style="color:#3D2B22;">
          {{ editing ? '編輯商品' : '新增商品' }}
        </div>
        <v-text-field v-model="form.name" label="商品名稱" class="mb-1" />
        <v-text-field v-model="form.category" label="分類" class="mb-1" />
        <v-row>
          <v-col cols="6"><v-text-field v-model.number="form.price" label="價格" type="number" /></v-col>
          <v-col cols="6"><v-text-field v-model="form.unit" label="單位（如：支/組）" /></v-col>
        </v-row>
        <v-row>
          <v-col cols="6"><v-text-field v-model="form.tag" label="標籤（選填）" /></v-col>
        </v-row>
        <v-switch v-model="form.bundle.enabled" color="primary" label="開放整組購買" class="mt-1" />
        <div v-if="form.bundle.enabled" class="d-flex ga-3">
          <v-text-field v-model.number="form.bundle.qty" label="一組幾支" type="number" style="flex:1" />
          <v-text-field v-model.number="form.bundle.price" label="整組售價" type="number" style="flex:1" />
        </div>
        <v-text-field v-if="form.bundle.enabled" v-model="form.bundle.label" label="整組顯示文字（如：整組10支）" />
        <v-textarea v-model="form.desc" label="商品描述" rows="3" variant="flat"/>
        <v-text-field v-model="form.image" label="圖片網址" />

        <div class="d-flex ga-3 mt-2">
          <v-btn variant="tonal" style="flex:1" @click="dialog = false">取消</v-btn>
          <v-btn color="primary" variant="flat" style="flex:1" @click="save">儲存</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProductStore } from '@/stores/products'

const store = useProductStore()
const dialog = ref(false)
const editing = ref(null)
const form = ref(emptyForm())

function emptyForm() {
  return {
    name: '', category: '', price: 0, unit: '支', tag: '', desc: '', image: '',
    bundle: { enabled: false, qty: 1, price: 0, label: '' }
  }
}

function openCreate() {
  editing.value = null
  form.value = emptyForm()
  dialog.value = true
}

function openEdit(p) {
  editing.value = p
  form.value = { ...p }
  dialog.value = true
}

function save() {
  if (editing.value) {
    Object.assign(editing.value, form.value)
  } else {
    store.products.push({ ...form.value, id: 'p' + Date.now() })
  }
  dialog.value = false
}

function remove(p) {
  store.products = store.products.filter((x) => x.id !== p.id)
}
</script>
