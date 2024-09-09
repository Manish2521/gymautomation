import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Error = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
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
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Unauthorized Access</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <p className="text-center text-gray-700">
            You are not logged in. Please log in to access this page.
          </p>
          <p className="text-center text-gray-700">
            Redirecting to login page in {countdown} seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error;
