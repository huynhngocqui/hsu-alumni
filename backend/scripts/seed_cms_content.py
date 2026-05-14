import os
import sys
from datetime import timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hsu_alumni.settings.local')

import django

django.setup()

from django.utils import timezone

from content.models import AlumniPost, AlumniStory, Article, Event, GalleryItem, NewsCategory, NewsPost, PublishableModel


def published_at(days_ago):
    return timezone.now() - timedelta(days=days_ago)


SEED_PAGES = [
    {
        'slug': 'dinh-huong-hoat-dong',
        'title': 'Định hướng hoạt động Alumni',
        'excerpt': 'Kết nối các thế hệ Hoa Sen, lan tỏa tri thức thực tiễn và xây dựng hệ sinh thái đồng hành bền vững.',
        'body': (
            'Mạng lưới Alumni HSU được xây dựng để kết nối nhiều thế hệ cựu sinh viên, doanh nghiệp và nhà trường trong cùng một hành trình phát triển.\n\n'
            'Định hướng trọng tâm gồm ba trục chính: duy trì kết nối cộng đồng, mở rộng cơ hội nghề nghiệp và phát triển các chương trình tri ân - học tập - đồng hành.\n\n'
            'Các hoạt động ưu tiên bao gồm mentoring, workshop, chương trình quay về trường, tuyển dụng nội bộ, kết nối doanh nghiệp và lan tỏa những câu chuyện thành công của alumni.'
        ),
    },
    {
        'slug': 'chinh-sach-alumni',
        'title': 'Chính sách Alumni',
        'excerpt': 'Quy định về quyền lợi, trách nhiệm và nguyên tắc tham gia cộng đồng Alumni HSU.',
        'body': (
            'Alumni tham gia mạng lưới cần cung cấp thông tin hồ sơ trung thực, tuân thủ quy định sử dụng nền tảng và gìn giữ hình ảnh chung của cộng đồng Hoa Sen.\n\n'
            'Thành viên được ưu tiên tiếp cận thông tin sự kiện, chương trình tuyển dụng, workshop hướng nghiệp, cơ hội mentoring và các chương trình tri ân dành cho alumni.\n\n'
            'Nhà trường có quyền rà soát, xác thực và điều chỉnh trạng thái tài khoản đối với các hồ sơ chưa đầy đủ hoặc sử dụng sai mục đích.'
        ),
    },
    {
        'slug': 'ban-lien-lac',
        'title': 'Thông tin Ban liên lạc',
        'excerpt': 'Ban liên lạc Alumni đóng vai trò đầu mối kết nối cựu sinh viên với nhà trường và cộng đồng doanh nghiệp.',
        'body': (
            'Ban liên lạc Alumni phối hợp với nhà trường để triển khai hoạt động cộng đồng, chương trình sự kiện, mentoring và kết nối doanh nghiệp.\n\n'
            'Khi cần đồng hành cùng các sáng kiến của alumni, thành viên có thể gửi đề xuất qua form liên hệ hoặc kết nối trực tiếp với bộ phận phụ trách tại văn phòng Alumni HSU.\n\n'
            'Thông tin nhân sự và đầu mối liên hệ chi tiết có thể tiếp tục được cập nhật từ CMS khi stakeholder chốt danh sách chính thức.'
        ),
    },
    {
        'slug': 'hoa-sen-shop',
        'title': 'Hoa Sen Shop',
        'excerpt': 'Ưu đãi mua sắm và các chương trình tri ân dành riêng cho cộng đồng alumni.',
        'body': (
            'Hoa Sen Shop là không gian giới thiệu các ưu đãi theo mùa, quà tặng tri ân và những sản phẩm gắn với cộng đồng HSU.\n\n'
            'Nội dung trang có thể dùng để công bố các đợt ưu đãi, thông tin đối tác và chính sách dành riêng cho thành viên alumni đã xác thực.\n\n'
            'Giai đoạn hiện tại, đây là landing page public được quản lý qua CMS để đội vận hành có thể cập nhật linh hoạt.'
        ),
    },
    {
        'slug': 'hoa-sen-courses',
        'title': 'Hoa Sen Courses',
        'excerpt': 'Tổng hợp cơ hội học tập tiếp nối, khóa ngắn hạn và ưu đãi đào tạo dành cho alumni.',
        'body': (
            'Hoa Sen Courses là khu vực dành cho các chương trình học tập tiếp nối, khóa kỹ năng ngắn hạn và cơ hội nâng cao năng lực nghề nghiệp cho alumni.\n\n'
            'Trang này có thể được dùng để truyền thông ưu đãi học phí, lớp cập nhật chuyên môn và các chương trình đào tạo kết hợp doanh nghiệp.\n\n'
            'Ở phiên bản hiện tại, CMS quản lý nội dung để giúp nhà trường cập nhật nhanh theo từng đợt tuyển sinh hoặc chiến dịch truyền thông.'
        ),
    },
]

