import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DeleteAcc(){
    const [users, setUsers] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);


    const fetchListUser = async () => {

        try{
            const token = localStorage.getItem('token');
            const response = await axios.get('/quanly/users',{
                headers : { Authorization : `Bearer ${token}`}
            });
            setUsers(response.data.result);
        }catch(err){
            const backendMessage = err.response?.data?.message;
            setError(backendMessage || 'Không thể tải danh sách tài khoản!');
        }finally{
            setLoading(false);
        }
    }

    const handleDelete = async(userId) =>{
        if (!window.confirm('Bạn có chắc muốn xóa user này?')) return;
        
        try{
            const token = localStorage.getItem('token');
            const response = await axios.delete(`/quanly/users/${userId}`,{
                headers : { Authorization : `Bearer ${token}`}
            });

            setUsers(prev => prev.filter(u => u.id !== userId));
        }catch(err){
            const backendMessage = err.response?.data?.message;
            setError(backendMessage || 'Không thể xoá tài khoản!');
        }
    }
    
    useEffect(() => {fetchListUser()}, []);

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Danh sách User</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="border p-2">Username</th>
                        <th className="border p-2">Role</th>
                        <th className="border p-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                        <td className="border p-2 text-center w-16">{user.username}</td>
                        <td className="border p-2 text-center w-16">{user.role}</td>
                        <td className="border p-2 text-center w-16">
                            <button
                                onClick={() => handleDelete(user.id)}
                            >
                                Xóa
                            </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
           
        </div>
    );
}