import React from 'react';
import Navbar from './Navbar'; 
import Footer from './Footer'; 

const Gymers = () => {
    const gymersData = [
        { name: 'John Doe', membership: 'Annual', joined: '2023-01-15', status: 'Active' },
        { name: 'Jane Smith', membership: 'Monthly', joined: '2023-09-05', status: 'Inactive' },
        { name: 'Alex Johnson', membership: 'Quarterly', joined: '2023-05-10', status: 'Active' },
        { name: 'Emily Davis', membership: 'Annual', joined: '2023-02-20', status: 'Active' },
        { name: 'Michael Brown', membership: 'Monthly', joined: '2023-07-12', status: 'Inactive' },
        { name: 'Linda Wilson', membership: 'Quarterly', joined: '2023-06-23', status: 'Active' },
        { name: 'David Miller', membership: 'Annual', joined: '2023-03-15', status: 'Active' },
        { name: 'Sarah Taylor', membership: 'Monthly', joined: '2023-08-01', status: 'Inactive' },
        { name: 'James Anderson', membership: 'Quarterly', joined: '2023-04-18', status: 'Active' },
        { name: 'Sophia White', membership: 'Annual', joined: '2023-01-29', status: 'Active' },
        { name: 'Daniel Moore', membership: 'Monthly', joined: '2023-09-10', status: 'Inactive' },
        { name: 'Olivia Harris', membership: 'Quarterly', joined: '2023-05-25', status: 'Active' },
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
              <th scope="col" className="px-4 py-2">Name</th>
              <th scope="col" className="px-4 py-2">Membership Status</th>
            </tr>
          </thead>
          <tbody>
            {gymersData.map((gymer, index) => (
              <tr key={index} className={gymer.membership === 'Active' ? 'bg-green-100' : 'bg-red-100'}>
                <td className="px-4 py-2">{gymer.name}</td>
                <td className="px-4 py-2">{gymer.membership}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}

export default Gymers;
