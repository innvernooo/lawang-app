'use client';

import { useState } from 'react';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Link from 'next/link';
import {
  LoginInput,
  LoginRequest,
  loginSchema,
} from '@/features/login/validation/loginSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axiosInstance.lib';
import { useRouter } from 'next/navigation';
import PopoverFailed from '@/features/general/components/popoverFailed';
import { useAuthStore } from '@/stores/useAuthStore';
import { isAxiosError } from 'axios';

// Class TailwindCSS
const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200';
const labelClass = 'mb-1 block text-sm font-medium text-gray-700';

export default function LoginPage() {
  const failedRef = useRef<HTMLDialogElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput, unknown, LoginRequest>({
    resolver: zodResolver(loginSchema),
  });

  const handleLoginUser = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const res = await axiosInstance.post('/auth/login', data);
      console.log(res);
      return res?.data;
    },
    onSuccess: (res) => {
      const id = res?.data?.id;
      const email = res?.data?.email;
      const role = res?.data?.role;
      const name = res?.data?.name;
      const imageUrl = res?.data?.profilePictureUrl;
      setAuth(id, email, name, role, imageUrl);
      console.log(setAuth);
      router.push(role === 'ORGANIZER' ? 'organizer/dashboard' : '/');
    },
    onError: (err) => {
      setErrorMessage(
        (isAxiosError(err) && err.response?.data?.message) ||
          'Terjadi kesalahan, silakan coba lagi',
      );
      failedRef?.current?.showModal();
    },
  });

  return (
    <>
      <PopoverFailed
        ref={failedRef}
        title="Gagal Masuk"
        message={errorMessage}
      />
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 sm:py-12">
        <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-5 shadow-md sm:p-8 md:max-w-lg">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Masuk</h1>
          <p className="mt-1 text-sm text-gray-600">
            Selamat datang kembali! Masuk untuk melanjutkan.
          </p>
          <form
            onSubmit={handleSubmit((data) => handleLoginUser.mutate(data))}
            noValidate
            className="mt-6 space-y-5"
          >
            <div>
              <label htmlFor="identifier" className={labelClass}>
                Email atau Nama Pengguna
              </label>
              <input
                id="identifier"
                placeholder="nama@email.com atau nama pengguna"
                autoComplete="username"
                className={inputClass}
                {...register('identifier')}
              />
              <p className="label text-xs text-red-600">
                {errors?.identifier?.message}
              </p>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Kata Sandi
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`${inputClass} pr-10`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
                  }
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-800 focus-visible:text-blue-600 focus-visible:outline-none"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              <p className="label text-xs text-red-600">
                {errors?.password?.message}
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Masuk
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:underline"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
