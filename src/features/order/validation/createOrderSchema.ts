import * as z from 'zod';

const emptyToUndefined = (v: unknown) =>
  typeof v === 'string' && v.trim() === '' ? undefined : v;

const pointStep = 10000;

export const createOrderSchema = z.object({
  ticketTypeId: z.uuid('Pilih jenis tiket yang tersedia untuk event ini'),

  quantity: z.coerce
    .number('Jumlah tiket harus berupa angka')
    .int('Jumlah tiket harus bilangan bulat')
    .min(1, 'Minimal 1 tiket per pesanan')
    .max(4, 'Maksimal 4 tiket per pesanan')
    .default(1),

  voucherCode: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .toUpperCase()
      .max(30, 'Maksimal 30 karakter')
      .optional(),
  ),

  couponCode: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .toUpperCase()
      .max(30, 'Maksimal 30 karakter')
      .optional(),
  ),

  pointsUsed: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number('Poin harus berupa angka')
      .int('Poin harus bilangan bulat')
      .min(0, 'Poin tidak boleh negatif')
      .max(50000, 'Poin yang dipakai maksimal 50.000')
      .multipleOf(
        pointStep,
        `Poin hanya bisa dipakai dalam kelipatan ${pointStep}`,
      )
      .default(0),
  ),
});

export type CreateOrderInput = z.input<typeof createOrderSchema>;
export type CreateOrderOutput = z.output<typeof createOrderSchema>;