SEED_ARTICLES = [
    {
        'slug': 'alumni-ket-noi-doanh-nghiep-2026',
        'title': 'HSU Alumni mở rộng kết nối doanh nghiệp năm 2026',
        'excerpt': 'Chuỗi hoạt động kết nối doanh nghiệp tập trung vào tuyển dụng, mentoring và hợp tác chiến lược cùng alumni.',
        'body': 'Chương trình kết nối doanh nghiệp năm 2026 tập trung vào ba nhóm hoạt động: tuyển dụng thực chiến, chia sẻ kinh nghiệm quản trị và kết nối đối tác cho các dự án alumni.',
        'article_type': Article.ArticleType.NEWS,
        'published_at': published_at(2),
    },
    {
        'slug': 'mang-luoi-mentor-alumni-ra-mat',
        'title': 'Ra mắt mạng lưới mentor Alumni HSU',
        'excerpt': 'Mạng lưới mentor mới quy tụ alumni ở nhiều lĩnh vực để đồng hành cùng sinh viên và cựu sinh viên trẻ.',
        'body': 'Hệ thống mentoring mới cho phép kết nối alumni theo chuyên ngành, kinh nghiệm và nhu cầu phát triển nghề nghiệp.',
        'article_type': Article.ArticleType.NEWS,
        'published_at': published_at(5),
    },
    {
        'slug': 'alumni-chung-tay-quy-hoc-bong',
        'title': 'Cộng đồng alumni chung tay cho quỹ học bổng Hoa Sen',
        'excerpt': 'Chiến dịch gây quỹ năm nay nhận được sự hưởng ứng từ nhiều thế hệ alumni và đối tác doanh nghiệp.',
        'body': 'Quỹ học bổng alumni được thiết kế để hỗ trợ sinh viên có thành tích tốt, hoàn cảnh khó khăn và các dự án học tập đổi mới sáng tạo.',
        'article_type': Article.ArticleType.NEWS,
        'published_at': published_at(8),
    },
    {
        'slug': 'ngay-hoi-alumni-homecoming-2026',
        'title': 'Ngày hội Alumni Homecoming 2026',
        'excerpt': 'Sự kiện quy tụ nhiều thế hệ Hoa Sen trở về trường để giao lưu, kết nối và cùng nhìn lại chặng đường phát triển.',
        'body': 'Homecoming 2026 gồm các hoạt động tham quan campus, giao lưu liên khóa, workshop cộng đồng và đêm gala tri ân.',
        'article_type': Article.ArticleType.EVENT,
        'published_at': published_at(3),
    },
    {
        'slug': 'workshop-chien-luoc-ca-nhan-cho-alumni',
        'title': 'Workshop chiến lược thương hiệu cá nhân cho alumni',
        'excerpt': 'Buổi workshop chuyên sâu giúp alumni củng cố hồ sơ nghề nghiệp và định vị cá nhân trên các nền tảng số.',
        'body': 'Sự kiện tập trung vào cách xây dựng hồ sơ chuyên nghiệp, kể câu chuyện nghề nghiệp và mở rộng mạng lưới cơ hội.',
        'article_type': Article.ArticleType.EVENT,
        'published_at': published_at(6),
    },
    {
        'slug': 'career-fair-doanh-nghiep-dong-hanh',
        'title': 'Career Fair doanh nghiệp đồng hành cùng alumni',
        'excerpt': 'Ngày hội tuyển dụng kết nối alumni với nhà tuyển dụng, đối tác thực tập và các chương trình upskilling.',
        'body': 'Career Fair quy tụ doanh nghiệp trong các lĩnh vực dịch vụ, công nghệ, truyền thông và tài chính để tuyển dụng trực tiếp.',
        'article_type': Article.ArticleType.EVENT,
        'published_at': published_at(9),
    },
    {
        'slug': 'career-webinar-xay-dung-ho-so-linkedin',
        'title': 'Career Webinar: Xây dựng hồ sơ LinkedIn nổi bật',
        'excerpt': 'Webinar hướng dẫn alumni cách tối ưu hồ sơ LinkedIn để tăng khả năng kết nối với nhà tuyển dụng và chuyên gia ngành.',
        'body': 'Buổi webinar chia sẻ về cấu trúc hồ sơ, cách trình bày thành tựu, networking và chiến lược nội dung cá nhân.',
        'article_type': Article.ArticleType.WEBINAR,
        'published_at': published_at(4),
    },
    {
        'slug': 'career-webinar-tu-duy-chuyen-doi-nghe-nghiep',
        'title': 'Career Webinar: Tư duy chuyển đổi nghề nghiệp bền vững',
        'excerpt': 'Phiên thảo luận dành cho alumni đang cân nhắc chuyển ngành hoặc nâng cấp kỹ năng trong bối cảnh thị trường thay đổi nhanh.',
        'body': 'Nội dung tập trung vào đánh giá năng lực lõi, thiết kế lộ trình học tập và chuẩn bị cho các vòng phỏng vấn mới.',
        'article_type': Article.ArticleType.WEBINAR,
        'published_at': published_at(10),
    },
]

