import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function GradeImport() {
    const { classId, className } = useParams();

    const [teacherSubject, setTeacherSubject] = useState(null);
    const [subjectId, setSubjectId] = useState("");
    const [file, setFile] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const [selection, setSelection] = useState({
        academicYear: "",
        semester: ""
    });

    // Lấy môn dạy của giáo viên
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
                setErr(error?.response?.data?.message || "Không thể tải môn dạy của giáo viên");
                setTimeout(() => setErr(''), 5000);
            }
        };
        fetchSubject();
    }, []);

    const handleSelectionChange = (e) => {
        const value = e.target.value;
        if (value && value !== "-") {
            const [year, sem] = value.split('-');
            setSelection({ academicYear: year, semester: sem });
            setResults([]);
        } else {
            setSelection({ academicYear: "", semester: "" });
            setResults([]);
        }
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;
        if (!selected.name.endsWith('.xlsx')) {
            setErr("Chỉ chấp nhận file .xlsx");
            setTimeout(() => setErr(''), 5000);
            setFile(null);
            return;
        }
        setFile(selected);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selection.academicYear || !selection.semester) {
            setErr("Vui lòng chọn năm học và học kỳ");
            return;
        }
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
                `/quanly/excel/grades/class/${classId}/subject/${subjectId}/import?semester=${selection.semester}&academicYear=${selection.academicYear}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            setResults(res.data.result || []);
        } catch (error) {
            setErr(error?.response?.data?.message || "Lỗi import file");
            setTimeout(() => setErr(''), 5000);
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

            {/* 1. Chọn năm học và học kỳ */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Năm học và học kỳ:</label>
                <select
                    className="w-full p-2 border rounded border-gray-300"
                    onChange={handleSelectionChange}
                    value={`${selection.academicYear}-${selection.semester}`}
                >
                    <option value="-">-- Chọn năm học và học kỳ --</option>
                    <option value="2024-1">Học kì 1 năm 2024</option>
                    <option value="2024-2">Học kì 2 năm 2024</option>
                    <option value="2025-1">Học kì 1 năm 2025</option>
                    <option value="2025-2">Học kì 2 năm 2025</option>
                </select>
            </div>

            {/* 2. Chọn file Excel */}
            <div className="mb-4">
                <label className="block font-medium mb-1">File Excel (.xlsx):</label>
                <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded border-gray-300"
                />
                {file && (
                    <p className="text-sm text-gray-500 mt-1">Đã chọn: {file.name}</p>
                )}
            </div>

            {/* 3. Hướng dẫn format file */}
            <div className="mb-4 p-3 bg-blue-50 rounded text-sm text-blue-700">
                <p className="font-medium mb-1">Format file Excel:</p>
                <p>Cột A: studentId | Cột B: Tên học sinh | Cột C trở đi: Các cột điểm</p>
                <p>Header: "Điểm 15p 1", "Điểm 15p 2", "Điểm giữa kì", "Điểm cuối kì"</p>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {loading ? "Đang import..." : "Import điểm"}
            </button>

            {/* 4. Kết quả import */}
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