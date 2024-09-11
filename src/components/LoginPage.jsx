import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
    // setLoading(true); // Start loading

    try {
      // Replace with your backend login route

      const response = await axios.post('https://gymautomation.onrender.com/login', {

        username,
        password,

      }, {

        withCredentials: true // Allow credentials (cookies) to be included

      });

      if (response.status === 200) {
        const token = generateToken();  // Generate secure token
        localStorage.setItem('token', token);
        navigate('/landingpage');

      } else {

        setError('An unexpected error occurred. Please try again.');

      }

    } catch (err) {

      if (err.response) {

        // Server responded with a status code outside the range of 2xx

        if (err.response.status === 401) {

          setError('Incorrect username or password.');

        } else if (err.response.status === 500) {

          setError('Server error. Please try again later.');

        } else {

          setError('An unexpected error occurred. Please try again.');

        }

      } else if (err.request) {

        setError('Unable to connect to the server. Please try again later.');

      } else {

        setError('An error occurred. Please try again.');

      }

    }

  };



  return (

    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">

        <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />

        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>

      </div>



      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

        <form className="space-y-6" onSubmit={handleSubmit}>

          {error && (

            <div className="rounded-md bg-red-50 p-4 text-red-800 border border-red-300">

              <p>{error}</p>

            </div>

          )}



          <div>

            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username</label>

            <div className="mt-2">

              <input

                id="username"

                name="username"

                type="text"

                autoComplete="username"

                required

                value={username}

                onChange={(e) => setUsername(e.target.value)}

                className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"

                placeholder="Username"

              />

            </div>

          </div>



          <div>

            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>

            <div className="mt-2">

              <input

                id="password"

                name="password"

                type="password"

                autoComplete="current-password"

                required

                value={password}

                onChange={(e) => setPassword(e.target.value)}

                className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"

                placeholder="Password"

              />

            </div>

          </div>



          <button

            type="submit"

            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm ring-1 ring-gray-900/10 transition-all hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"

          >

            Sign in

          </button>

        </form>

      </div>

    </div>

  );

};



export default LoginPage;
