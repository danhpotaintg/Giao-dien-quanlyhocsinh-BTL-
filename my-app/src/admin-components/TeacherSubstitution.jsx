import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function HomeroomTeacherClass(){

    const gender = {
        "MALE":"Nam",
        "FEMALE": "Nữ"
    }
    const [teacherData, setTeacherData] = useState([]);
    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");

    const fetchTeacher = async() => {
            try{
                const token = localStorage.getItem('token');
                const response = await axios.get("/quanly/teachers", {
                    headers: { Authorization : `Bearer ${token}` }
                });

                setTeacherData(response.data.result);
            }catch(e){
                const backendMessage = e.response?.data?.message;
                setErr(backendMessage || "Không thể tải danh sách giáo viên");
                setTimeout(() => setErr(''), 3000);
            }
        }

    useEffect(() => {
        fetchTeacher();
    }, []);

    
    
    

   
    return(
        <div className="p-6">
            
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Danh sách giáo viên</h2>

            {err && <div className="text-red-500 bg-red-50 p-2 rounded mb-4">{err}</div>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-blue-600 text-white">
                <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Họ và tên</th>
                    <th className="border p-2">Giới tính</th>
                    <th className="border p-2">Môn dạy</th>
                    <th className="border p-2">Lớp chủ nhiệm</th>
                    <th className="border p-2">Xem TKB của GV</th>
                </tr>
                </thead>
                <tbody>
                {teacherData.map(teacher => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                        <td className="border p-2 text-center w-16" >{teacher.id}</td>
                        <td className="border p-2 text-center w-16">{teacher.fullName}</td>
                        <td className="border p-2 text-center w-16">{gender[teacher.gender]}</td>
                        <td className="border p-2 text-center w-16">{ teacher.subjectName}</td>
                        <td className="border p-2 text-center w-16">{teacher.className || ""}</td>
                        <td className="border p-2 text-center w-16">
                            <Link 
                                to={`/admin/classes/assign-teacher/${teacher.id}`} 
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            >
                                Xem TKB 
                            </Link>

                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}