SEED_STORIES = [
    {
        'slug': 'nguyen-minh-tri-tu-hsu-den-lanh-dao-san-pham',
        'title': 'Nguyễn Minh Trí: Từ giảng đường HSU đến vị trí lãnh đạo sản phẩm',
        'story_category': AlumniStory.StoryCategory.OUTSTANDING,
        'alumni_name': 'Nguyễn Minh Trí',
        'company_name': 'Nova Digital',
        'role_title': 'Head of Product',
        'excerpt': 'Hành trình phát triển từ môi trường đại học đến vị trí quản lý sản phẩm trong lĩnh vực công nghệ.',
        'body': 'Sau khi tốt nghiệp, Minh Trí liên tục tham gia các dự án công nghệ, phát triển tư duy sản phẩm và dần đảm nhiệm vai trò lãnh đạo đội ngũ.',
        'featured_image_url': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
        'published_at': published_at(7),
    },
    {
        'slug': 'tran-khanh-linh-xay-dung-thuong-hieu-ca-nhan',
        'title': 'Trần Khánh Linh và câu chuyện xây dựng thương hiệu cá nhân',
        'story_category': AlumniStory.StoryCategory.SUCCESS,
        'alumni_name': 'Trần Khánh Linh',
        'company_name': 'Lumiere Studio',
        'role_title': 'Creative Director',
        'excerpt': 'Câu chuyện về việc chuyển hóa trải nghiệm học tập thành lợi thế cạnh tranh trong ngành sáng tạo.',
        'body': 'Khánh Linh chia sẻ cách cô xây dựng danh mục dự án, tận dụng mạng lưới alumni và phát triển thương hiệu cá nhân song song với sự nghiệp.',
        'featured_image_url': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
        'published_at': published_at(11),
    },
]

SEED_GALLERY = [
    {
        'title': 'Gặp gỡ alumni liên khóa tại campus chính',
        'album_name': 'Homecoming',
        'description': 'Khoảnh khắc alumni nhiều thế hệ quay lại trường và giao lưu cùng giảng viên, sinh viên.',
        'image_url': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
        'drive_url': 'https://drive.google.com/',
        'contributor_name': 'HSU Alumni Office',
        'published_at': published_at(12),
    },
    {
        'title': 'Workshop mentoring và định hướng nghề nghiệp',
        'album_name': 'Mentoring',
        'description': 'Chuỗi hình ảnh từ workshop nơi alumni chia sẻ kinh nghiệm nghề nghiệp với sinh viên.',
        'image_url': 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
        'drive_url': 'https://drive.google.com/',
        'contributor_name': 'HSU Alumni Office',
        'published_at': published_at(15),
    },
]

