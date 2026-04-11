import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CreateLeaveRequest() {
    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");
    const [history, setHistory] = useState([]);

    const [formData, setFormData] = useState({
        reason: "",
        fromDate: "",
        toDate: ""
    });
    

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/quanly/leave-request/student`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(response.data.result);
        } catch (error) {
            console.error("Lỗi tải lịch sử đơn:", error);
        }
    };

useEffect(() => {
    fetchHistory();
}, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn trang web reload khi submit form
        try {
            const token = localStorage.getItem('token');

            await axios.post(`/quanly/leave-request`, 
                { ...formData }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess("Gửi đơn xin nghỉ thành công! Vui lòng chờ giáo viên duyệt.");
            setFormData({ reason: "", fromDate: "", toDate: "" }); // Reset form
            setTimeout(() => setSuccess(""), 5000);
            fetchHistory();
        } catch (error) {
            setErr(error.response?.data?.message || "Lỗi khi gửi đơn xin nghỉ");
            setTimeout(() => setErr(""), 5000);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center uppercase tracking-wide">
                Gửi Đơn Xin Nghỉ Học
            </h2>

            {err && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{err}</div>}
            {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
 
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nghỉ từ ngày:</label>
                    <input 
                        type="date" 
                        name="fromDate"
                        value={formData.fromDate}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        required
                    />
                </div>

 
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Đến hết ngày:</label>
                    <input 
                        type="date" 
                        name="toDate"
                        value={formData.toDate}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        required
                    />
                </div>


                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Lý do xin nghỉ:</label>
                    <textarea 
                        name="reason"
                        rows="4"
                        value={formData.reason}
                        onChange={handleChange}
                        placeholder="Ví dụ: Em bị sốt cao cần đi khám bệnh..."
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                        required
                    ></textarea>
                </div>

                <button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-transform active:scale-95"
                >
                    GỬI ĐƠN XIN NGHỈ
                </button>
            </form>

            <div className="mt-10">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Lịch sử gửi đơn</h3>
                <div className="space-y-4">
                    {history.map((item) => (
                        <div key={item.id} className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center shadow-sm">
                            <div>
                                <p className="font-semibold text-gray-700">Nghỉ từ: {item.fromDate} → {item.toDate}</p>
                                <p className="text-sm text-gray-500 italic">Lý do: {item.reason}</p>
                                {item.approvedByTeacherName && (
                                    <p className="text-xs text-blue-600 mt-1">Người duyệt: {item.approvedByTeacherName}</p>
                                )}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                item.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                                item.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {item.status === 'APPROVED' ? 'Chấp nhận' : item.status === 'REJECTED' ? 'Từ chối' : 'Chờ duyệt'}
                            </span>
                        </div>
                    ))}
                    {history.length === 0 && <p className="text-gray-500 text-center italic">Chưa có đơn xin nghỉ nào.</p>}
                </div>
            </div>

        </div>
    );
}