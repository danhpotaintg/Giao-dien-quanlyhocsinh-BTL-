import { useState, useEffect } from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

export default function ScheduleDetails(){
    const gender = {
        "MALE": "Nam",
        "FEMALE": "Nữ"
    };

    const subject = {
        "Math": "Toán",
        "English": "Tiếng Anh",
        "Physics": "Vật lý",
        "Chemistry": "Hoá học",
        "Literature": "Ngữ văn" 
    }

    

    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [classSelected, setClassSelected] = useState({});

    useEffect(() => {
        const initData = async () => {
            const token = localStorage.getItem('token');
            const [resClasses, resTeachers] = await Promise.all([
                axios.get('/quanly/classes',{
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('/quanly/teachers', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setClasses(resClasses.data.result);
            setTeachers(resTeachers.data.result);
    };
    initData();
    }, []);

    const handleClassChange = (teacherId, classId) =>{
        setClassSelected(prev => ({
            ...prev,
            [teacherId]: classId
        }));
    }


    return (
        <div>
            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="border p-2">Họ và tên</th>
                        <th className="border p-2">Ngày sinh</th>
                        <th className="border p-2">Giới tính</th>
                        <th className="border p-2">Môn dạy</th>
                        <th className="border p-2">Lớp</th>
                        <th className="border p-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                            <td className="border p-2 text-center w-16">{user.fullName}</td>
                            <td className="border p-2 text-center w-16">{user.dob}</td>
                            <td className="border p-2 text-center w-16">{gender[user.gender]}</td>
                            <td className="border p-2 text-center w-16">{subject[user.subjectName]}</td>
                            <td className="border p-2 text-center w-16">
                                <select 
                                    className="border p-1 rounded"
                                    value={classSelected[user.id] || ""}
                                    onChange={(e) => handleClassChange(user.id, e.target.value)}
                                >   
                                    <option value="">Chọn lớp</option>
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.className}
                                        </option>   
                                    ))}
                                </select>
                                
                            </td>
                            <td className="border p-2 text-center w-16">
                                <Link 
                                    to={`/admin/classes/schedule/${user.id}/${classSelected[user.id]}`} 
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