SEED_ALUMNI_POSTS = [
    {
        'slug': 'anh-ngo-minh-huy',
        'full_name': 'Anh Ngo Minh Huy',
        'position': 'Designer',
        'short_description': 'Moi trai nghiem vua la mot bai hoc, vua la mot cam xuc rat chan that. Huy theo duoi thiet ke nhu mot cach tiep tuc hanh trinh truong thanh tu Hoa Sen.',
        'company': 'Freelance',
        'education_level': 'Dai hoc',
        'cohort': '2011 - 2015',
        'field': 'Thiet ke sang tao',
        'major': 'Quan tri Kinh doanh',
        'avatar_url': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
        'content_vi': (
            '## Khong nhieu ky vong, nhung du de bat dau\n\n'
            'Nhin lai quang thoi gian nhap hoc, toi khong vao Hoa Sen voi mot dinh nghia ro rang ve su nghiep. Dieu toi co luc do la su to mo va y muon trai nghiem mot moi truong mo, noi minh co the thu suc o nhieu vai tro khac nhau.\n\n'
            '![Ky niem cung ban hoc](https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80)\n\n'
            'Nhung buoi hoc, cac du an nhom va nhung lan tham gia hoat dong ngoai khoa giup toi hieu rang gia tri lon nhat cua truong dai hoc khong nam o mot dap an san co, ma nam o toc do minh hoc cach thich nghi va truong thanh.\n\n'
            '## Mot thoi sinh vien dien ra bang ca trai nghiem va cam xuc\n\n'
            'Tai Hoa Sen, toi duoc tiep xuc voi cach hoc de mo, noi sinh vien duoc khuyen khich dat cau hoi, thu nghiem va tu tim cach dinh hinh con duong rieng. Moi lan thuyet trinh, moi lan nhan feedback va moi lan lam viec cung ban hoc deu day toi tien xa hon mot chut.\n\n'
            '![Hoat dong tap the](https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1600&q=80)\n\n'
            'Khoang thoi gian do de lai trong toi mot thoi quen rat quan trong: xem moi tinh huong la mot bai toan can duoc giai bang su quan sat va su ki luat. Ve sau, day cung la cach toi tiep can cong viec thiet ke.\n\n'
            '## Re huong sang thiet ke mot cach tu nhien\n\n'
            'Cong viec hien tai cua toi la designer, nhung neu nhin sau hon, do khong phai mot cuoc re ngang bat ngo. Tu nhung nam o Hoa Sen, toi da duoc ren kha nang quan sat, ke cau chuyen va sap xep thong tin ro rang.\n\n'
            'Thiet ke voi toi khong chi la dep. Do la cach bien mot thong diep mo ho thanh trai nghiem de hieu, de nho va de ket noi. Va o mot muc do nao do, hanh trinh nay da bat dau ngay tu nhung ngay dau tien o Hoa Sen.'
        ),
        'content_en': (
            '## Starting with curiosity\n\n'
            'I did not enter university with a fixed career plan. What I had was curiosity and a willingness to explore. Hoa Sen gave me an environment where experimentation was not a distraction, but part of learning itself.\n\n'
            '## A student journey shaped by real experiences\n\n'
            'Coursework, team projects and extracurricular activities helped me understand that growth often comes from feedback, repetition and reflection. Those habits later became essential in my design practice.\n\n'
            '## Design as a continuation of that journey\n\n'
            'Today I work in design, but the transition feels natural. The way I observe people, structure information and turn ideas into clear experiences started during my years at Hoa Sen.'
        ),
        'gallery_images': [
            'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1600&q=80',
        ],
        'sort_order': 1,
        'seo_title': 'Anh Ngo Minh Huy | Cong dong Cuu Sinh vien Hoa Sen',
        'seo_description': 'Hanh trinh tu sinh vien Hoa Sen den cong viec designer tu do, noi moi trai nghiem tro thanh nen tang cho su truong thanh nghe nghiep.',
        'published_at': published_at(5),
    },
    {
        'slug': 'anh-phan-duc-tho',
        'full_name': 'Anh Phan Duc Tho',
        'position': 'Thiet ke thoi trang',
        'short_description': 'Tinh ky luat trong sang tao, kha nang quan sat tinh te va su ben bi trong qua trinh hoc giup Tho theo duoi hanh trinh thiet ke mot cach ben vung.',
        'company': 'Studio Doc Lap',
        'education_level': 'Dai hoc',
        'cohort': '2012 - 2016',
        'field': 'Thoi trang',
        'major': 'Thiet ke thoi trang',
        'avatar_url': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80',
        'content_vi': (
            '## Hoc cach ky luat trong mot moi truong sang tao\n\n'
            'Thiet ke khong chi bat dau tu cam hung. No bat dau tu viec quan sat, lap di lap lai va kien tri voi tung chi tiet nho. Hoa Sen cho toi khong gian de ren luyen dieu do tu rat som.\n\n'
            '![Hoc tap va thuc hanh](https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80)\n\n'
            'Tu bai tap tren lop den cac du an thuc hanh, toi hoc cach ton trong quy trinh va nhin mot san pham sang tao nhu mot he thong can duoc cham chut tu tong the den chi tiet.\n\n'
            '## Tu classroom den studio\n\n'
            'Sau khi tot nghiep, toi tiep tuc con duong thiet ke thoi trang. Nhung gia tri toi mang theo khong chi la ky nang chuyen mon, ma con la thai do lam nghe: biet lang nghe, biet nghiem tuc va biet kien nhan voi chat luong.\n\n'
            '![Cong viec studio](https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80)\n\n'
            'Nhung dieu do giup toi di duong dai hon trong mot linh vuc can rat nhieu su ben bi.'
        ),
        'content_en': '',
        'gallery_images': [
            'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80',
        ],
        'sort_order': 2,
        'seo_title': 'Anh Phan Duc Tho | Cong dong Cuu Sinh vien Hoa Sen',
        'seo_description': 'Cau chuyen ve tinh ky luat, su ben bi va hanh trinh theo duoi thiet ke thoi trang tu nen tang Hoa Sen.',
        'published_at': published_at(8),
    },
    {
        'slug': 'anh-nguyen-huu-phat',
        'full_name': 'Anh Nguyen Huu Phat',
        'position': 'Cong nghe thong tin',
        'short_description': 'Giao duc chi thanh cong khi co kha nang bien kien thuc thanh hanh dong. Phat tiep tuc xay dung su nghiep cong nghe tren nen tang tu duy do.',
        'company': 'Tech Forward',
        'education_level': 'Dai hoc',
        'cohort': '2010 - 2014',
        'field': 'Cong nghe',
        'major': 'Cong nghe thong tin',
        'avatar_url': 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=1200&q=80',
        'content_vi': (
            '## Bien kien thuc thanh hanh dong\n\n'
            'Dieu toi nho nhat tu thoi gian hoc tai Hoa Sen la tinh than hoc de lam. Moi kien thuc, neu dung lai o muc do ly thuyet, se rat kho tao ra gia tri that su ngoai doi song.\n\n'
            '![Lam du an nhom](https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80)\n\n'
            'Chinh vi vay, trong moi mon hoc va moi du an, toi luon co xu huong dat cau hoi: minh se ap dung dieu nay vao dau, va no giai quyet duoc van de nao?\n\n'
            '## Tu duy he thong duoc hinh thanh nhu the nao\n\n'
            'Moi truong hoc tap o Hoa Sen day toi cach nhin mot van de theo he thong. Tu yeu cau nguoi dung, quy trinh van hanh den goc nhin kinh doanh, tat ca deu can duoc dat vao cung mot boi canh.\n\n'
            '![Su kien cong dong](https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80)\n\n'
            'Hom nay, trong cong viec cong nghe, toi van mang theo cach nghi do: ro muc tieu, ro nguoi dung va ro cach tao ra tac dong thuc te.'
        ),
        'content_en': '',
        'gallery_images': [
            'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80',
        ],
        'sort_order': 3,
        'seo_title': 'Anh Nguyen Huu Phat | Cong dong Cuu Sinh vien Hoa Sen',
        'seo_description': 'Cau chuyen cua mot alumni CNTT luon tim cach bien kien thuc thanh hanh dong va gia tri thuc te.',
        'published_at': published_at(10),
    },
]

