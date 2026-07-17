# 蓬蓬煙火 Pom Pom Fireworks — 前端下單系統

Vue 3 + Vuetify 3 前端專案，目前使用假資料（mock data），尚未串接後端 API / 資料庫。

## 快速開始

```bash
npm install
npm run dev      # 開發模式，預設 http://localhost:5173
npm run build    # 建置正式版本至 dist/
```

## 專案結構

```
src/
  plugins/vuetify.js     # 設計代幣：色彩、字體、圓角、元件預設值
  assets/main.css         # 全域樣式、火花軌跡(spark-trail)簽名元素
  stores/                 # Pinia 狀態管理（未來可改接 C# API）
    products.js            # 商品資料 / 分類 / 搜尋
    cart.js                 # 購物車
    orders.js               # 訂單與狀態機（待確認→備貨中→可取貨→已完成／已取消）
    auth.js                  # LINE 登入模擬、會員點數、常用取貨人
  layouts/
    CustomerLayout.vue      # 顧客前台（頂部導航 + 手機底部導航）
    AdminLayout.vue          # 後台管理（側邊導航）
  views/
    customer/
      ProductList.vue        # 1. 瀏覽所有商品（含分類、搜尋）
      ProductDetail.vue       # 2. 商品下單頁面
      Cart.vue                 # 3. 購物車（新增、刪除、修改）
      Checkout.vue              # 4. 結帳（免金流，取貨人暱稱+電話末三碼）
      Orders.vue                 # 5. 訂單管理（列表、取消、狀態）
      OrderDetail.vue             # 5. 訂單詳情（火花軌跡狀態進度條）
      Login.vue                    # 6. LINE 會員登入（模擬）
      Account.vue                   # 7. 帳號管理（點數、取貨人、註銷會員）
    admin/
      AdminOrders.vue         # 後台：訂單管理 + 狀態更新（模擬 LINE 推播）
      AdminProducts.vue        # 後台：商品管理（新增/編輯/刪除）
      AdminAccounts.vue         # 後台：帳號管理 + 推播通知
```

- 顧客前台：`/`
- 後台管理：`/admin`（暫無權限保護，之後請串接 C# 後端做登入驗證）

## 設計系統

- 主色：`#E8734A`（蓬蓬橘）／輔色：`#F4A94E`（火花金橘）／背景：`#FBF3E7`（米色夜幕）
- 字體：標題 Noto Serif TC、內文 Noto Sans TC
- 大量圓角：卡片 20px、按鈕 pill、輸入框 12px
- 簽名元素：`.spark-trail`（漸層圓點火花軌跡，用於分隔線與頁首裝飾）、`.burst-badge`（放射狀圓形徽章，用於 Logo 與空狀態）

## 之後串接 C# 後端時的建議對應

| 前端 Pinia store | 建議 API |
|---|---|
| `products.js` | `GET /api/products`、`POST/PUT/DELETE /api/admin/products` |
| `cart.js` | 純前端狀態，送出訂單時才打 API（可保留現況） |
| `orders.js` | `POST /api/orders`、`GET /api/orders?userId=`、`PATCH /api/orders/{id}/status` |
| `auth.js` | LINE Login OAuth → 換發 JWT，`GET/PUT /api/me`、`GET/POST/DELETE /api/me/pickups` |
| 後台推播 | LINE Messaging API push message，依會員 `lineId` 發送 |
