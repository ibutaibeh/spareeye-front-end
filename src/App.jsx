import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage'
import SignInForm from './components/SignInForm/SignInForm'
import SignUpForm from './components/SignUpForm/SignUpForm'
import Profile from './components/Profile/Profile'
import MyRequests from './components/MyRequests/MyRequests'
import Settings from './components/Settings/Settings'
import AddNewRequest from './components/AddNewRequest/AddNewRequest'
import EditRequest from './components/EditRequest/EditRequest'
import './App.css'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
          <Route path='/sign-up' element={<SignUpForm />} />
          <Route path='/sign-in' element={<SignInForm />} />                   
          <Route path='/profile' element={<Profile />} />
          <Route path='/edit-profile' element={<EditProfile />} />
          <Route path='/requests' element={<MyRequests />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/requests/addnewrequest' element={<AddNewRequest/>}/>
          <Route path='/requests/:reqId' element={<EditRequest/>}/>
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </Router>
  );
};

export default App