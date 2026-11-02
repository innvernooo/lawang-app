import * as z from 'zod';

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const paymentSchema = z.object({
  paymentProof: z
    .custom<FileList>()
    .optional()
    .refine(
      (files) => !files?.length || files[0].size <= MAX_FILE_SIZE,
      'Ukuran foto maksimal 5 MB',
    )
    .refine(
      (files) => !files?.length || ALLOWED_TYPES.includes(files[0].type),
      'Foto harus berformat JPG, PNG, atau WEBP',
    ),
});

export type PaymentOutput = z.output<typeof paymentSchema>;
