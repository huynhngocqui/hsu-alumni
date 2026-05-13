# HSU Alumni Website - Phan Tich Va Task Implementation

## 1. Tong Quan

### 1.1 Muc tieu he thong
- Xay dung cong thong tin Hoa Sen Alumni thay the trang tinh hien tai.
- Ho tro dinh danh Alumni, cap nhat ho so, ket noi Co-op, ket noi viec lam va quan tri noi dung cong dong.
- Dat nen tang de mo rong matching, notification, CMS va tich hop PeopleSoft.

### 1.2 Nguon dau vao da phan tich
- Site Map ngay 31/12/2025.
- BRD v1.0 ngay 15/01/2026.
- Convention ky thuat tham khao: Django 4.2 + DRF, React 18 + Vite, Tailwind CSS, route group theo nghiep vu, service layer tach rieng.

### 1.3 Nhom nguoi dung
- Guest: khach chua dang nhap.
- Alumni: cuu sinh vien da co tai khoan va dang nhap.
- Admin: quan tri noi dung va tai khoan.

### 1.4 Pham vi module chinh
- Authentication va Account/Profile.
- Dashboard ca nhan.
- Hoa Sen Co-op.
- Hoa Sen Job.
- CMS/Content & Community.
- Admin Panel.
- Notification va matching engine.
- PeopleSoft integration.

## 2. Tom Tat Phan Tich Nghiep Vu

### 2.1 Chuc nang chinh da xac dinh

| Nhom | Mo ta |
| --- | --- |
| Authentication | Dang nhap, dang ky, quen mat khau, xac thuc tai khoan |
| Profile | Xem va cap nhat thong tin ca nhan, linh vuc quan tam, job seeking status |
| Co-op | Dang bai san pham/dich vu, listing, detail, filter/search |
| Job | Dang tin tuyen dung, listing, detail, apply CV |
| CMS | Trang chu, bai viet, alumni stories, gallery, ban lien lac |
| Admin | Quan ly nguoi dung, bai viet, tags, gallery |

### 2.2 Cac gap va diem chua ro da ghi nhan
- Dang nhap bang email Hoa Sen/SSO co trong Site Map nhung chua co spec ky thuat trong BRD.
- Hoa Sen Shop va Hoa Sen Courses co trong Site Map nhung khong nam ro trong In Scope cua BRD.
- "Dang tin tuyen dung" trong Site Map mo ta nhu external link, nhung BRD lai mo ta day du use case Job posting.
- Dashboard duoc BRD nhac den nhung khong co trong Site Map.
- CMS articles noi bo va external links toi HSU website chua tach bach ro.
- PeopleSoft API chua co spec request/response chi tiet.
- Notification/matching rules chua du business rule chi tiet.

### 2.3 Dinh huong kien truc da chot
- Repo fullstack tach `backend/` va `frontend/`.
- Frontend route group theo public / auth / protected / admin.
- Frontend dung service layer, khong fetch truc tiep trong page.
- Backend chia domain app theo business module.
- Session-based auth voi cookie/CSRF.
- Local state + Context cho auth/notification; co the nang cap them khi can.
- Docker dev setup de chay bang `docker compose up --build`.

### 2.4 Frontend UI/UX fixed requirements
- Frontend phai bam visual style cua website HSU Alumni va menu da cap cua website chinh HSU.
- Khong duoc copy source code tu website tham khao; chi duoc tham khao visual/layout/interaction.
- Navigation, footer va social/app links khong duoc hardcode rai rac trong component.
- Hien trang repo con lech o `Navbar.jsx`, `Footer.jsx`, `HomePage.jsx`, `tailwind.config.cjs` va mot so public route slug.
- Xem tai lieu chi tiet tai `docs/hsu-alumni-frontend-ui-spec.md`.

## 3. Trang Thai Implementation Hien Tai

### 3.1 Da xong

