from dataclasses import dataclass


PEOPLESOFT_PROFILES = [
    {
        'peoplesoft_id': 'PS-2018-0001',
        'identity_id': '079203009999',
        'student_id': '20181234',
        'email': 'alumni.nguyen@example.com',
        'full_name': 'Nguyen Thi',
        'last_name': 'An',
        'major': 'Marketing',
        'academic_degree': 'Cử nhân',
        'mode_of_study': 'Chính quy',
        'intake_year': 2018,
        'graduation_year': 2022,
    },
    {
        'peoplesoft_id': 'PS-2019-0002',
        'identity_id': '079203008888',
        'student_id': '20194567',
        'email': 'alumni.tran@example.com',
        'full_name': 'Tran Hoang',
        'last_name': 'Minh',
        'major': 'Information Technology',
        'academic_degree': 'Kỹ sư',
        'mode_of_study': 'Chính quy',
        'intake_year': 2019,
        'graduation_year': 2023,
    },
    {
        'peoplesoft_id': 'PS-2020-0003',
        'identity_id': '079203007777',
        'student_id': '20206789',
        'email': 'alumni.le@example.com',
        'full_name': 'Le Quoc',
        'last_name': 'Bao',
        'major': 'Hospitality Management',
        'academic_degree': 'Cử nhân',
        'mode_of_study': 'Liên thông',
        'intake_year': 2020,
        'graduation_year': 2024,
    },
]


@dataclass
class PeopleSoftLookupError(Exception):
    detail: str
    field: str = 'identity_id'
    code: str = 'peoplesoft_lookup_failed'

    def as_serializer_error(self):
        return {self.field: self.detail}


def lookup_peoplesoft_profile(identity_id='', student_id='', email=''):
    normalized_identity_id = ''.join(character for character in str(identity_id) if character.isdigit())
    normalized_student_id = str(student_id).strip()
    normalized_email = str(email).strip().lower()

    matches = []
    for profile in PEOPLESOFT_PROFILES:
        if normalized_identity_id and profile['identity_id'] == normalized_identity_id:
            matches.append(profile)
            continue
        if normalized_student_id and profile['student_id'] == normalized_student_id:
            matches.append(profile)
            continue
        if normalized_email and profile['email'] == normalized_email:
            matches.append(profile)

    if not matches:
        raise PeopleSoftLookupError(
            detail='No matching PeopleSoft alumni record was found for the provided identifiers.',
            field='identity_id' if normalized_identity_id else 'student_id',
        )

    profile = matches[0]

    if normalized_identity_id and profile['identity_id'] != normalized_identity_id:
        raise PeopleSoftLookupError('Identity ID does not match the PeopleSoft alumni record.')
    if normalized_student_id and profile['student_id'] != normalized_student_id:
        raise PeopleSoftLookupError('Student ID does not match the PeopleSoft alumni record.', field='student_id')
    if normalized_email and profile['email'] != normalized_email:
        raise PeopleSoftLookupError('Email does not match the PeopleSoft alumni record.', field='email')

    return profile.copy()