# 🎵📚 Soundbook — Hướng dẫn Setup cho Team

## Cấu trúc project
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
```

---

## 🖥️ Yêu cầu cài đặt

| Công cụ | Phiên bản | Link tải |
|---|---|---|
| Java JDK | 17+ | [adoptium.net](https://adoptium.net) |
| Maven | 3.9+ | [maven.apache.org](https://maven.apache.org/download.cgi) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| MySQL | 8.0+ | [mysql.com](https://dev.mysql.com/downloads/mysql/) |
| MySQL Workbench | 8.0+ | [mysql.com](https://dev.mysql.com/downloads/workbench/) |
| IntelliJ IDEA | mới nhất | [jetbrains.com](https://www.jetbrains.com/idea/download/) |

---

## 📥 Bước 1 — Clone project

```bash
git clone https://github.com/Vinhdiesel28/Soundbook-social-network-web.git
cd Soundbook-social-network-web
```

---

## 🗄️ Bước 2 — Tạo Database MySQL

Mở **MySQL Workbench**, đăng nhập vào MySQL local, rồi chạy lần lượt:

```sql
-- 1. Tạo database
CREATE DATABASE soundbook_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 2. Chọn database
USE soundbook_db;
```

Sau đó mở file `backend/src/main/resources/db/schema.sql` và **chạy toàn bộ file** (Ctrl+Shift+Enter trong Workbench).

---

## ⚙️ Bước 3 — Cấu hình Backend

Mở file `backend/src/main/resources/application.properties` và **sửa password** cho khớp với MySQL của bạn:

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD_HERE  ← đổi cái này
```

> ⚠️ **KHÔNG commit file application.properties lên git!**  
> File này đã được add vào `.gitignore` để bảo vệ thông tin cá nhân.

---

## ▶️ Bước 4 — Chạy Backend

### Cách 1: Dùng IntelliJ IDEA (Khuyên dùng)
1. Mở IntelliJ → **Open** → chọn thư mục `backend/`
2. IntelliJ tự nhận project Maven và tải dependencies
3. Tìm file `SoundbookApplication.java` → click **Run** ▶️

### Cách 2: Dùng Terminal
```bash
cd backend
mvn spring-boot:run
```

✅ Backend chạy thành công khi thấy:  
`Started SoundbookApplication on port 8080`

---

## 🌐 Bước 5 — Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend chạy tại: `http://localhost:5173`

---

## 🔍 Kiểm tra nhanh

| Service | URL | Kết quả mong đợi |
|---|---|---|
| Backend | `http://localhost:8080` | Response JSON |
| Frontend | `http://localhost:5173` | Trang web hiển thị |

---

