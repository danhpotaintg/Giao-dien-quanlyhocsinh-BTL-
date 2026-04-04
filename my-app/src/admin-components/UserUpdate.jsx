import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserUpdate(){
    const [users, setUsers] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [showInputId, setShowInputId] = useState(null);
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState("");

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

    const handleSubmit = async(userId) =>{
        if(!password.trim()) return;
        try{
            const token = localStorage.getItem('token');
            const response = await axios.put(`/quanly/users/${userId}`,
                {
                    password: password
                },
                {
                    headers: { Authorization : `Bearer ${token}`}
                }
            );

            setSuccess("Cập nhật mật khẩu thành công");
            setTimeout(() => setSuccess(''), 3000);
            setPassword('');
            setShowInputId(null);
        }catch(err){
            const backendMessage = err.response?.data?.message;
            setError(backendMessage || 'Không thể đổi mật khẩu!');
            setTimeout(() => setError(''), 3000);
        }
    }

     useEffect(() => {fetchListUser()}, []);
    
    if (loading) return <p>Đang tải...</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Danh sách User</h2>
            {success && <p style={{ color: 'green' }}>{success}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
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
                                onClick={() => setShowInputId(user.id)}
                            >
                                Thay đổi 
                            </button>

                            {showInputId === user.id && (
                                <div>
                                    <input
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Nhập mật khẩu mới"
                                    />
                                    <button onClick={() => handleSubmit(user.id)}>Submit</button>
                                    <button onClick={() => setShowInputId(false)}>Hủy</button>
                                </div>
                            )}

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
           
        </div>
    );
};