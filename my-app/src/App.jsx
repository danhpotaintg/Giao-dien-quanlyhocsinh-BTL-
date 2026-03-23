// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import UserList from "./admin components/ListUser";
import CreateTeacher from './admin components/CreateTeacher';
import CreateStudent from "./admin components/CreateStudent";
import CreateClass from "./admin components/CreateClass";
import NewPassword from "./admin components/NewPassword";

import StudentInfo from './student components/StudentInfo'; 

import TeacherInfo from './teacher componets/TeacherInfo';


function App() {
  const [role, setRole] = useState(() => localStorage.getItem('role') || null);

  const handleLogin = (selectedRole) => {
    // Lưu vào state và LocalStorage
    setRole(selectedRole);
  };

  const handleLogout = () => {
    // Xóa state và dọn dẹp LocalStorage
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Nếu chưa có role, bắt buộc ở trang Login */}
        {!role ? (
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        ) : (
          /* Nếu đã đăng nhập, bọc tất cả bằng Layout */
          <Route path="/" element={<Layout userRole={role} onLogout={handleLogout} />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Tạo trang Dashboard chung làm ví dụ */}
            <Route path="dashboard" element={
              <div className="bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-bold">Đây là Dashboard của {role.toUpperCase()}</h1>
                <p className="mt-2 text-gray-600">Hãy thử di chuột vào các menu bên trái.</p>
              </div>
            } />

             <Route path="admin/users" element={<UserList />} /> 
             <Route path="admin/users/create-teacher" element={<CreateTeacher />} /> 
             <Route path="admin/users/create-student" element={<CreateStudent />} /> 
             <Route path="admin/classes/create" element={<CreateClass />} /> 
             <Route path="admin/users/reset-password" element={<NewPassword />} /> 

             <Route path="profile/student-info" element={<StudentInfo />} /> 
             <Route path="profile/teacher-info" element={<TeacherInfo />} /> 
            {/* Bạn sẽ thêm các Route khác ở đây: /admin/users, /teacher/grades... */}
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;