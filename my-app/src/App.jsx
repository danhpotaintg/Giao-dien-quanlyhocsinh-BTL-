// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';

import UserList from "./admin-components/ListUser";
import CreateTeacher from './admin-components/CreateTeacher';
import CreateStudent from "./admin-components/CreateStudent";
import CreateClass from "./admin-components/CreateClass";
import DeleteAcc from "./admin-components/DeleteUser";
import UserUpdate from './admin-components/UserUpdate';
import StudentClass from './admin-components/StudentClass';
import HomeroomTeacherClass from './admin-components/HomeroomTeacherClass';
import CreateNotification from "./admin-components/CreateNotification";

//thong ke
import TeacherStats from './admin-components/TeacherStats';
import GradeStats from './admin-components/GradeStats';
import GradeRanking from './admin-components/GradeRanking';

import StudentInfo from './student-components/StudentInfo'; 
import StudentUpdate from './student-components/StudentUpdate';

import TeacherInfo from './teacher-components/TeacherInfo';
import TeacherUpdate from './teacher-components/TeacherUpdate';
import TeacherUploadAvatar from './teacher-components/TeacherUploadAvatar';
import Attendance from './teacher-components/Attendance';
import AttendanceDetail from "./teacher-components/AttendanceDetail";
import StudentList from './teacher-components/StudentList';
import Grade from "./teacher-components/Grade";
import GradeEntry from "./teacher-components/GradeEntry";
import StudentSubjectList from './student-components/StudentSubjectList';
import StudentGrade from './student-components/StudentGrade';
import StudentSchedule from './student-components/StudentSchedules';
import TeacherSchedule from './teacher-components/TeacherSchedules';
import ScheduleDetails from './admin-components/ScheduleDetails';
import CreateSchedules from "./admin-components/CreateSchedules";
import ListLeaveRequest from './teacher-components/ListLeaveRequest';
import CreateLeaveRequest from './student-components/CreateLeaveRequest';
import TeacherSubstitution from "./admin-components/TeacherSubstitution";
import AssignTeacher from "./admin-components/AssignTeacher";
import TeacherNotifications from './teacher-components/TeacherNotifications';
import GradeImport from './teacher-components/GradeImportExcel';


function App() {
  const [role, setRole] = useState(() => localStorage.getItem('role') || null);

  const handleLogin = (selectedRole) => {
    // Lưu vào state và LocalStorage
    setRole(selectedRole);
  };

  const handleLogout = () => {
  setRole(null);
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  window.location.href = '/';
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
            <Route path="change-password" element={<ChangePassword />} />
            
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
            
             <Route path="admin/users/delete" element={<DeleteAcc />} /> 
             <Route path="admin/users/edit" element={<UserUpdate />} /> 
             <Route path="admin/classes/assign-student" element={<StudentClass />} /> 
             <Route path="admin/classes/assign-teacher-class" element={<HomeroomTeacherClass />} /> 
             <Route path="admin/classes/schedule" element={<ScheduleDetails />} /> 
             <Route path="admin/classes/schedule/:teacherId/:classId/:subjectName" element={<CreateSchedules />} /> 
             <Route path="admin/classes/assign-teacher" element={<TeacherSubstitution />} />  
             <Route path="admin/classes/assign-teacher/:teacherId" element={<AssignTeacher />} />
             <Route path="admin/stats/teachers" element={<TeacherStats />} />
             <Route path="admin/stats/grades" element={<GradeStats />} />
             <Route path="admin/stats/grade-ranking" element={<GradeRanking />} />
             <Route path="admin/notifications" element={<CreateNotification />} /> 

             <Route path="profile/student-info" element={<StudentInfo />} /> 
             <Route path="profile/student-update" element={<StudentUpdate />} />
             <Route path="student/grades" element={<StudentSubjectList />} />
             <Route path="student/grade/:subjectId/:semester/:academicYear" element={<StudentGrade />} />
             <Route path="student/schedule/weekly" element={<StudentSchedule />} />
             <Route path="student/leave-request" element={<CreateLeaveRequest />} />

             <Route path="profile/teacher-info" element={<TeacherInfo />} /> 
             <Route path="profile/teacher-update" element={<TeacherUpdate />} />
             <Route path="profile/avatar" element={<TeacherUploadAvatar/>} />
             <Route path="teacher/attendance" element={<Attendance />} /> 
             <Route path="teacher/attendance/:classId/:className" element={<AttendanceDetail />} />
             <Route path="teacher/grades" element={<Grade />} />  
             <Route path="teacher/class/:classId/:className" element={<StudentList />} />
             <Route path="teacher/grade/:studentId" element={<GradeEntry />} />
             <Route path="teacher/grade-import/:classId/:className" element={<GradeImport />} />
             <Route path="teacher/schedule/weekly" element={<TeacherSchedule />} />
             <Route path="teacher/approvals" element={<ListLeaveRequest />} />
             <Route path="teacher/notifications" element={<TeacherNotifications />} />
             

            {/* Bạn sẽ thêm các Route khác ở đây: /admin/users, /teacher/grades... */}
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;