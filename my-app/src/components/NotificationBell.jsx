import React, { useState, useEffect, useRef } from 'react';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const dropdownRef = useRef(null);

  // Gọi API lấy thông báo
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/quanly/notifications/my-notifications', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        
        // Kiểm tra mã code 1000 và đảm bảo result là một mảng
        if (data.code === 1000 && Array.isArray(data.result)) {
          setNotifications(data.result);
        }
      } catch (error) {
        console.error("Lỗi khi tải thông báo:", error);
      }
    };

    fetchNotifications();
    // Bạn có thể thêm setInterval ở đây nếu muốn thông báo tự động cập nhật mỗi 1-2 phút
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openNotification = (notif) => {
    setSelectedNotif(notif);
    setIsDropdownOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      {/* Nút Chuông */}
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown List */}
      {isDropdownOpen && (
        <div className="absolute top-12 right-0 w-80 bg-white border border-gray-200 shadow-2xl rounded-lg overflow-hidden z-50 animate-fade-in">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-bold text-gray-800 text-sm">
            Thông báo gần đây
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400">Không có thông báo mới</div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  onClick={() => openNotification(notif)}
                  className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="text-sm font-semibold text-gray-800 line-clamp-1">
                    {notif.title}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1 flex justify-between italic">
                    <span>{notif.senderUsername}</span>
                    <span>{formatDate(notif.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal chi tiết (Dạng Slink) */}
      {selectedNotif && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] px-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            {/* Header Modal */}
            <div className="px-6 py-4 bg-blue-800 text-white flex justify-between items-center">
              <h2 className="text-lg font-bold truncate pr-4">{selectedNotif.title}</h2>
              <button 
                onClick={() => setSelectedNotif(null)} 
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Meta Info */}
            <div className="px-6 py-3 bg-gray-50 border-b flex justify-between text-xs text-gray-600 font-medium">
              <span>Người gửi: <span className="text-blue-700">{selectedNotif.senderUsername}</span></span>
              <span>Ngày gửi: {formatDate(selectedNotif.createdAt)}</span>
            </div>
            
            {/* Content Body */}
            <div className="px-6 py-6 overflow-y-auto flex-1">
              <div 
                style={{ whiteSpace: 'pre-wrap' }} 
                className="text-gray-700 text-sm leading-relaxed font-normal"
              >
                {selectedNotif.content}
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t flex justify-end">
              <button 
                onClick={() => setSelectedNotif(null)}
                className="px-6 py-2 bg-gray-800 hover:bg-black text-white text-xs font-bold rounded transition-all uppercase tracking-wider"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}