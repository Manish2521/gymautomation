import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import Membership from './components/Membership';
import Dashboard from './components/Dashboard';
import AvailablePlans from './components/AvailablePlans';
import GymRevenue from './components/GymRevenue';
import Employees from './components/Employees';
import Trainers from './components/Trainers';
import Gymers from './components/Gymers';
import GymEquipment from './components/GymEquipment';
import ClassesOffered from './components/ClassesOffered';
import Error from './components/Error';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/availableplans" element={<AvailablePlans />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Gymers" element={<Gymers />} />
        <Route path="/GymRevenue" element={<GymRevenue />} />
        <Route path="/Employees" element={<Employees />} />
        <Route path="/Trainers" element={<Trainers />} />
        <Route path="/GymEquipment" element={<GymEquipment />} />
        <Route path="/ClassesOffered" element={<ClassesOffered />} />
        <Route path="/error" element={<Error />} />
      </Routes>
    </Router>
  );
};

export default App;
