import React, { useState } from 'react';
import axios from 'axios';

export default function CreateClass() {
    const [formData, setFormData] = useState({
        className: "",
        academicYear: ""
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev, [name]: value
        }));
    };

    const reset = () => {
        setFormData({ className: "", academicYear: "" });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');

            await axios.post('/quanly/classes',
                {
                    className: formData.className,
                    academicYear: formData.academicYear
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setSuccess('Tạo lớp học thành công!');
            setFormData({ className: "", academicYear: "" }); // ← reset form khi thành công

        } catch (err) {
            const backendMessage = err.response?.data?.message;
            setError(backendMessage || 'Không thể tạo lớp học!');
            setFormData({ className: "", academicYear: "" }); // ← reset form khi thất bại
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Tạo lớp học</h3>

            <input
                name="className"
                value={formData.className}   // ← sửa: formData.username → formData.className
                onChange={handleChange}
                placeholder="Class name"
            />

            <input
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                placeholder="Academic Year"
            />

            {error && (
                <>
                    <p style={{ color: "red" }}>{error}</p>
                    <button type="button" onClick={reset}>Nhập lại</button>
                </>
            )}

            {success && (
                <>
                    <p style={{ color: "green" }}>{success}</p>
                    <button type="button" onClick={reset}>Tạo lớp mới</button>
                </>
            )}

            {!error && !success && (
                <button type="submit">Submit</button>
            )}
        </form>
    );
}