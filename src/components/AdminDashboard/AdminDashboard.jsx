import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    apiClient.get('/users')
      .then(res => setUsers(res.data))
      .catch(() => alert('Failed to load users'));
  }, []);

  const changeRole = async (id, role) => {
    try {
      await apiClient.put(`/users/${id}/role`, { role });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role } : u));
    } catch {
      alert('Failed to update role');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Admin Dashboard</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Role</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => changeRole(u._id, u.role === 'admin' ? 'user' : 'admin')}
                >
                  Toggle Role
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
