// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Khai báo màu thương hiệu của trường
        primary: {
          light: '#4dabf7', // Xanh nhạt
          DEFAULT: '#1971c2', // Xanh dương chủ đạo
          dark: '#1864ab', // Xanh đậm khi hover
        },
        schoolDanger: '#fa5252', // Màu cảnh báo (Xóa, Lỗi)
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Đổi font chữ mặc định
      }
    },
  },
  plugins: [],
}