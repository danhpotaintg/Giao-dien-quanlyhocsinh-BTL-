import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

export default function StudentSubjectList() {
    

    const [subjectList, setSubjectList] = useState([]);
    const [err, setErr] = useState("");

    const [semester, setSemester] = useState(1);
    const [selectedYear, setSelectedYear] = useState(2025);

    const getAvailableYears = () => {
        const base = parseInt(2025);
        return [base, base + 1, base + 2, base + 3, base + 4];
    };

    const [selection, setSelection] = useState({
        academicYear: "",
        semester: ""
    });

    const fetchSubjectList = async () => {
        try {
            const token = localStorage.getItem('token');
   
            const response = await axios.get(
                `/quanly/grades/student/subjects?semester=${semester}&academicYear=${selectedYear}`, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSubjectList(response.data.result);
        } catch (error) {
            const backendMessage = error.response?.data?.message;
            setErr(backendMessage || "Không thể tải danh sách môn học");
            setTimeout(() => setErr(''), 5000);
        }
    };

    useEffect(() => {
        fetchSubjectList();
    }, [semester, selectedYear]);



    return (
        <div className="p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-600">Danh sách môn học</h2>
                <Link
                    to={`/student/allgrade/${semester}/${selectedYear}`}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-lg transition-colors"
                >
                    Xem bảng điểm
                </Link>
            </div>

            {/* Bộ lọc */}
            <div className="flex gap-6 mb-6">
                <div className="flex items-center gap-2">
                    <label className="font-bold text-base text-gray-700">Học kỳ:</label>
                    <select
                        value={semester}
                        onChange={(e) => setSemester(Number(e.target.value))}
                        className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-600 text-base"
                    >
                        <option value={1}>Học kỳ 1</option>
                        <option value={2}>Học kỳ 2</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <label className="font-bold text-base text-gray-700">Năm học:</label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-600 text-base"
                    >
                        {getAvailableYears().map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            {err && <div className="text-red-500 font-semibold bg-red-50 p-2.5 rounded border border-red-200 mb-4">{err}</div>}

            {/* Bảng */}
            <table className="w-full table-fixed border-collapse border border-gray-300 shadow-sm rounded-lg overflow-hidden">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="border p-3 text-center font-bold text-base">Tên môn học</th>
                        <th className="border p-3 text-center font-bold text-base">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="text-base">
                    {subjectList && subjectList.length > 0 ? (
                        subjectList.map((data, index) => (
                            <tr key={data.id} className="hover:bg-blue-50/50 transition">
                                <td className="border p-3 text-center font-bold text-gray-800">{data.subjectName}</td>
                                <td className="border p-3 text-center">
                                    <Link
                                        to={`/student/grade/${data.id}/${semester}/${selectedYear}`}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded transition-colors inline-block"
                                    >
                                        Xem điểm
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="border p-10 text-center text-gray-500 italic">
                                {`Không tìm thấy môn học cho học kỳ ${semester} năm ${selectedYear}`}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}