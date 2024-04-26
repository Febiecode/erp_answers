"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    // Clear the token from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');

    // Redirect the user to the login page
    router.push('/login');
  }, []);

  return null; // or a loading message or any UI if needed
};

export default Logout;
