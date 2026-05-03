import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TeacherSchedule(){ 

    const [semester, setSemester] = useState(1);
    const [selectedYear, setSelectedYear] = useState(2025);

    const getAvailableYears = () => {
        const base = parseInt(2025);
        return [base, base + 1, base + 2, base + 3, base + 4];
    };

    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    const days = [2, 3, 4, 5, 6, 7]; 
    const lessons = Array.from({ length: 12 }, (_, i) => i + 1); // Tiết 1 đến 12

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`/quanly/schedules/teacher/${semester}/${selectedYear}`,{
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSchedules(response.data.result);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi tải TKB:", error);
                setLoading(false);
            }
        };
        fetchSchedule();
    }, [semester, selectedYear]);

    // Hàm tìm tiết học cụ thể cho một ô trong bảng
    const getSubjectAt = (day, lesson) => {
        return schedules.find(s => s.dayOfWeek === day && s.startLesson <= lesson && s.endLesson >= lesson);
    };

    if (loading) return <div className="text-center p-10">Đang tải thời khóa biểu...</div>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">
                THỜI KHÓA BIỂU 
            </h2>
            <div className="flex gap-4 items-center">
                <div>
                    <label className="mr-2 font-bold">Học kỳ:</label>
                    <select 
                        value={semester} 
                        onChange={(e) => setSemester(Number(e.target.value))} 
                        className="p-2 border rounded"
                    >
                        <option value={1}>Học kỳ 1</option>
                        <option value={2}>Học kỳ 2</option>
                    </select>
                </div>

                <div>
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
                </div>
            </div>
                

            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="w-full border-collapse border border-gray-300 bg-white">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="border p-2 w-20">Tiết</th>
                            {days.map(d => <th key={d} className="border p-2">Thứ {d}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {lessons.map(lesson => (
                            <tr key={lesson} className="h-16">
                                <td className="border text-center font-bold bg-gray-100">Tiết {lesson}</td>
                                {days.map(day => {
                                    const schedule = getSubjectAt(day, lesson);
                                    // Kiểm tra nếu là tiết bắt đầu thì mới render ô (để xử lý merge row nếu cần)
                                    // Ở đây làm đơn giản: hiện nội dung ở mọi tiết thuộc khoảng start-end
                                    return (
                                        <td key={day} className={`border p-1 text-sm text-center ${schedule ? 'bg-blue-50' : ''}`}>
                                            {schedule && (
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-blue-700">{schedule.subjectName}</span>
                                                    <span className="text-xs text-gray-600">
                                                        {`Lớp: ${schedule.className}`}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400">(Tiết {schedule.startLesson}-{schedule.endLesson})</span>
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

