import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import * as requestService from '../../services/requestService';
import { deleteRequest } from "../../services/requestService"

const MyRequest = ({ user }) => {
  const [requests, setRequests] = useState([])
  const userRequestList = requests.filter(request => request.owner._id === user._id)
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const fetchedRequest = await requestService.loadRequests();
        setRequests(fetchedRequest)
      } catch (err) {
        console.log(err)
      }
    }
    fetchRequests()
  }, [requests]);
  const handleDeleteRequest = async (reqId) => {
    const deletedReq = await deleteRequest(reqId)
    setRequests(requests.filter((req) => req._id !== deletedReq?._id))

  }
  return (
<main className="p-6 bg-[var(--color-bg)] dark:bg-[var(--color-bg)] min-h-screen">
  <div className="text-center mb-4">
    <h1 className="text-3xl font-bold text-[var(--color-header)] dark:text-[var(--color-header)]">
      My Requests
    </h1>
    <p className="text-[var(--color-secondary)] dark:text-[var(--color-secondary)]">
      {userRequestList.length > 0
        ? `${userRequestList.length} requests`
        : "--- 0 request ---"}
    </p>
  </div>

  <div className="flex justify-end mb-6">
    <Link
      to="/requests/addnewrequest"
      className="px-4 py-2 bg-[var(--color-primary)] dark:bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition"
    >
      Add New Request
    </Link>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {requests
      .filter((request) => request.owner._id === user._id)
      .map((request, index) => (
        <div
          key={index}
          className="bg-[var(--color-card)] dark:bg-[var(--color-card)] hover:bg-opacity-90 shadow-md rounded-lg p-4 flex flex-col justify-between transform transition duration-300 hover:scale-105 hover:shadow-lg"
        >
          
          {/* Clickable Card Area */}
          <Link to={`/requests/${request._id}`} className="block flex-1">
            <h2 className="text-lg font-semibold text-[var(--color-text)] dark:text-[var(--color-text)]">
              {request.carDetails.carMade} - {request.carDetails.carModel} ({request.carDetails.carYear})
            </h2>
            <p className="text-[var(--color-text)] dark:text-[var(--color-text)]">
              {request.name}
            </p>
            <p className="text-sm text-[var(--color-secondary)] dark:text-[var(--color-secondary)]">
              {new Date(request.createdAt).toISOString().split("T")[0]}
            </p>
          </Link>

          {/* Delete Button */}
          <div className="mt-4">
            <button
              onClick={() => handleDeleteRequest(request._id)}
              className="text-red-600 dark:text-red-400 hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
  </div>
</main>


  );
};

export default MyRequest;
