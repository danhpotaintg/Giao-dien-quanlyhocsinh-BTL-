import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Attendance(){
    const [stuData, setStuData] = useState([]);
    const [err, setErr] = useState("")

    const fetchData = async() => {
        try{
            const token = localStorage.getItem('token');
            const response = await axios.get("/quanly/classes/my-class-students",{
                headers: {Authorization: `Bearer ${token}`}
            });

            setStuData(response.data.result);
        }catch(err){
            const backendMessage = response?.data?.message;
            setErr(backendMessage || "Không thể tải danh sách học sinh");
            setTimeout(() => setErr(''), 5000);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            {err && <p style={{ color: 'red' }}>{err}</p>}
            
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Danh sách học sinh</h2>
            
            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="border p-2">Họ và tên</th>
                        <th className="border p-2">Ngày sinh</th>
                        <th className="border p-2">Giới tính</th>
                        <th className="border p-2">Số điện thoại phụ huynh</th>
                        <th className="border p-2">Email của phụ huynh</th>
                    </tr>
                </thead>
                <tbody>
                    {stuData.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                            <td className="border p-2 text-center w-16">{user.fullName}</td>
                            <td className="border p-2 text-center w-16">{user.dob}</td>
                            <td className="border p-2 text-center w-16">{user.gender}</td>
                            <td className="border p-2 text-center w-16">{user.parentPhonenumber}</td>
                            <td className="border p-2 text-center w-16">{user.parentGmail}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
           
        </div>
    );
}