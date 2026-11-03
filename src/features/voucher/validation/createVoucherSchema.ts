import * as z from 'zod';

const emptyToUndefined = (v: unknown) =>
  typeof v === 'string' && v.trim() === '' ? undefined : v;

const dateTime = (label: string) =>
  z.iso
    .datetime({
      local: true,
      offset: true,
      message: `${label} harus berupa tanggal dan waktu yang valid`,
    })
    .pipe(z.coerce.date());

export const createVoucherSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*-)[A-Z0-9-]+$/,
      'Gunakan kombinasi huruf, angka, dan tanda "-"',
    ),

  discountAmount: z.coerce
    .number('Nominal diskon harus berupa angka')
    .int('Nominal diskon harus bilangan bulat')
    .min(1000, 'Nominal diskon minimal Rp1.000')
    .max(2000000000, 'Nominal diskon terlalu besar'),

  quota: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number('Kuota harus berupa angka')
      .int('Kuota harus bilangan bulat')
      .min(1, 'Kuota minimal 1')
      .max(10000, 'Kuota maksimal 10.000'),
  ),

  startDate: z.preprocess(emptyToUndefined, dateTime('Tanggal mulai')),
  endDate: z.preprocess(emptyToUndefined, dateTime('Tanggal selesai')),
});

export type CreateVoucherInput = z.input<typeof createVoucherSchema>;
export type CreateVoucherOutput = z.output<typeof createVoucherSchema>;
