'use client';

import { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import IsLoading from '@/features/general/components/isLoadingImage';
import HocWarning from '@/features/general/components/hocWarning';
import { axiosInstance } from '@/lib/axiosInstance.lib';

export default function AuthGuard({
  allowedRole,
  children,
}: {
  allowedRole: string[];
  children: ReactNode;
}) {
  const { role } = useAuthStore();

  const { isPending } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/me');

      return res?.data?.data;
    },
    retry: false,
    enabled: false,
  });

  if (isPending) return <IsLoading />;
  if (!allowedRole.includes(role)) return <HocWarning />;

  return <>{children}</>;
}
