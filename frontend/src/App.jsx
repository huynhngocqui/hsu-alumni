import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";
const LEGACY_ALUMNI_LOGO = "https://www.hoasen.edu.vn/alumni/wp-content/uploads/sites/67/2025/11/HSU-ALUMNI.png";

const ACCOUNT_MENU = [
  { label: "Đăng nhập", href: "#dang-nhap" },
  { label: "Đăng ký thành viên", href: "#dang-ky" },
  { label: "Thông tin cá nhân", href: "#thong-tin-ca-nhan" },
  { label: "Đổi mật khẩu", href: "#doi-mat-khau" },
  { label: "Quên mật khẩu", href: "#quen-mat-khau" },
];

const MAIN_NAV_TREE = [
  { label: "Trang chủ", href: "#trang-chu", children: [] },
  {
    label: "Giới thiệu",
    href: "#gioi-thieu",
    children: [{ label: "Định hướng hoạt động", href: "#dinh-huong-hoat-dong" }],
  },
  {
    label: "Tin tức và Sự kiện",
    href: "#tin-tuc-su-kien",
    children: [
      { label: "Tin tức", href: "https://www.hoasen.edu.vn/tin-tuc/" },
      { label: "Sự kiện", href: "https://www.hoasen.edu.vn/su-kien/" },
    ],
  },
  {
    label: "Cộng đồng Alumni",
    href: "#cong-dong-alumni",
    children: [
      { label: "Chính sách Alumni", href: "#chinh-sach-alumni" },
      { label: "Thông tin ban liên lạc", href: "#ban-lien-lac" },
      { label: "Cựu sinh viên tiêu biểu", href: "#cuu-sinh-vien-tieu-bieu" },
      { label: "Câu chuyện thành công", href: "#cau-chuyen-thanh-cong" },
      {
        label: "Thư viện hình ảnh",
        href: "#thu-vien-hinh-anh",
      },
    ],
  },
  {
    label: "Việc làm và Kết nối",
    href: "#viec-lam-ket-noi",
    children: [
      {
        label: "Cơ hội việc làm",
        href: "https://www.hoasen.edu.vn/tuyen-dung/",
      },
      {
        label: "Career Webinars",
        href: "https://www.hoasen.edu.vn/tin-tuc/",
      },
      {
        label: "Đăng tin tuyển dụng",
        href: "https://www.hoasen.edu.vn/tin-tuc/",
      },
    ],
  },
  {
    label: "Dịch vụ Alumni",
    href: "#dich-vu-alumni",
    children: [
      { label: "Hoa Sen COOP", href: "#hoa-sen-coop" },
      { label: "Hoa Sen Shop", href: "#hoa-sen-shop" },
      { label: "Hoa Sen Courses", href: "#hoa-sen-courses" },
      { label: "Thư viện Hoa Sen", href: "https://www.hoasen.edu.vn/thuvien/" },
      {
        label: "Hỗ trợ Cơ sở vật chất",
        href: "https://www.hoasen.edu.vn/so-tay-sinh-vien/",
      },
    ],
  },
];

