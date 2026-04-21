import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function HomeroomTeacherClass(){
  

    const gender = {
        "MALE":"Nam",
        "FEMALE": "Nữ"
    }

    const [teacherData, setTeacherData] = useState([]);
    const [classData, setClassData] = useState([]);
    const [err, setErr] = useState("");
    const [selectedClasses, setSelectedClasses] = useState({});
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
                    setErr(backendMessage || 'Không thể tải danh sách lớp học!');
                    setTimeout(() => setErr(''), 3000);
                }
            };
            fetchClass();
    }, []);
    
    const handleSelectChange = (teacherID, classID) =>{
        setSelectedClasses(prev => ({
            ...prev,
            [teacherID]: classID
        }));
    }

    const handleSubmit = async(teacherID) =>{
        const classID = selectedClasses[teacherID];
        try{    
            const token = localStorage.getItem('token');
            const response = await axios.post(`/quanly/classes/${classID}/assign-teacher/${teacherID}`, {}, {
                headers: { Authorization : `Bearer ${token}`}
            });

            setSelectedClasses(prev => {
                const newState = { ...prev };
                delete newState[teacherID]; 
                return newState;
            });

            setSuccess("Gán lớp thành công");
            setTimeout(() => setSuccess(''), 3000);

            fetchTeacher();

        }catch(err){
            const backendMessage = err.response?.data?.message;
            setErr(backendMessage || 'Không thể tải danh sách lớp học!');
            setTimeout(() => setErr(''), 3000);
        }
    }

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

                </tr>
                </thead>
                <tbody>
                {teacherData.map(teacher => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="border p-2 text-center w-16" >{teacher.id}</td>
                    <td className="border p-2 text-center w-16">{teacher.fullName}</td>
                    <td className="border p-2 text-center w-16">{gender[teacher.gender]}</td>
                    <td className="border p-2 text-center w-16">{teacher.subjectName}</td>
                    <td className="border p-2 text-center w-16">
                        {teacher.className ? (
                            <span>{teacher.className}</span>
                        ) : (
                            <div>
                                <select 
                                    className="p-2 border rounded border-gray-300" 
                                    value={selectedClasses[teacher.id] || ""}
                                    onChange={(e) => handleSelectChange(teacher.id, e.target.value)}
                                >
                                    <option value="">Chọn lớp</option>
                                    {classData.map(clas => (
                                        <option key={clas.id} value={clas.id}>{clas.className}</option>
                                    ))}
                                </select>
                                {selectedClasses[teacher.id] && (

                                        <button 
                                            onClick={() => handleSubmit(teacher.id)}
                                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" 
                                        >
                                            Gán lớp    
                                        </button>  
                                    )
                                }
                                  
                            </div>
                        )}
                    </td>
                    
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}