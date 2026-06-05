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
            const token = localStorage.getItem('token');
            const response = await axios.get(`/quanly/grades/student/subject/${subjectId}?academicYear=${academicYear}&semester=${semester}`,{
                headers: { Authorization: `Bearer ${token}` }
            });

            setGradeData(response.data.result);
            console.log(response.data.result);

        }catch(error){
            console.error("Môn này chưa có điểm", error);
            setErr("Môn học này hiện chưa được cập nhật điểm.");
        }
    }
    
    useEffect(() => {
        fetchGradeData();
    }, [subjectId, semester, academicYear])

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-6">
            
            {/* Header thông tin môn học dạng Form Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white shadow-lg shadow-blue-100 mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                    Học kỳ {semester} — Năm học {academicYear}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold mt-3 tracking-tight">
                    {gradeData?.subjectName || "Kết quả học tập"}
                </h2>
                <p className="text-blue-100 text-sm mt-1">Chi tiết phiếu điểm cá nhân của học sinh</p>
            </div>

            {/* Trạng thái lỗi hoặc trống */}
            {err && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-xl text-center font-medium mb-6">
                    {err}
                </div>
            )}

            {/* Thân biểu mẫu (Form Body) */}
            {gradeData?.gradeConfigs && gradeData.gradeConfigs.length > 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-6">
                    
                    <div className="border-b border-gray-100 pb-3">
                        <h3 className="text-gray-800 font-bold text-lg">Các đầu điểm thành phần</h3>
                    </div>

                    {/* Danh sách các loại điểm biến đổi thành Form Row */}
                    <div className="space-y-4">
                        {gradeData.gradeConfigs.map((config) => (
                            <div 
                                key={config.gradeConfigId} 
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-blue-200 transition-all group"
                            >
                                {/* Cột trái: Tên điểm & Hệ số */}
                                <div className="mb-2 sm:mb-0">
                                    <div className="font-bold text-gray-800 group-hover:text-blue-600 transition">
                                        {config.scoreType === 'thuong_xuyen' ? 'Điểm thường xuyên' :
                                         config.scoreType === 'giua_ky' ? 'Điểm giữa kỳ' :
                                         config.scoreType === 'cuoi_ky' ? 'Điểm cuối kỳ' : config.scoreType}
                                    </div>
                                    <div className="text-xs text-gray-400 font-medium mt-0.5">
                                        Hệ số tương ứng: <span className="font-bold text-gray-600">{config.weight}</span>
                                    </div>
                                </div>

                                {/* Cột phải: Danh sách điểm số bong bóng */}
                                <div className="flex flex-wrap gap-2 sm:justify-end">
                                    {config.scores && config.scores.length > 0 ? (
                                        config.scores.map((score, index) => (
                                            <span 
                                                key={index}
                                                className="bg-blue-50 text-blue-600 border border-blue-100 px-3.5 py-1.5 rounded-xl font-extrabold text-base shadow-sm min-w-[40px] text-center"
                                            >
                                                {score}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 italic text-sm">Chưa nhập điểm</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Khối Điểm Trung Bình Kết Luận ở cuối Form */}
                    <div className="pt-4 border-t border-gray-100 mt-6">
                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                            <div>
                                <span className="font-bold text-gray-800 text-base block">Điểm trung bình học kỳ</span>
                                <span className="text-xs text-gray-400">Kết quả tổng kết của môn học này</span>
                            </div>
                            
                            <div className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-black text-xl shadow-md shadow-blue-200 tracking-wide">
                                {gradeData?.semesterAverage || "—"}
                            </div>
                        </div>
                    </div>

                </div>
            ) : (
                !err && (
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-12 text-center text-gray-400 italic">
                        Không tìm thấy dữ liệu cấu hình điểm của môn này.
                    </div>
                )
            )}
        </div>
    );
}