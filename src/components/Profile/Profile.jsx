import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon, EnvelopeIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You are not logged in.");
          setLoading(false);
          return;
        }

        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to fetch profile data.");
        }

        const data = await res.json();
        setUser(data.user || data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-lg p-8 text-center">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <img
            className="w-28 h-28 rounded-full border-4 border-blue-500 shadow-md"
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=3b82f6&color=fff&size=128`}
            alt="Profile Avatar"
          />
        </div>

        {/* Name */}
        <h1 className="text-2xl font-bold text-gray-800 mb-1">{user?.name || "N/A"}</h1>
        <p className="text-gray-500 mb-6">{user?.role || "User"}</p>

        {/* Info List */}
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3">
            <UserIcon className="h-5 w-5 text-blue-500" />
            <span className="text-gray-700">{user?.name || "N/A"}</span>
          </div>
          <div className="flex items-center gap-3">
            <EnvelopeIcon className="h-5 w-5 text-blue-500" />
            <span className="text-gray-700">{user?.email || "N/A"}</span>
          </div>
          <div className="flex items-center gap-3">
            <CalendarDaysIcon className="h-5 w-5 text-blue-500" />
            <span className="text-gray-700">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate("/edit-profile")}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
