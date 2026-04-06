import React, { useState } from "react";
import axios from "axios";

export default function CreateTeacher() {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    email: "",
    phoneNumber: "",
    subjectName: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "/quanly/teachers",
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
        },
      );

      setSuccess("Tạo tài khoản thành công!");
      setTimeout(() => setSuccess(""), 3000);
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
      setError(backendMessage || "Không thể tạo tài khoản!");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Tạo tài khoản giáo viên</h3>
      <input
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        placeholder="Full name"
      />
      <input
        name="dob"
        type="date"
        value={formData.dob}
        onChange={handleChange}
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        placeholder="Số điện thoại"
      />
      <input
        name="subjectName"
        value={formData.subjectName}
        onChange={handleChange}
        placeholder="Subject"
      />
      <select name="gender" value={formData.gender} onChange={handleChange}>
        <option value="">-- Chọn giới tính --</option>
        <option value="MALE">Nam</option>
        <option value="FEMALE">Nữ</option>
      </select>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}
