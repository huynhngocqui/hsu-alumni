import { z } from 'zod';

export const registerSchema = z
  .object({
    full_name: z.string().trim().min(2, 'Bắt buộc nhập họ và tên lót.'),
    last_name: z.string().trim().min(1, 'Bắt buộc nhập tên.'),
    email: z.string().trim().email('Email không hợp lệ.'),
    phone_number: z.string().trim().regex(/^\d{10,11}$/, 'Số điện thoại phải có 10-11 chữ số.'),
    identity_id: z.string().trim().regex(/^(\d{9}|\d{12})$/, 'CCCD/CMND phải có 9 hoặc 12 chữ số.'),
    student_id: z.string().trim().min(6, 'Mã số sinh viên phải có ít nhất 6 ký tự.'),
    major: z.string().trim().min(2, 'Bắt buộc nhập ngành học.'),
    academic_degree: z.string().trim().min(2, 'Bắt buộc nhập bậc đào tạo.'),
    mode_of_study: z.string().trim().min(2, 'Bắt buộc nhập hệ đào tạo.'),
    intake_year: z.coerce.number().int().min(1990, 'Năm nhập học không hợp lệ.'),
    graduation_year: z.coerce.number().int().min(1990, 'Năm tốt nghiệp không hợp lệ.'),
  })
  .superRefine((values, ctx) => {
    if (values.graduation_year < values.intake_year) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['graduation_year'],
        message: 'Năm tốt nghiệp phải lớn hơn hoặc bằng năm nhập học.',
      });
    }
  });