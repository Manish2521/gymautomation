import React from 'react';
import Navbar from './Navbar'; 
import Footer from './Footer'; 

const GymEquipment = () => {
    const equipmentData = [
        { name: 'Treadmill', quantity: 10, status: 'Available' },
        { name: 'Stationary Bike', quantity: 8, status: 'Available' },
        { name: 'Rowing Machine', quantity: 6, status: 'Available' },
        { name: 'Elliptical Trainer', quantity: 7, status: 'Under Maintenance' },
        { name: 'Leg Press Machine', quantity: 5, status: 'Available' },
        { name: 'Dumbbells Set (5-50kg)', quantity: 12, status: 'Available' },
        { name: 'Barbell Set', quantity: 4, status: 'Available' },
        { name: 'Pull-Up Bar', quantity: 3, status: 'Available' },
        { name: 'Smith Machine', quantity: 2, status: 'Available' },
        { name: 'Chest Press Machine', quantity: 5, status: 'Available' },
        { name: 'Cable Crossover Machine', quantity: 2, status: 'Available' },
        { name: 'Lat Pulldown Machine', quantity: 3, status: 'Under Maintenance' },
        { name: 'Ab Roller', quantity: 7, status: 'Available' },
        { name: 'Kettlebells Set (5-40kg)', quantity: 10, status: 'Available' },
        { name: 'Leg Curl Machine', quantity: 3, status: 'Available' },
        { name: 'Squat Rack', quantity: 4, status: 'Available' },
        { name: 'Bench Press', quantity: 6, status: 'Available' },
        { name: 'Resistance Bands', quantity: 15, status: 'Available' },
        { name: 'Medicine Balls', quantity: 8, status: 'Available' },
        { name: 'Battle Ropes', quantity: 2, status: 'Available' },
        { name: 'Seated Row Machine', quantity: 3, status: 'Available' },
        { name: 'Dip Bars', quantity: 3, status: 'Available' },
        { name: 'Plyometric Boxes', quantity: 4, status: 'Available' },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-auto w-full sm:max-w-5xl mt-3">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-2">Equipment</th>
                            <th scope="col" className="px-4 py-2">Quantity</th>
                            <th scope="col" className="px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equipmentData.map((equipment, index) => (
                            <tr key={index} className={`border-b ${equipment.status === 'Available' ? 'bg-green-100' : 'bg-orange-200'}`}>
                                <td className="px-4 py-2">{equipment.name}</td>
                                <td className="px-4 py-2">{equipment.quantity}</td>
                                <td className="px-4 py-2">{equipment.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </div>
    );
}

export default GymEquipment;
