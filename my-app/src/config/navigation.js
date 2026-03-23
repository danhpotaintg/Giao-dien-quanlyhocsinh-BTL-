// src/config/navigation.js

export const MENU_CONFIG = {  
  admin: [
    {
      title: 'Quản lý tài khoản',
      children: [
        { title: 'Danh sách tài khoản', path: '/admin/users' },
        { title: 'Tạo tài khoản giáo viên', path: '/admin/users/create-teacher' },
        { title: 'Tạo tài khoản học sinh', path: '/admin/users/create-student' },
        { title: 'Xoá tài khoản', path: '/admin/users/delete' },
        { title: 'Thay đổi thông tin', path: '/admin/users/edit' },
        { title: 'Đặt lại mật khẩu', path: '/admin/users/reset-password' },
      ]
    },
    {
      title: 'Quản lý lớp học',
      children: [
        { title: 'Tạo lớp học', path: '/admin/classes/create' },
        { title: 'Sắp xếp TKB', path: '/admin/classes/schedule' },
        { title: 'Phân công giảng dạy', path: '/admin/classes/assign' },
      ]
    },
    {
      title: 'Thống kê',
      children: [
        { title: 'Kết quả học tập', path: '/admin/stats/grades' },
        { title: 'Báo cáo tài chính', path: '/admin/stats/finance' },
      ]
    },
    { title: 'Phê duyệt đơn', path: '/admin/approvals' } // Không có menu con
  ],
  
  teacher: [
    {
      title: 'Thông tin tài khoản',
      children: [
        { title: 'Xem thông tin cá nhân', path: '/profile/teacher-info' },
        { title: 'Cập nhật ảnh đại diện', path: '/profile/avatar' },
        { title: 'Cập nhật thông tin', path: '/profile/edit' },
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
    {
      title: 'Xem thời khoá biểu',
      children: [
        { title: 'Xem theo ngày', path: '/schedule/daily' },
        { title: 'Xem theo tuần', path: '/schedule/weekly' },
      ]
    },
    { title: 'Gửi thông báo tới phụ huynh', path: '/teacher/notifications' }
  ],

  student: [
    {
      title: 'Thông tin tài khoản',
      children: [
        { title: 'Xem thông tin cá nhân', path: '/profile/student-info' },
        { title: 'Cập nhật ảnh đại diện', path: '/profile/avatar' },
        { title: 'Cập nhật thông tin', path: '/profile/edit' },
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
    {
      title: 'Xem thời khoá biểu',
      children: [
        { title: 'Xem theo ngày', path: '/schedule/daily' },
        { title: 'Xem theo tuần', path: '/schedule/weekly' },
      ]
    },
    { title: 'Thủ tục hành chính', path: '/student/administrative' }
  ]
};