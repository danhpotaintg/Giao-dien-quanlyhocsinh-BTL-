// src/config/navigation.js

export const MENU_CONFIG = {  
  admin: [
    {
      title: 'Quản lý tài khoản',
      children: [
        { title: 'Danh sách tài khoản', path: '/admin/users' },
        { title: 'Tạo tài khoản giáo viên', path: '/admin/users/create-teacher' },
        { title: 'Tạo tài khoản học sinh', path: '/admin/users/create-student' },
      ]
    },
    {
      title: 'Quản lý lớp học',
      children: [
        { title: 'Tạo lớp học và môn học', path: '/admin/classes/create' },
        { title: 'Danh sách lớp', path: '/admin/class-list' },
        { title: 'Tạo đầu điểm cho môn học', path: '/admin/create/grade-config' },
        { title: 'Sắp xếp lớp học cho học sinh', path: '/admin/classes/assign-student' },
        { title: 'Sắp xếp TKB', path: '/admin/classes/schedule' },
        { title: 'Phân công giáo viên chủ nhiệm', path: '/admin/classes/assign-teacher-class' },
        { title: 'Phân công dạy thay', path: '/admin/classes/assign-teacher' },
      ]
    },
    {
      title: 'Thống kê',
      children: [
        { title: 'Giáo viên', path: '/admin/stats/teachers' },
        { title: 'Kết quả học tập', path: '/admin/stats/grades' },
        { title: 'Xếp hạng học tập', path: '/admin/stats/grade-ranking' }
        
      ]
    },
    { title: 'Gửi thông báo chung', path: '/admin/notifications' } // Đã thêm phần này
  ],
  
  teacher: [
    {
      title: 'Thông tin tài khoản',
      children: [
        { title: 'Cập nhật ảnh đại diện', path: '/profile/avatar' },
        { title: 'Thông tin cá nhân', path: '/profile/teacher-update' },
      ]
    },
    {
      title: 'Lớp học',
      children: [
        { title: 'Điểm danh', path: '/teacher/attendance' },
        { title: 'Cập nhật điểm số', path: '/teacher/grades' },
        { title: 'Đổi vị trí', path: '/teacher/seats' },
      ]
    },
    { title: 'Xem thời khoá biểu', path: '/teacher/schedule/weekly' },
    { title: 'Phê duyệt đơn', path: '/teacher/approvals' },
    { title: 'Gửi thông báo cho lớp', path: '/teacher/notifications' } // Đã chuẩn hoá tên
  ],

  student: [
    {
      title: 'Thông tin tài khoản',
      children: [
        { title: 'Cập nhật ảnh đại diện', path: '/profile/avatar' },
        { title: 'Thông tin cá nhân', path: '/profile/student-update' },
      ]
    },
    {
      title: 'Học tập',
      children: [
        { title: 'Kết quả học tập', path: '/student/grades' },
        { title: 'Biểu đồ điểm', path: '/student/charts' },
        { title: 'Nhận lời khuyên', path: '/student/advice' },
      ]
    },
    { title: 'Xem thời khoá biểu', path: '/student/schedule/weekly' },
    { title: 'Gửi đơn xin nghỉ phép', path: '/student/leave-request' },
  ]
};