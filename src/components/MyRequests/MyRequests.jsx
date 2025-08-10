import { useContext, useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import * as requestService from '../../services/requestService';
import {UserContext} from "../../contexts/UserContext"
import {deleteRequest} from "../../services/requestService"

const MyRequest = () => {
const [requests, setRequests] = useState([])
const {user}= useContext(UserContext)
const userRequestList =requests.filter(request=>request.owner._id === user._id)
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const fetchedRequest = await requestService.loadReqeusts();
        setRequests(fetchedRequest)
      } catch (err) {
        console.log(err)
      }
    }
    fetchRequests()
  }, [requests]);
const handleDeleteRequest =async(reqId)=>{
const deletedReq = await deleteRequest(reqId)
setRequests(requests.filter((req)=> req._id!==deletedReq?._id))

}
  return (
    <main>
      <h1>My Requests</h1>
      <Link to={'/requests/addnewrequest'}>Add New Request</Link>
        {userRequestList.length>0 ? (<p>{userRequestList.length} requests </p>):(<p> --- 0 request ---</p>)} 
      <ul>
        {requests
        .filter(request=>request.owner._id === user._id)
        .map((request, index) => ( 
          <div key={index} className='requestList'>
          <li>Request {index+1} | {request.name} | {new Date(request.createdAt).toISOString().split('T')[0]}</li>
          <Link to={`/requests/${request._id}`}>Edit</Link>
          <button onClick={()=>handleDeleteRequest(request._id)}>Delete</button>
          </div>
          ))}
      </ul>
    </main>
  );
};

export default MyRequest;
