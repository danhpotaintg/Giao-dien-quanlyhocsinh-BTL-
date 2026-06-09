import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [userName, setUserName] = useState('');
  const role = localStorage.getItem('role') || 'Người dùng';

  // Gọi API lấy tên người dùng dựa vào role
  useEffect(() => {
    const fetchUserInfo = async () => {
      // Nếu là ADMIN, không có tên trong DB nên gán luôn là ADMIN
      if (role.toUpperCase() === 'ADMIN') {
        setUserName('ADMIN');
        return;
      }
      
      try {
        const token = localStorage.getItem('token');
        let endpoint = '';
        
        if (role.toUpperCase() === 'TEACHER') {
          endpoint = '/quanly/teachers/my-info';
        } else if (role.toUpperCase() === 'STUDENT') {
          endpoint = '/quanly/students/my-info';
        }

        if (endpoint) {
          const res = await axios.get(endpoint, {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Ưu tiên lấy tên, nếu lỗi lấy role làm fallback
          setUserName(res.data.result.fullName || role.toUpperCase());
        } else {
          setUserName(role.toUpperCase());
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
        setUserName(role.toUpperCase());
      }
    };

    fetchUserInfo();
  }, [role]);

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-8rem)] bg-gray-50 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* NỘI DUNG CHÍNH */}
      <div className="flex-grow p-6 md:p-8">
        
        {/* Banner Lời chào (Thiết kế giống ảnh) */}
        <div className="bg-[#2A64F6] rounded-xl p-8 text-white shadow-md mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-4 py-1.5 rounded-full mb-5 inline-block">
              Tổng quan hệ thống
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight flex items-center gap-2">
              Xin chào, {userName}! <span className="text-3xl">👋</span>
            </h1>
            <p className="text-blue-100 text-base max-w-2xl mt-4">
              Chào mừng bạn đến với nền tảng quản lý giáo dục toàn diện. Hãy sử dụng thanh điều hướng bên trái để bắt đầu công việc.
            </p>
          </div>
          
          {/* Họa tiết mũ cử nhân mờ ở góc phải */}
          <div className="absolute right-0 top-0 h-full w-1/2 pointer-events-none overflow-hidden">
            <svg 
              className="absolute -right-6 -top-4 w-64 h-64 text-[#1D51D3] opacity-80" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
            </svg>
          </div>
        </div>

        {/* Giới thiệu Hệ thống (Đã bỏ các thuật ngữ code) */}
        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">
            Về Trường Học Thông Minh (Smart Campus)
          </h2>
          
          <div className="space-y-4 text-gray-600 leading-relaxed text-base">
            <p>
              <strong>Trường học thông minh</strong> được xây dựng nhằm mục đích chuyển đổi số toàn diện môi trường giáo dục. Hệ thống cung cấp một nền tảng quản trị tập trung, giúp số hóa hoàn toàn các quy trình từ quản lý nhân sự, hồ sơ học sinh, sổ điểm điện tử, cho đến việc tự động hóa thời khóa biểu và xử lý đơn từ trực tuyến.
            </p>
            <p>
              Giao diện trực quan của hệ thống đóng vai trò như một cầu nối vững chắc và minh bạch giữa <strong>Ban Giám Hiệu, Giáo viên và Học sinh</strong>. Mọi thông tin từ lịch học, điểm số đến các thông báo quan trọng đều được cập nhật và truyền tải nhanh chóng, góp phần xây dựng một hệ sinh thái học đường thông minh, hiện đại và hiệu quả cao.
            </p>
          </div>
        </div>

      </div>

      {/* FOOTER (Căn giữa đơn giản theo ảnh) */}
      <footer className="bg-gray-50 py-6 border-t border-gray-200 mt-auto">
        <div className="text-center text-gray-600 text-sm">
          <p className="uppercase mb-2 font-medium tracking-wide">
            Trường học thông minh
          </p>
          <p>
            Email: <a href="mailto:truonghocthongminhddd@gmail.com" className="hover:text-blue-600 transition-colors">truonghocthongminhddd@gmail.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
}