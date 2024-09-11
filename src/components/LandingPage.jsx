import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/error');
    }
  }, [navigate]);

  const handleLogout = async () => {
    await fetch('https://gymautomation.onrender.com/logout', { method: 'POST', credentials: 'include' });
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <h1 className="text-center text-2xl font-bold text-gray-900">Welcome to the Landing Page!</h1>
      <button
        className="mt-6 bg-red-500 text-white font-semibold py-2 px-4 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default LandingPage;
