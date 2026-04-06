import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TeacherInfo(){
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const gender = {
        "MALE" : "NAM",
        "FEMALE": "NỮ"
    }

    const subject = {
        "English": "Tiếng Anh",
        "Math": "Toán"
    }
    useEffect(() => {
        const fetchInfo = async() => {
            try{const token = localStorage.getItem('token');

            const response = await axios.get('/quanly/teachers/my-info',{
                headers:{ Authorization: `Bearer ${token}` }
            });

            setData(response.data.result);
            }catch(err){
                const backendMessage = err.response?.data?.message;
                setError(backendMessage || 'Không thể tải dữ liệu cá nhân!');
            }
        }

        fetchInfo();
    },[]);    

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!data) return <p>Không có dữ liệu!</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Thông tin cá nhân</h2>

            {error && <div className="text-red-500 bg-red-50 p-2 rounded mb-4">{error}</div>}

            {data && (
                <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="border p-2">Họ và tên</th>
                            <th className="border p-2">Ngày sinh</th>
                            <th className="border p-2">Giới tính</th>
                            <th className="border p-2">Môn dạy</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-gray-50">
                            <td className="border p-2 text-center w-16">{data.fullName}</td>
                            <td className="border p-2 text-center w-16">{data.dob}</td>
                            <td className="border p-2 text-center w-16">{gender[data.gender]}</td>
                            <td className="border p-2 text-center w-16">{subject[data.subjectName]}</td>
                        </tr>
                    </tbody>
                </table>
            )
            }
        </div>
    );
}