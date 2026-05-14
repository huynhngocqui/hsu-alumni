### Tổng hợp tài khoản đăng nhập cho từng role và hướng dẫn truy cập trang quản lý

#### 1. Các role và tài khoản seed sẵn

- **Admin**
  - **Role:** ADMIN
  - **Cách tạo:** Sử dụng Django `createsuperuser` hoặc thêm user với role `'ADMIN'` và `is_staff=True, is_superuser=True, account_status='ACTIVE'`.
  - **Mặc định (nếu chưa có):**
    - **Email:** `admin@hsu.edu.vn`
    - **Password:** `Password123`
- **Job/Coop Owner**
  - **Role:** ALUMNI (hiện tại, owner là alumni có quyền đăng bài)
  - **Seed script:** Đã có trong `scripts/smoke_coop_jobs.py`
    - **Email:** `owner@example.com`
    - **Password:** `Password123`
  - **Applicant (test):**
    - **Email:** `applicant@example.com`
    - **Password:** `Password123`

> Nếu chưa có các tài khoản này, bạn có thể chạy script `scripts/smoke_coop_jobs.py` để seed nhanh owner và applicant. Để seed admin, dùng lệnh Django hoặc tạo user với role ADMIN.

#### 2. Hướng dẫn truy cập trang quản lý

- **Admin Panel (Quản trị)**
  - **URL:** `/admin` (trên frontend, ví dụ: `http://127.0.0.1:3456/admin`)
  - **Các module quản lý:** Tài khoản alumni, bài viết CMS, gallery, tags, v.v.
  - **Yêu cầu:** Đăng nhập bằng tài khoản có role `ADMIN`.

- **Trang quản lý Job/Coop Owner**
  - **Đăng tin Co-op:** `/dich-vu-alumni/hoa-sen-coop/dang-moi`
  - **Đăng tin Job:** `/viec-lam-ket-noi/dang-tin-tuyen-dung`
  - **Dashboard cá nhân:** `/dashboard`
  - **Yêu cầu:** Đăng nhập bằng tài khoản owner (role ALUMNI).

#### 3. Seed tài khoản nếu chưa có

- **Seed owner/applicant:** Chạy lệnh sau trong terminal:
  ```bash
  python backend/scripts/smoke_coop_jobs.py
  ```
- **Seed admin:** Chạy lệnh sau trong terminal:
  ```bash
  python backend/manage.py createsuperuser
  ```
  Hoặc tạo user mới với email `admin@hsu.edu.vn`, password `Password123`, role `ADMIN`, `is_staff=True`, `is_superuser=True`, `account_status='ACTIVE'`.

#### 4. Tóm tắt tài khoản test

| Role   | Email                  | Password     | Ghi chú                |
|--------|------------------------|--------------|------------------------|
| Admin  | admin@hsu.edu.vn       | Password123  | Tạo bằng createsuperuser|
| Owner  | owner@example.com      | Password123  | Đã có trong seed script|
| Alumni | applicant@example.com  | Password123  | Đã có trong seed script|

Nếu cần seed thêm hoặc gặp lỗi đăng nhập, xác nhận lại user đã có trong cả Django ORM và MongoDB (do session vẫn dùng Django).

---

Bạn cần seed thêm role nào khác, hay hướng dẫn chi tiết về seed qua MongoDB không? Nếu cần script seed tự động cho admin, mình sẽ hướng dẫn chi tiết.