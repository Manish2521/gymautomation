import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const AvailablePlans = () => {
  const [memberships, setMemberships] = useState([]); // State to hold fetched membership plans
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false); // Added for alert display


  
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
    const fetchAvailablePlans = async () => {
      try {
        const response = await fetch('https://gymautomation.onrender.com/availableplans');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMemberships(data); // Set the fetched data to memberships state
      } catch (error) {
        console.error('Error fetching membership data:', error);
        setAlertMessage('Error fetching membership data');
        setAlertType('error');
        setShowAlert(true);
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    };

    fetchAvailablePlans(); // Call the fetch function
  }, []);

  const handleCloseAlert = () => setShowAlert(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Background blur and loading bar */}
      {loading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      )}

      {/* Fixed Position Alert */}
      {showAlert && (
        <div 
          role="alert" 
          className={`fixed top-20 right-5 w-80 p-3 text-sm text-white ${alertType === 'success' ? 'bg-green-600' : 'bg-red-600'} rounded-md shadow-lg z-50`}
        >
          <span className="flex-grow text-center">{alertMessage}</span>
          <button 
            className="flex items-center justify-center transition-all w-8 h-8 rounded-md text-white hover:bg-white/10 active:bg-white/10 absolute top-1 right-1" 
            type="button"
            onClick={handleCloseAlert}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-auto w-full sm:max-w-5xl mt-3">
        {loading ? (
          <div className="flex justify-center py-4">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-2">Plan Name</th>
                  <th scope="col" className="px-4 py-2">Price</th>
                  <th scope="col" className="px-4 py-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                {memberships.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{item.planName}</td>
                    <td className="px-4 py-2">{item.price}</td>
                    <td className="px-4 py-2">{item.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AvailablePlans;
