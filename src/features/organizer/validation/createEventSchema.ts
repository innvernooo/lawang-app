import * as z from 'zod';
import { categories } from '../components/categories';
import { cities } from '@/utils/cities';

const emptyToUndefined = (v: unknown) =>
  typeof v === 'string' && v.trim() === '' ? undefined : v;
const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const dateTime = (label: string) =>
  z.iso
    .datetime({
      local: true,
      message: `${label} must be a valid date and time`,
    })
    .transform((v) => new Date(v));

export const createEventSchema = z
  .object({
    profilePicture: z
      .custom<FileList | undefined>()
      .refine(
        (file) => !file?.length || file[0].size > MAX_FILE_SIZE,
        'Ukuran foto maksimal 5 MB',
      )
      .refine(
        (file) => !file?.length || ALLOWED_TYPES.includes(file[0].type),
        'Foto harus berformat JPG, PNG, atau WEBP',
      ),

    name: z
      .string()
      .trim()
      .min(1, 'Event name is required')
      .max(200, 'Maximum input is 200 characters'),

    description: z.string().trim().min(1, 'Event description is required'),

    category: z.enum(categories, 'Pick one of the categories'),

    city: z.enum(cities, 'Pick one of the cities'),

    venue: z
      .string()
      .min(1, 'Event venue is required')
      .max(200, 'Maximum input is 200 characters'),

    pricingType: z.enum(['PAID', 'FREE'], 'Event can only be PAID or FREE'),

    startDate: dateTime('Start date').refine(
      (d) => d.getTime() > Date.now(),
      'Start date must be in the future',
    ),

    endDate: dateTime('End date'),

    totalSeats: z.preprocess(
      emptyToUndefined,
      z.coerce
        .number('Total seats must be a number')
        .pipe(
          z
            .int32('Total seats must be a whole number')
            .min(1, 'Total seats must be at least 1'),
        ),
    ),
  })
  .refine((d) => d.endDate > d.startDate, {
    message: 'End date must be after the start date',
    path: ['endDate'],
  });

export type CreateEventInput = z.input<typeof createEventSchema>;
export type CreateEventOutput = z.output<typeof createEventSchema>;
