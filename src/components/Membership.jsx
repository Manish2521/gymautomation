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



  
  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await fetch('https://gymautomation.onrender.com/memberships');
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
    if (!newMembership.name || !newMembership.type || !newMembership.startDate || !newMembership.endDate) {
      setAlertMessage('Please fill in all fields');
      setAlertType('error');
      autoDismissAlert();
      return;
    }

    const membershipToAdd = { ...newMembership };

    try {
      const response = await fetch('https://gymautomation.onrender.com/memberships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(membershipToAdd),
      });

      if (response.ok) {
        const newData = await response.json();
        setMemberships([...memberships, newData]);
        setShowPopup(false);
        setNewMembership({ name: '', type: '', startDate: '', endDate: '' });
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
        const response = await fetch(`https://gymautomation.onrender.com/memberships/name/${encodeURIComponent(membershipToDelete)}`, {
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
        setShowConfirmModal(false);
        setMembershipToDelete(null);
      }
    };

    deleteMembership();
  };

  const handleConfirmDelete = (name) => {
    setMembershipToDelete(name);
    setShowConfirmModal(true);
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

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-auto w-full sm:max-w-5xl mt-3">
        <div className="pb-4 bg-white dark:bg-gray-900 flex justify-between p-4">
          <button
            onClick={() => {
              setNewMembership({ name: '', type: '', startDate: '', endDate: '' });
              setEditingMembership(null);
              setShowPopup(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add Membership
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
                  <th scope="col" className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {memberships.map((item, index) => {
                  const isExpired = new Date(item.endDate) < new Date(); 
                  return (
                    <tr key={index} className={isExpired ? 'bg-red-100' : 'bg-green-100'}>
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.type}</td>
                      <td className="px-4 py-2">{item.startDate}</td>
                      <td className="px-4 py-2">{item.endDate}</td>
                      <td className="px-4 py-2 flex space-x-2">
                        <button onClick={() => handleEditMembership(item)} className="text-blue-500 hover:underline">
                          <FontAwesomeIcon icon={faPenToSquare} className="h-5 w-5 inline" />
                        </button>
                        <button onClick={() => handleConfirmDelete(item.name)} className="text-red-500 hover:underline">
                          <FontAwesomeIcon icon={faTrash} className="h-5 w-5 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Membership Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">{editingMembership ? 'Edit Membership' : 'Add Membership'}</h2>
            <input
              type="text"
              placeholder="Name"
              value={newMembership.name}
              onChange={(e) => setNewMembership({ ...newMembership, name: e.target.value })}
              className="w-full mb-3 p-2 border border-gray-300 rounded-md"
            />
            <select
              value={newMembership.type}
              onChange={(e) => setNewMembership({ ...newMembership, type: e.target.value })}
              className="w-full border rounded-md mb-2 px-2 py-1"
              required
            >
              <option value="">Type</option>
              <option value="Gym">Gym</option>
              <option value="Yoga">Yoga</option>
              <option value="Zumba">Zumba</option>
              <option value="Pilates">Pilates</option>
              <option value="Dance">Dance</option>
              <option value="Boxing">Boxing</option>
              <option value="Martial Art">Martial Arts</option>
            </select>

            <input
              type="date"
              value={newMembership.startDate}
              onChange={(e) => setNewMembership({ ...newMembership, startDate: e.target.value })}
              className="w-full mb-3 p-2 border border-gray-300 rounded-md"
            />
            <input
              type="date"
              value={newMembership.endDate}
              onChange={(e) => setNewMembership({ ...newMembership, endDate: e.target.value })}
              className="w-full mb-3 p-2 border border-gray-300 rounded-md"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMembership}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                {editingMembership ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete {membershipToDelete}?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mr-2"
                onClick={handleDeleteMembership}
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

export default Membership;
