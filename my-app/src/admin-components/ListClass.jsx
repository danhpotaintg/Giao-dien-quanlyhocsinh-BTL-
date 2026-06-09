import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ClassListModalVersion() {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [students, setStudents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingStudents, setLoadingStudents] = useState(false);

    
    useEffect(() => {
        const getAllClasses = async () => {
            try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/quanly/classes', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const rawClasses = res.data.result || [];

            const sortedClasses = [...rawClasses].sort((a, b) => b.academicYear - a.academicYear);
            
            setClasses(sortedClasses);
            } catch (err) {
            console.error("Lỗi lấy danh sách lớp:", err);
            }
        };
        getAllClasses();
    }, []);

    const handleViewStudents = async (cls) => {
        setSelectedClass(cls); 
        setIsModalOpen(true);
        setLoadingStudents(true);
        try {
            const token = localStorage.getItem('token');  

            const res = await axios.get(`/quanly/classes/${cls.id}/students`, {
            headers: { Authorization: `Bearer ${token}` }
            });
            
            setStudents(res.data.result); 
        } catch (error) {
            console.error("Lỗi lấy danh sách học sinh:", error);
            setStudents([]); 
        } finally {
            setLoadingStudents(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Danh Sách Lớp Học</h2>
        
        {/* Bảng danh sách lớp */}
        <div className="overflow-x-auto bg-white rounded-lg shadow  ">
            <table className="min-w-full table-auto ">
            <thead className="bg-blue-500 text-white uppercase text-sm leading-normal tracking-wider">
                <tr>
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Tên Lớp</th>
                <th className="py-3 px-6 text-left">Khoá học</th>
                <th className="py-3 px-6 text-left">Giáo Viên Chủ Nhiệm</th>
                <th className="py-3 px-6 text-center">Hành Động</th>
                </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
                {classes.map((cls) => (
                <tr key={cls.id} className="border-b border-gray-200 hover:bg-gray-55">
                    <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{cls.id}</td>
                    <td className="py-3 px-6 text-left">{cls.className}</td>
                    <td className="py-3 px-6 text-left">{cls.academicYear}</td>
                    <td className="py-3 px-6 text-left">{cls.teacherName || 'Chưa phân công'}</td>
                    <td className="py-3 px-6 text-center">
                    <button
                        onClick={() => handleViewStudents(cls)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md transition-colors"
                    >
                        Xem học sinh
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        {/* MODAL HIỂN THỊ DANH SÁCH HỌC SINH */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] flex flex-col">
                
                {/* Header Modal */}
                <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                <h3 className="text-xl font-semibold text-gray-800">
                    Danh sách học sinh - Lớp {selectedClass?.className}
                </h3>
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                    &times;
                </button>
                </div>

                {/* Body Modal */}
                <div className="p-6 overflow-y-auto flex-1">
                {loadingStudents ? (
                    <div className="text-center py-10 text-gray-500">Đang tải danh sách học sinh...</div>
                ) : students.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">Lớp học này hiện chưa có học sinh nào.</div>
                ) : (
                    <table className="min-w-full table-auto">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr>
                        <th className="py-2 px-4 text-left">Mã HS</th>
                        <th className="py-2 px-4 text-left">Họ Và Tên</th>
                        <th className="py-2 px-4 text-left">Ngày Sinh</th>
                        <th className="py-2 px-4 text-left">Giới Tính</th>
                        <th className="py-2 px-4 text-left">SĐT Phụ Huynh</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {students.map((stu) => (
                        <tr key={stu.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium text-gray-900">{stu.id}</td>
                            <td className="py-3 px-4">{stu.fullName}</td>
                            <td className="py-3 px-4">{stu.dob}</td>
                            <td className="py-3 px-4">{stu.gender}</td>
                            <td className="py-3 px-4">{stu.parentPhonenumber}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                )}
                </div>

                {/* Footer Modal */}
                <div className="p-4 border-t border-gray-200 flex justify-end bg-gray-50 rounded-b-lg">
                <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md transition-colors"
                >
                    Đóng
                </button>
                </div>

            </div>
            </div>
        )}
        </div>
    );
    }