import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function StudentList() {
    const gender = {
        "MALE": "Nam",
        "FEMALE": "Nữ"
    };

    const { classId, className } = useParams();
    const navigate = useNavigate();

    const [stuData, setStuData] = useState([]);
    const [err, setErr] = useState("");

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

    useEffect(() => {
        if (classId) fetchStuData();
    }, [classId]);

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

            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="border p-2">Họ và tên</th>
                        <th className="border p-2">Ngày sinh</th>
                        <th className="border p-2">Giới tính</th>
                        <th className="border p-2">Nhập điểm</th>
                    </tr>
                </thead>
                <tbody>
                    {stuData.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                            <td className="border p-2 text-center">{user.fullName}</td>
                            <td className="border p-2 text-center">{user.dob}</td>
                            <td className="border p-2 text-center">{gender[user.gender]}</td>
                            <td className="border p-2 text-center">
                                <Link
                                    to={`/teacher/grade/${user.id}`}
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
    );
}