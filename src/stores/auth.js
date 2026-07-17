import { defineStore } from 'pinia'

// 前端先以假登入模擬 LINE Login 流程；正式串接時由 C# 後端換發 JWT
export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: JSON.parse(localStorage.getItem('pom_user') || 'null') !== null,
    user: JSON.parse(localStorage.getItem('pom_user') || 'null'),
    points: 120,
    savedPickups: [
      { id: 1, name: '阿蓬', phone3: '678', isDefault: true },
      { id: 2, name: '蓬媽', phone3: '910', isDefault: false }
    ]
  }),
  actions: {
    loginWithLine() {
      // 模擬 LINE Login 導向後回傳的使用者資料
      const mockUser = {
        lineId: 'U_mock_88291',
        displayName: '蓬蓬煙火愛好者',
        avatar: 'https://i.pravatar.cc/150?img=15'
      }
      this.user = mockUser
      this.isLoggedIn = true
      localStorage.setItem('pom_user', JSON.stringify(mockUser))
    },
    logout() {
      this.user = null
      this.isLoggedIn = false
      localStorage.removeItem('pom_user')
    },
    deactivateAccount() {
      this.logout()
    },
    addPickup(pickup) {
      this.savedPickups.push({ id: Date.now(), ...pickup, isDefault: false })
    },
    removePickup(id) {
      this.savedPickups = this.savedPickups.filter((p) => p.id !== id)
    }
  }
})
