import React, { useEffect, useState } from 'react';
import axios from "axios";
import "./Profile.css";


const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { 
          setError("You Are Not Logged In.");
          setLoading(false);
          return;
        }
      
        const res = await axios.get("http://localhost:3000/auth/profile", {
          headers: { 
            Authorization: `Bearer ${token}`,
           },
      });

      if (!res.ok) { 
        throw new Error("Faild to fetch Profile data");
      }


      const data = await res.json();
      setUser(data);
      } catch (err) {
        setError(err.message || "Something Went Wronge");
      } finally {
        setLoading(false);
      }
  };

  fetchProfile();
}, []);

if (loading) return <p>Loading Profile...</p>;
if (error) return <p style={{ color: "red" }}>{error}</p>;

return (
  <div style={{ padding: "20px" }}>
    <h1>My Peofile</h1>
    {user ? (
    <div>
      <p><strong>Name:</strong>{user?.name}</p>
      <p><strong>Email:</strong>{user?.email}</p>
      <p><strong>Joined:</strong> {new Data(user?.createdAt).toLocalDataString()}</p>
    </div>
    ) : (
      <p>No User Data Found.</p>
    )}
  </div>
  
  );
};

export default Profile 