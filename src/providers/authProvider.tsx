'use client';

import { axiosInstance } from '@/lib/axiosInstance.lib';
import { useQuery } from '@tanstack/react-query';
import { PropsWithChildren, useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

export default function AuthProvider({ children }: PropsWithChildren) {
  const { setAuth } = useAuthStore();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/me');

      return res?.data?.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  console.log(user);
  useEffect(() => {
    if (user)
      setAuth(
        user.id,
        user.email,
        user.username ?? user.organizerName,
        user.role,
      );
  }, [user, setAuth]);
  return <>{children}</>;
}
