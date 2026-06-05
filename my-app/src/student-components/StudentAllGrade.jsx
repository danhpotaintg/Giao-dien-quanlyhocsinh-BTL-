import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaGraduationCap, FaStar, FaChartLine, FaBook } from 'react-icons/fa';

export default function StudentAllGrade() {
    const [gradeData, setGradeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { semester, academicYear } = useParams();

    const fetchGradeData = async () => {
        if (!semester || !academicYear) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/quanly/grades/my-grades?academicYear=${academicYear}&semester=${semester}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setGradeData(response.data.result);
        } catch (error) {
            console.error("Lỗi lấy danh sách điểm các môn!", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchGradeData();
    }, [semester, academicYear]);

    if (loading) return <div className="p-4 text-center">Đang tải bảng điểm...</div>;
    if (!gradeData) return <div className="p-4 text-center text-red-500">Không tìm thấy dữ liệu điểm.</div>;

    return (
        <div className="p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-blue-600">Bảng điểm chi tiết</h2>
                    <p className="text-gray-500 text-sm mt-1">Học kỳ {gradeData.semester} | Năm học {gradeData.academicYear}</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-bold text-gray-500 mb-1">Điểm trung bình (GPA)</p>
                    <p className="text-xl font-bold text-blue-600">{gradeData.semesterGPA?.toFixed(2) || "N/A"}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-bold text-gray-500 mb-1">Xếp loại</p>
                    <p className="text-xl font-bold text-blue-600">{gradeData.academicRank || "---"}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-bold text-gray-500 mb-1">Danh hiệu</p>
                    <p className="text-xl font-bold text-blue-600">{gradeData.title || "Chưa có"}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-bold text-gray-500 mb-1">Số môn học</p>
                    <p className="text-xl font-bold text-blue-600">{gradeData.subjects?.length || 0}</p>
                </div>
            </div>

            {/* Bảng điểm */}
            <table className="w-full table-fixed border-collapse border border-gray-300 shadow-sm rounded-lg overflow-hidden">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="border p-3 text-left w-[25%] font-bold text-base">Môn học</th>
                        <th className="border p-3 text-center w-[30%] font-bold text-base">Đánh giá thường xuyên</th>
                        <th className="border p-3 text-center w-[15%] font-bold text-base">Giữa kỳ</th>
                        <th className="border p-3 text-center w-[15%] font-bold text-base">Cuối kỳ</th>
                        <th className="border p-3 text-center w-[15%] font-bold text-base">TBM</th>
                    </tr>
                </thead>
                <tbody className="text-base">
                    {gradeData.subjects.map((subject) => (
                        <tr key={subject.subjectId} className="hover:bg-blue-50/50 transition">
                            <td className="border p-3 font-bold text-gray-800">{subject.subjectName}</td>
                            <td className="border p-3">
                                <div className="flex justify-center gap-2">
                                    {subject.gradeConfigs.find(c => c.scoreType === 'thuong_xuyen')?.scores.map((s, idx) => (
                                        <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-bold border border-gray-200">
                                            {s !== null ? s : '-'}
                                        </span>
                                    )) || <span className="text-gray-400">-</span>}
                                </div>
                            </td>
                            <td className="border p-3 text-center font-bold text-gray-700">
                                {subject.gradeConfigs.find(c => c.scoreType === 'giua_ky')?.scores[0] ?? '-'}
                            </td>
                            <td className="border p-3 text-center font-bold text-gray-700">
                                {subject.gradeConfigs.find(c => c.scoreType === 'cuoi_ky')?.scores[0] ?? '-'}
                            </td>
                            <td className="border p-3 text-center font-bold text-blue-600">
                                {subject.semesterAverage?.toFixed(1) || "-"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Ghi chú */}
            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-100">
                <p className="text-sm text-blue-700">
                    <strong>Ghi chú:</strong> Điểm trung bình môn (TBM) được tính theo trọng số: Thường xuyên (x1), Giữa kỳ (x2), Cuối kỳ (x3).
                    Mọi thắc mắc về điểm số vui lòng liên hệ trực tiếp giáo viên bộ môn.
                </p>
            </div>
        </div>
    );
}