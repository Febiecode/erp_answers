// adminAuth.tsx
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const AuthComponent = (props: P) => {
        const router = useRouter();

        useEffect(() => {
            const isAdmin = localStorage.getItem('isAdmin');
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
            }else if(isAdmin === 'false'){
                router.push('/userPost')
            }
        }, []);

        return <WrappedComponent {...props} />;
    };

    return AuthComponent;
};
