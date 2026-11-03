import * as z from 'zod';
import { cities } from '@/utils/cities';
import { provinces } from '@/utils/provinces';
import { banks } from '@/utils/banks';

const emptyToUndefined = (v: unknown) =>
  typeof v === 'string' && v.trim() === '' ? undefined : v;
const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const organizerRegisterSchema = z
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
    email: z
      .string()
      .trim()
      .pipe(
        z
          .email('Format email tidak valid')
          .max(150, 'Email maksimal 150 karakter'),
      ),

    username: z
      .string()
      .trim()
      .min(1, 'Nama pengguna wajib diisi')
      .max(50, 'Nama pengguna maksimal 50 karakter'),

    password: z
      .string()
      .min(8, 'Kata sandi minimal 8 karakter')
      .max(255, 'Maksimal 255 karakter'),

    organizerName: z
      .string()
      .min(1, 'Nama Event Organizer wajib diisi')
      .max(150, 'Maksimal 150 karakter'),

    organizerType: z.enum(
      ['INDIVIDUAL', 'COMPANY'],
      'Pilih jenis Event Organizer',
    ),

    legalName: z
      .string()
      .trim()
      .min(1, 'Nama legal wajib diisi')
      .max(200, 'Maksimal 200 karakter'),

    organizerBio: z.preprocess(
      emptyToUndefined,
      z.string().max(2500, 'Maksimal 2500 karakter').optional(),
    ),

    websiteUrl: z.preprocess(
      emptyToUndefined,
      z.string().max(255, 'Maksimal 255 karakter').optional(),
    ),

    instagramUrl: z.preprocess(
      emptyToUndefined,
      z.string().max(255, 'Maksimal 255 karakter').optional(),
    ),

    npwp: z
      .string()
      .trim()
      .regex(/^\+?[0-9]+$/, 'NPWP hanya boleh berisi angka')
      .min(15, 'NPWP minimal 15 digit')
      .max(16, 'NPWP maksimal 16 digit'),

    nib: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .regex(/^[0-9]{13}$/, 'NIB harus 13 digit angka')
        .optional(),
    ),

    picName: z
      .string()
      .min(1, 'Nama penanggung jawab wajib diisi')
      .max(100, 'Maksimal 100 karakter'),

    picNik: z
      .string()
      .trim()
      .regex(/^[0-9]{16}$/, 'NIK harus 16 digit angka'),

    picPhoneNumber: z
      .string()
      .trim()
      .max(20, 'No. ponsel maksimal 20 karakter')
      .regex(/^\+?[0-9]+$/, 'No. ponsel hanya boleh berisi angka'),

    officeAddress: z
      .string()
      .min(1, 'Alamat kantor wajib diisi')
      .max(500, 'Maksimal 500 karakter'),

    city: z.enum(cities, 'Pilih salah satu kota'),

    province: z.enum(provinces, 'Pilih salah satu provinsi'),

    postalCode: z
      .string()
      .trim()
      .regex(/^[0-9]{5}$/, 'Kode pos harus 5 digit angka'),

    bankName: z.enum(banks, 'Pilih salah satu bank'),

    bankAccountNumber: z
      .string()
      .trim()
      .min(1, 'Nomor rekening wajib diisi')
      .max(30, 'Maksimal 30 karakter'),

    bankAccountHolder: z
      .string()
      .trim()
      .min(1, 'Nama pemilik rekening wajib diisi')
      .max(200, 'Maksimal 200 karakter'),
    agree: z.literal(true, 'Kamu harus menyetujui pernyataan ini'),
    confirmPassword: z.string().min(1, 'Konfirmasi kata sandi wajib diisi'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Konfirmasi kata sandi tidak sama',
  });

export type OrganizerRegisterInput = z.input<typeof organizerRegisterSchema>;
export type OrganizerRegisterOutput = z.output<typeof organizerRegisterSchema>;
