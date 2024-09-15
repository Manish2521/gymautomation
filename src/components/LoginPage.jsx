import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to generate a random token
  const generateToken = () => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let token = '';
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error
    setLoading(true); // Start loading

    let timeout = setTimeout(() => {
      setError('Response not received. Please try again after 1 minute.');
      setLoading(false); // Stop loading after timeout
    }, 5000); // Timeout after 5 seconds

    try {
      const response = await axios.post('https://gymautomation.onrender.com/login', {
        username,
        password,
      }, {
        withCredentials: true 
      });
      
      clearTimeout(timeout);
      setLoading(false); // Stop loading after success
      
      if (response.status === 200) {
        const token = generateToken();  
        localStorage.setItem('token', token);
        navigate('/landingpage');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } catch (err) {
      clearTimeout(timeout);
      setLoading(false); // Stop loading on error
      
      if (err.response) {
        console.error('Response error:', err.response); 
        if (err.response.status === 401) {
          setError('Incorrect username or password.');
        } else if (err.response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } else if (err.request) {
        console.error('Response error:', err.response); 
        setError('Unable to connect to the server. Please try again later.');
      } else {
        console.error('Response error:', err.response); 
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 py-12 bg-gray-100">
      {/* Loading Spinner with Background Blur */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
            <p className="mt-4 text-white">Please wait...</p>
          </div>
        </div>
      )}

      <div className={`relative z-10 max-w-sm w-full bg-white p-8 rounded-lg shadow-lg transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}>
        <h2 className="text-2xl font-bold mb-4 text-center">Sign in to your account</h2>
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-800 border border-red-300">
            <p>{error}</p>
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-900">Username</label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                placeholder="Username"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
