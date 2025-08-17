import { useContext } from 'react'
import HomePage from './pages/HomePage/HomePage'
import SignInForm from './components/SignInForm/SignInForm'
import SignUpForm from './components/SignUpForm/SignUpForm'
import { Route, Routes } from 'react-router'
import './App.css'
import Profile from './components/Profile/Profile'
import MyRequests from './components/MyRequests/MyRequests'
import Settings from './components/Settings/Settings'
import AddNewRequest from './components/AddNewRequest/AddNewRequest'
import EditRequest from './components/EditRequest/EditRequest'
import { UserContext } from "./contexts/UserContext";

const App = () => {
  const { user, setUser } = useContext(UserContext);

  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage user={user} setUser={setUser} />}>
          {user ? (<>
            <Route path='/profile' element={<Profile user={user} setUser={setUser} />} />
            <Route path='/requests' element={<MyRequests user={user} setUser={setUser} />} />
            <Route path='/settings' element={<Settings user={user} />} />
            <Route path='/requests/addnewrequest' element={<AddNewRequest user={user} />} />
            <Route path='/requests/:reqId' element={<EditRequest user={user} />} />
          </>) : (<>
            <Route path='/sign-up' element={<SignUpForm user={user} setUser={setUser} />} />
            <Route path='/sign-in' element={<SignInForm setUser={setUser} />} />
          </>
          )}
          <Route path='*' element={ <SignInForm setUser={setUser} />}  />

        </Route>
      </Routes>
    </>
  )
}

export default App