function SectionTitle({ title, subtitle }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/landing-page/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Cannot load landing page data");
        }
        return response.json();
      })
      .then((payload) => {
        setData(payload);
      })
      .catch(() => {
        setError("Khong the tai du lieu trang Alumni. Vui long thu lai.");
      });
  }, []);

  if (!data && !error) {
    return <div className="screen-state">Dang tai trang Alumni...</div>;
  }

  if (error) {
    return <div className="screen-state error">{error}</div>;
  }

  const displayLogo = LEGACY_ALUMNI_LOGO;

  return (
    <div className="app-shell">
      <header className="portal-header" id="trang-chu">
        <div className="top-strip">
          <span>Đại học Hoa Sen – HSU</span>
          <span>Cổng thông tin sinh viên</span>
        </div>
        <div className="brand-row">
          <div className="logo-block">
            <img className="logo-image" src={displayLogo} alt={data.brand.name} />
            <div>
              <div className="logo-text">{data.brand.logoText}</div>
              <div className="logo-subtext">{data.brand.logoSubtext}</div>
            </div>
          </div>
          <a className="header-cta" href="#dang-ky">
            Gia nhập Alumni
          </a>
        </div>

        <section className="account-strip" aria-label="Đăng nhập hoặc tài khoản">
          <h2>Đăng nhập và Tài khoản</h2>
          <div className="account-links">
            {ACCOUNT_MENU.map((item) => (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </section>

        <section className="auth-note" aria-label="Lưu ý đăng nhập">
          <h3>Lưu ý đăng nhập</h3>
          <ul>
            <li>
              CSV còn email Hoa Sen: đăng ký và đăng nhập qua email sinh viên.
            </li>
            <li>
              CSV không còn email Hoa Sen: đăng nhập bằng email cá nhân đã đăng ký thành viên.
            </li>
          </ul>
        </section>

        <nav className="nav-tree" aria-label="Thanh điều hướng chính">
          {MAIN_NAV_TREE.map((root) => (
            <article key={root.label} className="nav-column">
              <a className="root-link" href={root.href}>
                {root.label}
              </a>
              {root.children.length > 0 ? (
                <ul>
                  {root.children.map((child) => (
                    <li key={child.label}>
                      <a href={child.href} target={child.href.startsWith("http") ? "_blank" : undefined} rel={child.href.startsWith("http") ? "noreferrer" : undefined}>
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Đi tới chuyên mục</p>
              )}
            </article>
          ))}
        </nav>
      </header>

      <main>
        <section className="hero" id="gioi-thieu">
          <p className="eyebrow">Hoa Sen University</p>
          <h1>Cổng kết nối Cựu sinh viên Hoa Sen</h1>
          <p>
            Nền tảng tập trung dành cho Alumni với điều hướng rõ ràng theo từng nhóm dịch vụ:
            cộng đồng, nghề nghiệp, học tập và các kết nối doanh nghiệp.
          </p>
          <a className="button" href={data.hero.cta.href}>
            {data.hero.cta.label}
          </a>
        </section>

        <section id="dinh-huong-hoat-dong" className="content-section">
          <SectionTitle
            title="Định hướng hoạt động"
            subtitle="Cấu trúc cổng Alumni được tổ chức theo đúng hành trình người dùng: Tài khoản - Cộng đồng - Cơ hội - Dịch vụ."
          />
          <div className="grid three">
            <article className="card accent-card">
              <h3>Đăng nhập một cửa</h3>
              <p>Luồng đăng nhập tách riêng cho email Hoa Sen và email cá nhân đã đăng ký thành viên.</p>
            </article>
            <article className="card accent-card">
              <h3>Điều hướng theo mục tiêu</h3>
              <p>Từ tin tức, sự kiện đến việc làm, mỗi nhánh đều có đầu mối truy cập rõ ràng.</p>
            </article>
            <article className="card accent-card">
              <h3>Quản trị cộng đồng</h3>
              <p>Thư viện hình ảnh và nội dung đóng góp sẽ qua bước kiểm duyệt trước khi hiển thị.</p>
            </article>
          </div>
        </section>

        <section id="tin-tuc-su-kien" className="content-section alt">
          <SectionTitle title="Tin tức và Sự kiện" />
          <div className="list-block">
            <article className="list-row">
              <span>Tin tức</span>
              <a href="https://www.hoasen.edu.vn/tin-tuc/" target="_blank" rel="noreferrer">
                Liên kết Tin tức - Đại học Hoa Sen
              </a>
            </article>
            <article className="list-row">
              <span>Sự kiện</span>
              <a href="https://www.hoasen.edu.vn/su-kien/" target="_blank" rel="noreferrer">
                Liên kết Sự kiện - Đại học Hoa Sen
              </a>
            </article>
          </div>
        </section>

        <section id="cong-dong-alumni" className="content-section">
          <SectionTitle title="Cộng đồng Alumni" />
          <div className="grid three">
            <article className="card"><h3>Chính sách Alumni</h3><p>Chuẩn hóa quyền lợi, tiêu chuẩn tham gia và nguyên tắc cộng đồng.</p></article>
            <article className="card"><h3>Thông tin ban liên lạc</h3><p>Công khai đầu mối phụ trách hỗ trợ theo khoa, niên khóa và nhóm ngành.</p></article>
            <article className="card"><h3>Cựu sinh viên tiêu biểu</h3><p>Tôn vinh các gương mặt truyền cảm hứng và giá trị đóng góp cho xã hội.</p></article>
            <article className="card"><h3>Câu chuyện thành công</h3><p>Lan tỏa hành trình nghề nghiệp thực tế và các bài học từ Alumni.</p></article>
            <article className="card"><h3>Thư viện hình ảnh</h3><p>Nhận ảnh đóng góp qua liên kết Drive, kiểm duyệt trước khi công khai.</p></article>
          </div>
        </section>

        <section id="viec-lam-ket-noi" className="content-section alt">
          <SectionTitle title="Việc làm và Kết nối" />
          <div className="grid two">
            <article className="card quote-card">
              <h3>Cơ hội việc làm</h3>
              <p className="major">Tuyển dụng và tìm kiếm việc làm nhanh</p>
              <a href="https://www.hoasen.edu.vn/tuyen-dung/" target="_blank" rel="noreferrer">Mở liên kết tuyển dụng</a>
            </article>
            <article className="card quote-card">
              <h3>Career Webinars</h3>
              <p className="major">Liên kết chuyên mục Tin tức</p>
              <a href="https://www.hoasen.edu.vn/tin-tuc/" target="_blank" rel="noreferrer">Xem chuyên mục</a>
            </article>
            <article className="card quote-card">
              <h3>Đăng tin tuyển dụng</h3>
              <p className="major">Đăng qua kênh nội dung chính thức</p>
              <a href="https://www.hoasen.edu.vn/tin-tuc/" target="_blank" rel="noreferrer">Gửi tin tuyển dụng</a>
            </article>
          </div>
        </section>

        <section id="dich-vu-alumni" className="content-section">
          <SectionTitle title="Dịch vụ Alumni" />
          <div className="list-block">
            <article className="list-row"><span>Dịch vụ</span><a href="#hoa-sen-coop">Hoa Sen COOP</a></article>
            <article className="list-row"><span>Dịch vụ</span><a href="#hoa-sen-shop">Hoa Sen Shop</a></article>
            <article className="list-row"><span>Dịch vụ</span><a href="#hoa-sen-courses">Hoa Sen Courses</a></article>
            <article className="list-row"><span>Liên kết</span><a href="https://www.hoasen.edu.vn/thuvien/" target="_blank" rel="noreferrer">Thư viện Hoa Sen</a></article>
            <article className="list-row"><span>Liên kết</span><a href="https://www.hoasen.edu.vn/so-tay-sinh-vien/" target="_blank" rel="noreferrer">Hỗ trợ Cơ sở vật chất</a></article>
          </div>
        </section>

        <section id="dang-ky" className="content-section join-section">
          <SectionTitle
            title="Đăng ký thành viên"
            subtitle="Sử dụng email phù hợp trạng thái CSV để hoàn tất đăng ký và quản lý tài khoản Alumni."
          />
          <form className="join-form" onSubmit={(event) => event.preventDefault()}>
            <input placeholder="Họ và tên" />
            <input placeholder="Email" />
            <input placeholder="Ngành" />
            <button type="submit">Đăng ký tư vấn</button>
          </form>
        </section>
      </main>

      <footer className="footer">
        <div>
          <h3>{data.footer.university}</h3>
          {data.footer.addresses.map((address) => (
            <p key={address}>{address}</p>
          ))}
          <p>HOTLINE: {data.footer.hotline.join(" - ")}</p>
        </div>
        <div>
          <h4>Tiện ích khác</h4>
          <ul>
            {data.footer.utilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Theo dõi</h4>
          <ul>
            {data.footer.social.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>{data.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
