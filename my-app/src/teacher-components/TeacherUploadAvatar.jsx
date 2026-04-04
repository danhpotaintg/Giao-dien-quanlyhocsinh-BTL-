import React, { useState } from 'react';
import axios from 'axios';

export default function TeacherUploadAvatar() {

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    //chọn file
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        //validate ảnh
        if (!selectedFile.type.startsWith("image/")) {
            setMessage("Chỉ chọn file ảnh!");
            return;
        }

        if (selectedFile.size > 2 * 1024 * 1024) {
            setMessage("File phải nhỏ hơn 2MB!");
            return;
        }

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setMessage("");
    };

    // upload
    const handleUpload = async () => {
        if (!file) {
            setMessage("Vui lòng chọn ảnh!");
            return;
        }

        setLoading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("file", file);

        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("Bạn chưa đăng nhập!");
            setLoading(false);
            return;
        }

        try {
            await axios.post(
                "/quanly/teachers/upload-avatar",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage("Upload thành công!");

        } catch (error) {
            console.error(error);
            setMessage(
                error.response?.data?.message || "Upload thất bại!"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-lg">

            <h2 className="text-xl font-bold mb-4 text-gray-700 text-center">
                Upload Avatar
            </h2>

            {/* Preview */}
            <div className="flex justify-center mb-4">
                {preview ? (
                    <img
                        src={preview}
                        alt="preview"
                        className="w-32 h-32 rounded-full object-cover border"
                    />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                        No Image
                    </div>
                )}
            </div>

            {/* Input */}
            <input
                type="file"
                onChange={handleFileChange}
                className="mb-4 w-full"
            />

            {/* Button */}
            <button
                onClick={handleUpload}
                disabled={loading}
                className={`w-full py-2 rounded text-white ${
                    loading
                        ? "bg-gray-400"
                        : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
                {loading ? "Đang upload..." : "Upload"}
            </button>

            {/* Message */}
            {message && (
                <p className="mt-3 text-center text-sm text-red-500">
                    {message}
                </p>
            )}
        </div>
    );
}