| Hang muc | Trang thai | Ghi chu |
| --- | --- | --- |
| Frontend scaffold | Done | React 18 + Vite + Tailwind, build pass |
| Backend scaffold | Done | Django 4.2.16 + DRF, check pass |
| Custom user model | Done | App `users`, session auth co san |
| Auth pages/API shell | Done | Login, register, forgot/reset shell, profile, change password |
| Co-op backend | Done | Model, serializer, list/detail/create API |
| Job backend | Done | Model, serializer, list/detail/create/apply API |
| Tags backend | Done | Listing API cho taxonomy |
| Co-op frontend | Done | List, detail, create page da noi API |
| Job frontend | Done | List, detail, create, apply page da noi API |
| Profile job seeking status | Done | Da them checkbox va save duoc |
| Smoke test Co-op/Job | Done | `backend/scripts/smoke_coop_jobs.py` pass |
| Docker dev setup | Done | `docker-compose.yml`, Dockerfiles, `.dockerignore` |
| Frontend nav/footer config | Done | Da tach `navigation`, `footer`, `site`, `socialLinks` config |
| Frontend shell HSU alignment | In Progress | Da refactor header, footer, home shell theo huong HSU Alumni |

### 3.2 Da xac thuc bang command
- `npm run build`
- `python manage.py check`
- `python manage.py makemigrations users`
- `python manage.py migrate`
- `python manage.py makemigrations tags coop jobs`
- `python manage.py migrate`
- `python scripts/smoke_coop_jobs.py`
- `docker compose config`
- `docker compose up --build`

## 4. Cau Truc Ky Thuat Hien Co

### 4.1 Frontend
- `frontend/src/api/`: client va domain services.
- `frontend/src/components/`: layout, common, notification.
- `frontend/src/context/`: auth, notification.
- `frontend/src/pages/`: home, auth, profile, dashboard, coop, jobs, admin.
- `frontend/src/routes/`: public, auth, protected, admin route groups.

### 4.2 Backend
- `backend/auth_api/`: auth endpoints.
- `backend/users/`: custom user, profile, password.
- `backend/tags/`: taxonomy tags.
- `backend/coop/`: Co-op listings.
- `backend/jobs/`: Job listings + applications.
- `backend/scripts/`: smoke test scripts.

## 5. Backlog Va Task Theo Epic

### 5.1 Epic A - Authentication & Identity

| Task ID | Task | Trang thai | Ghi chu |
| --- | --- | --- | --- |
| AUTH-01 | Tao login page va login API | Done | Da noi session auth |
| AUTH-02 | Tao register page va register API | Done | Dang ky co luu user pending |
| AUTH-03 | Hoan thien forgot/reset password workflow that | Todo | Hien moi la stub backend |
| AUTH-04 | Them set-password flow qua email | Todo | Chua co token persistence |
| AUTH-05 | Tich hop CAPTCHA cho dang ky | Todo | Chua implement |
| AUTH-06 | PeopleSoft lookup theo CCCD | Todo | Can spec API |
| AUTH-07 | Auto verification / manual activate | Todo | Chua co admin workflow day du |
| AUTH-08 | Ho tro login bang email Hoa Sen neu co SSO | Open Question | Phu thuoc business + IT |

### 5.2 Epic B - Profile & Dashboard

| Task ID | Task | Trang thai | Ghi chu |
| --- | --- | --- | --- |
| PROF-01 | Tao profile page va update API | Done | Da luu company, position, tags |
| PROF-02 | Them job seeking status | Done | Dung cho Job apply/matching |
| PROF-03 | Hoan thien dashboard voi du lieu match that | Todo | Hien la shell page |
| PROF-04 | Upload avatar file | Todo | Hien moi la URL field |
| PROF-05 | Chot validation profile schema-based | Todo | Can tang cuong rule |

### 5.3 Epic C - Hoa Sen Co-op

