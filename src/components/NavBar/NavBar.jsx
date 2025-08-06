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
      
      {user ? (
        <>
        <p>welcome,{user.username}</p>
        <div className='navbar'>
        <Link to='/profile'>Profile</Link>
        <Link to='/'>Home</Link>
        <Link to='/my-requests'>My Requests</Link>
        <Link to='/settings'>Settings</Link>
        <Link to='/' onClick={handleSignOut}>sign out</Link>
        </div>
        </>
        ):(
          <>
          <img src="https://picsum.photos/id/1/200" alt="logoPlaceholder" />
          <div className='navbar'>
          <Link to='/sign-up'>Sign Up</Link>
          <Link to= '/sign-in'>Sign In</Link>
          </div>
          </>
        )}

    </nav>
    </>
  )
}

export default NavBar