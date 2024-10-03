import React from 'react';
import Navbar from './Navbar'; 
import Footer from './Footer'; 

const Trainers = () => {
  const trainersData = [
    { name: 'Chris Lee', specialty: 'Strength Training', certification: 'Certified', status: 'Available' },
    { name: 'David Wilson', specialty: 'Cardio Training', certification: 'Certified', status: 'Available' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-auto w-full sm:max-w-5xl mt-3">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-2">Trainer Name</th>
              <th scope="col" className="px-4 py-2">Specialty</th>
              <th scope="col" className="px-4 py-2">Certification</th>
              <th scope="col" className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {trainersData.map((trainer, index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-4 py-2">{trainer.name}</td>
                <td className="px-4 py-2">{trainer.specialty}</td>
                <td className="px-4 py-2">{trainer.certification}</td>
                <td className="px-4 py-2">{trainer.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}

export default Trainers;
