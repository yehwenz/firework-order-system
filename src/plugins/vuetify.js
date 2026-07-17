import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'


// ---------------------------------------------------------------------------
// 設計代幣 Design Tokens — 蓬蓬煙火 Pom Pom Fireworks
// 主題：夜空中綻放的煙火 → 暖橘火光 + 米色夜幕餘溫
// ---------------------------------------------------------------------------
const pomTheme = {
  dark: false,
  colors: {
    background: '#FBF3E7', // 米色夜幕
    surface: '#FFFFFF',
    'surface-variant': '#F1E4D0', // 米色卡片底
    primary: '#E8734A', // 蓬蓬橘（品牌主色｜煙火餘燼）
    'primary-darken-1': '#C85A34',
    secondary: '#F4A94E', // 火花金橘（次強調）
    'secondary-darken-1': '#DB8F35',
    tertiary: '#B24B32', // 深焰紅棕（狀態強調）
    success: '#6B9B6E',
    warning: '#E4A63A',
    error: '#D65A4A',
    info: '#5C8AA6',
    'on-primary': '#FFFFFF',
    'on-background': '#3D2B22', // 深咖啡墨色（主要文字）
    'on-surface': '#3D2B22',
    outline: '#E4D4BE'
  },
  variables: {
    'border-color': '#E4D4BE',
    'high-emphasis-opacity': 1
  }
}

export default createVuetify({
  theme: {
    defaultTheme: 'pomTheme',
    themes: { pomTheme }
  },
  defaults: {
    global: {
      ripple: true
    },
    VBtn: {
      rounded: 'pill',
      elevation: 0,
      class: 'text-none font-weight-bold'
    },
    VCard: {
      rounded: 'xl',
      elevation: 0
    },
    VTextField: {
      variant: 'solo-filled',
      rounded: 'lg',
      flat: true,
      density: 'comfortable'
    },
    VSelect: {
      variant: 'solo-filled',
      rounded: 'lg',
      flat: true,
      density: 'comfortable'
    },
    VChip: {
      rounded: 'pill'
    },
    VSheet: {
      rounded: 'xl'
    },
    VDialog: {
      scrollable: true
    },
    VAppBar: {
      elevation: 0
    }
  }
})
