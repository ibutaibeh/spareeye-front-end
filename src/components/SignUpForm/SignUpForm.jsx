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
    password:'',
    passwordConf:'',
    role:''
  })
  const {username,password,passwordConf,role}=formData

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
      return !(username && password && password===passwordConf)
    }

  return (
    <>
    <h1>Sign Up</h1>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input type="text" name='username' id='username' value={username} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="text" name='password' id='password' value={password} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="confirm">Confirm Password:</label>
        <input type="password" name='passwordConf' id='passwordConf' value={passwordConf} onChange={handleChange} required />
      </div>

      <div>
        <button disabled={isFormValid()} onClick={()=>navigate('/sign-in')} >Sign Up</button>
        <button onClick={()=>navigate('/')}>Cancel</button>

      </div>


    </form>
    
    </>
  )
}

export default SignUpForm