SEED_NEWS_CATEGORIES = [
    {
        'name': 'Hoạt động HSU',
        'slug': 'hoat-dong-hsu',
        'description': 'Tin tức về hoạt động chính thức của Đại học Hoa Sen.',
        'sort_order': 1,
    },
    {
        'name': 'Hoạt động Alumni',
        'slug': 'hoat-dong-alumni',
        'description': 'Tin tức về hoạt động của cộng đồng cựu sinh viên Hoa Sen.',
        'sort_order': 2,
    },
    {
        'name': 'Hợp tác doanh nghiệp',
        'slug': 'hop-tac-doanh-nghiep',
        'description': 'Hoạt động hợp tác với doanh nghiệp và đối tác.',
        'sort_order': 3,
    },
    {
        'name': 'Kết nối cộng đồng',
        'slug': 'ket-noi-cong-dong',
        'description': 'Các chương trình gắn kết cộng đồng, sinh viên và alumni.',
        'sort_order': 4,
    },
]

SEED_NEWS_POSTS = [
    {
        'slug': 'cuoc-thi-hoa-sen-ky-uc-trong-toi',
        'title': 'Cuộc thi “Hoa Sen – Ký ức trong tôi”: Kết nối những mảnh ghép ký ức trong hành trình 35 năm Hoa Sen',
        'category_slug': 'hoat-dong-alumni',
        'excerpt': '35 năm hình thành và phát triển, Đại học Hoa Sen được dệt nên từ những trải nghiệm rất riêng của nhiều thế hệ người học, giảng viên và cán bộ nhân viên.',
        'thumbnail_url': '/branding/home/hoa-sen-ky-uc-trong-toi.png',
        'content_vi': (
            '## Nội dung cuộc thi\n\n'
            'Cuộc thi “Hoa Sen – Ký ức trong tôi” mở ra cơ hội để ghi lại những trải nghiệm đáng nhớ, những cột mốc quan trọng và các câu chuyện gắn bó với Đại học Hoa Sen trong suốt 35 năm hình thành.\n\n'
            '![Poster cuộc thi](/branding/home/hoa-sen-ky-uc-trong-toi.png)\n\n'
            '### Thông tin cuộc thi\n\n'
            '- Chủ đề: 35 năm Hoa Sen – Gửi lại một miền ký ức\n'
            '- Đối tượng tham gia: Giảng viên, sinh viên, cựu sinh viên, cán bộ nhân viên và đối tác.\n'
            '- Hình thức dự thi: Bài viết, hình ảnh hoặc video.\n\n'
            '### Giá trị chương trình\n\n'
            'Không chỉ là một cuộc thi, đây còn là dịp để cộng đồng Hoa Sen nhìn lại hành trình phát triển và lưu giữ những câu chuyện giàu cảm xúc qua nhiều thế hệ.'
        ),
        'content_en': '',
        'gallery_images': ['/branding/home/hoa-sen-ky-uc-trong-toi.png'],
        'is_featured': True,
        'sort_order': 1,
        'seo_title': 'Cuộc thi Hoa Sen – Ký ức trong tôi',
        'seo_description': 'Thông tin về cuộc thi kết nối ký ức cộng đồng Hoa Sen trong hành trình 35 năm phát triển.',
        'og_image_url': '/branding/home/hoa-sen-ky-uc-trong-toi.png',
        'published_at': published_at(9),
    },
    {
        'slug': 'alumni-concert-homecoming-2026',
        'title': 'Alumni Concert – Hoa Sen Homecoming 2026: Trở về với ký ức, kết nối các thế hệ',
        'category_slug': 'hoat-dong-alumni',
        'excerpt': 'Một đêm gặp gỡ giàu cảm xúc, nơi alumni nhiều thế hệ cùng trở về, kết nối và chia sẻ những ký ức đáng nhớ.',
        'thumbnail_url': 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
        'content_vi': 'Alumni Concert là không gian kết nối giữa nhiều thế hệ cựu sinh viên, nơi âm nhạc trở thành chất keo gắn kết những câu chuyện và hành trình trưởng thành khác nhau.',
        'content_en': '',
        'gallery_images': ['https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80'],
        'is_featured': False,
        'sort_order': 2,
        'seo_title': 'Alumni Concert – Hoa Sen Homecoming 2026',
        'seo_description': 'Thông tin về chương trình Alumni Concert trong khuôn khổ Hoa Sen Homecoming 2026.',
        'og_image_url': 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
        'published_at': published_at(24),
    },
    {
        'slug': 'cuu-sinh-vien-thiet-ke-do-hoa-dat-giai',
        'title': 'Cựu sinh viên Thiết kế Đồ họa đoạt giải “Thiết kế được chọn” tại cuộc thi Thiết kế',
        'category_slug': 'hoat-dong-alumni',
        'excerpt': 'Một dấu ấn mới của alumni Hoa Sen trong lĩnh vực sáng tạo, cho thấy năng lực bền bỉ và tư duy thị giác hiện đại.',
        'thumbnail_url': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
        'content_vi': 'Giải thưởng là kết quả của quá trình học tập và thực hành nghiêm túc, đồng thời tiếp thêm cảm hứng cho sinh viên đương nhiệm.',
        'content_en': '',
        'gallery_images': ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80'],
        'is_featured': False,
        'sort_order': 3,
        'seo_title': 'Cựu sinh viên Thiết kế Đồ họa đạt giải',
        'seo_description': 'Câu chuyện thành công của alumni Thiết kế Đồ họa Hoa Sen với giải thưởng mới trong lĩnh vực sáng tạo.',
        'og_image_url': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
        'published_at': published_at(191),
    },
    {
        'slug': 'lien-hiep-cac-hoi-unesco-vinh-danh',
        'title': 'Liên hiệp các hội UNESCO thế giới vinh danh Trường Đại học Hoa Sen dẫn đầu',
        'category_slug': 'hoat-dong-hsu',
        'excerpt': 'Dấu mốc quan trọng khẳng định vị thế học thuật và năng lực hội nhập của Hoa Sen trong các hoạt động quốc tế.',
        'thumbnail_url': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
        'content_vi': 'Tin vui này là kết quả từ nhiều nỗ lực phát triển chương trình đào tạo, nghiên cứu và kết nối cộng đồng quốc tế.',
        'content_en': '',
        'gallery_images': [],
        'is_featured': False,
        'sort_order': 4,
        'seo_title': 'Hoa Sen được vinh danh bởi Liên hiệp các hội UNESCO thế giới',
        'seo_description': 'Dấu mốc ghi nhận uy tín của Đại học Hoa Sen trên hành trình phát triển chất lượng và hội nhập quốc tế.',
        'og_image_url': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
        'published_at': published_at(193),
    },
    {
        'slug': 'hsu-ky-ket-hop-tac-voi-doanh-nghiep',
        'title': 'HSU ký kết hợp tác với 20 doanh nghiệp, mở rộng cơ hội học tập và nghề nghiệp cho sinh viên',
        'category_slug': 'hop-tac-doanh-nghiep',
        'excerpt': 'Chuỗi ký kết mới tập trung vào cơ hội thực tập, mentoring và kết nối việc làm cho sinh viên và alumni.',
        'thumbnail_url': 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
        'content_vi': 'Chương trình hợp tác hướng tới việc rút ngắn khoảng cách giữa đào tạo và nhu cầu doanh nghiệp, đồng thời mở rộng mạng lưới kết nối cho cộng đồng HSU.',
        'content_en': '',
        'gallery_images': [],
        'is_featured': False,
        'sort_order': 5,
        'seo_title': 'HSU ký kết hợp tác với doanh nghiệp',
        'seo_description': 'Các doanh nghiệp đồng hành cùng HSU để mở rộng cơ hội học tập, thực tập và nghề nghiệp.',
        'og_image_url': 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
        'published_at': published_at(193),
    },
    {
        'slug': 'dem-nhac-hoa-sen-tri-an',
        'title': 'Đêm nhạc “Hoa Sen tri ân – Hòa nhịp yêu thương”: Bản giao hưởng của giai điệu, sự tri ân và kết nối',
        'category_slug': 'ket-noi-cong-dong',
        'excerpt': 'Chương trình nghệ thuật tạo nên không gian sẻ chia, tri ân và kết nối các thế hệ cộng đồng Hoa Sen.',
        'thumbnail_url': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
        'content_vi': 'Đêm nhạc kết hợp biểu diễn và hoạt động cộng đồng, mang lại trải nghiệm cảm xúc và tạo thêm điểm chạm giữa sinh viên, cựu sinh viên và đối tác.',
        'content_en': '',
        'gallery_images': [],
        'is_featured': False,
        'sort_order': 6,
        'seo_title': 'Đêm nhạc Hoa Sen tri ân – Hòa nhịp yêu thương',
        'seo_description': 'Thông tin về đêm nhạc kết nối cộng đồng Hoa Sen với tinh thần tri ân và đồng hành.',
        'og_image_url': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
        'published_at': published_at(194),
    },
]

