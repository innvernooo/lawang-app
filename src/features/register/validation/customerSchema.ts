import * as z from 'zod';

const emptyToUndefined = (v: unknown) =>
  typeof v === 'string' && v.trim() === '' ? undefined : v;
const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const customerRegisterSchema = z
  .object({
    profilePicture: z
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
      .min(1, 'Nama lengkap wajib diisi')
      .max(100, 'Nama lengkap maksimal 100 karakter'),
    username: z
      .string()
      .trim()
      .min(5, 'Nama pengguna wajib diisi, minimal 5 karakter')
      .max(50, 'Nama pengguna maksimal 50 karakter'),
    email: z
      .email('Format email tidak valid')
      .trim()
      .max(255, 'Email maksimal 255 karakter'),

    nik: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .trim()
        .regex(/^[0-9]{16}$/, 'NIK harus 16 digit angka')
        .optional(),
    ),
    password: z
      .string()
      .min(8, 'Kata sandi wajib diisi, minimal 8 karakter')
      .max(15, 'Kata sandi maksimal 15 karakter'),
    phoneNumber: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .trim()
        .max(20, 'No. ponsel maksimal 20 karakter')
        .regex(/^\+?[0-9]+$/, 'No. ponsel hanya boleh berisi angka')
        .optional(),
    ),
    referralCode: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .trim()
        .toUpperCase()
        .length(12, 'Kode referral harus 12 karakter')
        .optional(),
    ),
    confirmPassword: z.string().min(1, 'Konfirmasi kata sandi wajib diisi'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Konfirmasi kata sandi tidak sama',
  });

export type CustomerRegisterInput = z.input<typeof customerRegisterSchema>;
export type CustomerRegisterOutput = z.output<typeof customerRegisterSchema>;
