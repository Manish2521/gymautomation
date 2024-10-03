import React from 'react';
import Navbar from './Navbar'; 
import Footer from './Footer'; 

const AvailablePlans = () => {
    const plans = [
        { name: 'Basic Membership', duration: '1 Month', price: '$30' },
        { name: 'Standard Membership', duration: '3 Months', price: '$75' },
        { name: 'Premium Membership', duration: '6 Months', price: '$150' },
        { name: 'Annual Membership', duration: '12 Months', price: '$270' },
        { name: 'Family Plan', duration: '6 Months', price: '$250' },
    ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-auto w-full sm:max-w-5xl mt-3">
        <div className="pb-4 bg-white dark:bg-gray-900 flex flex-col sm:flex-row sm:justify-between gap-4 p-4">
        </div>

        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-2">Plan Name</th>
              <th scope="col" className="px-4 py-2">Price</th>
              <th scope="col" className="px-4 py-2">Duration</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, index) => (
              <tr key={index} className="bg-gray-100 dark:bg-gray-800">
                <td className="px-4 py-2">{plan.name}</td>
                <td className="px-4 py-2">{plan.price}</td>
                <td className="px-4 py-2">{plan.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
};

export default AvailablePlans;
