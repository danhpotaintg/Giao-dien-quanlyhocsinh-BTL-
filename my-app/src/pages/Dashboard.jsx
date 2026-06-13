import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [userName, setUserName] = useState('');
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const role = localStorage.getItem('role') || 'Người dùng';

  useEffect(() => {
    const fetchUserInfo = async () => {
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

  // Gọi API lấy tin tức giáo dục
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await axios.get('/quanly/news/education', {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });

        if (response.data && response.data.code === 1000) {
          // Lấy 4 tin tức mới nhất hiển thị trên 1 hàng ngang
          setNews(response.data.result.slice(0, 4));
        }
      } catch (error) {
        console.error('Lỗi khi lấy tin tức:', error);
        setNews([]); 
      } finally {
        setLoadingNews(false);
      }
    };

    fetchNews();
  }, []);

  return (

    <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5 gap-4">
      
      <div className="bg-blue-500 rounded-xl p-4 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full mb-1.5 inline-block">
            Tổng quan hệ thống
          </span>
          <h1 className="text-xl md:text-2xl font-extrabold mb-1 tracking-tight flex items-center gap-2">
            Xin chào, {userName}! <span className="text-xl">👋</span>
          </h1>
          <p className="text-blue-50 text-xs max-w-2xl">
            Chào mừng bạn đến với nền tảng quản lý giáo dục toàn diện. Hãy sử dụng thanh điều hướng bên trái để bắt đầu công việc.
          </p>
        </div>
        
        <div className="absolute right-0 top-0 h-full w-1/3 pointer-events-none overflow-hidden">
          <svg 
            className="absolute -right-4 -top-4 w-32 h-32 text-blue-700 opacity-20" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
          </svg>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <h2 className="text-base font-bold text-gray-800 mb-1.5 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-blue-500 rounded-full inline-block"></span>
          Về Trường Học Thông Minh (Smart Campus)
        </h2>
        <p className="text-gray-600 text-xs leading-relaxed">
          Nền tảng số hóa toàn diện quy trình quản lý học đường (nhân sự, hồ sơ, sổ điểm, thời khóa biểu và xử lý đơn từ trực tuyến). Hệ thống đóng vai trò cầu nối trực quan, minh bạch giữa Ban Giám Hiệu, Giáo viên và Học sinh nhằm tối ưu hóa hiệu quả giáo dục.
        </p>
      </div>

      {/*Tin Tức Giáo Dục t */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-3">
          <h2 className="text-base font-bold text-[#9f224e] flex items-center gap-1.5">
            <span className="w-1.5 h-4 bg-[#9f224e] rounded-full inline-block"></span>
            Tin tức Giáo dục nổi bật
          </h2>
          <a href="https://vnexpress.net/giao-duc" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
            Xem thêm trên VnExpress &rarr;
          </a>
        </div>

        {loadingNews ? (
          <div className="flex justify-center py-4">
            <span className="text-gray-400 text-xs animate-pulse">Đang tải tin tức...</span>
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {news.map((item, index) => (
              <a 
                key={index} 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex flex-col bg-gray-50 rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <div className="w-full aspect-[4/3] overflow-hidden bg-gray-200">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="p-2.5 flex-grow flex flex-col justify-between">
                  <h3 className="text-xs font-semibold text-gray-800 group-hover:text-[#076bce] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 py-2 text-center">Chưa có tin tức nào được cập nhật.</p>
        )}
      </div>

      {/* FOOTER*/}
      <footer className="pt-2 border-t border-gray-100 flex justify-between text-[10px] text-gray-400">
        <p className="uppercase font-semibold tracking-wide">Trường học thông minh</p>
        <p>Email: truonghocthongminhddd@gmail.com</p>
      </footer>

    </div>
  );
}