SEED_EVENTS = [
    {
        'slug': 'hsu-alumni-meeting-2025-ngay-tro-ve-cua-cuu-sinh-vien-khoa-ngon-ngu-tam-ly',
        'title': 'HSU Alumni Meeting 2025: Ngày trở về của Cựu sinh viên Khoa Ngôn ngữ – Tâm lý',
        'excerpt': 'Sự kiện gặp gỡ nhiều thế hệ alumni khoa Ngôn ngữ – Tâm lý tại campus Nguyễn Văn Tráng với không gian chia sẻ và kết nối giàu cảm xúc.',
        'banner_url': '/branding/home/cong-dong-cuu-sinh-vien-hoa-sen-2.jpg',
        'start_date_time': timezone.now() + timedelta(days=12, hours=8),
        'end_date_time': timezone.now() + timedelta(days=12, hours=11),
        'location': 'Hội trường 204 - Trụ sở Nguyễn Văn Tráng',
        'content_vi': (
            '## Alumni Meeting 2025\n\n'
            'Sự kiện là điểm hẹn để các thế hệ alumni cùng trở về, gặp gỡ giảng viên, bạn học và nhìn lại những dấu mốc trưởng thành đáng nhớ.\n\n'
            '![Banner sự kiện](/branding/home/cong-dong-cuu-sinh-vien-hoa-sen-2.jpg)\n\n'
            '### Nội dung nổi bật\n\n'
            '- Chia sẻ hành trình nghề nghiệp từ các alumni khách mời\n'
            '- Kết nối mentor – mentee giữa alumni và sinh viên\n'
            '- Khu vực check-in, networking và trưng bày kỷ niệm khóa\n\n'
            '### Lưu ý tham gia\n\n'
            'Người tham dự vui lòng đăng ký trước để ban tổ chức chuẩn bị thông tin đón tiếp và chỗ ngồi phù hợp.'
        ),
        'content_en': '',
        'registration_url': 'https://forms.gle/',
        'gallery_images': ['/branding/home/cong-dong-cuu-sinh-vien-hoa-sen-2.jpg'],
        'is_featured': True,
        'sort_order': 1,
        'seo_title': 'HSU Alumni Meeting 2025',
        'seo_description': 'Ngày trở về của cựu sinh viên khoa Ngôn ngữ – Tâm lý với chuỗi hoạt động kết nối, chia sẻ và networking.',
        'og_image_url': '/branding/home/cong-dong-cuu-sinh-vien-hoa-sen-2.jpg',
        'published_at': published_at(2),
    },
    {
        'slug': 'career-webinar-alumni-2025',
        'title': 'Career Webinar Alumni 2025: Tái thiết hồ sơ nghề nghiệp trong kỷ nguyên AI',
        'excerpt': 'Buổi webinar trực tuyến dành cho alumni đang muốn nâng cấp CV, portfolio và chiến lược nghề nghiệp.',
        'banner_url': 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
        'start_date_time': timezone.now() + timedelta(days=20, hours=5),
        'end_date_time': timezone.now() + timedelta(days=20, hours=7),
        'location': 'Online qua Zoom',
        'content_vi': 'Webinar tập trung vào cách tái cấu trúc hồ sơ nghề nghiệp, xây dựng câu chuyện cá nhân và tận dụng công cụ AI trong tìm việc.',
        'content_en': '',
        'registration_url': 'https://forms.gle/',
        'gallery_images': [],
        'is_featured': False,
        'sort_order': 2,
        'seo_title': 'Career Webinar Alumni 2025',
        'seo_description': 'Webinar dành cho alumni muốn tối ưu hồ sơ nghề nghiệp và định vị cá nhân trong bối cảnh AI.',
        'og_image_url': 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
        'published_at': published_at(5),
    },
    {
        'slug': 'homecoming-2024',
        'title': 'Hoa Sen Homecoming 2024: Những khoảnh khắc kết nối liên khóa',
        'excerpt': 'Sự kiện homecoming năm trước đã ghi lại những khoảnh khắc hội ngộ đáng nhớ của nhiều thế hệ Hoa Sen.',
        'banner_url': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
        'start_date_time': timezone.now() - timedelta(days=160, hours=5),
        'end_date_time': timezone.now() - timedelta(days=160, hours=2),
        'location': 'HSU Campus',
        'content_vi': 'Homecoming 2024 để lại nhiều ấn tượng với chuỗi hoạt động gặp gỡ, networking và các phiên chia sẻ chuyên đề dành cho cộng đồng alumni.',
        'content_en': '',
        'registration_url': '',
        'gallery_images': ['https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80'],
        'is_featured': False,
        'sort_order': 3,
        'seo_title': 'Hoa Sen Homecoming 2024',
        'seo_description': 'Những khoảnh khắc đáng nhớ tại sự kiện Hoa Sen Homecoming 2024.',
        'og_image_url': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
        'published_at': published_at(170),
    },
]