| Task ID | Task | Trang thai | Ghi chu |
| --- | --- | --- | --- |
| COOP-01 | Tao model/list/detail/create backend | Done | Da co API va migration |
| COOP-02 | Tao list/detail/create frontend | Done | Da noi API |
| COOP-03 | Search va filter theo tag | Done | Dang o muc co ban |
| COOP-04 | Them pagination backend/frontend | Todo | Chua implement |
| COOP-05 | Them moderation status / admin moderation | Todo | Chua co admin CRUD |
| COOP-06 | Matching engine cho Co-op | Todo | Chua co Celery job |
| COOP-07 | Notification/email khi match | Todo | Chua implement |

### 5.4 Epic D - Hoa Sen Job

| Task ID | Task | Trang thai | Ghi chu |
| --- | --- | --- | --- |
| JOB-01 | Tao model/list/detail/create/apply backend | Done | Da co API va migration |
| JOB-02 | Tao list/detail/create/apply frontend | Done | Da noi API |
| JOB-03 | Validate apply chi 1 lan / phai bat tim viec | Done | Da enforce backend |
| JOB-04 | Them pagination backend/frontend | Todo | Chua implement |
| JOB-05 | Matching engine cho Job | Todo | Chua co background task |
| JOB-06 | Notification cho applicant va recruiter | Todo | Chua implement |
| JOB-07 | Quan ly application status | Todo | BRD chua ro, can chot pham vi |

### 5.5 Epic E - CMS & Community

| Task ID | Task | Trang thai | Ghi chu |
| --- | --- | --- | --- |
| CMS-01 | Trang chu shell | Done | Co shell frontend |
| CMS-02 | Article CMS backend/frontend | Todo | Chua implement domain `content` day du |
| CMS-03 | Alumni stories/backend/frontend | Todo | Chua implement |
| CMS-04 | Gallery va contribute link Drive | Todo | Chua implement |
| CMS-05 | Ban lien lac page/CMS | Todo | Chua implement |
| CMS-06 | Noi bo hay external link cho News/Event | Open Question | Can PO chot |

### 5.6 Epic F - Admin Panel

| Task ID | Task | Trang thai | Ghi chu |
| --- | --- | --- | --- |
| ADMIN-01 | Admin layout va route shell | Done | Da co route shell |
| ADMIN-02 | User moderation page/API | Todo | Chua co CRUD/approve |
| ADMIN-03 | Tag management page/API | Todo | Hien moi co list API public |
| ADMIN-04 | Article management | Todo | Chua implement |
| ADMIN-05 | Gallery moderation | Todo | Chua implement |
| ADMIN-06 | Co-op/Job moderation | Todo | Chua implement |

### 5.7 Epic G - Docker & DevOps

| Task ID | Task | Trang thai | Ghi chu |
| --- | --- | --- | --- |
| DEVOPS-01 | Docker dev setup check-in | Done | Compose va Dockerfile da co |
| DEVOPS-02 | Compose runtime validation | Done | `docker compose up --build` pass |
| DEVOPS-03 | Them redis/celery service | Todo | Can cho matching engine |
| DEVOPS-04 | Tach `.env.example` | Todo | Chua tao |
| DEVOPS-05 | Tao Docker production profile | Todo | Chua can cho local dev |

### 5.8 Epic H - Frontend UI/UX Alignment

