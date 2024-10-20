import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';
import Footer from './Footer';

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [trainerToDelete, setTrainerToDelete] = useState(null);
  const [newTrainer, setNewTrainer] = useState({
    name: '',
    specialty: '',
    certification: '',
    status: '',
  });
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // 'success' or 'error'
  const [editingTrainer, setEditingTrainer] = useState(null);


  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await fetch('https://gymautomation.onrender.com/trainers'); // Update endpoint for trainers
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTrainers(data);
      } catch (error) {
        console.error('Error fetching trainer data:', error);
        setAlertMessage('Error fetching trainer data');
        setAlertType('error');
        autoDismissAlert();
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  const handleAddTrainer = async () => {
    // Validate fields before submitting
    if (!newTrainer.name || !newTrainer.specialty || !newTrainer.certification || !newTrainer.status) {
      setAlertMessage('Please fill in all fields'); // Alert message for empty fields
      setAlertType('error');
      autoDismissAlert();
      return; // Prevent form submission
    }

    const trainerToAdd = {
      ...newTrainer,
    };

    try {
      const response = await fetch('https://gymautomation.onrender.com/trainers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trainerToAdd),
      });

      if (response.ok) {
        const newData = await response.json();
        setTrainers([...trainers, newData]);
        setShowPopup(false); // Close the popup
        setNewTrainer({ name: '', specialty: '', certification: '', status: '' }); // Reset form
        setAlertMessage('Trainer added successfully');
        setAlertType('success');
        autoDismissAlert();
      } else {
        throw new Error('Failed to add trainer');
      }
    } catch (error) {
      console.error('Error adding trainer:', error);
      setAlertMessage('Error adding trainer');
      setAlertType('error');
      autoDismissAlert();
    }
  };

  const handleDeleteTrainer = () => {
    if (!trainerToDelete) return;

    const deleteTrainer = async () => {
      try {
        const response = await fetch(`https://gymautomation.onrender.com/trainers/name/${encodeURIComponent(trainerToDelete)}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setTrainers(trainers.filter((trainer) => trainer.name !== trainerToDelete));
          setAlertMessage('Trainer deleted successfully');
          setAlertType('success');
          autoDismissAlert();
        } else {
          throw new Error('Failed to delete trainer');
        }
      } catch (error) {
        console.error('Error deleting trainer:', error);
        setAlertMessage('Error deleting trainer');
        setAlertType('error');
        autoDismissAlert();
      } finally {
        setShowConfirmModal(false); // Close the confirmation modal
        setTrainerToDelete(null); // Reset trainer to delete
      }
    };

    deleteTrainer();
  };

  const handleConfirmDelete = (name) => {
    setTrainerToDelete(name); // Set the trainer name to delete
    setShowConfirmModal(true); // Show the confirmation modal
  };

  const handleEditTrainer = (trainer) => {
    setNewTrainer(trainer);
    setEditingTrainer(trainer);
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
              setNewTrainer({ name: '', specialty: '', certification: '', status: '' }); // Reset form with default status
              setEditingTrainer(null); // Reset editing state
              setShowPopup(true); // Open the popup
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add Trainer
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-4">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-2">Trainer Name</th>
                  <th scope="col" className="px-4 py-2">Specialty</th>
                  <th scope="col" className="px-4 py-2">Certification</th>
                  <th scope="col" className="px-4 py-2">Status</th>
                  <th scope="col" className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trainers.map((item, index) => (
                  <tr key={index} className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${item.status === 'Available' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{item.specialty}</td>
                    <td className="px-4 py-2">{item.certification}</td>
                    <td className="px-4 py-2">{item.status}</td>
                    <td className="px-4 py-2 flex space-x-2">
                      <button onClick={() => handleEditTrainer(item)} className="text-blue-500 hover:underline">
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
        )}
      </div>

{/* Add/Edit Trainer Popup */}
{showPopup && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-5 rounded-lg shadow-lg w-80">
      <h2 className="text-xl font-bold mb-4">{editingTrainer ? 'Edit Trainer' : 'Add Trainer'}</h2>
      <input
        type="text"
        placeholder="Name"
        value={newTrainer.name}
        onChange={(e) => setNewTrainer({ ...newTrainer, name: e.target.value })}
        className="w-full mb-3 p-2 border border-gray-300 rounded-md"
      />
      <select
        value={newTrainer.specialty}
        onChange={(e) => setNewTrainer({ ...newTrainer, specialty: e.target.value })}
        className="w-full border rounded-md mb-3 px-2 py-1"
        required
      >
        <option value="">Select Specialty</option>
        <option value="Nutrition">Nutrition</option>
        <option value="Strength Training">Strength Training</option>
        <option value="Yoga">Yoga</option>
        <option value="Pilates">Pilates</option>
        <option value="Cardio">Cardio</option>
        <option value="Dance">Dance</option>
      </select>
      <select
        value={newTrainer.certification}
        onChange={(e) => setNewTrainer({ ...newTrainer, certification: e.target.value })}
        className="w-full border rounded-md mb-3 px-2 py-1"
        required
      >
        <option value="">Select Certification</option>
        <option value="Certified Nutritionist">Certified Nutritionist</option>
        <option value="Certified Personal Trainer">Certified Personal Trainer</option>
        <option value="Yoga Instructor">Yoga Instructor</option>
        <option value="Pilates Instructor">Pilates Instructor</option>
        <option value="Group Fitness Instructor">Group Fitness Instructor</option>
      </select>

      <select
        value={newTrainer.status} // Change this to match the trainer's status
        onChange={(e) => setNewTrainer({ ...newTrainer, status: e.target.value })}
        className="border rounded px-2 py-1 mb-2 w-full"
      >
        <option value="Select">Select</option>
        <option value="Available">Available</option>
        <option value="Under Maintenance">Under Maintenance</option>
      </select>

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setShowPopup(false)}
          className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={handleAddTrainer}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          {editingTrainer ? 'Update' : 'Add'}
        </button>
      </div>
    </div>
  </div>
)}



      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete {trainerToDelete}?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mr-2"
                onClick={handleDeleteTrainer}
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

export default Trainers;
