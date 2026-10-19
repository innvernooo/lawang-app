import * as z from 'zod';
import { cities } from '@/components/cities';
import { provinces } from '@/components/provinces';
import { banks } from '@/components/banks';

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
          .email('Invalid email format')
          .max(150, 'Email input has maximum 150 characters'),
      ),

    username: z
      .string()
      .trim()
      .min(1, 'Username input is required')
      .max(50, 'Username input has maximum 50 characters'),

    password: z
      .string()
      .min(8, 'Password input has minimum 8 characters')
      .max(255, 'Maximum input has maximum 255 characters'),

    organizerName: z
      .string()
      .min(1, 'Organizer name input is required')
      .max(150, 'Maximum input has maximum 150 characters'),

    organizerType: z.enum(
      ['INDIVIDUAL', 'COMPANY'],
      'Oragnaizer type must be choosen',
    ),

    legalName: z
      .string()
      .trim()
      .min(1, 'Legal Name input is required')
      .max(200, 'Maximum input is 200 characters'),

    organizerBio: z.preprocess(
      emptyToUndefined,
      z.string().max(2500, 'Maximum input is 2500 characters').optional(),
    ),

    websiteUrl: z.preprocess(
      emptyToUndefined,
      z.string().max(255, 'Maximum input is 255 characters').optional(),
    ),

    instagramUrl: z.preprocess(
      emptyToUndefined,
      z.string().max(255, 'Maximum input is 255 characters').optional(),
    ),

    npwp: z
      .string()
      .trim()
      .regex(/^\+?[0-9]+$/, 'NPWP input must contain digits only')
      .min(15, 'Minimum length is 15 characters')
      .max(16, 'Maximum length is 16 characters'),

    nib: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .regex(/^[0-9]{13}$/, 'NIB must be 13 digits')
        .optional(),
    ),

    picName: z
      .string()
      .min(1, 'PIC Name input is required')
      .max(100, 'Maximum input is 100 characters'),

    picNik: z
      .string()
      .trim()
      .regex(/^[0-9]{16}$/, 'NIK must be 16 digits'),

    picPhoneNumber: z
      .string()
      .trim()
      .max(20, 'Phone number input is 20 characters')
      .regex(/^\+?[0-9]+$/, 'Phone number must contain digits only'),

    officeAddress: z
      .string()
      .min(1, 'Office address input is required')
      .max(500, 'Maximum input is 500 characters'),

    city: z.enum(cities, 'Pick one of the cities'),

    province: z.enum(provinces, 'Pick one of the provinces'),

    postalCode: z
      .string()
      .trim()
      .regex(/^[0-9]{5}$/, 'Postal code must be 5 digits'),

    bankName: z.enum(banks, 'Pick one of the banks'),

    bankAccountNumber: z
      .string()
      .trim()
      .min(1, 'Bank account number input is required')
      .max(30, 'Maximum input is 30 characters'),

    bankAccountHolder: z
      .string()
      .trim()
      .min(1, 'Bank account holder input is required')
      .max(200, 'Maximum input is 200 characters'),
    agree: z.literal(true, 'Kamu harus menyetujui pernyataan ini'),
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Konfirmasi password tidak sama',
  });

export type OrganizerRegisterInput = z.input<typeof organizerRegisterSchema>;
export type OrganizerRegisterOutput = z.output<typeof organizerRegisterSchema>;
