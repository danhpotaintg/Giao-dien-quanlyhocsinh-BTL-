import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function StudentList() {
    const { classId, className, academicYear } = useParams();
    const navigate = useNavigate();

    const [stuData, setStuData] = useState([]);
    const [err, setErr] = useState("");
    const [subjectId, setSubjectId] = useState('');
    const [semester, setSemester] = useState(1);
    const [selectedYear, setSelectedYear] = useState(academicYear   );
    const [gradeData, setGradeData] = useState(null);

    const getAvailableYears = () => {
        const base = parseInt(academicYear) || new Date().getFullYear();
        return [base, base + 1, base + 2];
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`/quanly/teachers/subject`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSubjectId(res.data.result.id);
            } catch (error) {
                setErr("Không thể tải môn dạy của giáo viên");
            }
        };
        fetchData();
    }, []);

    const fetchGrades = async () => {
        if (!subjectId) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`/quanly/statistics/class/${classId}/subject/${subjectId}`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { academicYear: selectedYear, semester: semester } 
            });
            setGradeData(res.data.result);
            setErr("");
        } catch (error) {
            setGradeData(null);
            setErr(error.response?.status === 404 ? "Không có dữ liệu bảng điểm!" : "Lỗi hệ thống");
        }
    };

    useEffect(() => {
        if (classId && subjectId) fetchGrades();
    }, [classId, subjectId, semester, selectedYear]);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-blue-600">Lớp {className}</h2>

                <div className="flex gap-4 items-center">
                    <div>
                        <label className="mr-2 font-bold">Năm học:</label>
                        <select 
                            value={selectedYear} 
                            onChange={(e) => setSelectedYear(e.target.value)} 
                            className="p-2 border rounded"
                        >
                            {getAvailableYears().map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mr-2 font-bold">Học kỳ:</label>
                        <select 
                            value={semester} 
                            onChange={(e) => setSemester(Number(e.target.value))} 
                            className="p-2 border rounded"
                        >
                            <option value={1}>Học kỳ 1</option>
                            <option value={2}>Học kỳ 2</option>
                        </select>
                    </div>
                </div>
            </div>

            {err && <p className="text-red-500 mb-2">{err}</p>}

            {gradeData && (
                <table className="min-w-full bg-white border">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="border p-3">STT</th>
                            <th className="border p-3">Họ và Tên</th>
                            {gradeData.gradeConfigs.map(config => (
                                <th key={config.id} className="border p-3">{config.scoreType}</th>
                            ))}
                            <th className="border p-3">ĐTB</th>
                            <th className="border p-3">Nhập điểm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gradeData.students.map((st, idx) => (
                            <tr key={st.studentId} className="border-b">
                                <td className="p-3 text-center">{idx + 1}</td>
                                <td className="p-3">{st.studentName}</td>
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

                                <td className="border p-3 text-center font-bold text-red-600 text-lg">
                                    {st.semesterAverage !== null && st.semesterAverage !== undefined ? st.semesterAverage : "-"}
                                </td>

                                <td className="p-3 text-center">
                                    <Link
                                        to={`/teacher/grade/${st.studentId}/${selectedYear}/${semester}`}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                        Nhập
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}