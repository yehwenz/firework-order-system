<template>
  <div>
    <h1 class="font-display text-h4 mb-1" style="color:#3D2B22;">帳號管理</h1>
    <p class="text-body-2 mb-6" style="color:#8A7361;">
      顧客帳號皆透過 LINE 驗證綁定，可直接推播訂單狀態通知
    </p>

    <v-card style="box-shadow:0 2px 10px rgba(61,43,34,0.06);">
      <v-table>
        <thead>
          <tr>
            <th></th>
            <th>顯示名稱</th>
            <th>LINE ID</th>
            <th>點數</th>
            <th>常用取貨人</th>
            <th class="text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in mockMembers" :key="m.lineId">
            <td class="py-2"><v-avatar size="36"><v-img :src="m.avatar" /></v-avatar></td>
            <td class="font-weight-bold" style="color:#3D2B22;">{{ m.displayName }}</td>
            <td class="text-caption" style="color:#8A7361;">{{ m.lineId }}</td>
            <td>{{ m.points }} 點</td>
            <td>{{ m.pickup }}</td>
            <td class="text-right">
              <v-btn size="small" variant="tonal" color="primary" prepend-icon="mdi-bell-outline" @click="pushMsg(m)">
                推播通知
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-snackbar v-model="showPush" color="success" location="top" timeout="2000">
      <v-icon start>mdi-check</v-icon> 已發送 LINE 推播訊息給 {{ pushedName }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mockMembers = [
  { lineId: 'U_mock_88291', displayName: '蓬蓬煙火愛好者', avatar: 'https://i.pravatar.cc/150?img=15', points: 120, pickup: '阿蓬（678）' },
  { lineId: 'U_mock_10233', displayName: '小美', avatar: 'https://i.pravatar.cc/150?img=32', points: 40, pickup: '小美（321）' },
  { lineId: 'U_mock_50210', displayName: '晚風', avatar: 'https://i.pravatar.cc/150?img=5', points: 300, pickup: '晚風（045）' }
]

const showPush = ref(false)
const pushedName = ref('')

function pushMsg(m) {
  // 正式串接時透過 LINE Messaging API 依 lineId 推播訊息（由 C# 後端執行）
  pushedName.value = m.displayName
  showPush.value = true
}
</script>
