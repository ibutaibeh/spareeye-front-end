import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import * as requestService from '../../services/requestService';
import { UserContext } from "../../contexts/UserContext"
import { deleteRequest } from "../../services/requestService"

const MyRequest = () => {
  const [requests, setRequests] = useState([])
  const { user } = useContext(UserContext)
  const userRequestList = requests.filter(request => request.owner._id === user._id)
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
  const handleDeleteRequest = async (reqId) => {
    const deletedReq = await deleteRequest(reqId)
    setRequests(requests.filter((req) => req._id !== deletedReq?._id))

  }
  return (
    <main className="p-6 bg-[var(--color-bg)] min-h-screen">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-[var(--color-text)]">My Requests</h1>
        <p className="text-gray-400">
          {userRequestList.length > 0
            ? `${userRequestList.length} requests`
            : "--- 0 request ---"}
        </p>
      </div>

      <div className="flex justify-end mb-6">
        <Link
          to="/requests/addnewrequest"
          className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-600 transition"
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
              className="bg-gray-200 hover:bg-gray-50 shadow-md rounded-lg p-4 flex flex-col justify-between transform transition duration-300 hover:scale-105 hover:shadow-lg"
            >
              {/* Clickable Card Area */}
              <Link
                to={`/requests/${request._id}`}
                className="block flex-1"
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  {request.carDetails.carMade} - {request.carDetails.carModel} ({request.carDetails.carYear})
                </h2>
                <p className="text-gray-700">{request.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(request.createdAt).toISOString().split("T")[0]}
                </p>
              </Link>

              {/* Delete Button Below */}
              <div className="mt-4">
                <button
                  onClick={() => handleDeleteRequest(request._id)}
                  className="text-red-600 hover:underline"
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
