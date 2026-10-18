'use client';

import { useRef } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Link from 'next/link';
import {
  RegisterInput,
  RegisterRequest,
  registerSchema,
} from '@/features/register/validation/customerSchema';
import { axiosInstance } from '@/lib/axiosInstance.lib';
import PopoverFailed from '@/features/register/components/popoverFailed';
import PopoverSuccess from '@/features/register/components/popoverSuccess';

// Class TailwindCSS
const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200';
const labelClass = 'mb-1 block text-sm font-medium text-gray-700';

export default function CustomerRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const successRef = useRef<HTMLDialogElement>(null);
  const failedRef = useRef<HTMLDialogElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterInput, unknown, RegisterRequest>({
    resolver: zodResolver(registerSchema),
  });

  return <></>;
}
