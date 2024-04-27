// auth.tsx
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      const isAdmin = localStorage.getItem('isAdmin');
      if (!token) {
        router.push('/login');
      }else if(isAdmin === 'true'){
        router.push('/admin')
    }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};
