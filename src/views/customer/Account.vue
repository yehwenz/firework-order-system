<template>
  <div v-if="auth.isLoggedIn" style="max-width:640px; margin:0 auto;">
    <div class="d-flex align-center mb-6">
      <v-avatar size="64" class="mr-4">
        <v-img :src="auth.user.avatar" />
      </v-avatar>
      <div>
        <div class="font-display text-h5" style="color:#3D2B22;">{{ auth.user.displayName }}</div>
        <div class="text-caption" style="color:#8A7361;">已透過 LINE 完成身份驗證</div>
      </div>
    </div>

    <v-card class="pa-5 mb-5" color="primary" variant="flat" style="color:white;">
      <div class="d-flex justify-space-between align-center">
        <div>
          <div class="text-body-2" style="opacity:0.85;">目前點數</div>
          <div class="text-h4 font-weight-bold">{{ auth.points }} 點</div>
        </div>
        <v-icon size="42" style="opacity:0.85;">mdi-star-four-points</v-icon>
      </div>
    </v-card>

    <v-card class="pa-5 mb-5" style="box-shadow:0 2px 10px rgba(61,43,34,0.06);">
      <div class="d-flex justify-space-between align-center mb-4">
        <div class="text-subtitle-1 font-weight-bold" style="color:#3D2B22;">常用取貨人資訊</div>
        <v-btn size="small" variant="tonal" color="primary" prepend-icon="mdi-plus" @click="showAddDialog = true">新增</v-btn>
      </div>

      <v-list v-if="auth.savedPickups.length" density="comfortable">
        <v-list-item
          v-for="p in auth.savedPickups"
          :key="p.id"
          rounded="lg"
          class="mb-1"
          :style="{ background: '#F1E4D0' }"
        >
          <template #prepend>
            <v-icon color="primary">mdi-account-outline</v-icon>
          </template>
          <v-list-item-title class="font-weight-bold" style="color:#3D2B22;">
            {{ p.name }}
            <v-chip v-if="p.isDefault" size="x-small" color="secondary" class="ml-2">預設</v-chip>
          </v-list-item-title>
          <v-list-item-subtitle>手機末三碼 {{ p.phone3 }}</v-list-item-subtitle>
          <template #append>
            <v-btn icon="mdi-trash-can-outline" size="small" variant="text" color="error" @click="auth.removePickup(p.id)" />
          </template>
        </v-list-item>
      </v-list>
      <div v-else class="text-body-2" style="color:#8A7361;">尚未儲存任何取貨人資訊</div>
    </v-card>

    <v-card class="pa-5" style="box-shadow:0 2px 10px rgba(61,43,34,0.06);">
      <div class="text-subtitle-1 font-weight-bold mb-3" style="color:#3D2B22;">帳號設定</div>
      <v-btn variant="tonal" block class="mb-3" @click="auth.logout(); $router.push('/')">登出</v-btn>
      <v-btn variant="text" color="error" block @click="showDeactivateDialog = true">註銷會員</v-btn>
    </v-card>

    <!-- 新增取貨人 -->
    <v-dialog v-model="showAddDialog" max-width="380">
      <v-card class="pa-5" rounded="xl">
        <div class="text-subtitle-1 font-weight-bold mb-4" style="color:#3D2B22;">新增取貨人資訊</div>
        <v-text-field v-model="newPickup.name" label="取貨人暱稱" />
        <v-text-field v-model="newPickup.phone3" label="手機末三碼" maxlength="3" />
        <div class="d-flex ga-3 mt-2">
          <v-btn variant="tonal" style="flex:1" @click="showAddDialog = false">取消</v-btn>
          <v-btn color="primary" variant="flat" style="flex:1" @click="addPickup">儲存</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- 註銷確認 -->
    <v-dialog v-model="showDeactivateDialog" max-width="380">
      <v-card class="pa-5" rounded="xl">
        <v-icon color="error" size="40" class="mb-2">mdi-alert-circle-outline</v-icon>
        <div class="text-subtitle-1 font-weight-bold mb-2" style="color:#3D2B22;">確定要註銷會員嗎？</div>
        <div class="text-body-2 mb-5" style="color:#8A7361;">
          註銷後將清除點數與儲存的取貨人資訊，且無法復原
        </div>
        <div class="d-flex ga-3">
          <v-btn variant="tonal" style="flex:1" @click="showDeactivateDialog = false">再想想</v-btn>
          <v-btn color="error" variant="flat" style="flex:1" @click="deactivate">確定註銷</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>

  <div v-else class="empty-state">
    <v-icon size="56" color="#E4D4BE">mdi-account-lock-outline</v-icon>
    <div class="text-h6 mt-3" style="color:#8A7361;">請先登入會員</div>
    <v-btn color="primary" variant="flat" class="mt-4" to="/login">前往登入</v-btn>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const showAddDialog = ref(false)
const showDeactivateDialog = ref(false)
const newPickup = ref({ name: '', phone3: '' })

function addPickup() {
  if (!newPickup.value.name || !/^\d{3}$/.test(newPickup.value.phone3)) return
  auth.addPickup({ ...newPickup.value })
  newPickup.value = { name: '', phone3: '' }
  showAddDialog.value = false
}

function deactivate() {
  auth.deactivateAccount()
  showDeactivateDialog.value = false
  router.push('/')
}
</script>
