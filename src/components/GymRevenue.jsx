import React from 'react';
import Navbar from './Navbar'; 
import Footer from './Footer'; 

const GymRevenue = () => {
  const revenueData = [
    { month: 'January', revenue: '$1000' },
    { month: 'February', revenue: '$1200' },
    { month: 'March', revenue: '$1500' },
    { month: 'April', revenue: '$1300' },
    { month: 'May', revenue: '$1800' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-auto w-full sm:max-w-5xl mt-3">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-2">Month</th>
              <th scope="col" className="px-4 py-2">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {revenueData.map((revenue, index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-4 py-2">{revenue.month}</td>
                <td className="px-4 py-2">{revenue.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}

export default GymRevenue;
