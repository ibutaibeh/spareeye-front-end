import React, { useContext, useState } from 'react'
import { Link } from 'react-router'
import { UserContext } from '../../contexts/UserContext'

const NavBar = () => {

  const {user,setUser}= useContext(UserContext)
  const handleSignOut =()=>{
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <>
    <nav>
      <Link to='/'>Home</Link>
      {user ? (
        <div>
        <p>welcome,{user.username}</p>
        <Link to='/' onClick={handleSignOut}>sign out</Link>
        </div>
        ):(
          <div className='navbar'>
          <Link to='/sign-up'>Sign Up</Link>
          <Link to= '/sign-in'>Sign In</Link>
          </div>
        )}

    </nav>
    </>
  )
}

export default NavBar