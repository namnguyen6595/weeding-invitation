# Save the Date — Nam & Mai

Landing page thiệp cưới mobile-first xây dựng bằng Next.js, React, Tailwind CSS 4 và Vinext để tương thích Cloudflare Workers.

## Tính năng

- Thiết kế trắng ngà, be và nâu taupe
- Typography tiếng Việt bằng Google Fonts
- Phát nhạc khi khách bắt đầu vuốt/cuộn; có nút bật/tắt dự phòng
- Hiệu ứng xuất hiện khi cuộn
- Lịch Save the Date và bộ đếm ngược
- Thông tin hai gia đình, timeline và Google Maps
- Carousel 36 ảnh cưới kèm lightbox
- Form RSVP mẫu
- Responsive theo hướng mobile-first

## Chạy local

Yêu cầu Node.js `>=22.13.0`.

```bash
npm ci
npm run dev
```

Mở địa chỉ được hiển thị trong terminal.

## Kiểm tra production build

```bash
npm run build
```

Build tạo Cloudflare Worker ESM tại `dist/server/index.js`.

## Nội dung cần chỉnh

- Trang chính: `app/page.tsx`
- Toàn bộ giao diện: `app/globals.css`
- Metadata và Google Fonts: `app/layout.tsx`
- Danh sách ảnh: hằng số `PHOTO_URLS` trong `app/page.tsx`
- Link Google Maps: tìm `maps.app.goo.gl` trong `app/page.tsx`
- Nhạc: hằng số `MUSIC_URL` trong `app/page.tsx`

Ảnh cưới được tải từ Cloudflare R2 theo mẫu:

```text
https://pub-f56b79df70fa43399d2d0de06b99b7bf.r2.dev/anh-cuoi/photo-001.webp
...
https://pub-f56b79df70fa43399d2d0de06b99b7bf.r2.dev/anh-cuoi/photo-036.webp
```

## RSVP

Form hiện hoàn chỉnh về giao diện nhưng mới hiển thị trạng thái xác nhận ở phía client. Để lưu phản hồi thật, kết nối route API với Cloudflare D1 và bổ sung Turnstile trước khi public rộng rãi.

## Đưa lên GitHub

```bash
git init
git add .
git commit -m "Initial wedding invitation"
git branch -M main
git remote add origin <GITHUB_REPOSITORY_URL>
git push -u origin main
```

Không commit `node_modules`, `dist`, `.next`, `.wrangler` hoặc file môi trường chứa secret.
