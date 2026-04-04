// src/admin components/UserList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token'); // ← lấy token từ localStorage

        const response = await axios.get('/quanly/users', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUsers(response.data.result);
      } catch (err) {
        const backendMessage = err.response?.data?.message;
        setError(backendMessage || 'Không thể tải danh sách user!');
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Danh sách User</h2>

      {error && <div className="text-red-500 bg-red-50 p-2 rounded mb-4">{error}</div>}

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="border p-2 text-center w-16" >{user.id}</td>
              <td className="border p-2 text-center w-16">{user.username}</td>
              <td className="border p-2 text-center w-16">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}