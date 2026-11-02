import * as z from 'zod';

export const createReviewSchema = z.object({
  rating: z.coerce
    .number()
    .int()
    .min(1, 'Minimum rating is 1')
    .max(5, 'Maximum rating is 5'),

  comment: z
    .string()
    .trim()
    .min(5, 'Minimum comment is 5 characters')
    .max(1000, 'Maximum comment is 1000 characters'),
});

export type CreateReviewInput = z.input<typeof createReviewSchema>;
export type CreateReviewOutput = z.output<typeof createReviewSchema>;