| Task ID | Task | Trang thai | Ghi chu |
| --- | --- | --- | --- |
| FEUI-01 | Chot brand token, font va official asset pack | Todo | Can stakeholder/UI xac nhan |
| FEUI-02 | Tao `frontend/src/config/navigation.js`, `footer.js`, `site.js`, `socialLinks.js` | Done | Da bo hardcode khoi header/footer shell |
| FEUI-03 | Refactor Header thanh menu da cap accessible | Done | Da co desktop dropdown + mobile drawer/accordion baseline |
| FEUI-04 | Refactor Footer theo layout HSU Alumni verified content | Done | Da co footer config-driven, can stakeholder verify noi dung |
| FEUI-05 | Rebuild HomePage theo section pattern HSU Alumni | Done | Da co hero, mission, achievement, benefit, stories, news, events, join |
| FEUI-06 | Normalize public route slug va breadcrumb mapping | In Progress | Da doi slug chinh sach/tieu bieu va mo route Shop/Courses; breadcrumb chua implement |
| FEUI-07 | Tao reusable component system theo HSU Alumni style | In Progress | Da co config, icons, nav/footer shell; chua tach du section/card primitive |
| FEUI-08 | Gan SEO metadata va content structure cho page noi bo | Todo | Title, description, H1, OG, breadcrumb |
| FEUI-09 | Hoan thien responsive/accessibility checklist cho frontend | In Progress | Da co menu accessible co ban; can QA them tren viewport va keyboard flow |
| FEUI-10 | Chot internal vs external cho Job navigation | Open Question | Mau thuan voi internal Job module hien tai |

## 6. Task Uu Tien Tiep Theo

### 6.1 Uu tien cao
- Hoan thien reset password that.
- Tich hop PeopleSoft lookup cho register.
- Refactor frontend shell theo `docs/hsu-alumni-frontend-ui-spec.md`.
- Tao content domain cho CMS.
- Tao admin CRUD cho users, tags, articles.

### 6.2 Uu tien trung binh
- Matching engine Co-op/Job bang Celery.
- Notification in-app/email.
- Pagination cho listing pages.
- Upload avatar va CV validation chi tiet hon.

### 6.3 Uu tien phu thuoc open question
- SSO/email Hoa Sen.
- Hoa Sen Shop / Hoa Sen Courses.
- External link hay CMS article cho News/Event.
- Application status sau khi ung tuyen.

## 7. Open Questions Can Chot

| Nhom | Cau hoi |
| --- | --- |
| Business | Hoa Sen Shop va Hoa Sen Courses la external link hay future scope? |
| Business/IT | Co can login bang email Hoa Sen/SSO khong? |
| PO | Dashboard can hien thi them gi ngoai match suggestions? |
| PO | Co-op/Job can admin duyet truoc khi publish hay auto-publish? |
| PO | Navigation Viec lam & Ket noi se dung external HSU Career hay giu internal Job module? |
| PO | Notification chi email, chi in-app hay ca hai? |
| Design | Bo mau, font, logo, icon va hero asset chinh thuc cho HSU Alumni la gi? |
| IT | PeopleSoft API request/response va auth spec la gi? |
| IT | Google Drive contribution luu link hay ingest file/thumbnail? |
| QA | Co can staging/UAT rieng truoc khi mo rong feature khong? |

## 8. Cach Chay Hien Tai

### 8.1 Chay local khong Docker

Backend:

```powershell
cd "d:\Cuc Hoa\hsu-alumni\backend"
C:/Users/Hoa/AppData/Local/Programs/Python/Python313/python.exe -m pip install -r requirements.txt
C:/Users/Hoa/AppData/Local/Programs/Python/Python313/python.exe manage.py migrate
C:/Users/Hoa/AppData/Local/Programs/Python/Python313/python.exe manage.py runserver 8000
```

Frontend:

```powershell
cd "d:\Cuc Hoa\hsu-alumni\frontend"
npm install
npm run dev
```

### 8.2 Chay bang Docker

```powershell
cd "d:\Cuc Hoa\hsu-alumni"
docker compose up --build
```

Ket qua mong doi:
- Frontend: `http://localhost:3456`
- Backend health: `http://127.0.0.1:8000/api/health/`

## 9. Ghi Chu
- File nay duoc tao de luu lai tong hop phan tich va backlog task implementation theo trang thai hien tai cua repo.
- Cac muc `Todo` va `Open Question` can duoc cap nhat tiep theo khi co thong tin tu stakeholder va khi implementation duoc mo rong.