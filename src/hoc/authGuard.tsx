'use client';

import { ReactNode, useSyncExternalStore } from 'react';
import { useQuery } from '@tanstack/react-query';
import IsLoading from '@/features/general/components/isLoadingImage';
import HocWarning from '@/features/general/components/hocWarning';
import { axiosInstance } from '@/lib/axiosInstance.lib';

const noop = () => () => {};

export default function AuthGuard({
  allowedRole,
  children,
}: {
  allowedRole: string[];
  children: ReactNode;
}) {
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

  const { data: user, isPending } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/me');

      return res?.data?.data;
    },
    retry: false,
    enabled: false,
  });

  if (!mounted || isPending) return <IsLoading />;
  if (!allowedRole.includes(user?.role)) return <HocWarning />;

  return <>{children}</>;
}
