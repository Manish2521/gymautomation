import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'; 
import Navbar from './Navbar'; 
import Footer from './Footer'; 

const Membership = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [membershipToDelete, setMembershipToDelete] = useState(null);
  const [newMembership, setNewMembership] = useState({
    name: '',
    type: '',
    startDate: '',
    endDate: ''
  });
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // 'success' or 'error'
  const [editingMembership, setEditingMembership] = useState(null);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await fetch('http://localhost:5000/memberships');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMemberships(data);
      } catch (error) {
        console.error('Error fetching membership data:', error);
        setAlertMessage('Error fetching membership data');
        setAlertType('error');
        autoDismissAlert();
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  const handleAddMembership = async () => {
    try {
      const response = await fetch('http://localhost:5000/memberships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMembership),
      });

      if (response.ok) {
        const newData = await response.json();
        setMemberships([...memberships, newData]);
        setShowPopup(false); // Close the popup
        setNewMembership({ name: '', type: '', startDate: '', endDate: '' }); // Reset form
        setAlertMessage('Membership added successfully');
        setAlertType('success');
        autoDismissAlert();
      } else {
        throw new Error('Failed to add membership');
      }
    } catch (error) {
      console.error('Error adding membership:', error);
      setAlertMessage('Error adding membership');
      setAlertType('error');
      autoDismissAlert();
    }
  };

  const handleDeleteMembership = () => {
    if (!membershipToDelete) return;

    const deleteMembership = async () => {
      try {
        const response = await fetch(`http://localhost:5000/memberships/name/${encodeURIComponent(membershipToDelete)}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setMemberships(memberships.filter((membership) => membership.name !== membershipToDelete));
          setAlertMessage('Membership deleted successfully');
          setAlertType('success');
          autoDismissAlert();
        } else {
          throw new Error('Failed to delete membership');
        }
      } catch (error) {
        console.error('Error deleting membership:', error);
        setAlertMessage('Error deleting membership');
        setAlertType('error');
        autoDismissAlert();
      } finally {
        setShowConfirmModal(false); // Close the confirmation modal
        setMembershipToDelete(null); // Reset membership to delete
      }
    };

    deleteMembership();
  };

  const handleConfirmDelete = (name) => {
    setMembershipToDelete(name); // Set the membership name to delete
    setShowConfirmModal(true); // Show the confirmation modal
  };

  const handleEditMembership = (membership) => {
    setNewMembership(membership);
    setEditingMembership(membership);
    setShowPopup(true);
  };

  const autoDismissAlert = () => {
    setTimeout(() => {
      setAlertMessage('');
      setAlertType('');
    }, 9000);
  };

  const handleCloseAlert = () => {
    setAlertMessage('');
    setAlertType('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

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

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-auto w-full sm:max-w-5xl mt-3">
        <div className="pb-4 bg-white dark:bg-gray-900 flex justify-between p-4">
          {/* Add Button */}
          <button
            onClick={() => {
              // Reset newMembership to clear any existing data
              setNewMembership({ name: '', type: '', startDate: '', endDate: '' }); 
              setEditingMembership(null); // Reset editing state
              setShowPopup(true); // Open the popup
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add Member
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-4">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-2">Name</th>
                  <th scope="col" className="px-4 py-2">Type</th>
                  <th scope="col" className="px-4 py-2">Start Date</th>
                  <th scope="col" className="px-4 py-2">End Date</th>
                  <th scope="col" className="px-4 py-2">Status</th>
                  <th scope="col" className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {memberships.map((item, index) => (
                  <tr key={index} className={new Date(item.endDate) >= new Date() ? 'bg-green-100' : 'bg-red-100'}>
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{item.type}</td>
                    <td className="px-4 py-2">{item.startDate}</td>
                    <td className="px-4 py-2">{item.endDate}</td>
                    <td className="px-4 py-2">{new Date(item.endDate) >= new Date() ? 'Active' : 'Expired'}</td>
                    <td className="px-4 py-2 flex space-x-2">
                      <button onClick={() => handleEditMembership(item)} className="text-blue-500 hover:underline">
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

      {/* Add/Edit Membership Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">{editingMembership ? 'Edit Membership' : 'Add Membership'}</h2>
            <input
              type="text"
              placeholder="Name"
              value={newMembership.name}
              onChange={(e) => setNewMembership({ ...newMembership, name: e.target.value })}
              className="border p-2 mb-2 w-full"
              required // Making the field mandatory
            />
            <select
              value={newMembership.type}
              onChange={(e) => setNewMembership({ ...newMembership, type: e.target.value })}
              className="border p-2 mb-2 w-full"
              required // Making the field mandatory
            >
              <option value="" disabled>Select Membership Type</option>
              <option value="Gym">Gym</option>
              <option value="Zumba">Zumba</option>
              <option value="Yoga">Yoga</option>
            </select>
            <input
              type="date"
              placeholder="Start Date"
              value={newMembership.startDate}
              onChange={(e) => setNewMembership({ ...newMembership, startDate: e.target.value })}
              className="border p-2 mb-2 w-full"
              required // Making the field mandatory
            />
            <input
              type="date"
              placeholder="End Date"
              value={newMembership.endDate}
              onChange={(e) => setNewMembership({ ...newMembership, endDate: e.target.value })}
              className="border p-2 mb-2 w-full"
              required // Making the field mandatory
            />
            <button
              onClick={handleAddMembership}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {editingMembership ? 'Update Membership' : 'Add Membership'}
            </button>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded shadow-lg w-11/12 max-w-md md:max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this membership?</p>
            <div className="mt-4 flex justify-center space-x-2">
              <button onClick={handleDeleteMembership} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Yes</button>
              <button onClick={() => setShowConfirmModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">No</button>
            </div>
          </div>
        </div>
      )}



      <Footer />
    </div>
  );
};

export default Membership;
