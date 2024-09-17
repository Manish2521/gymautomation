import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';  
import Footer from './Footer';  
import Table from './Table';  

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/error'); 
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch('https://gymautomation.onrender.com/logout', { method: 'POST', credentials: 'include' });
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar handleLogout={handleLogout} />
      <Table />
      <Footer />
    </div>
  );
};

export default LandingPage;
