import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import * as requestService from '../../services/requestService';
import AddNewRequest from '../AddNewRequest/AddNewRequest';

const MyRequest = () => {
  const [requests, setRequests] = useState([])

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

  return (
    <main>
      <h1>My Requests</h1>
      <Link to={'/requests/addnewrequest'}>Add Request</Link>
        {requests.length>0 ? (<p>{requests.length} requests </p>):(<p>add new request</p>)}
      <ul>
        {requests.map((request, index) => ( 
          <div className='requestList'>
          <li key={index}>Request {index+1} | {new Date(request.date).toISOString().split('T')[0]}</li>
          <h1>Edit</h1>
          <h1>Delete</h1>
          </div>
      ))}


      </ul>
    </main>
  );
};

export default MyRequest;
