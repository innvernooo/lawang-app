'use client';

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
      return <h1>Access forbidden</h1>;
    }

    return <WrappedComponent {...props} />;
  };
}
