import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'; 
import Navbar from './Navbar'; 
import Footer from './Footer'; 

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const navigate = useNavigate();
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    role: '',
  });
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // 'success' or 'error'
  const [editingEmployee, setEditingEmployee] = useState(null);


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
    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://gymautomation.onrender.com/employees'); // Update endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setAlertMessage('Error fetching employee data');
        setAlertType('error');
        autoDismissAlert();
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleAddEmployee = async () => {
    // Validate fields before submitting
    if (!newEmployee.name || !newEmployee.role) {
      setAlertMessage('Please fill in all fields'); // Alert message for empty fields
      setAlertType('error');
      autoDismissAlert();
      return; // Prevent form submission
    }
  
    // Add status to newEmployee object
    const employeeToAdd = {
      ...newEmployee,
    };
  
    try {
      const response = await fetch('https://gymautomation.onrender.com/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeToAdd), // Use updated object
      });
  
      if (response.ok) {
        const newData = await response.json();
        setEmployees([...employees, newData]);
        setShowPopup(false); // Close the popup
        setNewEmployee({ name: '', role: ''}); // Reset form
        setAlertMessage('Employee added successfully');
        setAlertType('success');
        autoDismissAlert();
      } else {
        throw new Error('Failed to add employee');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      setAlertMessage('Error adding employee');
      setAlertType('error');
      autoDismissAlert();
    }
  };
  
  const handleDeleteEmployee = () => {
    if (!employeeToDelete) return;

    const deleteEmployee = async () => {
      try {
        const response = await fetch(`https://gymautomation.onrender.com/employees/name/${encodeURIComponent(employeeToDelete)}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setEmployees(employees.filter((employee) => employee.name !== employeeToDelete));
          setAlertMessage('Employee deleted successfully');
          setAlertType('success');
          autoDismissAlert();
        } else {
          throw new Error('Failed to delete employee');
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        setAlertMessage('Error deleting employee');
        setAlertType('error');
        autoDismissAlert();
      } finally {
        setShowConfirmModal(false); // Close the confirmation modal
        setEmployeeToDelete(null); // Reset employee to delete
      }
    };

    deleteEmployee();
  };

  const handleConfirmDelete = (name) => {
    setEmployeeToDelete(name); // Set the employee name to delete
    setShowConfirmModal(true); // Show the confirmation modal
  };

  const handleEditEmployee = (employee) => {
    setNewEmployee(employee);
    setEditingEmployee(employee);
    setShowPopup(true);
  };

  const autoDismissAlert = () => {
    setTimeout(() => {
      setAlertMessage('');
      setAlertType('');
    }, 2000);
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
              setNewEmployee({ name: '', role: ''}); // Reset form with default status
              setEditingEmployee(null); // Reset editing state
              setShowPopup(true); // Open the popup
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add Employee
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
                  <th scope="col" className="px-4 py-2">Role</th>
                  <th scope="col" className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((item, index) => (
                  <tr key={index} className={'bg-green-100' }>
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{item.role}</td>
                    <td className="px-4 py-2 flex space-x-2">
                      <button onClick={() => handleEditEmployee(item)} className="text-blue-500 hover:underline">
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

      {/* Add/Edit Employee Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
            <input
              type="text"
              placeholder="Name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              required
              className="border rounded-lg p-2 mb-2 w-full"
            />
            <select
              value={newEmployee.role}
              onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
              required
              className="border rounded-lg p-2 mb-4 w-full"
            >
              <option value="">Select Role</option>
              <option value="developer">Developer</option>
              <option value="manager">Manager</option>
              <option value="designer">Designer</option>
            </select>
            <div className="flex justify-between">
              <button onClick={handleAddEmployee} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                {editingEmployee ? 'Update' : 'Add'}
              </button>
              <button onClick={() => setShowPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                Cancel
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
            <p>Are you sure you want to delete {employeeToDelete}?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mr-2"
                onClick={handleDeleteEmployee}
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

export default Employee;
