import React from 'react';
import { Link } from 'react-router-dom';

const Table = () => {
  const cardsData = [
    {
      title: 'Total Members',
      value: 20,
      description: 'Total number of active gym members.',
      colorClass: 'bg-blue-500', 
      link: '/membership', 
    },
    {
      title: 'Available Plans',
      value: 5,
      description: 'Total number of plans available for members.',
      colorClass: 'bg-green-500',
      link: '/availableplans', 
    },
    {
      title: 'Gym Revenue',
      value: '$5000',
      description: 'Total revenue generated this month.',
      colorClass: 'bg-purple-500',
      link: '/GymRevenue', 
    },
    {
      title: 'Gymers',
      value: 15,
      description: 'Number of gym users accessing the facility.',
      colorClass: 'bg-red-500',
      link: '/Gymers', 
    },
    {
      title: 'Employees',
      value: 4,
      description: 'Total employees working in the gym.',
      colorClass: 'bg-yellow-500',
      link: '/Employees', 
    },
    {
      title: 'Trainers',
      value: 2,
      description: 'Total number of certified trainers available.',
      colorClass: 'bg-red-500',
      link: '/Trainers', 
    },
    {
      title: 'Gym Equipment',
      value: 23,
      description: 'Total equipment available for gym members.',
      colorClass: 'bg-blue-500',
      link: '/GymEquipment',
    },
    {
      title: 'Classes Offered',
      value: 10,
      description: 'Total number of classes available for members.',
      colorClass: 'bg-indigo-500',
      link: '/ClassesOffered', 
    },
  ];

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen p-6 bg-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cardsData.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className={`max-w-sm p-6 border border-gray-200 rounded-lg shadow ${card.colorClass} text-white text-center hover:shadow-lg transition-shadow duration-200`}
            >
              <h5 className="mb-2 text-2xl font-bold">{card.title}</h5>
              <p className="mb-3 text-3xl">{card.value}</p>
              <p className="text-gray-200">{card.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Table;
