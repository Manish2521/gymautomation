import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';  
import Footer from './Footer';  
import Table from './Table';  

const LandingPage = () => {
  const navigate = useNavigate();


// Check if user exist in db or not  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    const checkUserInDB = async () => {
      try {
        const response = await fetch(`https://gymautomation.onrender.com/checkUser?username=${username}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('User not found or session expired');
        }
        const data = await response.json();
        if (!data.exists) {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          navigate('/error');
        }
      } catch (error) {
        console.error('Error checking user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/error');
      }
    };
  
    if (token && username) {
      checkUserInDB();
    } else {
      navigate('/error');
    }
  }, [navigate]);






  
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
