import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

export default function CreateSchedules(){

    const VNsubject = {
        "Toán": "Math",
        "Tiếng Anh": "English",
        "Vật lý": "Physics",
        "Hoá học": "Chemistry",
        "Ngữ văn": "Literature"
    }
    const [formData, setFormData] = useState({
            classId: "",
            subjectName: "",
            teacherId: "",
            startLesson: 1,
            endLesson: 2,
            dayOfWeek: 2,
            semester: 1,
            academicYear: 2024
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    
    const [subjectData, setSubjectData] = useState([]);

    const {teacherId, classId} = useParams();
    
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");

    const days = [2, 3, 4, 5, 6, 7]; 
    const lessons = Array.from({ length: 12 }, (_, i) => i + 1); // Tiết 1 đến 12


     useEffect(() => {
        const fetchSubject = async() => {
          try{
            const token = localStorage.getItem("token");
            const response = await axios.get("/quanly/subjects",
              {
              headers: { Authorization: `Bearer ${token}` }
              }
            );

            setSubjectData(response.data.result);
          }catch(err){
            const backendMessage = err.response?.data?.message;
            console.log(err);
            setErr(backendMessage || "Không thể lấy danh sách môn học!");
            setTimeout(() => setErr(""), 3000);
          }
        }
        fetchSubject();
      }, [])

    const fetchSchedule = async () => {
        if (!classId || classId === "null") return;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/quanly/schedules/class/${classId}`,{
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
    }, [classId]);

    // Hàm tìm tiết học cụ thể cho một ô trong bảng
    const getSubjectAt = (day, lesson) => {
        return schedules.find(s => s.dayOfWeek === day && s.startLesson <= lesson && s.endLesson >= lesson);
    };

    const handleSubmit = async(event) => {
        event.preventDefault();
        try{
            const token = localStorage.getItem('token');
            const response = await axios.post(`/quanly/schedules`,
                {
                    classId: classId,
                    subjectName: formData.subjectName,
                    teacherId: teacherId,
                    startLesson: parseInt(formData.startLesson),
                    endLesson: parseInt(formData.endLesson),
                    dayOfWeek: parseInt(formData.dayOfWeek),
                    semester: parseInt(formData.semester),
                    academicYear: parseInt(formData.academicYear)
                },
                {
                    headers: { Authorization: `Bearer ${token}`}
                }
            )

            setSuccess("Tạo lịch thành công");
            setTimeout(() => setSuccess(''), 5000);
            fetchSchedule();
            setFormData({
                classId: "",
                subjectName: "",
                teacherId: "",
                startLesson: 1,
                endLesson: 2,
                dayOfWeek: 2,
                semester: 1,
                academicYear: 2024
            });
        }catch(eror){
            setErr(err.response?.data?.message || "Tạo lịch không thành công");
            setTimeout(() => setErr(''), 5000);
        }
    }
    if (!classId || classId === "null" || classId === "undefined") {
        return (
            <div className="p-10 text-center">
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                    <p className="font-bold">Cảnh báo</p>
                    <p>Bạn chưa chọn lớp học để thiết lập lịch. Vui lòng quay lại danh sách lớp.</p>
                </div>
                <Link to="/admin/classes/schedule" className="text-blue-600 underline">Quay lại danh sách giáo viên & lớp</Link>
            </div>
        );
    }

    if (loading) return <div className="text-center p-10">Đang tải thời khóa biểu...</div>;
    
    return (
        <div className="p-4">
            
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-800 uppercase">
                Thiết lập thời khóa biểu lớp
            </h2>

            {err && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{err}</div>}
            {success && <div className="bg-green-100 text-green-700 p-2 rounded mb-4">{success}</div>}


            <div className="bg-white p-4 shadow rounded-lg mb-8 border border-gray-200">
                <h3 className="font-bold mb-3 text-gray-700 border-b pb-2">Thiết lập tiết dạy mới</h3>
                <form onSubmit={handleSubmit} className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-600">
                                <th className="p-2 text-left">Tên môn</th>
                                <th className="p-2 text-left">Tiết bắt đầu</th>
                                <th className="p-2 text-left">Tiết kết thúc</th>
                                <th className="p-2 text-left">Thứ</th>
                                <th className="p-2 text-left">Học kỳ</th>
                                <th className="p-2 text-left">Năm học</th>
                                <th className="p-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-2">
                                    <select 
                                        name="subjectName"
                                        value={formData.subjectName}
                                        onChange={handleChange}
                                        className="w-full border p-1 rounded"
                                        required
                                    >   
                                        <option value="">Chọn môn học</option>
                                        {subjectData.map(data => (
                                            <option key={data.id} value={data.subjectName}>
                                                {data.subjectName}
                                            </option>   
                                        ))}
                                    </select>
                                </td>
                                <td className="p-2">
                                    <input name="startLesson" type="number" min="1" max="12" value={formData.startLesson} onChange={handleChange} className="w-full border p-1 rounded" required />
                                </td>
                                <td className="p-2">
                                    <input name="endLesson" type="number" min="1" max="12" value={formData.endLesson} onChange={handleChange} className="w-full border p-1 rounded" required />
                                </td>
                                <td className="p-2">
                                    <select name="dayOfWeek" value={formData.dayOfWeek} onChange={handleChange} className="w-full border p-1 rounded">
                                        {days.map(d => <option key={d} value={d}>Thứ {d}</option>)}
                                    </select>
                                </td>
                                <td className="p-2">
                                    <input name="semester" type="number" value={formData.semester} onChange={handleChange} className="w-full border p-1 rounded" required />
                                </td>
                                <td className="p-2">
                                    <input name="academicYear" type="number" value={formData.academicYear} onChange={handleChange} className="w-full border p-1 rounded" required />
                                </td>
                                <td className="p-2 text-center">
                                    <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 shadow-sm">
                                        Tạo lịch
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">
                THỜI KHÓA BIỂU 
            </h2>
          
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
                                                    <span className="font-bold text-blue-700">{ schedule.subjectName}</span>
                                                    <span className="text-xs text-gray-600">
                                                        {`GV: ${schedule.teacherName}`}
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
}