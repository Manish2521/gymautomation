import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/error'); // Redirect to error page if no token
    }
  }, [navigate]);

  const handleLogout = async () => {
    await fetch('https://gymautomation.onrender.com/logout', { method: 'POST', credentials: 'include' });
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Welcome to Gym Automation</h2>
        <button
          onClick={handleLogout}
          className="mt-6 w-full rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm ring-1 ring-gray-900/10 transition-all hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          Logout
        </button>
      </div>
   </div>
  );
};

export default LandingPage;
