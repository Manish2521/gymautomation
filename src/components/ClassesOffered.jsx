import React from 'react';
import Navbar from './Navbar'; 
import { useNavigate } from 'react-router-dom';
import Footer from './Footer'; 

const ClassesOffered = () => {
    const classesData = [
        { name: 'Yoga', instructor: 'Sarah Thompson' },
        { name: 'Pilates', instructor: 'Emily Johnson' },
        { name: 'Zumba', instructor: 'Carlos Rodriguez' },
        { name: 'HIIT (High-Intensity Interval Training)', instructor: 'Jason Lee' },
        { name: 'Spinning', instructor: 'Michelle Davis' },
        { name: 'Strength Training', instructor: 'James Miller' },
        { name: 'Boxing', instructor: 'Alex Turner' },
        { name: 'BodyPump', instructor: 'Chris Evans' },
        { name: 'CrossFit', instructor: 'Jennifer Wilson' },
        { name: 'Aqua Aerobics', instructor: 'Laura Green' },
    ];


    
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

    
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-auto w-full sm:max-w-5xl mt-3">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-2">Class Name</th>
              <th scope="col" className="px-4 py-2">Instructor</th>
            </tr>
          </thead>
          <tbody>
            {classesData.map((classOffered, index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-4 py-2">{classOffered.name}</td>
                <td className="px-4 py-2">{classOffered.instructor}</td>
                <td className="px-4 py-2">{classOffered.schedule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}

export default ClassesOffered;
