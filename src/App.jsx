import React from 'react'
import HomePage from './pages/HomePage/HomePage'
import SignInForm from './components/SignInForm/SignInForm'
import SignUpForm from './components/SignUpForm/SignUpForm'
import { Route, Routes } from 'react-router'
import './App.css'
import Profile from './components/Profile/Profile'
import MyRequests from './components/MyRequests/MyRequests'
import Settings from './components/Settings/Settings'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />}>
          <Route path='/sign-up' element={<SignUpForm />} />
          <Route path='/sign-in' element={<SignInForm />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/my-requests' element={<MyRequests />} />
          <Route path='/settings' element={<Settings />} />
        </Route>
      </Routes>
    </>
  )
}

export default App