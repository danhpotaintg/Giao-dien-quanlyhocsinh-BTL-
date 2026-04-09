import React, { useState } from "react";
import axios from "axios";

export default function CreateTeacher() {
  
  // ================= STATE CHO TAB =================
  const [activeTab, setActiveTab] = useState("manual"); // 'manual' hoặc 'excel'

  // ================= STATE CHO TẠO THỦ CÔNG =================
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    email: "",
    phoneNumber: "",
    subjectName: "",
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleManualSubmit = async (event) => {
    event.preventDefault();
    setManualError("");
    setManualSuccess("");

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8080/quanly/teachers", // Đã thêm full URL để tránh lỗi mạng
        {
          fullName: formData.fullName,
          dob: formData.dob,
          gender: formData.gender,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          subjectName: formData.subjectName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setManualSuccess("Tạo tài khoản thành công!");
      setTimeout(() => setManualSuccess(""), 3000);
      setFormData({
        fullName: "",
        dob: "",
        gender: "",
        email: "",
        phoneNumber: "",
        subjectName: "",
      });
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      setManualError(backendMessage || "Không thể tạo tài khoản!");
      setTimeout(() => setManualError(""), 3000);
    }
  };

  // ================= LOGIC IMPORT EXCEL =================
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setPreviewData([]);
    setImportError("");
    setImportSuccess("");
  };

  const handlePreviewUpload = async () => {
    if (!selectedFile) {
      setImportError("Vui lòng chọn file Excel!");
      setTimeout(() => setImportError(''), 5000);
      return;
    }

    setIsLoading(true);
    setImportError("");
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("file", selectedFile);

      const response = await axios.post(
        "http://localhost:8080/quanly/teachers/import/preview",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPreviewData(response.data.result);
      setImportSuccess("Đã tải dữ liệu xem trước.");
    } catch (err) {
      setImportError(err.response?.data?.message || "Lỗi khi đọc file!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmImport = async () => {
    setIsLoading(true);
    setImportError("");
    setImportSuccess("");

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("file", selectedFile);

      const response = await axios.post(
        "http://localhost:8080/quanly/teachers/import/confirm",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setImportSuccess(response.data.result || "Import thành công!");
      setPreviewData([]);
    } catch (err) {
      setImportError(err.response?.data?.message || "Lỗi trong quá trình tạo tài khoản.");
    } finally {
      setIsLoading(false);
    }
  };

  // Logic màu: Chỉ có Xanh (Hợp lệ) và Đỏ (Lỗi), không có Vàng
  const getRowStyle = (valid) => {
    return valid ? { backgroundColor: "#82e0aa" } : { backgroundColor: "#ff8c8c" };
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      {/* ================= THANH ĐIỀU HƯỚNG TABS ================= */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("manual")}
          style={{ padding: "10px 20px", cursor: "pointer", fontWeight: activeTab === "manual" ? "bold" : "normal" }}
        >
          Thêm thủ công
        </button>
        <button
          onClick={() => setActiveTab("excel")}
          style={{ padding: "10px 20px", cursor: "pointer", fontWeight: activeTab === "excel" ? "bold" : "normal" }}
        >
          Import từ Excel
        </button>
      </div>

      {/* ================= TAB 1: FORM TẠO THỦ CÔNG ================= */}
      {activeTab === "manual" && (
        <form onSubmit={handleManualSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "500px" }}>
          <h3>Tạo tài khoản giáo viên</h3>
          <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Họ và tên" required />
          <input name="dob" type="date" value={formData.dob} onChange={handleChange} required />
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          <input name="phoneNumber" type="text" value={formData.phoneNumber} onChange={handleChange} placeholder="Số điện thoại" required />
          <input name="subjectName" type="text" value={formData.subjectName} onChange={handleChange} placeholder="Môn giảng dạy (VD: Toán)" required />
          
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">-- Chọn giới tính --</option>
            <option value="MALE">Nam</option>
            <option value="FEMALE">Nữ</option>
          </select>

          {manualError && <p style={{ color: "red", fontWeight: "bold" }}>{manualError}</p>}
          {manualSuccess && <p style={{ color: "green", fontWeight: "bold" }}>{manualSuccess}</p>}
          
          <button type="submit" style={{ padding: "10px", cursor: "pointer", backgroundColor: "#007bff", color: "white", border: "none" }}>
            Tạo giáo viên
          </button>
        </form>
      )}

      {/* ================= TAB 2: IMPORT EXCEL ================= */}
      {activeTab === "excel" && (
        <div>
          <h3>Import Giáo viên hàng loạt</h3>
          
          <div style={{ marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            <button onClick={handlePreviewUpload} disabled={isLoading} style={{ padding: "8px 15px", cursor: "pointer" }}>
              {isLoading ? "Đang xử lý..." : "Xem trước dữ liệu"}
            </button>
          </div>

          {importError && <p style={{ color: "red", fontWeight: "bold" }}>{importError}</p>}
          {importSuccess && <p style={{ color: "green", fontWeight: "bold" }}>{importSuccess}</p>}

          {/* Bảng hiển thị dữ liệu Preview */}
          {previewData.length > 0 && (
            <>
              <div style={{ overflowX: "auto", marginBottom: "20px" }}>
                <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f4f4f4" }}>
                      <th>Họ Tên</th>
                      <th>Ngày sinh</th>
                      <th>Giới tính</th>
                      <th>Email</th>
                      <th>SĐT</th>
                      <th>Môn học</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <tr key={index} style={getRowStyle(row.valid)}>
                        <td>{row.fullName}</td>
                        <td>{row.dob}</td>
                        <td>{row.gender}</td>
                        <td>{row.email}</td>
                        <td>{row.phoneNumber}</td>
                        <td>{row.subjectName}</td>
                        <td>
                          {!row.valid ? (
                            <strong>Lỗi: {row.errorNote}</strong>
                          ) : (
                            <span style={{ fontWeight: "bold", color: "#1e8449" }}>Hợp lệ</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={handleConfirmImport}
                style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
              >
                Tạo tài khoản hợp lệ
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}