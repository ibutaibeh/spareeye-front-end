import { useEffect, useState } from 'react';

import * as requestService from '../../services/requestService';

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
      <h1>Requests</h1>

      <ul>
        {requests.map((request, index) => (
          <li key={index}>request.date</li>
      ))}

      </ul>
    </main>
  );
};

export default MyRequest;
