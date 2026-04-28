import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherStats = () => {
    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear - 1, currentYear - 2]; // 3 năm gần nhất

    const [academicYear, setAcademicYear] = useState(currentYear);
    const [semester, setSemester] = useState(1);
    const [teachers, setTeachers] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    
    // State cho Modal Thời khóa biểu
    const [scheduleModal, setScheduleModal] = useState({ isOpen: false, teacherId: null, data: [] });

    const fetchTeachers = async () => {
        try {
            setErrorMessage("");
            const token = localStorage.getItem('token');
            const res = await axios.get('/quanly/statistics/teachers', {
                headers: { Authorization: `Bearer ${token}` },
                params: { academicYear, semester } 
            });
            setTeachers(res.data.result || []);
        } catch (error) {
            setTeachers([]);
            if (error.response && error.response.status === 404) {
                setErrorMessage("Không có dữ liệu thống kê giáo viên cho học kỳ này!");
            } else {
                setErrorMessage("Đã xảy ra lỗi khi lấy danh sách giáo viên.");
                console.error("Lỗi lấy danh sách giáo viên", error);
            }
        }
    };

    const viewSchedule = async (teacherId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`/quanly/statistics/teachers/${teacherId}/schedule`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { academicYear, semester }
            });
            setScheduleModal({ isOpen: true, teacherId, data: res.data.result || [] });
        } catch (error) {
            console.error("Lỗi lấy thời khóa biểu", error);
        }
    };

    return (
        <div className="p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-6">Thống kê Giáo viên</h2>
            
            <div className="flex gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Năm học</label>
                    <select value={academicYear} onChange={(e) => setAcademicYear(Number(e.target.value))} className="mt-1 p-2 border rounded w-full">
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Học kỳ</label>
                    <select value={semester} onChange={(e) => setSemester(Number(e.target.value))} className="mt-1 p-2 border rounded w-full">
                        <option value={1}>Học kỳ 1</option>
                        <option value={2}>Học kỳ 2</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <button onClick={fetchTeachers} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Thống kê
                    </button>
                </div>
            </div>

            {/* Hiển thị lỗi */}
            {errorMessage && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
                    <span className="font-medium">Thông báo: </span> {errorMessage}
                </div>
            )}

            {teachers.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr className="bg-blue-600 text-white">
                                <th className="border p-3 text-center">Mã GV</th>
                                <th className="border p-3 text-left">Họ tên</th>
                                <th className="border p-3 text-left">Email</th>
                                <th className="border p-3 text-center">Số tiết/tuần</th>
                                <th className="border p-3 text-center">Số lớp dạy</th>
                                <th className="border p-3 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.map(t => (
                                <tr key={t.teacherId} className="hover:bg-gray-50 border-b">
                                    <td className="border p-3 text-center text-gray-700">{t.teacherId}</td>
                                    <td className="border p-3 font-medium">{t.fullName}</td>
                                    <td className="border p-3 text-gray-600">{t.email}</td>
                                    <td className="border p-3 text-center font-bold text-gray-700">{t.schedulePerWeek}</td>
                                    <td className="border p-3 text-center font-bold text-gray-700">{t.countClassTeaching}</td>
                                    <td className="border p-3 text-center">
                                        <button 
                                            onClick={() => viewSchedule(t.teacherId)} 
                                            className="text-blue-600 font-semibold hover:text-blue-800 hover:underline"
                                        >
                                            Xem TKB
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal TKB Đơn giản */}
            {scheduleModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded max-w-2xl w-full">
                        <h3 className="text-xl font-bold mb-4 text-blue-600">Thời khóa biểu GV: {scheduleModal.teacherId}</h3>
                        <div className="max-h-96 overflow-y-auto">
                            <ul className="list-disc pl-5">
                                {scheduleModal.data.length === 0 ? <p className="text-gray-500">Không có lịch dạy.</p> : 
                                    scheduleModal.data.map(s => (
                                        <li key={s.id} className="mb-2">
                                            <span className="font-semibold">Thứ {s.dayOfWeek}:</span> Tiết {s.startLesson}-{s.endLesson} | Lớp: {s.className} | Môn: {s.subjectName}
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button 
                                onClick={() => setScheduleModal({isOpen: false})} 
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default TeacherStats;