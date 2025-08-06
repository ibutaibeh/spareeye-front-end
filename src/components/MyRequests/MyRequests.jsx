import { useEffect, useContext } from 'react';

import * as requestService from '../../services/requestService';

const MyRequest = () => {

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const fetchedRequest = await requestService.loadReqeusts();
        console.log(fetchedRequest);
      } catch (err) {
        console.log(err)
      }
    }
  }, []);

  return (
    <main>
      <h1>Requests</h1>
    </main>
  );
};

export default MyRequest;
