// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  // Tạo state lưu trữ dữ liệu người dùng nhập từ bàn phím
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Lưu thông báo lỗi nếu sai pass
  const [isLoading, setIsLoading] = useState(false);

  // Hàm xử lý khi bấm nút Đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trang web bị reload khi submit form
    setError('');
    setIsLoading(true);

    try {
  // Bước 1: Đăng nhập lấy token
  const response = await axios.post('/quanly/auth/log-in', {
    username: username,
    password: password
  });

  const token = response.data.result.token;
  localStorage.setItem('token', token);

  // Bước 2: Lấy thông tin user hiện tại
  const userResponse = await axios.get('/quanly/users/my-info', {
    headers: { Authorization: `Bearer ${token}` }
  });

  const role = userResponse.data.result.roles[0]; // lấy role đầu tiên
  localStorage.setItem('role', role);

  onLogin(role);

} catch (err) {
  if (err.response && err.response.status === 401) {
    setError('Sai tên đăng nhập hoặc mật khẩu!');
  } else {
    setError('Không thể kết nối đến Server. Vui lòng thử lại sau!');
  }
  }
};

  return (
    <div className="flex h-screen items-center justify-center bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">ĐĂNG NHẬP HỆ THỐNG</h2>
        
        {/* Hiển thị lỗi nếu có */}
        {error && <div className="mb-4 text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tài khoản</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input 
              type="password" 
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`mt-2 w-full text-white py-2 rounded transition-colors ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}