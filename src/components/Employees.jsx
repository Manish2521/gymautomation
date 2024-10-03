import React from 'react';
import Navbar from './Navbar'; 
import Footer from './Footer'; 

const Employees = () => {
  const employeesData = [
    { name: 'John Doe', role: 'Manager', status: 'Active' },
    { name: 'Jane Smith', role: 'Receptionist', status: 'Active' },
    { name: 'Chris Lee', role: 'Trainer', status: 'Active' },
    { name: 'David Wilson', role: 'Cleaner', status: 'Active' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-auto w-full sm:max-w-5xl mt-3">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-2">Name</th>
              <th scope="col" className="px-4 py-2">Role</th>
              <th scope="col" className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {employeesData.map((employee, index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-4 py-2">{employee.name}</td>
                <td className="px-4 py-2">{employee.role}</td>
                <td className="px-4 py-2">{employee.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}

export default Employees;
