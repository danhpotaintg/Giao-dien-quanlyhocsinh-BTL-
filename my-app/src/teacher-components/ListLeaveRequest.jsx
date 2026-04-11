import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ListLeaveRequest() {
    const statusMap = {
        "APPROVED": { label: "Chấp nhận", color: "bg-green-100 text-green-800" },
        "PENDING": { label: "Chờ duyệt", color: "bg-yellow-100 text-yellow-800" },
        "REJECTED": { label: "Từ chối", color: "bg-red-100 text-red-800" }
    };

    const [listData, setListData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");
    const [statusSelected, setStatusSelected] = useState({});

    const fetchListLeaveRequest = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/quanly/leave-request`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setListData(response.data.result);
            setLoading(false);
        } catch (error) {
            setErr("Không thể tải danh sách đơn xin nghỉ");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListLeaveRequest();
    }, []);

    const handleSelectChange = (leaveId, val) => {
        setStatusSelected(prev => ({
            ...prev,
            [leaveId]: val
        }));
    };

    const handleSubmit = async (leaveId) => {
        try {
            const token = localStorage.getItem('token');
            const newStatus = statusSelected[leaveId] || "APPROVED"; // Mặc định nếu chưa chọn

            await axios.post(`/quanly/leave-request/${leaveId}`, 
                { status: newStatus }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess("Cập nhật trạng thái thành công!");
            setTimeout(() => setSuccess(""), 3000);
            fetchListLeaveRequest(); // Tải lại danh sách
        } catch (error) {
            setErr("Lỗi khi cập nhật trạng thái");
            setTimeout(() => setErr(""), 3000);
        }
    };

    if (loading) return <div className="text-center p-10 font-medium">Đang tải danh sách đơn...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                Quản lý đơn xin nghỉ học
            </h2>

            {err && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md shadow-sm">{err}</div>}
            {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md shadow-sm">{success}</div>}

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="p-4 font-semibold uppercase text-sm">Học sinh / Lớp</th>
                            <th className="p-4 font-semibold uppercase text-sm">Thời gian nghỉ</th>
                            <th className="p-4 font-semibold uppercase text-sm">Lý do</th>
                            <th className="p-4 font-semibold uppercase text-sm">Trạng thái hiện tại</th>
                            <th className="p-4 font-semibold uppercase text-sm text-center">Phê duyệt</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {listData.map(leave => (
                            <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-gray-900">{leave.studentName}</div>
                                    <div className="text-xs text-gray-500 uppercase">Lớp: {leave.className}</div>
                                </td>
                                <td className="p-4 text-sm text-gray-700">
                                    <div>Từ: <span className="font-medium">{leave.fromDate}</span></div>
                                    <div>Đến: <span className="font-medium">{leave.toDate}</span></div>
                                </td>
                                <td className="p-4 text-sm text-gray-600 italic max-w-xs truncate">
                                    "{leave.reason}"
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusMap[leave.status]?.color}`}>
                                        {statusMap[leave.status]?.label}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <select 
                                            className="border border-gray-300 rounded-md p-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"

                                            value={statusSelected[leave.id] || leave.status}
                                            onChange={(e) => handleSelectChange(leave.id, e.target.value)}
                                        >   
                                            <option value="APPROVED">Chấp nhận</option>  
                                            <option value="REJECTED">Từ chối</option> 
                                        </select>
                                        <button 
                                            onClick={() => handleSubmit(leave.id)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-transform active:scale-95 shadow-sm"
                                        >
                                            Lưu
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {listData.length === 0 && (
                    <div className="p-10 text-center text-gray-500">Không có đơn xin nghỉ nào cần xử lý.</div>
                )}
            </div>
        </div>
    );
}