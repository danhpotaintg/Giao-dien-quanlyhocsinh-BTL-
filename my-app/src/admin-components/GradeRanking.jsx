import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GradeRanking = () => {
    const [subjects, setSubjects] = useState([]);
    
    const [studentCohort, setStudentCohort] = useState('');
    const [academicYear, setAcademicYear] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [semester, setSemester] = useState(1);
    const [rankingQuantity, setRankingQuantity] = useState(20);
    
    const [rankingData, setRankingData] = useState([]);
    const [errorMessage, setErrorMessage] = useState(""); // Thêm state thông báo lỗi

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/quanly/subjects', { headers: { Authorization: `Bearer ${token}` }});
                setSubjects(res.data.result || []);
            } catch (error) { console.error(error); }
        };
        fetchSubjects();
    }, []);

    const getAvailableYears = () => {
        const cohort = Number(studentCohort);
        if (!cohort || cohort < 2000) return [];
        return [cohort, cohort + 1, cohort + 2, cohort + 3, cohort + 4];
    };

    const fetchRanking = async () => {
        if(!studentCohort || !academicYear || !subjectId || !rankingQuantity) {
            setErrorMessage("Vui lòng điền đủ thông tin để xếp hạng!");
            return;
        }
        
        try {
            setErrorMessage(""); // Xóa lỗi cũ
            const token = localStorage.getItem('token');
            const res = await axios.get('/quanly/statistics/top-students', {
                headers: { Authorization: `Bearer ${token}` },
                params: { studentCohort, subjectId, semester, academicYear, rankingQuantity }
            });
            setRankingData(res.data.result || []);
        } catch (error) {
            setRankingData([]);
            if (error.response && error.response.status === 404) {
                setErrorMessage("Không có dữ liệu bảng điểm cho môn học và khóa này!");
            } else {
                setErrorMessage("Đã xảy ra lỗi khi lấy dữ liệu xếp hạng.");
                console.error("Lỗi lấy xếp hạng", error);
            }
        }
    };

    // Lấy danh sách tên các cột điểm (thuong_xuyen, giua_ky, cuoi_ky...) từ học sinh đầu tiên để làm header
    const scoreHeaders = rankingData.length > 0 ? rankingData[0].gradeConfigs.map(c => c.scoreType) : [];

    return (
        <div className="p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-6">Xếp Hạng Điểm Môn Học</h2>
            
            <div className="grid grid-cols-5 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium">Khóa học (VD: 2023)</label>
                    <input type="number" value={studentCohort} onChange={(e) => { setStudentCohort(e.target.value); setAcademicYear('');}} className="mt-1 w-full p-2 border rounded" placeholder="Nhập năm..."/>
                </div>
                <div>
                    <label className="block text-sm font-medium">Năm học</label>
                    <select disabled={!studentCohort || Number(studentCohort) < 2000} value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} className="mt-1 w-full p-2 border rounded disabled:bg-gray-200">
                        <option value="">-- Chọn năm --</option>
                        {getAvailableYears().map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Môn học</label>
                    <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="mt-1 w-full p-2 border rounded">
                        <option value="">-- Chọn môn --</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.subjectName}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Học kỳ</label>
                    <select value={semester} onChange={(e) => setSemester(Number(e.target.value))} className="mt-1 w-full p-2 border rounded">
                        <option value={1}>Học kỳ 1</option>
                        <option value={2}>Học kỳ 2</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Số lượng Top</label>
                    <input type="number" value={rankingQuantity} onChange={(e) => setRankingQuantity(Number(e.target.value))} className="mt-1 w-full p-2 border rounded" />
                </div>
            </div>
            
            <button onClick={fetchRanking} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mb-6">Xem Xếp Hạng</button>

            {/* Khung hiển thị lỗi nếu không có dữ liệu */}
            {errorMessage && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
                    <span className="font-medium">Thông báo: </span> {errorMessage}
                </div>
            )}

            {/* Bảng xếp hạng */}
            {rankingData.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr className="bg-blue-600 text-white">
                                <th className="border p-3 text-center w-16">STT</th>
                                <th className="border p-3 text-left">Họ và Tên</th>
                                <th className="border p-3 text-center">Lớp</th>
                                
                                {/* Tự động sinh ra các cột điểm */}
                                {scoreHeaders.map((headerName, index) => (
                                    <th key={index} className="border p-3 text-center capitalize">
                                        {headerName.replace(/_/g, ' ')}
                                    </th>
                                ))}

                                <th className="border p-3 text-center">ĐTB Học kỳ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rankingData.map((hs, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 border-b">
                                    {/* STT */}
                                    <td className="border p-3 text-center font-bold text-gray-700">{idx + 1}</td>
                                    
                                    {/* Tên Học sinh */}
                                    <td className="border p-3 font-medium">
                                        {hs.studentName}
                                    </td>

                                    {/* [THÊM MỚI]: Hiển thị Lớp */}
                                    <td className="border p-3 text-center text-gray-600">
                                        {hs.className}
                                    </td>
                                    
                                    {/* Các điểm thành phần (Đã sửa logic hiển thị dấu "-") */}
                                    {hs.gradeConfigs.map(cf => (
                                        <td key={cf.gradeConfigId} className="border p-3">
                                            <div className="flex justify-center flex-wrap gap-2">
                                                {/* Dùng Array.from để tạo đủ số lượng ô dựa theo maxEntries */}
                                                {Array.from({ length: cf.maxEntries }).map((_, sIdx) => {
                                                    const score = cf.scores[sIdx]; // Lấy điểm ở vị trí tương ứng
                                                    return (
                                                        <span 
                                                            key={sIdx} 
                                                            className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 font-semibold rounded-md shadow-sm"
                                                        >
                                                            {/* Nếu có điểm thì hiện, nếu undefined/null thì hiện "-" */}
                                                            {score !== undefined && score !== null ? score : '-'}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    ))}

                                    {/* ĐTB Học kỳ */}
                                    <td className="border p-3 text-center font-bold text-red-600 text-lg">
                                        {hs.semesterAverage}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default GradeRanking;