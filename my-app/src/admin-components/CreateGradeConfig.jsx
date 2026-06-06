import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SCORE_TYPES = [
    { value: "thuong_xuyen", label: "Thường xuyên" },
    { value: "giua_ky", label: "Giữa kỳ" },
    { value: "cuoi_ky", label: "Cuối kỳ" },
];

const DEFAULT_CONFIG = {
    scoreType: "thuong_xuyen",
    weight: 1,
    maxEntries: 1,
    semester: 1,
    academicYear: new Date().getFullYear(),
};

export default function CreateGradeConfig() {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null); // { id, subjectName }
    const [existingConfigs, setExistingConfigs] = useState([]);
    const [configs, setConfigs] = useState([{ ...DEFAULT_CONFIG }]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch danh sách môn
    useEffect(() => {
        const fetch = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/quanly/subjects', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSubjects(res.data.result || []);
            } catch (err) {
                setError('Không thể tải danh sách môn học!');
            }
        };
        fetch();
    }, []);

    // Khi chọn môn → load đầu điểm hiện có
    const handleSelectSubject = async (subjectId) => {
        if (!subjectId) { setSelectedSubject(null); setExistingConfigs([]); return; }
        const subject = subjects.find(s => s.id === subjectId);
        setSelectedSubject(subject);
        setError(''); setSuccess('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`/quanly/gradeConfigs/bulk/${subjectId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExistingConfigs(res.data.result?.configs || []);
        } catch {
            setExistingConfigs([]);
        }
    };

    // Thêm/xóa/sửa dòng config
    const handleAddRow = () => setConfigs(prev => [...prev, { ...DEFAULT_CONFIG }]);

    const handleRemoveRow = (index) => setConfigs(prev => prev.filter((_, i) => i !== index));

    const handleConfigChange = (index, field, value) => {
        setConfigs(prev => prev.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        ));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/quanly/gradeConfigs/bulk/${selectedSubject.id}`,
                { configs },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess(`Đã tạo ${configs.length} đầu điểm cho môn ${selectedSubject.subjectName}!`);
            setTimeout(() => setSuccess(''), 4000);
            // Reload existing configs
            const res = await axios.get(`/quanly/gradeConfigs/bulk/${selectedSubject.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExistingConfigs(res.data.result?.configs || []);
            setConfigs([{ ...DEFAULT_CONFIG }]);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tạo đầu điểm!');
            setTimeout(() => setError(''), 4000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-600">Quản lý đầu điểm</h2>
            </div>

            {/* Bước 1: Chọn môn học */}
            <div className="bg-white rounded shadow border border-gray-200 mb-6">
                <div className="bg-blue-600 p-4">
                    <h3 className="text-white font-bold text-base">Bước 1: Chọn môn học</h3>
                </div>
                <div className="p-4">
                    <select
                        onChange={e => handleSelectSubject(e.target.value)}
                        className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:border-blue-600 text-base bg-white"
                    >
                        <option value="">-- Chọn môn học --</option>
                        {subjects.map(s => (
                            <option key={s.id} value={s.id}>{s.subjectName}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Hiển thị đầu điểm hiện có */}
            {selectedSubject && (
                <div className="bg-white rounded shadow border border-gray-200 mb-6">
                    <div className="bg-gray-600 p-4">
                        <h3 className="text-white font-bold text-base">
                            Đầu điểm hiện có — {selectedSubject.subjectName}
                        </h3>
                    </div>
                    <div className="p-4">
                        {existingConfigs.length === 0 ? (
                            <p className="text-gray-500 italic text-center py-4">Môn này chưa có đầu điểm nào.</p>
                        ) : (
                            <table className="w-full table-fixed border-collapse border border-gray-300 rounded overflow-hidden">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border p-2 text-center font-bold text-sm text-gray-700 w-[25%]">Loại điểm</th>
                                        <th className="border p-2 text-center font-bold text-sm text-gray-700 w-[15%]">Hệ số</th>
                                        <th className="border p-2 text-center font-bold text-sm text-gray-700 w-[15%]">Số cột</th>
                                        <th className="border p-2 text-center font-bold text-sm text-gray-700 w-[15%]">Học kỳ</th>
                                        <th className="border p-2 text-center font-bold text-sm text-gray-700 w-[15%]">Năm học</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {existingConfigs.map((cfg, idx) => (
                                        <tr key={idx} className="hover:bg-blue-50/50">
                                            <td className="border p-2 text-center font-bold text-gray-800">
                                                {cfg.scoreType === 'thuong_xuyen' ? 'Thường xuyên' :
                                                 cfg.scoreType === 'giua_ky' ? 'Giữa kỳ' :
                                                 cfg.scoreType === 'cuoi_ky' ? 'Cuối kỳ' : cfg.scoreType}
                                            </td>
                                            <td className="border p-2 text-center text-gray-700">{cfg.weight}</td>
                                            <td className="border p-2 text-center text-gray-700">{cfg.maxEntries}</td>
                                            <td className="border p-2 text-center text-gray-700">HK {cfg.semester}</td>
                                            <td className="border p-2 text-center text-gray-700">{cfg.academicYear}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}

            {/* Bước 2: Thêm đầu điểm mới */}
            {selectedSubject && (
                <div className="bg-white rounded shadow border border-gray-200">
                    <div className="bg-blue-600 p-4">
                        <h3 className="text-white font-bold text-base">
                            Bước 2: Thêm đầu điểm mới — {selectedSubject.subjectName}
                        </h3>
                    </div>
                    <form onSubmit={handleSubmit} className="p-4 space-y-4">
                        {error && <div className="bg-red-50 text-red-700 p-3 rounded border border-red-200 text-base font-semibold">{error}</div>}
                        {success && <div className="bg-green-50 text-green-700 p-3 rounded border border-green-200 text-base font-semibold">{success}</div>}

                        {/* Header cột */}
                        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-2 px-1">
                            <span className="text-sm font-bold text-gray-600">Loại điểm</span>
                            <span className="text-sm font-bold text-gray-600 text-center">Hệ số</span>
                            <span className="text-sm font-bold text-gray-600 text-center">Số cột điểm</span>
                            <span className="text-sm font-bold text-gray-600 text-center">Học kỳ</span>
                            <span className="text-sm font-bold text-gray-600 text-center">Năm học</span>
                            <span></span>
                        </div>

                        {/* Các dòng config */}
                        <div className="space-y-2">
                            {configs.map((cfg, index) => (
                                <div key={index} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-2 items-center">
                                    <select
                                        value={cfg.scoreType}
                                        onChange={e => handleConfigChange(index, 'scoreType', e.target.value)}
                                        className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-600 text-base bg-white"
                                    >
                                        {SCORE_TYPES.map(t => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number" min="1" max="5"
                                        value={cfg.weight}
                                        onChange={e => handleConfigChange(index, 'weight', Number(e.target.value))}
                                        className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-600 text-base text-center"
                                    />
                                    <input
                                        type="number" min="1" max="10"
                                        value={cfg.maxEntries}
                                        onChange={e => handleConfigChange(index, 'maxEntries', Number(e.target.value))}
                                        className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-600 text-base text-center"
                                    />
                                    <select
                                        value={cfg.semester}
                                        onChange={e => handleConfigChange(index, 'semester', Number(e.target.value))}
                                        className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-600 text-base bg-white"
                                    >
                                        <option value={1}>HK 1</option>
                                        <option value={2}>HK 2</option>
                                    </select>
                                    <input
                                        type="number"
                                        value={cfg.academicYear}
                                        onChange={e => handleConfigChange(index, 'academicYear', Number(e.target.value))}
                                        className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-600 text-base text-center"
                                    />
                                    {configs.length > 1 && (
                                        <button type="button" onClick={() => handleRemoveRow(index)}
                                            className="text-red-500 hover:text-red-700 font-bold text-lg px-2">
                                            ✕
                                        </button>
                                    )}
                                    {configs.length === 1 && <span className="w-8" />}
                                </div>
                            ))}
                        </div>

                        <button type="button" onClick={handleAddRow}
                            className="w-full border-2 border-dashed border-blue-300 text-blue-600 font-bold py-2.5 rounded hover:bg-blue-50 transition-colors text-base">
                            + Thêm dòng
                        </button>

                        <button type="submit" disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition-colors text-base disabled:bg-gray-400">
                            {loading ? "Đang lưu..." : `Lưu ${configs.length} đầu điểm`}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}