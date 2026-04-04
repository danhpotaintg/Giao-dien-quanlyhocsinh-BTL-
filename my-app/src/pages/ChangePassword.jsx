// src/pages/ChangePassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
  const navigate = useNavigate();
  
  // 1. Cập nhật state có thêm oldPassword
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // 2. Kiểm tra khớp mật khẩu mới ở FE
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' });
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 8 ký tự!' });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // 3. Payload gửi kèm cả oldPassword và password mới
      const payload = {
        oldPassword: formData.oldPassword,
        password: formData.newPassword 
      };

      await axios.put('/quanly/users', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });

      

    } catch (error) {
      const errorResponse = error.response?.data?.message;
      setMessage({ type: 'error', text: errorResponse || 'Có lỗi xảy ra khi đổi mật khẩu!' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Đổi mật khẩu</h2>
        <p className="text-sm text-gray-500 mt-2">Vui lòng nhập mật khẩu hiện tại để xác thực</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-3 rounded-lg text-sm text-center font-medium ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Ô NHẬP MẬT KHẨU CŨ */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu hiện tại</label>
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            placeholder="Nhập mật khẩu đang sử dụng..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            required
          />
        </div>

        <hr className="border-gray-100" />

        {/* Ô NHẬP MẬT KHẨU MỚI */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu mới</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Tối thiểu 8 ký tự..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu mới..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            required
          />
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 text-white font-bold rounded-xl shadow-md transition-all ${
              isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {isLoading ? 'Đang kiểm tra...' : 'Xác nhận cập nhật'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 bg-gray-50 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </form>
    </div>
  );
}