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
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header: Thông tin chung */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">PHIẾU ĐIỂM CHI TIẾT</h1>
                <p className="text-gray-500">Học kỳ {gradeData.semester} | Năm học {gradeData.academicYear}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 uppercase font-bold">Điểm trung bình (GPA)</p>
                            <h3 className="text-2xl font-black text-blue-600">{gradeData.semesterGPA?.toFixed(2) || "N/A"}</h3>
                        </div>
                        <FaChartLine className="text-3xl text-blue-200" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 uppercase font-bold">Xếp loại</p>
                            <h3 className="text-2xl font-black text-green-600">{gradeData.academicRank || "---"}</h3>
                        </div>
                        <FaGraduationCap className="text-3xl text-green-200" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 uppercase font-bold">Danh hiệu</p>
                            <h3 className="text-xl font-black text-yellow-600">{gradeData.title || "Chưa có"}</h3>
                        </div>
                        <FaStar className="text-3xl text-yellow-200" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 uppercase font-bold">Số môn học</p>
                            <h3 className="text-2xl font-black text-purple-600">{gradeData.subjects?.length || 0}</h3>
                        </div>
                        <FaBook className="text-3xl text-purple-200" />
                    </div>
                </div>
            </div>

            {/* Bảng điểm chi tiết */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="p-4 font-semibold uppercase text-sm">Môn học</th>
                            <th className="p-4 font-semibold uppercase text-sm text-center">Đánh giá thường xuyên</th>
                            <th className="p-4 font-semibold uppercase text-sm text-center">Giữa kỳ</th>
                            <th className="p-4 font-semibold uppercase text-sm text-center">Cuối kỳ</th>
                            <th className="p-4 font-semibold uppercase text-sm text-center bg-blue-700">TBM</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {gradeData.subjects.map((subject) => (
                            <tr key={subject.subjectId} className="hover:bg-blue-50 transition-colors">
                                <td className="p-4 font-bold text-gray-700 uppercase tracking-tight">
                                    {subject.subjectName}
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-center gap-2">
                                        {subject.gradeConfigs.find(c => c.scoreType === 'thuong_xuyen')?.scores.map((s, idx) => (
                                            <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium border border-gray-200">
                                                {s !== null ? s : '-'}
                                            </span>
                                        )) || <span className="text-gray-400">-</span>}
                                    </div>
                                </td>
                                <td className="p-4 text-center font-semibold text-gray-600">
                                    {subject.gradeConfigs.find(c => c.scoreType === 'giua_ky')?.scores[0] ?? '-'}
                                </td>
                                <td className="p-4 text-center font-semibold text-gray-600">
                                    {subject.gradeConfigs.find(c => c.scoreType === 'cuoi_ky')?.scores[0] ?? '-'}
                                </td>
                                <td className="p-4 text-center">
                                    <span className="inline-block w-12 py-1 rounded-full bg-blue-100 text-blue-800 font-bold">
                                        {subject.semesterAverage?.toFixed(1) || "-"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700 leading-relaxed">
                    <strong>Ghi chú:</strong> Điểm trung bình môn (TBM) được tính theo trọng số: Thường xuyên (x1), Giữa kỳ (x2), Cuối kỳ (x3). 
                    Mọi thắc mắc về điểm số vui lòng liên hệ trực tiếp giáo viên bộ môn.
                </p>
            </div>
        </div>
    );
}