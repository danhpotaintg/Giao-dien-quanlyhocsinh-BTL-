import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function GradeImport() {
    const { classId, className, year, semester } = useParams();
    const navigate = useNavigate();

    const [teacherSubject, setTeacherSubject] = useState(null);
    const [subjectId, setSubjectId] = useState("");
    const [file, setFile] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const [columns, setColumns] = useState([]);

    //lấy subject
    useEffect(() => {
        const fetchSubject = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`/quanly/teachers/subject`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTeacherSubject(res.data.result);
                setSubjectId(res.data.result.id);
            } catch (error) {
                setErr("Không thể tải môn dạy");
            }
        };
        fetchSubject();
    }, []);

    // lấy gradeConfig
    useEffect(() => {
        if (!year || !semester || !subjectId) return;

        const fetchConfigs = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(
                    `/quanly/gradeConfigs/bulk-year-semseter/${subjectId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        params: {
                            academicYear: year,
                            semester: semester
                        }
                    }
                );

                const cfgs = res.data.result.configs || [];
                setColumns(generateColumns(cfgs));

            } catch (error) {
                setErr("Không thể tải cấu hình đầu điểm");
            }
        };

        fetchConfigs();
    }, [year, semester, subjectId]);

    const generateColumns = (configs) => {
        const cols = [];

        configs.forEach(cfg => {
            const type = cfg.scoreType?.toLowerCase();

            if (type === "thuong_xuyen") {
                for (let i = 1; i <= cfg.maxEntries; i++) {
                    cols.push(`Điểm thường xuyên ${i}`);
                }
            } else if (type === "giua_ky") {
                cols.push("Điểm giữa kì");
            } else if (type === "cuoi_ky") {
                cols.push("Điểm cuối kì");
            }
        });

        return cols;
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        if (!selected.name.endsWith('.xlsx')) {
            setErr("Chỉ chấp nhận file .xlsx");
            setFile(null);
            return;
        }

        setFile(selected);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setErr("Vui lòng chọn file Excel");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        setResults([]);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                `/quanly/excel/grades/class/${classId}/subject/${subjectId}/import`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                    params: {
                        semester: semester,
                        academicYear: year
                    }
                }
            );

            setResults(res.data.result || []);

        } catch (error) {
            setErr(error?.response?.data?.message || "Lỗi import file");
        } finally {
            setLoading(false);
        }
    };

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white shadow rounded">
            <h2 className="text-xl font-bold mb-4">
                Import điểm môn {teacherSubject?.subjectName || "..."} - Lớp {className}
            </h2>

            {err && (
                <div className="text-red-500 bg-red-50 p-2 rounded mb-4">{err}</div>
            )}

            {/* Năm + học kỳ */}
            <div className="mb-4">
                <p className="p-2 bg-gray-100 rounded">
                    Năm {year} - Học kỳ {semester}
                </p>
            </div>

            <div className="flex items-center gap-3">
           
            <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
            Chọn file
                    <input
                        type="file"
                        accept=".xlsx"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>

                {/* Tên file */}
                <span className="text-sm text-gray-600">
                    {file ? file.name : "Chưa có file nào được chọn"}
                </span>
            </div>

            {/* Format */}
            <div className="mb-4 p-3 bg-blue-50 rounded text-sm text-blue-700">
                <p className="font-medium mb-1">Định dạng file Excel:</p>
                <p>Cột A: Mã học sinh | Cột B: Tên | Cột C trở đi: Các cột điểm</p>

                {columns.length > 0 && (
                    <ul className="list-disc pl-5 mt-2">
                        {columns.map((col, index) => (
                            <li key={index}>
                                Cột {String.fromCharCode(67 + index)}: {col}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="flex justify-between mt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {loading ? "Đang import..." : "Import điểm"}
                </button>


                <button
                    type="button"
                    onClick={() => {
                        if (window.history.length > 1) {
                            navigate(-1);
                        } else {
                            navigate(`/teacher/class/${classId}/${className}/${year}`);
                        }
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Trở lại 
                </button>
            </div>

             {/* Kết quả import */}
            {results.length > 0 && (
                <div className="mt-6">
                    <div className="flex gap-4 mb-3">
                        <span className="text-green-600 font-medium">✓ Thành công: {successCount}</span>
                        <span className="text-red-500 font-medium">✗ Thất bại: {failCount}</span>
                    </div>
                    <table className="w-full border text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 text-left">STT</th>
                                <th className="border p-2 text-left">Tên học sinh</th>
                                <th className="border p-2 text-left">Trạng thái</th>
                                <th className="border p-2 text-left">Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((r) => (
                                <tr key={r.rowIndex} className={r.success ? "bg-green-50" : "bg-red-50"}>
                                    <td className="border p-2">{r.rowIndex}</td>
                                    <td className="border p-2">{r.studentName}</td>
                                    <td className="border p-2">
                                        {r.success
                                            ? <span className="text-green-600">✓ Thành công</span>
                                            : <span className="text-red-500">✗ Thất bại</span>
                                        }
                                    </td>
                                    <td className="border p-2">{r.message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </form>
    );
}
