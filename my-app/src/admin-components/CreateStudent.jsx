import React, { useState } from 'react';
import axios from 'axios';

export default function CreateTeacher() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        fullName: "",
        dob: "",
        parentGmail: "",
        parentPhoneNumber: "",
        gender: ""
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev, [name]: value
        }));
    };

    const handleSubmit = async (event) => {   
        event.preventDefault();               
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');

            const response = await axios.post('/quanly/students',
                {
                    username: formData.username,
                    password: formData.password,
                    fullName: formData.fullName,
                    dob: formData.dob,
                    parentGmail: formData.parentGmail,
                    parentPhonenumber: formData.parentPhonenumber,
                    gender: formData.gender
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setSuccess('Tạo tài khoản thành công!');
            setTimeout(() => setSuccess(''), 3000);
            setFormData({ username: "", password: "", fullName: "", 
                dob: "", parentGmail: "", parentPhonenumber: "", gender: "" });

        } catch (err) {
            const backendMessage = err.response?.data?.message;
            setError(backendMessage || 'Không thể tạo tài khoản!');
            setTimeout(() => setError(''), 3000);
        }

    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Tạo tài khoản học sinh</h3>
            
            <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
            
            <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" />
            
            <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full name" />
            
            <input name="dob" type="date" value={formData.dob} onChange={handleChange} />
            
            <input name="parentGmail" type="email" value={formData.parentGmail} onChange={handleChange} placeholder='Parent Email'/>
            
            <input name="parentPhonenumber" type="number" value={formData.parentPhonenumber} onChange={handleChange} placeholder='Parent Phone Number'/>
            
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