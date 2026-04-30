import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function GradeEntry() {
    const { studentId } = useParams();
    const [configs, setConfigs] = useState([]);
    const [teacherSubject, setTeacherSubject] = useState([]);
    const [selectedConfig, setSelectedConfig] = useState(null);
    const [subjectId, setSubjectId] = useState("");
    const [err, setErr] = useState("");

    const [selection, setSelection] = useState({
        academicYear: "",
        semester: ""
    });

    const [formData, setFormData] = useState({
        gradeConfigId: '',
        entryIndex: 1,
        score: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try{
                const token = localStorage.getItem('token');
                const res = await axios.get(`/quanly/teachers/subject`, {
                    headers: {Authorization: `Bearer ${token}`}
                });

                const subId = res.data.result.id; 
                setTeacherSubject(res.data.result);
                setSubjectId(subId);
            }catch(error){
                const backendMessage = error?.data?.message;
                setErr(backendMessage || "Không thể tải môn dạy của giáo viên");
                setTimeout(() => setErr(''), 5000);
            }
        };
        fetchData();
    }, []);


    useEffect(() => {
    const fetchConfigs = async () => {
            if (!subjectId || !selection.academicYear || !selection.semester) return;

            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(
                    `/quanly/gradeConfigs/bulk-year-semseter/${subjectId}?academicYear=${selection.academicYear}&semester=${selection.semester}`, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                setConfigs(res.data.result.configs || []);
            } catch (error) {
                console.error("Lỗi lấy cấu hình điểm:", error);
                setConfigs([]); 
            }
        };
        fetchConfigs();
    }, [subjectId, selection]);

    const handleChange = (event) => {
        const value = event.target.value;
        if (value && value !== "-") {
            const [year, sem] = value.split('-'); 
            setSelection({
                academicYear: year,
                semester: sem
            });
        } else {
            setSelection({ academicYear: "", semester: "" });
            setConfigs([]); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
    
        if (!studentId || studentId === "undefined") {
            alert("Lỗi: Không tìm thấy ID học sinh. Vui lòng quay lại danh sách.");
            return;
        }
        try {
            const token = localStorage.getItem('token');
 
            await axios.post(
                `/quanly/grades/${studentId}/${formData.gradeConfigId}?entryIndex=${formData.entryIndex}`,
                { score: formData.score },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Lưu điểm thành công!");
        } catch (err) {
            alert(err.response?.data?.message || "Lỗi nhập điểm");
        }
    };


    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white shadow rounded">
            <h2 className="text-xl font-bold mb-4">Nhập điểm môn {teacherSubject.subjectName} cho học sinh</h2>
            {err && <div className="text-red-500 bg-red-50 p-2 rounded mb-4">{err}</div>}
            <div>
                <select 
                    className="mb-4 p-2 border rounded border-gray-300"
                    onChange={handleChange}
                    value={`${selection.academicYear}-${selection.semester}`}
                >
                    <option value="-">-- Chọn năm học và học kỳ --</option>
                    <option value="2025-1">Học kì 1 năm 2025</option>
                    <option value="2025-1">Học kì 2 năm 2025</option>
                </select>
            </div>
            {/* 1. Chọn loại điểm */}
            <div className="mb-4">
                <label>Loại điểm:</label>
                <select 
                    className="w-full border p-2 rounded"
                    value={formData.gradeConfigId}
                    onChange={(e) => {
                        const configId = e.target.value;
                        const found = configs.find(c => String(c.id) === String(configId));
                        setSelectedConfig(found);
                        setFormData({ ...formData, gradeConfigId: configId, entryIndex: 1 }); 
                    }}
                >
                    <option value="">-- Chọn loại điểm --</option>
                    {configs.map(c => (
                        <option key={c.id} value={c.id}>{c.scoreType} (Hệ số {c.weight})</option>
                    ))}
                </select>
            </div>

            {/* 2. Chọn cột điểm (Entry Index) */}
            <div className="mb-4">
                <label className="block font-medium mb-1">
                    Cột điểm số (Tối đa: {selectedConfig?.maxEntries || "..."} cột):
                </label>
                <input 
                    type="number" 
                    min="1"
                    // Sử dụng selectedConfig để giới hạn giá trị nhập
                    max={selectedConfig?.maxEntries} 
                    value={formData.entryIndex}
                    onChange={(e) => setFormData({ ...formData, entryIndex: e.target.value })}
                    className="w-full border p-2 rounded"
                />
            </div>

            {/* 3. Nhập điểm số */}
            <div className="mb-4">
                <label>Điểm số (0-10):</label>
                <input 
                    type="number" 
                    step="0.1"
                    required
                    onChange={(e) => setFormData({...formData, score: e.target.value})}
                    className="w-full border p-2"
                />
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Lưu điểm
            </button>
        </form>
    );
}