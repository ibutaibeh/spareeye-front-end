import React from 'react'
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
      return !(username && password && email && password===passwordConf)
    }

  return (
    <>
    <h1>Sign Up</h1>
    <p>{message}</p>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input className= 'text-gray-900' type="text" name='username' id='username' value={username} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input className= 'text-gray-900'  type="text" name='email' id='email' onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input className= 'text-gray-900'  type="text" name='password' id='password' value={password} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="confirm">Confirm Password:</label>
        <input className= 'text-gray-900'  type="password" name='passwordConf' id='passwordConf' value={passwordConf} onChange={handleChange} required />
      </div>

      <div>
        <button disabled={isFormValid()}>Sign Up</button>
        <button onClick={()=>navigate('/')}>Cancel</button>

      </div>


    </form>
    
    </>
  )
}

export default SignUpForm