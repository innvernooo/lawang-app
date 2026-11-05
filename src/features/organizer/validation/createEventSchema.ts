import * as z from 'zod';
import { categories } from '../../../utils/categories';
import { cities } from '@/utils/cities';

const emptyToUndefined = (v: unknown) =>
  typeof v === 'string' && v.trim() === '' ? undefined : v;
const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const dateTime = (label: string) =>
  z.iso
    .datetime({
      local: true,
      offset: true,
      message: `${label} harus berupa tanggal dan waktu yang valid`,
    })
    .pipe(z.coerce.date());

export const createEventSchema = z
  .object({
    imageUrl: z
      .custom<FileList | undefined>()
      .refine(
        (file) => !file?.length || file[0].size <= MAX_FILE_SIZE,
        'Ukuran foto maksimal 5 MB',
      )
      .refine(
        (file) => !file?.length || ALLOWED_TYPES.includes(file[0].type),
        'Foto harus berformat JPG, PNG, atau WEBP',
      ),

    name: z
      .string()
      .trim()
      .min(1, 'Nama event wajib diisi')
      .max(200, 'Maksimal 200 karakter'),

    description: z.string().trim().min(1, 'Deskripsi event wajib diisi'),

    category: z.enum(
      categories.map(({ cat }) => cat),
      'Pilih salah satu kategori',
    ),

    city: z.enum(cities, 'Pilih salah satu kota'),

    venue: z
      .string()
      .min(1, 'Lokasi event wajib diisi')
      .max(200, 'Maksimal 200 karakter'),

    pricingType: z.enum(
      ['PAID', 'FREE'],
      'Pilih jenis harga: Berbayar atau Gratis',
    ),

    startDate: dateTime('Tanggal mulai').refine(
      (d) => d.getTime() > Date.now(),
      'Tanggal mulai harus setelah waktu sekarang',
    ),

    endDate: dateTime('Tanggal selesai'),

    totalSeats: z.preprocess(
      emptyToUndefined,
      z.coerce
        .number('Jumlah kursi harus berupa angka')
        .pipe(
          z
            .int32('Jumlah kursi harus bilangan bulat')
            .min(1, 'Jumlah kursi minimal 1'),
        ),
    ),
  })
  .refine((d) => d.endDate > d.startDate, {
    message: 'Tanggal selesai harus setelah tanggal mulai',
    path: ['endDate'],
  });

export type CreateEventInput = z.input<typeof createEventSchema>;
export type CreateEventOutput = z.output<typeof createEventSchema>;
