import * as z from 'zod';

const emptyToUndefined = (v: unknown) =>
  typeof v === 'string' && v.trim() === '' ? undefined : v;

const pointStep = 10000;

export const createOrderSchema = z.object({
  ticketTypeId: z.uuid('Tikcet type is not belong to this event'),

  quantity: z.coerce
    .number('Quantity input must be a number')
    .int('Quantity must be a whole number')
    .min(1, 'Minimum quantity is 1 ticket per order')
    .max(4, 'Maximum quantity is 4 tickets per order')
    .default(1),

  voucherCode: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .toUpperCase()
      .max(30, 'Maximum input is 30 characters')
      .optional(),
  ),

  couponCode: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .toUpperCase()
      .max(30, 'Maximum input is 30 characters')
      .optional(),
  ),

  pointsUsed: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number('Point input must be a number')
      .int('Point must be a whole number')
      .min(0, 'Point cannot be negative')
      .max(50000, 'Maximum point used is 50.000')
      .multipleOf(
        pointStep,
        `Points can only be used in multiple of ${pointStep}`,
      )
      .default(0),
  ),
});

export type CreateOrderInput = z.input<typeof createOrderSchema>;
export type CreateOrderOutput = z.output<typeof createOrderSchema>;
