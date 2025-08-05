import React from 'react'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router'
import {signIn} from '../../services/authService'
import {UserContext} from '../../contexts/UserContext'

const SignInForm = () => {
    const navigate = useNavigate()
    const {setUser}= useContext(UserContext)
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
        <h1>Sign In</h1>
        <p>{message}</p>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username:</label>
                <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} required />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input type="text" name="password" id="password" value={formData.password} onChange={handleChange} required />
            </div>
            <button>Sign In</button>
            <button onClick={()=>navigate('/')}>Cancel</button>


        </form>
        
        </>
    
  )
}

export default SignInForm