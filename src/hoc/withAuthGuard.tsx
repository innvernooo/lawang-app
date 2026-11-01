'use client';

import HocWarning from '@/features/general/components/hocWarning';
import { useAuthStore } from '@/stores/useAuthStore';
import { ComponentType } from 'react';

export default function WithAuthGuard<P extends object>(
  WrappedComponent: ComponentType<P>,
  allowedRole: string[],
) {
  return function AuthGuardComponent(props: P) {
    const { role } = useAuthStore();
    const isAuthorized = allowedRole.includes(role);

    if (!isAuthorized) {
      return <HocWarning />;
    }

    return <WrappedComponent {...props} />;
  };
}
