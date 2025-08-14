import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage/HomePage';
import SignInForm from './components/SignInForm/SignInForm';
import SignUpForm from './components/SignUpForm/SignUpForm';
import Profile from './components/Profile/Profile';
import MyRequests from './components/MyRequests/MyRequests';
import Settings from './components/Settings/Settings';

import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/sign-in' element={<SignInForm />} />
          <Route path='/sign-up' element={<SignUpForm />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/my-requests' element={<MyRequests />} />
          <Route path='/settings' element={<Settings />} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </Router>
  );
};

export default App