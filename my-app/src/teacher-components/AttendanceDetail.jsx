import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function AttendanceDetail() {
    const gender = {
        "MALE": "Nam",
        "FEMALE": "Nữ"
    };
    const { classId, className } = useParams();

    const [stuData, setStuData] = useState([]);
    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");
    
    const [attendanceStates, setAttendanceStates] = useState({});

    const fetchStuData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/quanly/classes/${classId}/students`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStuData(response.data.result);
            
    
            const initialStates = {};
            response.data.result.forEach(stu => {
                initialStates[stu.id] = "Present";
            });
            setAttendanceStates(initialStates);
        } catch (error) {
            const backendMessage = error.response?.data?.message;
            setErr(backendMessage || "Không thể tải danh sách học sinh");
            setTimeout(() => setErr(''), 5000);
        }
    };

    useEffect(() => {
        if (classId) {
            fetchStuData();
        }
    }, [classId]);


    const handleStatusChange = (stuId, value) => {
        setAttendanceStates(prev => ({
            ...prev,
            [stuId]: value
        }));
    };

    const handleSubmitAll = async () => {
        if (stuData.length === 0) {
            setErr("Không có học sinh nào trong danh sách để điểm danh.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            
            const bulkData = stuData.map(stu => ({
                studentId: stu.id,
                status: (attendanceStates[stu.id] || "Present").toUpperCase() 
            }));


            await axios.post("/quanly/attendances/multi", bulkData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess(`Đã điểm danh cho toàn bộ lớp thành công!`);
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
            setTimeout(() => setSuccess(''), 4000);
        } catch (error) {
            setErr(error.response?.data?.message || "Lưu điểm danh thất bại");
            setTimeout(() => setErr(''), 5000);
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-600">Điểm danh lớp: {className}</h2>
                
                <button 
                    onClick={handleSubmitAll}
                    className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:bg-green-700 transition-all duration-200"
                >
                    Điểm danh
                </button>
            </div>

            <div>
                {err && <p className="text-red-500 font-semibold mb-3 bg-red-50 p-2.5 rounded border border-red-200">{err}</p>}
                {success && <p className="text-green-500 font-semibold mb-3 bg-green-50 p-2.5 rounded border border-green-200">{success}</p>}
            </div>

            <table className="w-full table-fixed border-collapse border border-gray-300 shadow-sm rounded-lg overflow-hidden">
                <thead className="bg-blue-600 text-white text-base">
                    <tr>
                        <th className="border p-3 text-center w-[5%] font-bold">STT</th>
                        <th className="border p-3 text-center w-[25%] font-bold">Họ và tên</th>
                        <th className="border p-3 text-center w-[12%] font-bold">Ngày sinh</th>
                        <th className="border p-3 text-center w-[10%] font-bold">Giới tính</th>
                        <th className="border p-3 text-center w-[18%] font-bold">SĐT Phụ huynh</th>
                        <th className="border p-3 text-center w-[20%] font-bold">Trạng thái điểm danh</th>
                    </tr>
                </thead>
                <tbody className="text-base">  
                    {stuData.map((user, index) => (
                        <tr key={user.id} className="hover:bg-blue-50/50 transition">
                            <td className="border p-3 text-center font-bold text-gray-600">{index + 1}</td>
                            <td className="border p-3 text-center font-bold text-gray-800 truncate">{user.fullName}</td>
                            <td className="border p-3 text-center font-bold text-gray-600">{user.dob}</td>
                            <td className="border p-3 text-center font-bold text-gray-600">{gender[user.gender]}</td>
                            <td className="border p-3 text-center font-bold text-gray-600">{user.parentPhonenumber}</td>
                            <td className="border p-3 text-center">
                                <select 
                                    className="border border-gray-300 p-1.5 rounded-md font-medium bg-white focus:outline-none focus:border-blue-500 cursor-pointer text-gray-700"
                                    value={attendanceStates[user.id] || "Present"}
                                    onChange={(e) => handleStatusChange(user.id, e.target.value)}
                                >
                                    <option value="Present">Có mặt</option>
                                    <option value="Absent">Vắng mặt</option>
                                    <option value="Late">Đi muộn</option>
                                    <option value="Excused">Nghỉ có phép</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
        </div>
    );
}