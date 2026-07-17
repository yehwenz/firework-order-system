<template>
  <div class="d-flex flex-column align-center justify-center" style="min-height:60vh;">
    <div class="burst-badge mb-6" style="width:88px;height:88px;">
      <span style="font-size:44px;">🎆</span>
    </div>
    <h1 class="font-display text-h4 mb-2" style="color:#3D2B22;">歡迎回來</h1>
    <p class="text-body-2 mb-8 text-center" style="color:#8A7361; max-width:320px;">
      使用 LINE 帳號登入，即可儲存取貨人資訊、查看點數與訂單通知
    </p>

    <v-btn
      size="x-large"
      color="#06C755"
      variant="flat"
      class="text-white"
      style="width:280px;"
      :loading="loading"
      @click="handleLogin"
    >
      <v-icon start>mdi-line</v-icon> 使用 LINE 登入
    </v-btn>

    <v-btn variant="text" class="mt-4" color="primary" to="/">先逛逛就好</v-btn>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)

function handleLogin() {
  loading.value = true
  // 實際串接時導向 LINE OAuth，取得授權碼後交由 C# 後端換發使用者資料 / JWT
  setTimeout(() => {
    auth.loginWithLine()
    loading.value = false
    router.push('/account')
  }, 800)
}
</script>
