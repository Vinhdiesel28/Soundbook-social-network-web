# 🎵📚 Soundbook — Hướng dẫn Setup cho Team

Dự án Mạng xã hội Âm nhạc & Sách.

## 📂 Cấu trúc project
```
Soundbook-social-network-web/
├── backend/          ← Spring Boot (Java 17 + Maven)
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/soundbook/
│       └── resources/
│           ├── application.properties
│           └── db/schema.sql
└── frontend/         ← React + Vite
    ├── package.json
    └── src/
```

---

## 🖥️ Yêu cầu cài đặt

| Công cụ | Phiên bản | Link tải |
|---|---|---|
| Java JDK | 17+ | [adoptium.net](https://adoptium.net) |
| Maven | 3.9+ | [maven.apache.org](https://maven.apache.org/download.cgi) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| MySQL | 8.0+ | [mysql.com](https://dev.mysql.com/downloads/mysql/) |
| DBeaver / MySQL Workbench | Mới nhất | Dùng để quản lý DB |
| IntelliJ IDEA / VS Code | Mới nhất | [jetbrains.com](https://www.jetbrains.com/idea/download/) |

---

## 📥 Bước 1 — Clone project

Mở Terminal / Git Bash và chạy:
```bash
git clone https://github.com/Vinhdiesel28/Soundbook-social-network-web.git
cd Soundbook-social-network-web
```

---

## 🗄️ Bước 2 — Khởi tạo Database MySQL

Mở **MySQL Workbench** hoặc **DBeaver**, đăng nhập bằng tài khoản `root` (hoặc tài khoản local của bạn), rồi chạy SQL sau:

```sql
-- 1. Tạo database
CREATE DATABASE soundbook_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 2. Chọn database để sử dụng
USE soundbook_db;
```

**Lưu ý quan trọng**: Sau khi tạo xong database `soundbook_db`, bạn cần mở file `backend/src/main/resources/db/schema.sql` và **chạy toàn bộ script trong file đó** để tạo các bảng (tables) cơ sở dữ liệu.

---

## ⚙️ Bước 3 — Cấu hình Backend

Mở file thiết lập môi trường tại `backend/src/main/resources/application.properties` và **đảm bảo thông tin đăng nhập đúng với MySQL local của bạn**:

```properties
server.port=8081

spring.datasource.url=jdbc:mysql://localhost:3306/soundbook_db?useSSL=false&serverTimezone=UTC&characterEncoding=UTF-8&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=MẬT_KHẨU_MYSQL_CỦA_BẠN_Ở_ĐÂY
```
*(Hãy đổi `MẬT_KHẨU_MYSQL_CỦA_BẠN_Ở_ĐÂY` thành mật khẩu thực tế DB của bạn - VD: root, 123456...)*

> ⚠️ **Lưu ý**: File này không được phép commit chứa mật khẩu thật lên Git để bảo mật. Hãy thận trọng khi commit (chỉ nên giữ template).

---

## ▶️ Bước 4 — Chạy Backend (Spring Boot)

### Cách 1: Dùng IntelliJ IDEA (Khuyên dùng)
1. Mở IntelliJ → Chọn **Open** → trỏ vào thư mục `backend/`
2. Đợi IntelliJ tự nhận diện project Maven và tải các thư viện (dependencies).
3. Tìm file `SoundbookApplication.java` → click nút **Run** ▶️

### Cách 2: Dùng Terminal
```bash
cd backend
mvn spring-boot:run
```

✅ Backend khởi chạy thành công khi log báo:  
`Started SoundbookApplication in X.XXX seconds (process running for Y.YYY) ... Tomcat initialized with port(s): 8081 (http)`

---

## 🌐 Bước 5 — Chạy Frontend (React + Vite)

Mở một cửa sổ Terminal **MỚI**, trỏ vào thư mục `frontend`:
```bash
cd frontend
# Cài đặt toàn bộ thư viện cần thiết
npm install
# Khởi chạy server phát triển
npm run dev
```

✅ Frontend khởi chạy thành công tại: `http://localhost:5173`

*(Note: API Backend đã được cấu hình CORS cho phép origin từ `http://localhost:5173` gọi tới).*

---

## 🔍 Kiểm tra tổng thể

Sau khi chạy cả 2 thành phần, hãy vào trình duyệt để test:

| Service | Môi trường | URL |
|---|---|---|
| Backend API | Cổng `8081` | `http://localhost:8081` |
| Frontend UI | Cổng `5173` | `http://localhost:5173` |

Chúc team code vui vẻ! 🚀
