import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';
import Footer from './Footer';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'admin' });
  const [editingUser, setEditingUser] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // 'success' or 'error'
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showPassword, setShowPassword] = useState(new Set());
  const navigate = useNavigate();

  const handleTogglePassword = (index) => {
    const updatedSet = new Set(showPassword);
    if (updatedSet.has(index)) {
      updatedSet.delete(index); // Hide password
    } else {
      updatedSet.add(index); // Show password
    }
    setShowPassword(updatedSet);
  };

  // Check if user role is superadmin 
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    const checkUserRole = async () => {
      try {
        const response = await fetch(`https://gymautomation.onrender.com/role/${username}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.role !== 'superadmin') {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          navigate('/error');
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/error');
      }
    };

    if (token && username) {
      checkUserRole();
    } else {
      navigate('/error');
    }
  }, [navigate]);
  



  

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
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/error');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://gymautomation.onrender.com/users'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setAlertMessage('Error fetching user data');
        setAlertType('error');
        autoDismissAlert();
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.password) {
      setAlertMessage('Please fill in all fields');
      setAlertType('error');
      autoDismissAlert();
      return;
    }

    try {
      const response = await fetch('https://gymautomation.onrender.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const addedUser = await response.json();
        setUsers([...users, addedUser]);
        setShowPopup(false);
        setNewUser({ username: '', password: '', role: 'admin' });
        setAlertMessage('User added successfully');
        setAlertType('success');
        autoDismissAlert();
      } else {
        throw new Error('Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setAlertMessage('Error adding user');
      setAlertType('error');
      autoDismissAlert();
    }
  };

  const handleEditUser = async () => {
    if (!newUser.username || !newUser.password) {
      setAlertMessage('Please fill in all fields');
      setAlertType('error');
      autoDismissAlert();
      return;
    }

    try {
      const response = await fetch(`https://gymautomation.onrender.com/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(user => user._id === updatedUser._id ? updatedUser : user));
        setShowPopup(false);
        setNewUser({ username: '', password: '', role: editingUser.role });
        setEditingUser(null);
        setAlertMessage('User updated successfully');
        setAlertType('success');
        autoDismissAlert();
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setAlertMessage('Error updating user');
      setAlertType('error');
      autoDismissAlert();
    }
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user); // Set the entire user object
    setShowConfirmModal(true);
};

  const confirmDeleteUser = async () => {
    try {
      const response = await fetch(`https://gymautomation.onrender.com/users/${userToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter(user => user._id !== userToDelete));
        setAlertMessage('User deleted successfully');
        setAlertType('success');
        autoDismissAlert();
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setAlertMessage('Error deleting user');
      setAlertType('error');
      autoDismissAlert();
    } finally {
      setShowConfirmModal(false);
    }
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
      
      {/* Loading Indicator */}
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

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-auto w-full sm:max-w-5xl mt-3 mb-40">
        <div className="pb-4 bg-white flex justify-between p-4">
          <button onClick={() => {
              setNewUser({ username: '', password: '', role: 'admin' });
              setShowPopup(true);
            }} 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 bg-gray-50">
              <tr>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Password</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="bg-white border-b">
                  <td className="px-4 py-2">{user.username}</td>
                  {/* <td className="px-4 py-2">{'•'.repeat(user.password.length)}</td> */}
                  
                  {/* Password logic Starts */}
                  <td className="px-4 py-2 flex items-center">
                      {/* Prevent structure break on clicking the toggle eye button */}
                      <div className="flex items-center" style={{ width: '50px' }}> 
                        <span className="mr-2" style={{ whiteSpace: 'nowrap' }}>
      
                          {showPassword.has(index) ? user.password : '•'.repeat(user.password.length)}
                        </span>
                        <button
                          onClick={() => handleTogglePassword(index)}
                          className="text-dark"
                        >
                          <FontAwesomeIcon icon={showPassword.has(index) ? faEye : faEyeSlash} />
                        </button>
                      </div>
                    </td>
                  {/* Password logic ends */}
                  
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button onClick={() => {
                      setEditingUser(user);
                      setNewUser({ username: user.username, password: user.password, role: user.role });
                      setShowPopup(true);
                    }} className="text-blue-500 hover:underline">
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button onClick={() => handleDeleteUser(user._id, user.username)} className="text-red-500 hover:underline">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit User Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">{editingUser ? 'Edit User' : 'Add User'}</h2>
            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="w-full mb-3 p-2 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="w-full mb-3 p-2 border border-gray-300 rounded-md"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full mb-4 p-2 border border-gray-300 rounded-md"
            >
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
            </select>
            <div className="flex justify-end">
              <button onClick={() => setShowPopup(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 mr-2">
                Cancel
              </button>
              <button onClick={editingUser ? handleEditUser : handleAddUser} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                {editingUser ? 'Update' : 'Add'}
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
            <p>Are you sure you want to delete?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mr-2"
                onClick={confirmDeleteUser}
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

export default Dashboard;
