# TravelTemplate — Osaka 2026

可直接部署到 GitHub Pages 的純靜態旅行行程網站。

## 部署到 GitHub Pages

1. 解壓縮此 ZIP。
2. 將 `TravelTemplate` 資料夾內的所有檔案上傳到你的 repository 根目錄：
   - `index.html`
   - `style.css`
   - `script.js`
   - `data/`
3. 在 GitHub repository 進入 **Settings → Pages**。
4. 在 **Build and deployment**：
   - Source 選擇 `Deploy from a branch`
   - Branch 選擇 `main`
   - Folder 選擇 `/(root)`
5. 儲存後，網站通常會位於：
   `https://yupm15.github.io/TravelTemplate/`

## 私人 Repository 注意事項

GitHub Pages 能否從私人 repository 發佈，取決於帳號方案與 GitHub 當下規則。
若 Pages 設定中無法選擇部署，可暫時改為 public，或改用 Cloudflare Pages / Netlify。

## 編輯行程

- `data/itinerary.json`：日期、時間、每日行程、提醒。
- `data/places.json`：店家、飯店、景點名稱、Google Maps 搜尋詞、官方網站。
- 未確定的奈良午餐目前標示為「待決定」。

## 功能

- 5 日行程切換
- 美食／住宿／購物篩選
- Google Maps 地點連結
- 每段行程 Google Maps 路線
- 打卡完成進度
- 收藏功能
- 手機版響應式介面

打卡與收藏資料只儲存在每位使用者自己的瀏覽器中，不會同步給其他朋友。
