import * as z from 'zod';
import { categories } from '../components/categories';
import { cities } from '@/components/cities';

const emptyToUndefined = (v: unknown) =>
  typeof v === 'string' && v.trim() === '' ? undefined : v;

const dateTime = (label: string) =>
  z.iso
    .datetime({
      local: true,
      message: `${label} must be a valid date and time`,
    })
    .transform((v) => new Date(v));

export const createEventSchema = z
  .object({
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

    price: z.preprocess(
      emptyToUndefined,
      z.coerce
        .number('Price must be a number')
        .int('Price must be a whole number')
        .min(1, 'Event price is required')
        .max(2000000000, 'Price is too large'),
    ),

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
