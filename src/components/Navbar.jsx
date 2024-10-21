import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Disclosure } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import cz from './cz.jpg';
import axios from 'axios';

const initialNavigation = [
  { name: 'Home', to: '/landingpage', current: false },
  { name: 'Membership', to: '/membership', current: false },
  { name: 'Trainer', to: '/Trainers', current: false },
  { name: 'Employees', to: '/Employees', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const [navigation, setNavigation] = useState(initialNavigation);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [role, setRole] = useState(null); // State to store user role
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUserRole = async () => {
      const username = localStorage.getItem('username');
      const token = localStorage.getItem('token');
      if (username && token) {
        try {
          // Fetch the user role from the server using the correct endpoint
          const userResponse = await axios.get(`https://gymautomation.onrender.com/role/${username}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const userRole = userResponse.data.role;
          console.log("-----------------------");
          console.log(userRole);
          console.log("-----------------------");
          setRole(userRole);
        } catch (error) {
          console.error('Failed to fetch user role:', error);
        }
      }
    };
    fetchUserRole();
  }, []);
  

  // Define handleLogout
  const handleLogout = async () => {
    try {
      await fetch('https://gymautomation.onrender.com/logout', { method: 'POST', credentials: 'include' });
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      navigate('/'); 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <Disclosure as="nav" className="bg-black">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <Link to="/landingpage">
                      <img className="h-8 w-auto" src={cz} alt="Your Company" />
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.to}
                          className={classNames(
                            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'rounded-md px-3 py-2 text-sm font-medium'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}

                      {/* Conditionally render Dashboard only for superadmin */}
                      {role === 'superadmin' && (
                        <Link
                          to="/dashboard"
                          className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                        >
                          Dashboard
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {/* Logout button */}
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm ring-1 ring-gray-900/10 transition-all hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Conditionally render Dashboard for mobile view */}
                {role === 'superadmin' && (
                  <Link
                    to="/dashboard"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Confirm Logout Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mr-2"
                onClick={handleLogout}
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
    </>
  );
}
