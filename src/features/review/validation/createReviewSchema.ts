import * as z from 'zod';

export const createReviewSchema = z.object({
  rating: z.coerce
    .number('Pilih rating bintang terlebih dahulu')
    .int()
    .min(1, 'Rating minimal 1 bintang')
    .max(5, 'Rating maksimal 5 bintang'),

  comment: z
    .string()
    .trim()
    .min(5, 'Komentar minimal 5 karakter')
    .max(1000, 'Komentar maksimal 1000 karakter'),
});

export type CreateReviewInput = z.input<typeof createReviewSchema>;
export type CreateReviewOutput = z.output<typeof createReviewSchema>;
