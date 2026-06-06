import React, { useState } from 'react';
import axios from 'axios';

export default function CreateClass() {
    const [activeTab, setActiveTab] = useState("class");

    // Tab tạo lớp
    const [formData, setFormData] = useState({ className: "", academicYear: "" });
    const [classError, setClassError] = useState('');
    const [classSuccess, setClassSuccess] = useState('');

    // Tab tạo môn học
    const [subjectList, setSubjectList] = useState([""]);
    const [subjectError, setSubjectError] = useState('');
    const [subjectSuccess, setSubjectSuccess] = useState('');

    // ===== LỚP HỌC =====
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleClassSubmit = async (e) => {
        e.preventDefault();
        setClassError(''); setClassSuccess('');
        try {
            const token = localStorage.getItem('token');
            await axios.post('/quanly/classes',
                { className: formData.className, academicYear: formData.academicYear },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setClassSuccess('Tạo lớp học thành công!');
            setTimeout(() => setClassSuccess(''), 3000);
            setFormData({ className: "", academicYear: "" });
        } catch (err) {
            setClassError(err.response?.data?.message || 'Không thể tạo lớp học!');
            setTimeout(() => setClassError(''), 3000);
        }
    };

    // ===== MÔN HỌC =====
    const handleAddRow = () => setSubjectList(prev => [...prev, ""]);

    const handleRemoveRow = (index) => {
        setSubjectList(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubjectChange = (index, value) => {
        setSubjectList(prev => prev.map((item, i) => i === index ? value : item));
    };

    const handleSubjectSubmit = async (e) => {
        e.preventDefault();
        setSubjectError(''); setSubjectSuccess('');

        const filtered = subjectList.filter(s => s.trim() !== "");
        if (filtered.length === 0) {
            setSubjectError("Vui lòng nhập ít nhất 1 môn học!");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('/quanly/subjects/bulk',
                { subjectName: filtered },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSubjectSuccess(`Đã tạo thành công ${filtered.length} môn học!`);
            setTimeout(() => setSubjectSuccess(''), 3000);
            setSubjectList([""]);
        } catch (err) {
            setSubjectError(err.response?.data?.message || 'Không thể tạo môn học!');
            setTimeout(() => setSubjectError(''), 3000);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            {/* Tabs */}
            <div className="flex justify-center border-b border-gray-300 mb-6">
                <button onClick={() => setActiveTab("class")}
                    className={`px-6 py-3 font-bold text-base transition-colors ${
                        activeTab === "class" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-blue-600"
                    }`}>
                    Tạo lớp học
                </button>
                <button onClick={() => setActiveTab("subject")}
                    className={`px-6 py-3 font-bold text-base transition-colors ${
                        activeTab === "subject" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-blue-600"
                    }`}>
                    Tạo môn học
                </button>
            </div>

            <div className="bg-white rounded shadow border border-gray-200">
                <div className="bg-blue-600 p-4 text-center">
                    <h2 className="text-white font-bold text-lg">
                        {activeTab === "class" ? "Tạo lớp học" : "Tạo môn học"}
                    </h2>
                </div>

                {/* Tab lớp học */}
                {activeTab === "class" && (
                    <form onSubmit={handleClassSubmit} className="p-6 space-y-4">
                        {classError && <div className="bg-red-50 text-red-700 p-3 rounded border border-red-200 text-base font-semibold">{classError}</div>}
                        {classSuccess && <div className="bg-green-50 text-green-700 p-3 rounded border border-green-200 text-base font-semibold">{classSuccess}</div>}

                        <div>
                            <label className="block text-base font-semibold text-gray-700 mb-1">Tên lớp</label>
                            <input name="className" value={formData.className} onChange={handleChange} required
                                className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:border-blue-600 text-base"
                                placeholder="VD: 10A1..." />
                        </div>
                        <div>
                            <label className="block text-base font-semibold text-gray-700 mb-1">Năm học</label>
                            <input name="academicYear" value={formData.academicYear} onChange={handleChange} required
                                className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:border-blue-600 text-base"
                                placeholder="VD: 2025..." />
                        </div>

                        <button type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition-colors text-base">
                            Tạo lớp học
                        </button>
                    </form>
                )}

                {/* Tab môn học */}
                {activeTab === "subject" && (
                    <form onSubmit={handleSubjectSubmit} className="p-6 space-y-4">
                        {subjectError && <div className="bg-red-50 text-red-700 p-3 rounded border border-red-200 text-base font-semibold">{subjectError}</div>}
                        {subjectSuccess && <div className="bg-green-50 text-green-700 p-3 rounded border border-green-200 text-base font-semibold">{subjectSuccess}</div>}

                        <div className="space-y-3">
                            {subjectList.map((item, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <span className="text-gray-500 font-bold w-6 text-right">{index + 1}.</span>
                                    <input
                                        value={item}
                                        onChange={e => handleSubjectChange(index, e.target.value)}
                                        className="flex-1 border border-gray-300 p-2.5 rounded focus:outline-none focus:border-blue-600 text-base"
                                        placeholder={`Tên môn học ${index + 1}...`}
                                    />
                                    {subjectList.length > 1 && (
                                        <button type="button" onClick={() => handleRemoveRow(index)}
                                            className="text-red-500 hover:text-red-700 font-bold text-lg px-2">
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button type="button" onClick={handleAddRow}
                            className="w-full border-2 border-dashed border-blue-300 text-blue-600 font-bold py-2.5 rounded hover:bg-blue-50 transition-colors text-base">
                            + Thêm môn học
                        </button>

                        <button type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition-colors text-base">
                            Tạo ({subjectList.filter(s => s.trim()).length} môn học)
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}