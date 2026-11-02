import * as z from 'zod';

const emptyToUndefined = (v: unknown) =>
  typeof v === 'string' && v.trim() === '' ? undefined : v;

const dateTime = (label: string) =>
  z.iso
    .datetime({
      local: true,
      offset: true,
      message: `${label} must be a valid date-time`,
    })
    .pipe(z.coerce.date());

export const addTicketTypeSchema = z.object({
  name: z
    .string()
    .min(1, 'Ticket type is required')
    .max(100, 'Maximum input is 100 characters'),

  price: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number('Price must be a number')
      .int('Price must be a whole number')
      .min(0, 'Ticket price is required')
      .max(2000000000, 'Price is too large'),
  ),

  quota: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number('Quota must be a number')
      .int('Quota must be a whole number')
      .min(1, 'Event price is required')
      .max(10000, 'Maximum quota is 1000'),
  ),

  endSale: z.preprocess(emptyToUndefined, dateTime('End sale').optional()),
});

export type TicketTypeInput = z.input<typeof addTicketTypeSchema>;
export type TicketTypeOutput = z.output<typeof addTicketTypeSchema>;
