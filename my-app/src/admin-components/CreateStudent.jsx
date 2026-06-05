import React, { useState } from "react";
import axios from "axios";

export default function CreateStudent() {
  // ================= STATE CHO TAB =================
  const [activeTab, setActiveTab] = useState("manual"); // 'manual' hoặc 'excel'

  // ================= STATE CHO TẠO THỦ CÔNG =================
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    parentGmail: "",
    parentPhonenumber: "",
    gender: "",
    className: "",
    academicYear: "",
  });
  const [manualError, setManualError] = useState("");
  const [manualSuccess, setManualSuccess] = useState("");

  // ================= STATE CHO IMPORT EXCEL =================
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ================= LOGIC TẠO THỦ CÔNG =================
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleManualSubmit = async (event) => {
    event.preventDefault();
    setManualError("");
    setManualSuccess("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/quanly/students",
        {
          ...formData,
          academicYear: parseInt(formData.academicYear),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setManualSuccess("Tạo tài khoản thành công!");
      setFormData({ fullName: "", dob: "", parentGmail: "", parentPhonenumber: "", gender: "", academicYear: "" });
    } catch (err) {
      setManualError(err.response?.data?.message || "Không thể tạo tài khoản!");
    }
  };

  // ================= LOGIC IMPORT EXCEL =================

  // 1. Chọn file
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setPreviewData([]); 
    setImportError("");
    setImportSuccess("");
  };

  // 2. Upload file để xem trước (Preview)
  const handlePreviewUpload = async () => {
    if (!selectedFile) {
      setImportError("Vui lòng chọn một file Excel!");
      return;
    }

    setIsLoading(true);
    setImportError("");
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("file", selectedFile);

      const response = await axios.post(
        "http://localhost:8080/quanly/students/import/preview",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPreviewData(response.data.result);
      setImportSuccess("Đã tải dữ liệu xem trước. Vui lòng kiểm tra bảng bên dưới.");
    } catch (err) {
      setImportError(err.response?.data?.message || "Lỗi khi đọc file Excel!");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Xác nhận Import (Đã sửa lại để nhận chuỗi thay vì nhận file)
  const handleConfirmImport = async (mode) => {
    setIsLoading(true);
    setImportError("");
    setImportSuccess("");

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("file", selectedFile);
      data.append("mode", mode); 

      const response = await axios.post(
        "http://localhost:8080/quanly/students/import/confirm",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          }
          
        }
      );

      // Import thanh cong
      setImportSuccess(response.data.result || "Import thành công!");
      setPreviewData([]); 
    } catch (err) {
      setImportError(err.response?.data?.message || "Lỗi trong quá trình tạo tài khoản hàng loạt.");
    } finally {
      setIsLoading(false);
    }
  };

  // To mau bang tao 
  const getRowStyle = (row) => {
    if (!row.valid) return { backgroundColor: "#ff8c8c" }; 
    if (row.valid && row.hasWarning) return { backgroundColor: "#ffd966" }; 
    return { backgroundColor: "#82e0aa" }; 
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      
      {/* THANH ĐIỀU HƯỚNG TABS */}
      <div className="flex justify-center border-b border-gray-300 mb-6">
          <button
              onClick={() => setActiveTab("manual")}
              className={`px-6 py-3 font-bold text-base transition-colors ${
                  activeTab === "manual"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-blue-600"
              }`}
          >
              Thêm thủ công
          </button>
          <button
              onClick={() => setActiveTab("excel")}
              className={`px-6 py-3 font-bold text-base transition-colors ${
                  activeTab === "excel"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-blue-600"
              }`}
          >
              Import từ Excel
          </button>
      </div>

      {/* ================= TAB 1: FORM TẠO THỦ CÔNG ================= */}
      {activeTab === "manual" && (
          <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded shadow border border-gray-200">
                  <div className="bg-blue-600 p-4 text-center">
                      <h2 className="text-white font-bold text-lg">Tạo tài khoản học sinh</h2>
                  </div>
                  <form onSubmit={handleManualSubmit} className="p-6 space-y-4">
                      {manualError && <div className="bg-red-50 text-red-700 p-3 rounded border border-red-200 text-base font-semibold">{manualError}</div>}
                      {manualSuccess && <div className="bg-green-50 text-green-700 p-3 rounded border border-green-200 text-base font-semibold">{manualSuccess}</div>}

                      <div>
                          <label className="block text-base font-semibold text-gray-700 mb-1">Họ và tên</label>
                          <input name="fullName" value={formData.fullName} onChange={handleChange} required
                              className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:border-blue-600 text-base" placeholder="Nhập họ và tên..." />
                      </div>
                      <div>
                          <label className="block text-base font-semibold text-gray-700 mb-1">Ngày sinh</label>
                          <input name="dob" type="date" value={formData.dob} onChange={handleChange} required
                              className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:border-blue-600 text-base" />
                      </div>
                      <div>
                          <label className="block text-base font-semibold text-gray-700 mb-1">Email phụ huynh</label>
                          <input name="parentGmail" type="email" value={formData.parentGmail} onChange={handleChange}
                              className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:border-blue-600 text-base" placeholder="Nhập email phụ huynh..." />
                      </div>
                      <div>
                          <label className="block text-base font-semibold text-gray-700 mb-1">Số điện thoại phụ huynh</label>
                          <input name="parentPhonenumber" value={formData.parentPhonenumber} onChange={handleChange}
                              className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:border-blue-600 text-base" placeholder="Nhập số điện thoại..." />
                      </div>
                      <div>
                          <label className="block text-base font-semibold text-gray-700 mb-1">Lớp học</label>
                          <input name="className" value={formData.className} onChange={handleChange}
                              className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:border-blue-600 text-base" placeholder="VD: 10A1..." />
                      </div>
                      <div>
                          <label className="block text-base font-semibold text-gray-700 mb-1">Khóa học</label>
                          <input name="academicYear" type="number" value={formData.academicYear} onChange={handleChange} required
                              className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:border-blue-600 text-base" placeholder="VD: 2022..." />
                      </div>
                      <div>
                          <label className="block text-base font-semibold text-gray-700 mb-1">Giới tính</label>
                          <select name="gender" value={formData.gender} onChange={handleChange} required
                              className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:border-blue-600 text-base bg-white">
                              <option value="">-- Chọn giới tính --</option>
                              <option value="MALE">Nam</option>
                              <option value="FEMALE">Nữ</option>
                          </select>
                      </div>

                      <button type="submit"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 mt-2 rounded transition-colors text-base">
                          Tạo học sinh
                      </button>
                  </form>
              </div>
          </div>
      )}

      {/* ================= TAB 2: IMPORT EXCEL ================= */}
      {activeTab === "excel" && (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded shadow border border-gray-200">
                <div className="bg-blue-600 p-4 text-center">
                    <h2 className="text-white font-bold text-lg">Import học sinh từ Excel</h2>
                </div>
                <div className="p-6 space-y-4">
                    {importError && <div className="bg-red-50 text-red-700 p-3 rounded border border-red-200 text-base font-semibold">{importError}</div>}
                    {importSuccess && <div className="bg-green-50 text-green-700 p-3 rounded border border-green-200 text-base font-semibold">{importSuccess}</div>}

                    <div className="flex items-center gap-4">
                        <input type="file" accept=".xlsx,.xls" onChange={handleFileChange}
                            className="flex-1 border border-gray-300 p-2 rounded text-base text-gray-700" />
                        <button onClick={handlePreviewUpload} disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded transition-colors disabled:bg-gray-400 text-base whitespace-nowrap">
                            {isLoading ? "Đang xử lý..." : "Xem trước dữ liệu"}
                        </button>
                    </div>

                    {previewData.length > 0 && (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full table-fixed border-collapse border border-gray-300 rounded-lg overflow-hidden">
                                    <thead className="bg-blue-600 text-white">
                                        <tr>
                                            <th className="border p-3 text-left font-bold text-base w-[20%]">Họ tên</th>
                                            <th className="border p-3 text-center font-bold text-base w-[12%]">Ngày sinh</th>
                                            <th className="border p-3 text-center font-bold text-base w-[10%]">Giới tính</th>
                                            <th className="border p-3 text-center font-bold text-base w-[10%]">Khóa</th>
                                            <th className="border p-3 text-center font-bold text-base w-[20%]">Email PH</th>
                                            <th className="border p-3 text-center font-bold text-base w-[15%]">SĐT PH</th>
                                            <th className="border p-3 text-center font-bold text-base w-[13%]">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-base">
                                        {previewData.map((row, index) => (
                                            <tr key={index} className={`border-b ${!row.valid ? 'bg-red-100' : row.hasWarning ? 'bg-yellow-100' : 'bg-green-100'}`}>
                                                <td className="border p-3 font-bold text-gray-800">{row.fullName}</td>
                                                <td className="border p-3 text-center text-gray-700">{row.dob}</td>
                                                <td className="border p-3 text-center text-gray-700">{row.gender}</td>
                                                <td className="border p-3 text-center text-gray-700">{row.academicYear}</td>
                                                <td className="border p-3 text-center text-gray-700">{row.parentGmail}</td>
                                                <td className="border p-3 text-center text-gray-700">{row.parentPhonenumber}</td>
                                                <td className="border p-3 text-center font-bold">
                                                    {!row.valid ? <span className="text-red-700">Lỗi: {row.errorNote}</span>
                                                        : row.hasWarning ? <span className="text-yellow-700">Cảnh báo: {row.warningNote}</span>
                                                        : <span className="text-green-700">Hợp lệ</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button onClick={() => handleConfirmImport("ACCEPT_WARNING")}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded transition-colors text-base">
                                    Tạo tất cả (Bỏ qua dòng Đỏ, Giữ dòng Vàng)
                                </button>
                                <button onClick={() => handleConfirmImport("STRICT")}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded transition-colors text-base">
                                    Chỉ tạo dữ liệu hoàn hảo (Bỏ qua Đỏ & Vàng)
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )}
    </div>
  );
}