import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'; 
import Navbar from './Navbar'; 
import Footer from './Footer'; 

const GymEquipment = () => {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [equipmentToDelete, setEquipmentToDelete] = useState(null);
    const [newEquipment, setNewEquipment] = useState({
        name: '',
        quantity: '',
        status: 'Available', // Default status
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(''); // 'success' or 'error'
    const [editingEquipment, setEditingEquipment] = useState(null);

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const response = await fetch('https://gymautomation.onrender.com/equipment'); // Update endpoint
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setEquipment(data);
            } catch (error) {
                console.error('Error fetching equipment data:', error);
                setAlertMessage('Error fetching equipment data');
                setAlertType('error');
                autoDismissAlert();
            } finally {
                setLoading(false);
            }
        };

        fetchEquipment();
    }, []);

    const handleAddEquipment = async () => {
        // Validate fields before submitting
        if (!newEquipment.name || !newEquipment.quantity) {
            setAlertMessage('Please fill in all fields'); // Alert message for empty fields
            setAlertType('error');
            autoDismissAlert();
            return; // Prevent form submission
        }

        // Add status to newEquipment object
        const equipmentToAdd = {
            ...newEquipment,
            quantity: parseInt(newEquipment.quantity), // Ensure quantity is an integer
        };

        try {
            const response = await fetch('https://gymautomation.onrender.com/equipment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(equipmentToAdd),
            });

            if (response.ok) {
                const newData = await response.json();
                setEquipment([...equipment, newData]);
                setShowPopup(false); // Close the popup
                setNewEquipment({ name: '', quantity: '', status: 'Available' }); // Reset form
                setAlertMessage('Equipment added successfully');
                setAlertType('success');
                autoDismissAlert();
            } else {
                throw new Error('Failed to add equipment');
            }
        } catch (error) {
            console.error('Error adding equipment:', error);
            setAlertMessage('Error adding equipment');
            setAlertType('error');
            autoDismissAlert();
        }
    };

    const handleDeleteEquipment = () => {
        if (!equipmentToDelete) return;

        const deleteEquipment = async () => {
            try {
                const response = await fetch(`https://gymautomation.onrender.com/equipment/name/${encodeURIComponent(equipmentToDelete)}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setEquipment(equipment.filter((eq) => eq.name !== equipmentToDelete));
                    setAlertMessage('Equipment deleted successfully');
                    setAlertType('success');
                    autoDismissAlert();
                } else {
                    throw new Error('Failed to delete equipment');
                }
            } catch (error) {
                console.error('Error deleting equipment:', error);
                setAlertMessage('Error deleting equipment');
                setAlertType('error');
                autoDismissAlert();
            } finally {
                setShowConfirmModal(false); // Close the confirmation modal
                setEquipmentToDelete(null); // Reset equipment to delete
            }
        };

        deleteEquipment();
    };

    const handleConfirmDelete = (name) => {
        setEquipmentToDelete(name); // Set the equipment name to delete
        setShowConfirmModal(true); // Show the confirmation modal
    };

    const handleEditEquipment = (equipment) => {
        setNewEquipment(equipment);
        setEditingEquipment(equipment);
        setShowPopup(true);
    };

    const autoDismissAlert = () => {
        setTimeout(() => {
            setAlertMessage('');
            setAlertType('');
        }, 3000);
    };

    const handleCloseAlert = () => {
        setAlertMessage('');
        setAlertType('');
    };

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
            {alertMessage && (
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

            <div className={`relative overflow-x-auto shadow-md sm:rounded-lg mx-auto w-full sm:max-w-5xl mt-3 ${loading ? 'blur-md' : ''}`}>
                <div className="pb-4 bg-white dark:bg-gray-900 flex justify-between p-4">
                    {/* Add Button */}
                    <button
                        onClick={() => {
                            setNewEquipment({ name: '', quantity: '', status: 'Available' }); // Reset form
                            setEditingEquipment(null); // Reset editing state
                            setShowPopup(true); // Open the popup
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Add Equipment
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-4 py-2">Name</th>
                                <th scope="col" className="px-4 py-2">Quantity</th>
                                <th scope="col" className="px-4 py-2">Status</th>
                                <th scope="col" className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {equipment.map((item, index) => (
                                <tr key={index} className={`bg-green-100 ${item.status === 'Under Maintenance' ? 'bg-orange-200' : ''}`}>
                                    <td className="px-4 py-2">{item.name}</td>
                                    <td className="px-4 py-2">{item.quantity}</td>
                                    <td className="px-4 py-2">{item.status}</td>
                                    <td className="px-4 py-2 flex space-x-2">
                                        <button onClick={() => handleEditEquipment(item)} className="text-blue-500 hover:underline">
                                            <FontAwesomeIcon icon={faPenToSquare} className="h-5 w-5 inline" />
                                        </button>
                                        <button onClick={() => handleConfirmDelete(item.name)} className="text-red-500 hover:underline">
                                            <FontAwesomeIcon icon={faTrash} className="h-5 w-5 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Equipment Popup */}
            {showPopup && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-80">
                        <h2 className="text-xl font-bold mb-4">{editingEquipment ? 'Edit Equipment' : 'Add Equipment'}</h2>
                        <input
                            type="text"
                            placeholder="Equipment Name"
                            value={newEquipment.name}
                            onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                            required
                            className="border rounded px-2 py-1 mb-2 w-full"
                        />
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={newEquipment.quantity}
                            onChange={(e) => setNewEquipment({ ...newEquipment, quantity: e.target.value })}
                            required
                            className="border rounded px-2 py-1 mb-2 w-full"
                        />
                        <select
                            value={newEquipment.status}
                            onChange={(e) => setNewEquipment({ ...newEquipment, status: e.target.value })}
                            className="border rounded px-2 py-1 mb-2 w-full"
                        >
                            <option value="Available">Available</option>
                            <option value="Under Maintenance">Under Maintenance</option>
                        </select>
                        <div className="flex justify-between">
                            <button
                                onClick={handleAddEquipment}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                {editingEquipment ? 'Update' : 'Add'}
                            </button>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showConfirmModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                <p>Are you sure you want to delete {equipmentToDelete}?</p>
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mr-2"
                    onClick={handleDeleteEquipment}
                  >
                    Confirm
                  </button>
                  <button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    onClick={() => setShowConfirmModal(false)}
                  >
                    Cancel
                  </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default GymEquipment;
