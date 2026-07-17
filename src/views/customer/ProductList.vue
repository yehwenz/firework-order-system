<template>
  <div>
    <!-- Hero -->
    <div class="mb-6">
      <div class="spark-trail"><span /><span /><span /><span /><span /></div>
      <h1 class="font-display text-h4 text-md-h3" style="color:#3D2B22;">點亮這個夏天</h1>
      <p class="text-body-1 mt-1" style="color:#8A7361;">精選煙火商品，團購價直接下單，取貨現場點交</p>
    </div>

    <v-row class="mb-2" align="center">
      <v-col cols="12" md="5">
        <v-text-field
          v-model="store.searchKeyword"
          placeholder="搜尋商品名稱"
          prepend-inner-icon="mdi-magnify"
          hide-details
          clearable
        />
      </v-col>
    </v-row>

    <div class="d-flex flex-wrap ga-2 mb-6">
      <v-chip
        v-for="cat in store.categories"
        :key="cat"
        :color="store.selectedCategory === cat ? 'primary' : undefined"
        :variant="store.selectedCategory === cat ? 'flat' : 'tonal'"
        class="font-weight-bold"
        @click="store.selectedCategory = cat"
      >
        {{ cat }}
      </v-chip>
    </div>

    <v-row v-if="store.filteredProducts.length">
      <v-col v-for="p in store.filteredProducts" :key="p.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="pom-product-card h-100" @click="$router.push(`/product/${p.id}`)">
          <div class="position-relative">
            <v-img :src="p.image" height="160" cover class="rounded-t-xl" />
            <v-chip
              v-if="p.tag"
              size="small"
              :color="p.tag === '補貨中' ? 'error' : 'secondary'"
              class="position-absolute font-weight-bold"
              style="top:10px; left:10px;"
            >{{ p.tag }}</v-chip>
          </div>
          <v-card-text>
            <div class="text-caption" style="color:#B08B6A;">{{ p.category }}</div>
            <div class="text-subtitle-1 font-weight-bold mt-1" style="color:#3D2B22;">{{ p.name }}</div>
            <div class="d-flex align-center justify-space-between mt-3">
              <div>
                <span class="text-h6 font-weight-bold" style="color:#E8734A;">${{ p.price }}</span>
                <span class="text-caption" style="color:#8A7361;"> / {{ p.unit }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <div v-else class="empty-state">
      <v-icon size="56" color="#E4D4BE">mdi-firework-off</v-icon>
      <div class="text-h6 mt-3" style="color:#8A7361;">找不到符合的商品</div>
      <div class="text-body-2">試試看其他關鍵字或切換分類</div>
    </div>
  </div>
</template>

<script setup>
import { useProductStore } from '@/stores/products'
const store = useProductStore()
</script>

<style scoped>
.pom-product-card {
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  box-shadow: 0 2px 10px rgba(61, 43, 34, 0.06);
}
.pom-product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(232, 115, 74, 0.18);
}
</style>
