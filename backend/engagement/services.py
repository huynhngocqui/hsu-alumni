from django.contrib.auth import get_user_model
from django.utils import timezone

from coop.repositories import get_coop_repository
from jobs.repositories import get_job_repository

from .models import Notification

User = get_user_model()


def _normalize_tags(values):
    return {str(value).strip().lower() for value in values or [] if str(value).strip()}


def _build_overlap(user_tags, listing_tags):
    overlap = sorted(_normalize_tags(user_tags) & _normalize_tags(listing_tags))
    return overlap


def _create_notification(user, notification_type, title, message, url='', payload=None):
    return Notification.objects.create(
        user=user,
        notification_type=notification_type,
        title=title,
        message=message,
        url=url,
        payload=payload or {},
    )


def _match_users_for_listing(listing, exclude_user_id, require_job_seeking=False):
    queryset = User.objects.filter(
        is_active=True,
        account_status=User.AccountStatus.ACTIVE,
    ).exclude(id=exclude_user_id)

    if require_job_seeking:
        queryset = queryset.filter(job_seeking_status=True)

    matches = []
    for candidate in queryset:
        overlap = _build_overlap(candidate.interest_tags, listing.get('category_tags', []))
        if overlap:
            matches.append((candidate, overlap))

    matches.sort(key=lambda item: (-len(item[1]), item[0].email))
    return matches


def notify_job_listing_created(listing, owner):
    matches = _match_users_for_listing(listing, exclude_user_id=owner.id, require_job_seeking=True)
    for candidate, overlap in matches:
        _create_notification(
            candidate,
            Notification.Type.JOB_MATCH,
            f"Việc làm mới phù hợp: {listing['job_name']}",
            f"{listing['company_name']} vừa đăng tuyển {listing['job_position']}. Tags phù hợp: {', '.join(overlap)}.",
            url=f"/viec-lam-ket-noi/hoa-sen-job/{listing['id']}",
            payload={'listing_id': listing['id'], 'matched_tags': overlap},
        )

    if matches:
        _create_notification(
            owner,
            Notification.Type.SYSTEM,
            'Tin tuyển dụng đã được phân phối',
            f"Hệ thống đã tìm thấy {len(matches)} alumni đang tìm việc phù hợp với tin {listing['job_name']}.",
            url=f"/viec-lam-ket-noi/hoa-sen-job/{listing['id']}",
            payload={'listing_id': listing['id'], 'matches_count': len(matches)},
        )


def notify_coop_listing_created(listing, owner):
    matches = _match_users_for_listing(listing, exclude_user_id=owner.id, require_job_seeking=False)
    for candidate, overlap in matches:
        _create_notification(
            candidate,
            Notification.Type.COOP_MATCH,
            f"Co-op mới phù hợp: {listing['name']}",
            f"{listing['business_name']} vừa đăng ưu đãi/dịch vụ mới. Tags phù hợp: {', '.join(overlap)}.",
            url=f"/dich-vu-alumni/hoa-sen-coop/{listing['id']}",
            payload={'listing_id': listing['id'], 'matched_tags': overlap},
        )

    if matches:
        _create_notification(
            owner,
            Notification.Type.SYSTEM,
            'Bài Co-op đã được gửi tới đúng tệp quan tâm',
            f"Hệ thống đã tìm thấy {len(matches)} alumni có tag phù hợp với bài Co-op {listing['name']}.",
            url=f"/dich-vu-alumni/hoa-sen-coop/{listing['id']}",
            payload={'listing_id': listing['id'], 'matches_count': len(matches)},
        )


def notify_job_application_created(listing, applicant, application):
    try:
        owner_id = int(listing['owner'])
    except (TypeError, ValueError):
        owner_id = None

    owner = User.objects.filter(id=owner_id).first() if owner_id is not None else None
    if owner is not None:
        _create_notification(
            owner,
            Notification.Type.JOB_APPLICATION,
            f"Ứng tuyển mới cho {listing['job_name']}",
            f"{applicant.full_name} ({applicant.email}) vừa ứng tuyển vào tin {listing['job_name']}.",
            url=f"/viec-lam-ket-noi/hoa-sen-job/{listing['id']}",
            payload={
                'listing_id': listing['id'],
                'application_id': application['id'],
                'applicant_id': applicant.id,
                'applicant_name': applicant.full_name,
                'applicant_email': applicant.email,
                'cv_file': application.get('cv_file', ''),
                'cover_note': application.get('cover_note', ''),
            },
        )

    _create_notification(
        applicant,
        Notification.Type.JOB_APPLICATION,
        f"Đã gửi ứng tuyển: {listing['job_name']}",
        'Hệ thống đã ghi nhận hồ sơ của bạn và thông báo tới nhà tuyển dụng.',
        url=f"/viec-lam-ket-noi/hoa-sen-job/{listing['id']}",
        payload={'listing_id': listing['id'], 'application_id': application['id']},
    )


def build_dashboard_matches(user):
    interest_tags = _normalize_tags(user.interest_tags)
    if not interest_tags:
        return {'job_matches': [], 'coop_matches': []}

    job_matches = []
    if user.job_seeking_status:
        for listing in get_job_repository().list_published():
            if listing['owner'] == user.id:
                continue

            overlap = _build_overlap(interest_tags, listing.get('category_tags', []))
            if not overlap:
                continue

            job_matches.append(
                {
                    'id': listing['id'],
                    'title': listing['job_name'],
                    'subtitle': f"{listing['company_name']} · {listing['job_position']}",
                    'matched_tags': overlap,
                    'score': len(overlap),
                    'url': f"/viec-lam-ket-noi/hoa-sen-job/{listing['id']}",
                    'created_at': listing['created_at'],
                }
            )

    coop_matches = []
    for listing in get_coop_repository().list_published():
        if listing['owner'] == user.id:
            continue

        overlap = _build_overlap(interest_tags, listing.get('category_tags', []))
        if not overlap:
            continue

        coop_matches.append(
            {
                'id': listing['id'],
                'title': listing['name'],
                'subtitle': listing['business_name'],
                'matched_tags': overlap,
                'score': len(overlap),
                'url': f"/dich-vu-alumni/hoa-sen-coop/{listing['id']}",
                'created_at': listing['created_at'],
            }
        )

    sort_key = lambda item: (-item['score'], item['title'].lower())
    job_matches.sort(key=sort_key)
    coop_matches.sort(key=sort_key)

    return {
        'job_matches': job_matches[:5],
        'coop_matches': coop_matches[:5],
    }


def mark_notification_as_read(notification):
    if notification.read_at is None:
        notification.read_at = timezone.now()
        notification.save(update_fields=['read_at'])
    return notification


def mark_all_notifications_as_read(user):
    Notification.objects.filter(user=user, read_at__isnull=True).update(read_at=timezone.now())
