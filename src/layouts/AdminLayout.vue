<template>
  <!-- 桌面版導航欄 -->
  <v-navigation-drawer v-if="$vuetify.display.mdAndUp" permanent color="surface" width="240" class="pa-3">
    <div class="d-flex align-center mb-6 mt-2 px-2">
      <div class="burst-badge mr-3" style="width:36px;height:36px;">
        <span style="font-size:18px;">🎆</span>
      </div>
      <div>
        <div class="font-display text-subtitle-1" style="color:#3D2B22;">灣裡彈珠臺煙火</div>
        <div class="text-caption" style="color:#B08B6A;">後臺管理</div>
      </div>
    </div>

    <v-list nav density="comfortable">
      <v-list-item
        to="/admin/orders"
        rounded="xl"
        prepend-icon="mdi-receipt-text-check-outline"
        title="訂單管理"
        class="mb-1"
      />
      <v-list-item
        to="/admin/products"
        rounded="xl"
        prepend-icon="mdi-firework"
        title="商品管理"
        class="mb-1"
      />
      <v-list-item
        to="/admin/accounts"
        rounded="xl"
        prepend-icon="mdi-account-multiple-outline"
        title="帳號管理"
        class="mb-1"
      />
    </v-list>

    <template #append>
      <v-divider class="mb-2" />
      <v-list-item
        rounded="xl"
        prepend-icon="mdi-storefront-outline"
        title="回到顧客前台"
        to="/"
      />
    </template>
  </v-navigation-drawer>

  <!-- 手機版頂部導航 -->
  <v-app-bar v-if="$vuetify.display.smAndDown" color="background" class="px-2" height="64">
    <router-link to="/" class="d-flex align-center text-decoration-none">
      <div class="burst-badge mr-2" style="width:32px;height:32px;">
        <span style="font-size:16px;">🎆</span>
      </div>
      <div>
        <div class="font-display text-subtitle-2" style="color:#3D2B22;">蓬蓬煙火</div>
        <div class="text-caption" style="color:#B08B6A;">後臺管理</div>
      </div>
    </router-link>

    <v-spacer />

    <v-menu>
      <template #activator="{ props }">
        <v-btn v-bind="props" icon="mdi-menu">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </template>
      <v-list density="compact">
        <v-list-item
          to="/admin/orders"
          rounded="xl"
          prepend-icon="mdi-receipt-text-check-outline"
          title="訂單管理"
        />
        <v-list-item
          to="/admin/products"
          rounded="xl"
          prepend-icon="mdi-firework"
          title="商品管理"
        />
        <v-list-item
          to="/admin/accounts"
          rounded="xl"
          prepend-icon="mdi-account-multiple-outline"
          title="帳號管理"
        />
        <v-divider class="my-1" />
        <v-list-item
          rounded="xl"
          prepend-icon="mdi-storefront-outline"
          title="回到顧客前台"
          to="/"
        />
      </v-list>
    </v-menu>
  </v-app-bar>

  <v-main style="background:#FBF3E7; min-height:100vh;">
    <v-container fluid :class="$vuetify.display.mdAndUp ? 'pa-6 pa-md-8' : 'pa-3 pt-4'">
      <router-view />
    </v-container>
  </v-main>
</template>

<script setup>
</script>
