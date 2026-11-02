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

export const createVoucherSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*-)[A-Z0-9-]+$/,
      'Use a mix of letters, numbers, and "-"',
    ),

  discountAmount: z.coerce
    .number('Input must be a number')
    .int('Input must be a whole number')
    .min(1000, 'Minimum amount is 1.000')
    .max(2000000000, 'Discount amount is too large'),

  quota: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number('Quota must be a number')
      .int('Quota must be a whole number')
      .min(1, 'Event price is required')
      .max(10000, 'Maximum quota is 1000'),
  ),

  startDate: z.preprocess(emptyToUndefined, dateTime('Start Date')),
  endDate: z.preprocess(emptyToUndefined, dateTime('End Date')),
});

export type CreateVoucherInput = z.input<typeof createVoucherSchema>;
export type CreateVoucherOutput = z.output<typeof createVoucherSchema>;
