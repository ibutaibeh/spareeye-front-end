import { useState } from 'react'
import { useNavigate } from 'react-router'
import {signIn} from '../../services/authService'

const SignInForm = ({ setUser }) => {
    const navigate = useNavigate()
    const [message,setMessage]=useState('')

    const [formData,setFormData]=useState({
        username:'',
        password:'',
    })

    const handleChange =(evt)=>{
        setMessage('');
        setFormData({...formData, [evt.target.name]:evt.target.value})
    };
    
    const handleSubmit = async (evt)=>{
        evt.preventDefault()
        try {
            const signedInUser = await signIn(formData)
            setUser(signedInUser);
            navigate('/')
            
        } catch (error) {
            setMessage(error.message)
            
        }
    }
  return (
       <>
  <div className="max-w-md mx-auto mt-16 p-6 bg-gray-800 rounded-2xl shadow-lg">
    <h1 className="text-2xl font-bold text-white mb-4 text-center">Sign In</h1>
    <p className="text-center text-red-400 mb-4">{message}</p>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col">
        <label htmlFor="username" className="mb-1 font-medium text-gray-200">Username:</label>
        <input
          type="text"
          name="username"
          id="username"
          value={formData.username}
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
          value={formData.password}
          onChange={handleChange}
          required
          className="p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex justify-between mt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Sign In
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

export default SignInForm