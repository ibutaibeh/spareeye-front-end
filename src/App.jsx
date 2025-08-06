import React from 'react'
import NavBar from './components/NavBar/NavBar'
import SignInForm from './components/SignInForm/SignInForm'
import SignUpForm from './components/SignUpForm/SignUpForm'
import { Route, Routes } from 'react-router'
import  './App.css'
import Profile from './components/Profile/Profile'
import MyRequests from './components/MyRequests/MyRequests'
import Settings from './components/Settings/Settings'

const App = () => {
  return (
    <>
    <NavBar/>
    <Routes>
      <Route path='/'/>
      <Route path='/sign-up' element={<SignUpForm/>} />
      <Route path='/sign-in' element={<SignInForm/>} />
      <Route path='/profile'element={<Profile/>}/>
      <Route path='/my-requests' element={<MyRequests/>}/>
      <Route path='/settings' element={<Settings/>}/>
    </Routes>
    </>
  )
}

export default App