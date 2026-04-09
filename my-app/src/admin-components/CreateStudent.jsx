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
          // ĐÃ XÓA responseType: "blob"
        }
      );

      // Nhận câu thông báo "Import dữ liệu thành công!" từ Backend
      setImportSuccess(response.data.result || "Import thành công!");
      setPreviewData([]); // Xóa bảng sau khi tạo xong
    } catch (err) {
      setImportError(err.response?.data?.message || "Lỗi trong quá trình tạo tài khoản hàng loạt.");
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm helper để tô màu từng dòng trong bảng Preview
  const getRowStyle = (row) => {
    if (!row.valid) return { backgroundColor: "#ff8c8c" }; 
    if (row.valid && row.hasWarning) return { backgroundColor: "#ffd966" }; 
    return { backgroundColor: "#82e0aa" }; 
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
          <h3>Tạo tài khoản học sinh</h3>
          <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Họ và tên" required />
          <input name="dob" type="date" value={formData.dob} onChange={handleChange} required />
          <input name="parentGmail" type="email" value={formData.parentGmail} onChange={handleChange} placeholder="Email phụ huynh" />
          <input name="parentPhonenumber" type="text" value={formData.parentPhonenumber} onChange={handleChange} placeholder="Số điện thoại phụ huynh" />
          <input name="className" type="text" value={formData.className} onChange={handleChange} placeholder="Lớp học"/>
          <input name="academicYear" type="number" value={formData.academicYear} onChange={handleChange} placeholder="Khóa (VD: 2022)" required />
          
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">-- Chọn giới tính --</option>
            <option value="MALE">Nam</option>
            <option value="FEMALE">Nữ</option>
          </select>

          {manualError && <p style={{ color: "red" }}>{manualError}</p>}
          {manualSuccess && <p style={{ color: "green" }}>{manualSuccess}</p>}
          
          <button type="submit" style={{ padding: "10px", cursor: "pointer" }}>Tạo học sinh</button>
        </form>
      )}

      {/* ================= TAB 2: IMPORT EXCEL ================= */}
      {activeTab === "excel" && (
        <div>
          <h3>Import Học Sinh hàng loạt bằng Excel</h3>
          
          <div style={{ marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            <button onClick={handlePreviewUpload} disabled={isLoading} style={{ padding: "8px 15px", cursor: "pointer" }}>
              {isLoading ? "Đang xử lý..." : "Xem trước dữ liệu"}
            </button>
          </div>

          {importError && <p style={{ color: "red" }}>{importError}</p>}
          {importSuccess && <p style={{ color: "green" }}>{importSuccess}</p>}

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
                      <th>Niên khóa</th>
                      <th>Email PH</th>
                      <th>SĐT PH</th>
                      <th>Trạng thái dữ liệu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <tr key={index} style={getRowStyle(row)}>
                        <td>{row.fullName}</td>
                        <td>{row.dob}</td>
                        <td>{row.gender}</td>
                        <td>{row.academicYear}</td>
                        <td>{row.parentGmail}</td>
                        <td>{row.parentPhonenumber}</td>
                        <td>
                          {!row.valid ? (
                            <strong>Lỗi: {row.errorNote}</strong>
                          ) : row.hasWarning ? (
                            <span>Cảnh báo: {row.warningNote}</span>
                          ) : (
                            <span>Hợp lệ</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Các nút bấm Xác nhận tạo */}
              <div style={{ display: "flex", gap: "15px" }}>
                <button
                  onClick={() => handleConfirmImport("ACCEPT_WARNING")}
                  style={{ padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}
                >
                  Tạo tất cả (Bỏ qua dòng Đỏ, Giữ dòng Vàng)
                </button>
                <button
                  onClick={() => handleConfirmImport("STRICT")}
                  style={{ padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", cursor: "pointer" }}
                >
                  Chỉ tạo dữ liệu hoàn hảo (Bỏ qua Đỏ & Vàng)
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}