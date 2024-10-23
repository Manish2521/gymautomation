import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Error = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown === 0) {
      clearInterval(timer);
      navigate('/');
    }

    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
  <section className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 text-center">
      <div className="mx-auto max-w-screen-sm">
        <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">403</h1>
        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-5xl dark:text-white">Access Denied</p>
        <p className="mb-4 text-lg font-light text-black-500 dark:text-black-400">
          You'll be redirected to the Login page in {countdown} seconds.
        </p>
      </div>
    </div>
  </section>

  );
};

export default Error;
