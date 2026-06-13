// src/components/Layout.jsx
import React, { useState } from 'react'; 
import { useNavigate, Outlet } from 'react-router-dom';
import { MENU_CONFIG } from '../config/navigation';
import NotificationBell from './NotificationBell';

export default function Layout({ userRole, onLogout }) {
  const navigate = useNavigate();
  // Đảm bảo không bị lỗi nếu userRole chưa load kịp
  const menuItems = userRole ? MENU_CONFIG[userRole.toLowerCase()] || [] : [];
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      
      {/* CỘT TRÁI: SIDEBAR */}
      <aside className="w-64 flex-shrink-0 bg-gray-900 text-white flex flex-col z-20">
        <div 
          className="h-16 flex items-center justify-center border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors"
          onClick={() => navigate('/dashboard')}
        >
          <span className="text-2xl font-bold text-blue-400 tracking-wider">
            QLHS.COM
          </span>
        </div>

        <nav className="flex-1 pt-4 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index} className="relative group">
                <button 
                  onClick={() => !item.children && navigate(item.path)}
                  className="w-full text-left px-6 py-3 hover:bg-gray-800 transition-colors flex justify-between items-center"
                >
                  {item.title}
                  {item.children && <span className="text-xs text-gray-400">▶</span>}
                </button>

                {item.children && (
                  <ul className="absolute left-full top-0 w-56 bg-gray-800 hidden group-hover:block shadow-xl border-l border-gray-700">
                    {item.children.map((child, idx) => (
                      <li key={idx}>
                        <button 
                          onClick={() => navigate(child.path)}
                          className="w-full text-left px-6 py-3 hover:bg-blue-600 transition-colors text-sm"
                        >
                          {child.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* HEADER */}
        <header className="h-16 flex-shrink-0 bg-white shadow flex items-center justify-end px-6 z-[50]">
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col text-right">
              <span className="text-sm font-semibold text-gray-800">
                {userRole?.toUpperCase()}
              </span>
              <span className="text-xs text-gray-500">Trực tuyến</span>
            </div>
            
            {/* COMPONENT NÚT CHUÔNG */}
            <NotificationBell />
            
            <button 
              onClick={() => navigate('/change-password')}
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              Đổi mật khẩu
            </button>
            
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="text-sm font-medium bg-red-50 text-red-600 px-4 py-2 rounded-lg border border-red-200 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
            >
              Đăng xuất
            </button>
          </div>
        </header>

        {/*  sinh thanh cuộn  nếu quá dài */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <Outlet /> 
        </main>

        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[99999]">
            {/* Lớp phủ màn hình mờ nhẹ, click vào đây để đóng nhanh popup */}
            <div 
              className="absolute inset-0 bg-black/5 cursor-default" 
              onClick={() => setShowLogoutConfirm(false)}
            ></div>
            
            {/* Bảng Popup chính xác nhận */}
            <div className="absolute top-16 right-6 mt-2 w-72 bg-white border border-gray-200 shadow-2xl rounded-xl p-5 z-10 animate-fade-in">
              <p className="text-[15px] text-gray-800 mb-5 font-semibold text-center">
                Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
              </p>
              
              <div className="flex justify-center gap-3">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-bold cursor-pointer"
                >
                  Huỷ bỏ
                </button>
                <button 
                  onClick={onLogout} 
                  className="flex-1 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold cursor-pointer shadow-md"
                >
                  Đồng ý
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
}