import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function StudentList() {
    const gender = {
        "MALE": "Nam",
        "FEMALE": "Nữ"
    };

    const { classId, className, academicYear} = useParams();
    const navigate = useNavigate();

    const [stuData, setStuData] = useState([]);
    const [err, setErr] = useState("");
    const [selectedClass, setSelectedClass] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [semester, setSemester] = useState(1);
    const [gradeData, setGradeData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const token = localStorage.getItem('token');
                const res = await axios.get(`/quanly/teachers/subject`, {
                    headers: {Authorization: `Bearer ${token}`}
                });

                const subId = res.data.result.id; 
                setSubjectId(subId);
            }catch(error){
                const backendMessage = error?.data?.message;
                setErr(backendMessage || "Không thể tải môn dạy của giáo viên");
                setTimeout(() => setErr(''), 5000);
            }
        };
        fetchData();
    }, []);

    const fetchStuData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/quanly/classes/${classId}/students`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStuData(response.data.result);
        } catch (err) {
            const backendMessage = err?.response?.data?.message;
            setErr(backendMessage || "Không thể tải danh sách học sinh");
            setTimeout(() => setErr(''), 5000);
        }
    };

    const getAvailableYears = () => {
        const baseYear = academicYear;
        return [baseYear, baseYear + 1, baseYear + 2];
    };

    const fetchGrades = async () => { 
        try {
            setErr(""); 
            
            const token = localStorage.getItem('token');
            const res = await axios.get(`/quanly/statistics/class/${classId}/subject/${subjectId}`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { academicYear, semester }
            });
            setGradeData(res.data.result);
        } catch (error) {
            setGradeData(null); 
            if (error.response && error.response.status === 404) {
                setErr("Không có dữ liệu bảng điểm cho môn học và lớp này!");
            } else {
                setErr("Đã xảy ra lỗi hệ thống khi lấy dữ liệu.");
                console.error("Lỗi lấy bảng điểm", error);
            }
        }
    };

    useEffect(() => {
        if (classId) fetchStuData();
    }, [classId]);

    useEffect(() => {
        if (classId && subjectId) {
            fetchGrades();
        }
    }, [classId, subjectId, semester]);

    return (
        <div>

            {err && <p style={{ color: 'red' }}>{err}</p>}


            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-blue-600">
                    Danh sách học sinh lớp {className}
                </h2>
                <button
                    onClick={() => navigate(`/teacher/grade-import/${classId}/${className}`)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Import điểm từ Excel
                </button>
            </div>
            <div>
                <select value={semester} onChange={(e) => setSemester(Number(e.target.value))} className="mt-1 p-2 border rounded">
                    <option value={1}>Học kỳ 1</option>
                    <option value={2}>Học kỳ 2</option>
                </select>
            </div>
            {gradeData && gradeData.students && gradeData.gradeConfigs && (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr className="bg-blue-600 text-white">
                                <th className="border p-3 text-center w-16">STT</th>
                                <th className="border p-3 text-left">Họ và Tên</th>
                                {/* Tự động sinh tiêu đề cột điểm từ cấu hình điểm (gradeConfigs) */}
                                {gradeData.gradeConfigs.map(config => (
                                    <th key={config.id} className="border p-3 text-center capitalize">
                                        {config.scoreType.replace(/_/g, ' ')}
                                    </th>
                                ))}
                                
                                <th className="border p-3 text-center">ĐTB Học kỳ</th>
                                <th className="border p-3 text-center">Nhập điểm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gradeData.students.map((st, idx) => (
                                <tr key={st.studentId} className="hover:bg-gray-50 border-b">
                                    {/* STT */}
                                    <td className="border p-3 text-center font-bold text-gray-700">{idx + 1}</td>
                                    
                                    {/* Tên học sinh */}
                                    <td className="border p-3 font-medium">{st.studentName}</td>

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

                                    <td className="border p-2 text-center">
                                            <Link
                                            to={`/teacher/grade/${st.studentId}`}
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        >
                                            Nhập
                                        </Link>
                                    </td> 
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
              
        </div>
    );
}

