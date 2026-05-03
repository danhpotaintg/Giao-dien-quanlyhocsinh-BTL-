import { useState, useEffect } from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';

export default function Attendance(){
    const [stucData, setStuData] = useState([]);
    const [classData, setClassData] = useState([]);
    const [err, setErr] = useState("")

    const [selectedYear, setSelectedYear] = useState(2025);
    
    const getAvailableYears = () => {
        const base = parseInt(2025);
        return [base, base + 1, base + 2, base + 3, base + 4];
    };

    const fetchClassData = async() => {
        try{
            const token = localStorage.getItem('token');
            const response = await axios.get(`/quanly/schedules/teacher-classes/${selectedYear}`,{
                headers: {Authorization: `Bearer ${token}`}
            });

            setClassData(response.data.result);
        }catch(err){
            const backendMessage = response?.data?.message;
            setErr(backendMessage || "Không thể tải danh sách lớp");
            setTimeout(() => setErr(''), 5000);
        }
    }

    useEffect(() => {
        fetchClassData();
    }, [selectedYear]);

    

  

    return (
        <div>
            {err && <p style={{ color: 'red' }}>{err}</p>}
            
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Danh sách lớp giảng dạy</h2>
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

            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="border p-2">Tên lớp</th>
                        <th className="border p-2">Năm học</th>
                        <th className="border p-2">Xem danh sách học sinh</th>                      
                    </tr>
                </thead>
                <tbody>
                    {classData.map(clas => (
                        <tr key={clas.id} className="hover:bg-gray-50">
                            <td className="border p-2 text-center w-16">{clas.className}</td>
                            <td className="border p-2 text-center w-16">{clas.academicYear}</td>
                            <td className="border p-2 text-center w-16">
                                <Link 
                                    to={`/teacher/attendance/${clas.id}/${clas.className}`} 
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    Xem danh sách
                                </Link>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
            
        
           
        </div>
    );
}