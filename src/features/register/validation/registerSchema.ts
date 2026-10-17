import * as z from 'zod';

const emptyToUndefined = (v: unknown) =>
  typeof v === 'string' && v.trim() === '' ? undefined : v;
const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const registerSchema = z
  .object({
    profilePictureUrl: z
      .custom<FileList | undefined>()
      .refine(
        (files) => !files?.length || files[0].size <= MAX_FILE_SIZE,
        'Ukuran foto maksimal 5 MB',
      )
      .refine(
        (files) => !files?.length || ALLOWED_TYPES.includes(files[0].type),
        'Foto harus berformat JPG, PNG, atau WEBP',
      ),
    name: z
      .string()
      .trim()
      .min(1, 'Fullname input is required')
      .max(100, 'Fullname input has maximum 100 characters'),
    username: z
      .string()
      .trim()
      .min(5, 'Username input is required, minimum 5 characters')
      .max(50, 'Username input has maximum 50 characters'),
    email: z
      .email('Invalid email format')
      .trim()
      .max(255, 'Email input has maximum 255 characters'),
    password: z
      .string()
      .min(8, 'Password input is required, minimum 8 characters')
      .max(15, 'Password input has maximum 15 characters'),
    phoneNumber: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .trim()
        .max(20, 'Phone number input has maximum 20 characters')
        .regex(/^\+?[0-9]+$/, 'Phone number must contain digits only')
        .optional(),
    ),
    referralCode: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .trim()
        .length(12, 'Referral code must be 12 characters')
        .optional(),
    ),
    role: z
      .enum(['CUSTOMER', 'ORGANIZER'], 'Role must be CUSTOMER or ORGANIZER')
      .optional(),
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Konfirmasi password tidak sama',
  });

export type RegisterInput = z.input<typeof registerSchema>;
export type RegisterRequest = z.output<typeof registerSchema>;
