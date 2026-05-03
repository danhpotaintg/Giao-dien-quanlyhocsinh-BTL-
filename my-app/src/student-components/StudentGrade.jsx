import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function StudentGrade() {

    const [err, setErr] = useState("");
    const [gradeData, setGradeData] = useState(null);

    const {subjectId, semester, academicYear} = useParams();

    const fetchGradeData = async() => {
        if (!subjectId || !semester || !academicYear) return;
        
        try{
            if (!subjectId) return;

            const token = localStorage.getItem('token');
            const response = await axios.get(`/quanly/grades/student/subject/${subjectId}?academicYear=${academicYear}&semester=${semester}`,{
                headers: { Authorization: `Bearer ${token}` }
            });

            setGradeData(response.data.result);
            console.log(response.data.result);

        }catch(error){
            console.error("Môn này chưa có điểm", error);
        }
    }
    useEffect(() => {
        fetchGradeData();
    }, [subjectId, semester, academicYear])

    return (
        <div className="p-4">

            <h2 className="text-2xl font-bold mb-6 text-blue-700">
                Kết quả học tập: {gradeData?.subjectName}
            </h2>

            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="w-full border-collapse bg-white">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="border p-3 text-left">Loại điểm</th>
                            <th className="border p-3 text-center">Hệ số</th>
                            <th className="border p-3 text-left">Điểm số</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gradeData?.gradeConfigs && gradeData.gradeConfigs.length > 0 ? (
                            <>
                                {gradeData.gradeConfigs.map((config) => (
                                    <tr key={config.gradeConfigId} className="hover:bg-gray-50 border-b">
                                        <td className="border p-3 font-medium">
                                            {config.scoreType === 'thuong_xuyen' ? 'Điểm thường xuyên' : 
                                            config.scoreType === 'giua_ky' ? 'Kiểm tra giữa kỳ' : 
                                            config.scoreType === 'cuoi_ky' ? 'Kiểm tra cuối kỳ' : config.scoreType}
                                        </td>
                                        <td className="border p-3 text-center text-gray-600">
                                            {config.weight}
                                        </td>
                                        <td className="border p-3">
                                            <div className="flex flex-wrap gap-2">
                                                {config.scores && config.scores.length > 0 ? (
                                                    config.scores.map((score, index) => (
                                                        <span 
                                                            key={index} 
                                                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold shadow-sm"
                                                        >
                                                            {score}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400 italic">Chưa có điểm</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {/* Thêm hàng hiển thị điểm trung bình học kỳ */}
                                <tr className="hover:bg-gray-50 border-b ">
                                    <td colSpan="2" className="border p-3 font-medium ">
                                        Điểm trung bình học kỳ
                                    </td>
                                    <td className="border p-3">
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold shadow-sm">
                                        {gradeData?.semesterAverage || "Chưa có"}
                                        </span>
                                    </td>
                                </tr>
                            </>
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center p-10 text-gray-500">
                                    Môn học này chưa có điểm.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}