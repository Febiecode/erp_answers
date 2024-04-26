// auth.tsx
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};
