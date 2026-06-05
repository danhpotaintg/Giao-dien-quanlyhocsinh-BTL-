// src/student-components/StudentUpdate.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function StudentUpdate() {
  // 1. Khởi tạo state chỉ chứa thông tin cá nhân
  const [formData, setFormData] = useState({
    id: '', 
    fullName: '',
    dob: '',
    parentGmail: '',
    parentPhonenumber: '',
    gender: 'MALE'
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchMyInfo();
  }, []);

  const fetchMyInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/quanly/students/my-info', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const studentData = response.data.result;
      
      setFormData({
        id: studentData.id,
        fullName: studentData.fullName || '',
        dob: studentData.dob || '', 
        parentGmail: studentData.parentGmail || '',
        parentPhonenumber: studentData.parentPhonenumber || '',
        gender: studentData.gender || 'MALE'
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Không thể tải thông tin. Vui lòng thử lại!' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      
      // 2. Payload bây giờ chỉ gửi các thông tin cá nhân
      const updatePayload = {
        fullName: formData.fullName,
        dob: formData.dob,
        parentGmail: formData.parentGmail,
        parentPhonenumber: formData.parentPhonenumber,
        gender: formData.gender
      };

      await axios.put(`/quanly/students/${formData.id}`, updatePayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật!';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center mt-10">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Thông tin cá nhân</h2>

      {message.text && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* --- THÔNG TIN CÁ NHÂN --- */}
        <div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- THÔNG TIN PHỤ HUYNH --- */}
        <div className="pt-2 border-t mt-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3 mt-2">Liên hệ Phụ huynh</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Phụ huynh</label>
              <input
                type="email"
                name="parentGmail"
                value={formData.parentGmail}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SĐT Phụ huynh</label>
              <input
                type="text"
                name="parentPhonenumber"
                value={formData.parentPhonenumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Nút Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className={`px-6 py-2 text-white font-medium rounded shadow-sm ${
              isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
          >
            {isSaving ? 'Đang xử lý...' : 'Lưu thông tin'}
          </button>
        </div>
      </form>
    </div>
  );
}