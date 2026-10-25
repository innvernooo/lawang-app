import * as z from 'zod';

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const paymentSchema = z.object({
  paymentProof: z
    .custom<FileList>()
    .refine((files) => files.length > 0, 'Bukti pembayaran wajib diunggah')
    .refine(
      (files) => files[0].size <= MAX_FILE_SIZE,
      'Ukuran foto maksimal 5 MB',
    )
    .refine(
      (files) => ALLOWED_TYPES.includes(files[0].type),
      'Foto harus berformat JPG, PNG, atau WEBP',
    ),
});

export type PaymentOutput = z.output<typeof paymentSchema>;