def seed_pages():
    count = 0
    for item in SEED_PAGES:
        Article.objects.update_or_create(
            slug=item['slug'],
            defaults={
                'title': item['title'],
                'excerpt': item['excerpt'],
                'body': item['body'],
                'article_type': Article.ArticleType.PAGE,
                'status': PublishableModel.Status.PUBLISHED,
                'published_at': published_at(1),
                'external_url': '',
            },
        )
        count += 1
    return count


def seed_articles():
    count = 0
    for item in SEED_ARTICLES:
        Article.objects.update_or_create(
            slug=item['slug'],
            defaults={
                'title': item['title'],
                'excerpt': item['excerpt'],
                'body': item['body'],
                'article_type': item['article_type'],
                'status': PublishableModel.Status.PUBLISHED,
                'published_at': item['published_at'],
                'external_url': '',
            },
        )
        count += 1
    return count


def seed_stories():
    count = 0
    for item in SEED_STORIES:
        AlumniStory.objects.update_or_create(
            slug=item['slug'],
            defaults={
                'title': item['title'],
                'story_category': item['story_category'],
                'alumni_name': item['alumni_name'],
                'company_name': item['company_name'],
                'role_title': item['role_title'],
                'excerpt': item['excerpt'],
                'body': item['body'],
                'featured_image_url': item['featured_image_url'],
                'status': PublishableModel.Status.PUBLISHED,
                'published_at': item['published_at'],
            },
        )
        count += 1
    return count


