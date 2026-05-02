import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function GradeEntry() {
    const { studentId, year, semester } = useParams();
    
    const [configs, setConfigs] = useState([]);
    const [teacherSubject, setTeacherSubject] = useState([]);
    const [selectedConfig, setSelectedConfig] = useState(null);
    const [err, setErr] = useState("");

    const [formData, setFormData] = useState({
        gradeConfigId: '',
        entryIndex: 1,
        score: ''
    });


    useEffect(() => {
        const fetchSubject = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`/quanly/teachers/subject`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTeacherSubject(res.data.result);
                fetchConfigs(res.data.result.id);
            } catch (error) {
                setErr("Không thể tải môn dạy");
            }
        };

        const fetchConfigs = async (subId) => {
            if (!subId || !year || !semester) return;
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(
                    `/quanly/gradeConfigs/bulk-year-semseter/${subId}?academicYear=${year}&semester=${semester}`, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setConfigs(res.data.result.configs || []);
            } catch (error) {
                setConfigs([]);
            }
        };

        fetchSubject();
    }, [year, semester]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.gradeConfigId || !formData.score) {
            alert("Vui lòng chọn loại điểm và nhập điểm số");
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
        <form onSubmit={handleSubmit} className="p-6 bg-white shadow rounded max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-2">Nhập điểm: {teacherSubject.subjectName}</h2>
            <p className="text-gray-600 mb-4">Năm học: {year} | Học kỳ: {semester}</p>
            
            {err && <div className="text-red-500 mb-4">{err}</div>}

            <div className="mb-4">
                <label className="block mb-1 font-medium">Loại điểm:</label>
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

            {selectedConfig && (
                <div className="mb-4">
                    <label className="block mb-1 font-medium">
                        Cột điểm số (Tối đa {selectedConfig.maxEntries} cột):
                    </label>
                    <input 
                        type="number" 
                        min="1"
                        max={selectedConfig.maxEntries} 
                        value={formData.entryIndex}
                        onChange={(e) => setFormData({ ...formData, entryIndex: e.target.value })}
                        className="w-full border p-2 rounded"
                    />
                </div>
            )}

            <div className="mb-4">
                <label className="block mb-1 font-medium">Điểm số (0-10):</label>
                <input 
                    type="number" 
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={formData.score}
                    onChange={(e) => setFormData({...formData, score: e.target.value})}
                    className="w-full border p-2 rounded"
                />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold">
                Lưu điểm
            </button>
        </form>
    );
}