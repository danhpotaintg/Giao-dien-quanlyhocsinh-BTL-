import React, { useState } from 'react';
import axios from 'axios';

export default function TeacherNotifications() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const BASE_URL = 'http://localhost:8080/quanly/notifications';

    const handleSend = async (e) => {
        e.preventDefault();
        
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const payload = { title, content };

            const response = await axios.post(`${BASE_URL}/teacher`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.code === 1000) {
                setMessage("Gửi thông báo thành công!");
                setTitle('');
                setContent('');
            }
        } catch (err) {
            setError(err.response?.data?.message || "Lỗi khi gửi thông báo!");
        } finally {
            setLoading(false);
            setTimeout(() => { setMessage(''); setError(''); }, 4000);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="bg-white rounded shadow border border-gray-200">
                {/* Header đơn giản */}
                <div className="bg-[#1e40af] p-4 text-center">
                    <h2 className="text-white font-bold text-lg uppercase">
                        Gửi thông báo tới lớp chủ nhiệm
                    </h2>
                </div>

                <form onSubmit={handleSend} className="p-6 space-y-4">
                    {/* Thông báo kết quả không có icon */}
                    {message && (
                        <div className="bg-green-50 text-green-700 p-3 rounded border border-green-200 text-sm">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-50 text-red-700 p-3 rounded border border-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Tiêu đề */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Tiêu đề
                        </label>
                        <input 
                            required
                            type="text"
                            className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:border-blue-600"
                            placeholder="Nhập tiêu đề..."
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Nội dung */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Nội dung
                        </label>
                        <textarea 
                            required
                            rows="10"
                            className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:border-blue-600 resize-none"
                            placeholder="Nhập nội dung thông báo..."
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                    </div>

                    {/* Button */}
                    <button 
                        disabled={loading}
                        className="w-full bg-[#1e40af] hover:bg-blue-800 text-white font-bold py-3 mt-2 rounded transition-colors disabled:bg-gray-400"
                    >
                        {loading ? "Đang gửi..." : "Gửi thông báo"}
                    </button>
                </form>
            </div>
        </div>
    );
}