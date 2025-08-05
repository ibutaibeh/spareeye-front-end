import React from 'react'
import NavBar from './components/NavBar/NavBar'
import SignInForm from './components/SignInForm/SignInForm'
import SignUpForm from './components/SignUpForm/SignUpForm'
import { Route, Routes } from 'react-router'
import  './App.css'

const App = () => {
  return (
    <>
    <NavBar/>
    <h1>welcome to SpareEye</h1>
    <Routes>
      <Route path='/' element={<h1>SpareEye Homepage</h1>}/>
      <Route path='/sign-up' element={<SignUpForm/>} />
      <Route path='/sign-in' element={<SignInForm/>} />
    </Routes>
    </>
  )
}

export default App