import React, { useEffect } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { useContext, useState } from 'react'
import { signUp } from '../../services/authService'
import { useNavigate } from 'react-router'

const SignUpForm = () => {

  const navigate= useNavigate();
  const {setUser}= useContext(UserContext)
  const [message,setMessage]=useState('') 
  const [formData,setFormData]=useState({
    username:'',
    email:'',
    password:'',
    passwordConf:'',
  })
  const {username,email,password,passwordConf}=formData

  const handleChange =(evt)=>{
        setMessage('');
        setFormData({...formData, [evt.target.name]:evt.target.value})
    };

    const handleSubmit = async (evt)=>{
      evt.preventDefault()
      console.log(formData)
      const newUser = await signUp(formData)
      setUser(newUser)
      navigate('/')
    }

    const isFormValid=()=>{
      return (username && password && email && password===passwordConf)
    }
  return (
    <>
  <div className="max-w-md mx-auto mt-16 p-6 bg-gray-800 rounded-2xl shadow-lg">
    <h1 className="text-2xl font-bold text-white mb-4 text-center">Sign Up</h1>
    <p className="text-center text-red-400 mb-4">{message}</p>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col">
        <label htmlFor="username" className="mb-1 font-medium text-gray-200">Username:</label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={handleChange}
          required
          className="p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="email" className="mb-1 font-medium text-gray-200">Email:</label>
        <input
          type="text"
          name="email"
          id="email"
          value={email}
          onChange={handleChange}
          required
          className="p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="password" className="mb-1 font-medium text-gray-200">Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={handleChange}
          required
          className="p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="passwordConf" className="mb-1 font-medium text-gray-200">Confirm Password:</label>
        <input
          type="password"
          name="passwordConf"
          id="passwordConf"
          value={passwordConf}
          onChange={handleChange}
          required
          className="p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-between mt-4">
        <button
          type="submit"
          disabled={!isFormValid()}
          className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:hover:bg-blue-900"
        >
          Sign Up
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</>

  )
}

export default SignUpForm