import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function AssignTeacher() {
    
    const { teacherId } = useParams();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [freeTeachers, setFreeTeachers] = useState([]);
    const [subDate, setSubDate] = useState(new Date().toISOString().split('T')[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // state quản lý bộ lọc gv cùng môn
    const [onlySameSubject, setOnlySameSubject] = useState(true);

    const days = [2, 3, 4, 5, 6, 7];
    const lessons = Array.from({ length: 12 }, (_, i) => i + 1);

    //lấy dữ liệu TKB
    const fetchSchedule = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/quanly/schedules/teacher/${teacherId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSchedules(response.data.result);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi tải TKB:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, [teacherId]);

    // lấy danh sách giáo viên rảnh
    const fetchFreeTeachers = async (scheduleId, filter) => {
        try {
            const token = localStorage.getItem('token');
 
            const response = await axios.get(`/quanly/substitution/${scheduleId}?onlySameSubject=${filter}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFreeTeachers(response.data.result);
        } catch (error) {
            console.error("Lỗi tìm giáo viên rảnh:", error);
        }
    };

    //click chọn tiết để phân công gv
    const handleCellClick = (schedule) => {
        if (!schedule) return;
        setSelectedSchedule(schedule);
        setIsModalOpen(true);
        setOnlySameSubject(true); 
        fetchFreeTeachers(schedule.id, true);
    };

    //phân công giáo viên dạy thay
    const handleAssign = async (subTeacherId) => {
        try {
            const token = localStorage.getItem('token');
            const payload = {
                scheduleId: selectedSchedule.id,
                teacherSubstitutionId: subTeacherId,
                substitutionDate: subDate
            };

            await axios.post(`/quanly/substitution`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Phân công dạy thay thành công!");
            setIsModalOpen(false);
        } catch (error) {
            alert("Lỗi khi phân công: " + (error.response?.data?.message || "Lỗi hệ thống"));
        }
    };

    const getSubjectAt = (day, lesson) => {
        return schedules.find(s => s.dayOfWeek === day && s.startLesson <= lesson && s.endLesson >= lesson);
    };

    if (loading) return <div className="text-center p-10 font-medium">Đang tải thời khóa biểu...</div>;

    return (
        <div className="p-4 relative bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-800 uppercase tracking-wider">
                Điều phối dạy thay đột xuất
            </h2>
            
            <div className="overflow-x-auto shadow-2xl rounded-xl border border-gray-200">
                <table className="w-full border-collapse bg-white">
                    <thead className="bg-blue-700 text-white">
                        <tr>
                            <th className="border p-4 w-24">Tiết</th>
                            {days.map(d => <th key={d} className="border p-4">Thứ {d}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {lessons.map(lesson => (
                            <tr key={lesson} className="h-20">
                                <td className="border text-center font-bold bg-gray-100 text-gray-600">Tiết {lesson}</td>
                                {days.map(day => {
                                    const schedule = getSubjectAt(day, lesson);
                                    return (
                                        <td 
                                            key={day} 
                                            onClick={() => handleCellClick(schedule)}
                                            className={`border p-2 text-sm text-center transition-all duration-200 ${schedule ? 'bg-blue-50 hover:bg-blue-100 cursor-pointer group relative' : 'bg-white'}`}
                                        >
                                            {schedule && (
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-blue-900">{schedule.subjectName}</span>
                                                    <span className="text-xs font-semibold text-gray-500">Lớp: {schedule.className}</span>
                                                    <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-10 flex items-center justify-center transition-all">
                                                        <span className="text-[10px] text-blue-700 font-bold opacity-0 group-hover:opacity-100 uppercase mt-12">Chọn thay thế</span>
                                                    </div>
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

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900 bg-opacity-60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all">
                        <div className="bg-blue-600 p-5 text-white flex justify-between items-center shadow-lg">
                            <div>
                                <h3 className="font-bold text-xl uppercase italic">Phân công thay thế</h3>
                                <p className="text-xs text-blue-100 mt-1">Môn: {selectedSchedule?.subjectName} | Lớp: {selectedSchedule?.className}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform duration-200 text-3xl font-light">&times;</button>
                        </div>
                        
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <label className="block text-sm font-bold text-slate-600 mb-2">Ngày dạy thay:</label>
                                    <input 
                                        type="date" 
                                        value={subDate} 
                                        onChange={(e) => setSubDate(e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-inner"
                                    />
                                </div>
                                
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                                    <label className="flex items-center gap-3 cursor-pointer select-none">
                                        <div className="relative">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer"
                                                checked={onlySameSubject} 
                                                onChange={(e) => {
                                                    const val = e.target.checked;
                                                    setOnlySameSubject(val);
                                                    fetchFreeTeachers(selectedSchedule.id, val);
                                                }}
                                            />
                                            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                        </div>
                                        <span className="text-sm font-bold text-slate-700 italic">Ưu tiên cùng bộ môn</span>
                                    </label>
                                    <p className="text-[10px] text-slate-400 mt-2">Bỏ tích để xem tất cả giáo viên đang trống lịch.</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-end border-b-2 border-slate-100 pb-2">
                                    <h4 className="font-bold text-slate-800 text-lg uppercase">Giáo viên đang rảnh</h4>
                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{freeTeachers.length} kết quả</span>
                                </div>
                                
                                <div className="max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                                    {freeTeachers.length > 0 ? freeTeachers.map(t => (
                                        <div key={t.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-xl mb-3 hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm group">
                                            <div>
                                                <p className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{t.fullName}</p>
                                                <div className="flex gap-3 mt-1 text-[10px] font-bold uppercase">
                                                    <span className="text-slate-400 tracking-tighter">ID: {t.id}</span>
                                                    <span className="text-blue-500">{t.subjectName}</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleAssign(t.id)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-black shadow-lg shadow-green-200 transition-all transform active:scale-95 uppercase"
                                            >
                                                Phân công
                                            </button>
                                        </div>
                                    )) : (
                                        <div className="text-center py-12">
                                            <p className="text-slate-400 font-bold italic">Không tìm thấy giáo viên phù hợp tiết này.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}