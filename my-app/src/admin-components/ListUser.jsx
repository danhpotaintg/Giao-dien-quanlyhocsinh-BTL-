import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    
    // State cho việc cập nhật mật khẩu
    const [showInputId, setShowInputId] = useState(null);
    const [newPassword, setNewPassword] = useState("");

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/quanly/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data.result);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải danh sách tài khoản!');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý Xóa tài khoản
    const handleDelete = async (userId, username) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${username}"?`)) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/quanly/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(prev => prev.filter(u => u.id !== userId));
            setSuccess("Xóa tài khoản thành công!");
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể xoá tài khoản!');
            setTimeout(() => setError(''), 3000);
        }
    };

    // Xử lý Đổi mật khẩu
    const handleUpdatePassword = async (userId) => {
        if (!newPassword.trim()) {
            alert("Vui lòng nhập mật khẩu mới");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/quanly/users/${userId}`, 
                { password: newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess("Cập nhật mật khẩu thành công!");
            setNewPassword('');
            setShowInputId(null);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể đổi mật khẩu!');
            setTimeout(() => setError(''), 3000);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <div className="p-6 text-center text-blue-600 font-bold">Đang tải dữ liệu...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-700">Quản lý Tài khoản Hệ thống</h2>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        Tổng cộng: {users.length} user
                    </span>
                </div>

                {/* Thông báo */}
                {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md border border-green-200">{success}</div>}
                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-200">{error}</div>}

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-blue-600 text-white">
                                <th className="p-3 text-left">Tên tài khoản</th>
                                <th className="p-3 text-center">Vai trò</th>
                                <th className="p-3 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="p-3 font-medium text-gray-800">{user.username}</td>
                                    <td className="p-3 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setShowInputId(showInputId === user.id ? null : user.id);
                                                        setNewPassword("");
                                                    }}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition"
                                                >
                                                    Đổi mật khẩu
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id, user.username)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                                                >
                                                    Xóa
                                                </button>
                                            </div>

                                            {/* Giao diện nhập mật khẩu nhanh */}
                                            {showInputId === user.id && (
                                                <div className="mt-2 p-3 bg-gray-100 rounded-md shadow-inner flex gap-2 w-full max-w-xs">
                                                    <input
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        placeholder="Mật khẩu mới..."
                                                        className="flex-1 p-1 text-sm border rounded"
                                                        autoFocus
                                                    />
                                                    <button 
                                                        onClick={() => handleUpdatePassword(user.id)}
                                                        className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                                                    >
                                                        Lưu
                                                    </button>
                                                    <button 
                                                        onClick={() => setShowInputId(null)}
                                                        className="bg-gray-400 text-white px-2 py-1 rounded text-xs"
                                                    >
                                                        Hủy
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}