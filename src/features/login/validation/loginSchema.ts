import * as z from 'zod';

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, 'Email atau nama pengguna wajib diisi')
    .max(255, 'Email atau nama pengguna maksimal 255 karakter'),
  password: z.string().min(1, 'Kata sandi wajib diisi'),
});

export type LoginInput = z.input<typeof loginSchema>;
export type LoginRequest = z.output<typeof loginSchema>;