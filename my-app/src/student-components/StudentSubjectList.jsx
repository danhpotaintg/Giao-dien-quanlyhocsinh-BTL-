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
            <div className="flex gap-4 items-center">
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
            </div>
            
            {err && <div className="text-red-500 bg-red-50 p-2 rounded mb-4">{err}</div>}

            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="border p-2 text-center">Tên môn</th>
                        <th className="border p-2 text-center w-32">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {subjectList && subjectList.length > 0 ? (
                        subjectList.map(data => (
                            <tr key={data.id} className="hover:bg-gray-50 text-center">
                                <td className="border p-2">
                                    { data.subjectName}
                                </td>
                                <td className="border p-2"> 
                                    <Link 
                                            to={`/student/grade/${data.id}/${semester}/${selectedYear}`} 
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 inline-block"
                                    >
                                        Xem điểm
                                    </Link>
                                </td>
                            </tr>  
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" className="border p-10 text-center text-gray-500 italic">
                                {selectedYear 
                                    ? `Không tìm thấy môn học cho học kỳ ${semester} năm ${selectedYear}`
                                    : "Vui lòng chọn học kỳ để hiển thị dữ liệu."
                                }
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}