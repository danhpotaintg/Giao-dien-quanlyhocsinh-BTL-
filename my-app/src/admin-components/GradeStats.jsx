import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GradeStats = () => {
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    
    const [selectedClass, setSelectedClass] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [semester, setSemester] = useState(1);
    const [academicYear, setAcademicYear] = useState('');
    
    const [gradeData, setGradeData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    // Lấy DS Lớp và DS Môn học khi load trang
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            try {
                const [classRes, subRes] = await Promise.all([
                    axios.get('/quanly/classes', { headers }),
                    axios.get('/quanly/subjects', { headers })
                ]);
                setClasses(classRes.data.result || []);
                setSubjects(subRes.data.result || []);
            } catch (error) {
                console.error("Lỗi lấy dữ liệu ban đầu", error);
            }
        };
        fetchData();
    }, []);

    // Tính toán 5 năm gần nhất từ năm học của lớp
    const getAvailableYears = () => {
        if (!selectedClass) return [];
        const cls = classes.find(c => c.id.toString() === selectedClass);
        if (!cls) return [];
        const baseYear = cls.academicYear;
        return [baseYear, baseYear + 1, baseYear + 2, baseYear + 3, baseYear + 4];
    };

    const fetchGrades = async () => {
        if(!selectedClass || !subjectId || !academicYear) {
            setErrorMessage("Vui lòng chọn đủ thông tin"); 
            return;
        }
        
        try {
            setErrorMessage(""); 
            
            const token = localStorage.getItem('token');
            const res = await axios.get(`/quanly/statistics/class/${selectedClass}/subject/${subjectId}`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { academicYear, semester }
            });
            setGradeData(res.data.result);
        } catch (error) {
            setGradeData(null); 
            if (error.response && error.response.status === 404) {
                setErrorMessage("Không có dữ liệu bảng điểm cho môn học và lớp này!");
            } else {
                setErrorMessage("Đã xảy ra lỗi hệ thống khi lấy dữ liệu.");
                console.error("Lỗi lấy bảng điểm", error);
            }
        }
    };

    return (
        <div className="p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-6">Bảng Điểm Lớp Học</h2>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium">Lớp học</label>
                    <select value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); setAcademicYear(''); }} className="mt-1 w-full p-2 border rounded">
                        <option value="">-- Chọn lớp --</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.className} ({c.academicYear})</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Năm học</label>
                    <select disabled={!selectedClass} value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} className="mt-1 w-full p-2 border rounded disabled:bg-gray-200">
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
            </div>
            
            <button onClick={fetchGrades} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6">
                Xem Bảng Điểm
            </button>

            {/* Hiển thị lỗi */}
            {errorMessage && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
                    <span className="font-medium">Thông báo: </span> {errorMessage}
                </div>
            )}
            
            {/* Hiển thị bảng điểm với giao diện mới */}
            {gradeData && gradeData.students && gradeData.gradeConfigs && (
                <div className="overflow-x-auto">
                    <h3 className="font-bold mb-4 text-lg text-gray-800">
                        Lớp: <span className="text-blue-600">{gradeData.className}</span> | Môn: <span className="text-blue-600">{gradeData.subjectName}</span>
                    </h3>
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr className="bg-blue-600 text-white">
                                <th className="border p-3 text-center w-16">STT</th>
                                <th className="border p-3 text-left">Họ và Tên</th>
                                <th className="border p-3 text-center">Lớp</th>
                                
                                {/* Tự động sinh tiêu đề cột điểm từ cấu hình điểm (gradeConfigs) */}
                                {gradeData.gradeConfigs.map(config => (
                                    <th key={config.id} className="border p-3 text-center capitalize">
                                        {config.scoreType.replace(/_/g, ' ')}
                                    </th>
                                ))}
                                
                                <th className="border p-3 text-center">ĐTB Học kỳ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gradeData.students.map((st, idx) => (
                                <tr key={st.studentId} className="hover:bg-gray-50 border-b">
                                    {/* STT */}
                                    <td className="border p-3 text-center font-bold text-gray-700">{idx + 1}</td>
                                    
                                    {/* Tên học sinh */}
                                    <td className="border p-3 font-medium">{st.studentName}</td>
                                    
                                    {/* Lớp (API ClassGradeSheetResponse trả về className chung cho toàn bảng) */}
                                    <td className="border p-3 text-center text-gray-600">{gradeData.className}</td>
                                    
                                    {/* Render điểm thành phần dựa trên số đầu điểm tối đa (maxEntries) */}
                                    {gradeData.gradeConfigs.map(config => (
                                        <td key={config.id} className="border p-3">
                                            <div className="flex justify-center flex-wrap gap-2">
                                                {/* Khởi tạo đủ số ô điểm theo maxEntries của từng cột */}
                                                {Array.from({ length: config.maxEntries }).map((_, sIdx) => {
                                                    // Key của map trong Backend được format là: "gradeConfigId_entryIndex"
                                                    // sIdx bắt đầu từ 0 nên entryIndex = sIdx + 1
                                                    const scoreKey = `${config.id}_${sIdx + 1}`;
                                                    const score = st.scores ? st.scores[scoreKey] : null;
                                                    
                                                    return (
                                                        <span 
                                                            key={sIdx} 
                                                            className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 font-semibold rounded-md shadow-sm"
                                                        >
                                                            {/* Render điểm, nếu chưa nhập thì hiện dấu "-" */}
                                                            {score !== undefined && score !== null ? score : '-'}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    ))}

                                    {/* ĐTB Học Kỳ */}
                                    <td className="border p-3 text-center font-bold text-red-600 text-lg">
                                        {st.semesterAverage !== null && st.semesterAverage !== undefined ? st.semesterAverage : "-"}
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

export default GradeStats;