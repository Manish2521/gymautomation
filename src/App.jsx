import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import Membership from './components/Membership';
import Error from './components/Error';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/error" element={<Error />} />
      </Routes>
    </Router>
  );
};

export default App;
