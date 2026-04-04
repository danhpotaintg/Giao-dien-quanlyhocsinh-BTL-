import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function StudentClass() {
    const [stuData, setStuData] = useState([]);
    const [error, setError] = useState("");
    const [classData, setClassData] = useState([]);
    const [classId, setClassId] = useState(""); 
    const [stuIds, setStuIds] = useState([]);
    const [success, setSuccess] = useState("");

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token'); 
            const response = await axios.get('/quanly/students', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStuData(response.data.result);
        } catch (err) {
            const backendMessage = err.response?.data?.message;
            setError(backendMessage || 'Không thể tải danh sách học sinh!');
            setTimeout(() => setError(''), 3000);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchClass = async() => {
            try{
                const token = localStorage.getItem('token');
                const response = await axios.get("/quanly/classes", {
                    headers : { Authorization: `Bearer ${token}`}
                });
                setClassData(response.data.result);
            }catch (err) {
                const backendMessage = err.response?.data?.message;
                setError(backendMessage || 'Không thể tải danh sách lớp học!');
                setTimeout(() => setError(''), 3000);
            }
        };
        fetchClass();
    }, []);

    const handleCheckBox = (studentId) => {
        setStuIds((prevIds) => {
            if (prevIds.includes(studentId)) {
                return prevIds.filter((id) => id !== studentId);
            }
            return [...prevIds, studentId];
        });
    };

    const handleSubmit = async() => {
        if (!classId) {
            alert("Vui lòng chọn lớp!");
            return;
        }

        if (stuIds.length === 0) {
            alert("Vui lòng chọn ít nhất 1 học sinh!");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`/quanly/classes/${classId}/addstudent`, 
            {
                studentIds: stuIds
            },
            {
                headers : { Authorization: `Bearer ${token}`}
            });


            const assignedIds = response.data.result.assignedStudentIds;


            if (assignedIds && assignedIds.length > 0) {

                setSuccess('Gán lớp học thành công!');
                setTimeout(() => setSuccess(''), 3000);

                setClassId("");
                setStuIds([]);

                fetchUsers();

            } else {
 
                setError('Tất cả học sinh được chọn đều đã có lớp!');
                setTimeout(() => setError(''), 3000);
  
            }

        } catch (err) {
            const backendMessage = err.response?.data?.message;
            setError(backendMessage || 'Có lỗi xảy ra khi gán lớp!');
            setTimeout(() => setError(''), 3000);
        }
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Danh sách học sinh</h2>

            <div className="h-12 mb-4"> 
                {success && <div className="text-green-700 bg-green-100 p-2 rounded border border-green-200">{success}</div>}
                {error && <div className="text-red-700 bg-red-100 p-2 rounded border border-red-200">{error}</div>}
            </div>

            <div className="flex items-center gap-4 mb-4">
                <select 
                    className="p-2 border rounded border-gray-300" 
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                >
                    <option value="">Chọn lớp</option>
                    {classData.map(data => (
                        <option key={data.id} value={data.id}>{data.className}</option>
                    ))}
                </select>
                <button 
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" 
                    onClick={handleSubmit}
                >
                    Gán lớp
                </button>
            </div>

            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Họ và tên</th>
                        <th className="border p-2">Ngày sinh</th>
                        <th className="border p-2">Giới tính</th>
                        <th className="border p-2">Lớp học</th>
                        <th className="border p-2">Chọn</th>
                    </tr>
                </thead>
                <tbody>
                    {stuData.map(stu => (
                        <tr key={stu.id} className="hover:bg-gray-50">
                            <td className="border p-2 text-center w-16" >{stu.id}</td>
                            <td className="border p-2 text-center w-16">{stu.fullName}</td>
                            <td className="border p-2 text-center w-16">{stu.dob}</td>
                            <td className="border p-2 text-center w-16">{stu.gender}</td>
                            <td className="border p-2 text-center w-16">{stu.classRoom?.className || <span className="text-gray-400">Chưa xếp lớp</span>}</td>
                            <td className="border p-2 text-center w-16">
                                <input type="checkbox" checked={stuIds.includes(stu.id)} onChange={() => handleCheckBox(stu.id)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}