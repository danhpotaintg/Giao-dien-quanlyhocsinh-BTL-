import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CreateNotification() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [toStudents, setToStudents] = useState(false);
  const [toTeachers, setToTeachers] = useState(false);
  const [loading, setLoading] = useState(false);

  const [teacherData, setTeacherData] = useState([]);
  const [teacherId, setTeacherId] = useState("");
  const [classData, setClassData] = useState([]);
  const [classId, setClassId] = useState("");
  const [err, setErr] = useState("");


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


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return alert("Vui lòng nhập đủ thông tin!");
    if (!toStudents && !toTeachers) return alert("Vui lòng chọn đối tượng nhận thông báo!");

    setLoading(true);
    try {
      const payload = {
        title,
        content,
        toStudents,
        toTeachers,
        targetClassId: classId ? classId : null, 
  targetTeacherId: teacherId ? teacherId : null
      };

      const response = await fetch('http://localhost:8080/quanly/notifications/admin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Gửi thành công!");
        // Reset form
        setTitle(''); setContent('');
        setTeacherId(''); setClassId('');
      }
    } catch (error) {
      alert("Lỗi kết nối!");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Tạo thông báo toàn trường</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          className="w-full border p-2 rounded" 
          placeholder="Tiêu đề" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
        />
        {/* <div className="flex gap-4 text-sm">
          <label><input type="checkbox" checked={toStudents} onChange={e => setToStudents(e.target.checked)} /> Học sinh</label>
          <label><input type="checkbox" checked={toTeachers} onChange={e => setToTeachers(e.target.checked)} /> Giáo viên</label>
        </div> */}

        {/* Chọn đối tượng nhận */}
        <div className="flex gap-4 text-sm font-medium">
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="checkbox" checked={toStudents} onChange={e => {
                setToStudents(e.target.checked);
                if(!e.target.checked) setClassId(""); // Reset nếu bỏ chọn
            }} /> Học sinh
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="checkbox" checked={toTeachers} onChange={e => {
                setToTeachers(e.target.checked);
                if(!e.target.checked) setTeacherId(""); // Reset nếu bỏ chọn
            }} /> Giáo viên
          </label>
        </div>

        {/* Dropdown chọn lớp học  */}
        {toStudents && (
          <select 
            className="w-full border p-2 rounded text-sm"
            value={classId}
            onChange={e => setClassId(e.target.value)}
          >
            <option value="">Gửi cho toàn bộ học sinh</option>
            {classData.map(item => (
              <option key={item.id} value={item.id}>Lớp: {item.className}</option>
            ))}
          </select>
        )}

        {/* Dropdown chọn giáo viên*/}
        {toTeachers && (
          <select 
            className="w-full border p-2 rounded text-sm"
            value={teacherId}
            onChange={e => setTeacherId(e.target.value)}
          >
            <option value="">Gửi cho toàn bộ giáo viên</option>
            {teacherData.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.fullName} ({teacher.subjectName || teacher.subjectName})
              </option>
            ))}
          </select>
        )}

        <textarea 
          className="w-full border p-2 rounded h-40" 
          placeholder="Nội dung thông báo..." 
          value={content} 
          onChange={e => setContent(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Gửi thông báo</button>
      </form>
    </div>
  );
}