def seed_gallery():
    count = 0
    for item in SEED_GALLERY:
        GalleryItem.objects.update_or_create(
            title=item['title'],
            defaults={
                'album_name': item['album_name'],
                'description': item['description'],
                'image_url': item['image_url'],
                'drive_url': item['drive_url'],
                'contributor_name': item['contributor_name'],
                'status': PublishableModel.Status.PUBLISHED,
                'published_at': item['published_at'],
            },
        )
        count += 1
    return count


def seed_alumni_posts():
    count = 0
    for item in SEED_ALUMNI_POSTS:
        AlumniPost.objects.update_or_create(
            slug=item['slug'],
            defaults={
                'full_name': item['full_name'],
                'position': item['position'],
                'short_description': item['short_description'],
                'company': item['company'],
                'education_level': item['education_level'],
                'cohort': item['cohort'],
                'field': item['field'],
                'major': item['major'],
                'avatar_url': item['avatar_url'],
                'content_vi': item['content_vi'],
                'content_en': item['content_en'],
                'gallery_images': item['gallery_images'],
                'status': PublishableModel.Status.PUBLISHED,
                'sort_order': item['sort_order'],
                'seo_title': item['seo_title'],
                'seo_description': item['seo_description'],
                'published_at': item['published_at'],
            },
        )
        count += 1
    return count


def seed_news_categories():
    count = 0
    for item in SEED_NEWS_CATEGORIES:
        NewsCategory.objects.update_or_create(
            slug=item['slug'],
            defaults={
                'name': item['name'],
                'description': item['description'],
                'sort_order': item['sort_order'],
                'status': NewsCategory.Status.PUBLISHED,
            },
        )
        count += 1
    return count


def seed_news_posts():
    count = 0
    categories = {category.slug: category for category in NewsCategory.objects.all()}
    for item in SEED_NEWS_POSTS:
        NewsPost.objects.update_or_create(
            slug=item['slug'],
            defaults={
                'title': item['title'],
                'category': categories[item['category_slug']],
                'excerpt': item['excerpt'],
                'thumbnail_url': item['thumbnail_url'],
                'content_vi': item['content_vi'],
                'content_en': item['content_en'],
                'gallery_images': item['gallery_images'],
                'status': PublishableModel.Status.PUBLISHED,
                'is_featured': item['is_featured'],
                'sort_order': item['sort_order'],
                'published_at': item['published_at'],
                'seo_title': item['seo_title'],
                'seo_description': item['seo_description'],
                'og_image_url': item['og_image_url'],
            },
        )
        count += 1
    return count


def seed_events():
    count = 0
    for item in SEED_EVENTS:
        Event.objects.update_or_create(
            slug=item['slug'],
            defaults={
                'title': item['title'],
                'excerpt': item['excerpt'],
                'banner_url': item['banner_url'],
                'start_date_time': item['start_date_time'],
                'end_date_time': item['end_date_time'],
                'location': item['location'],
                'content_vi': item['content_vi'],
                'content_en': item['content_en'],
                'registration_url': item['registration_url'],
                'gallery_images': item['gallery_images'],
                'status': PublishableModel.Status.PUBLISHED,
                'is_featured': item['is_featured'],
                'sort_order': item['sort_order'],
                'published_at': item['published_at'],
                'seo_title': item['seo_title'],
                'seo_description': item['seo_description'],
                'og_image_url': item['og_image_url'],
            },
        )
        count += 1
    return count


def main():
    page_count = seed_pages()
    article_count = seed_articles()
    story_count = seed_stories()
    gallery_count = seed_gallery()
    alumni_count = seed_alumni_posts()
    news_category_count = seed_news_categories()
    news_post_count = seed_news_posts()
    event_count = seed_events()

    print(
        {
            'pages_seeded': page_count,
            'articles_seeded': article_count,
            'stories_seeded': story_count,
            'gallery_seeded': gallery_count,
            'alumni_posts_seeded': alumni_count,
            'news_categories_seeded': news_category_count,
            'news_posts_seeded': news_post_count,
            'events_seeded': event_count,
        }
    )


if __name__ == '__main__':
    main()