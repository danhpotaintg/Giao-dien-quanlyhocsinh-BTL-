import React, { useState } from 'react';
import axios from 'axios';

export default function CreateTeacher() {
    const [passWord, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {   
        event.preventDefault();               
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');

            const response = await axios.put('/quanly/users',
                {
                    password: passWord
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setSuccess('Cập nhật mật khẩu thành công!');
            setPassword("");

        } catch (err) {
        const backendMessage = err.response?.data?.message;
        setError(backendMessage || 'Không thể cập nhật mật khẩu!');
    }

    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Đặt lại mật khẩu</h3>
            
            <input name="passWord" type="password" value={passWord} onChange={handleChange} placeholder="Password" />
            

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            
            <button type="submit">Submit</button>
        </form>
    );
}