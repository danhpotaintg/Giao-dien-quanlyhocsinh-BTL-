import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, Cell } from 'recharts';

export default function StudentChart() {
    const [studentInfo, setStudentInfo] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("GPA");
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [chartWidth, setChartWidth] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        const measure = () => {
            if (containerRef.current) {
                setChartWidth(containerRef.current.getBoundingClientRect().width);
            }
        };
        measure();
        const t = setTimeout(measure, 300);
        window.addEventListener('resize', measure);
        return () => { clearTimeout(t); window.removeEventListener('resize', measure); };
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [infoRes, subjectsRes] = await Promise.all([
                    axios.get('/quanly/students/my-info', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/quanly/subjects', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setStudentInfo(infoRes.data.result);
                setSubjects(subjectsRes.data.result);
            } catch (err) {
                setError("Không thể tải thông tin khởi tạo!");
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // Cố định 10 cột: HK1 và HK2 của 5 năm kể từ academicYear
    const generateTimeline = (startYear) => {
        const timeline = [];
        for (let i = 0; i < 5; i++) {
            const y = startYear + i;
            timeline.push({ year: y, semester: 1, label: `HK1\n${y}` });
            timeline.push({ year: y, semester: 2, label: `HK2\n${y}` });
        }
        return timeline; // luôn đúng 10 phần tử
    };

    useEffect(() => {
        const fetchChartData = async () => {
            if (!studentInfo) return;
            setLoading(true);
            setError("");
            const timeline = generateTimeline(studentInfo.academicYear);
            const token = localStorage.getItem('token');
            try {
                const dataPromises = timeline.map(async (time) => {
                    try {
                        if (selectedSubject === "GPA") {
                            const res = await axios.get(`/quanly/grades/my-grades?academicYear=${time.year}&semester=${time.semester}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            const gpa = res.data.result?.semesterGPA;
                            return { name: time.label, diem: gpa || 0, hasData: !!gpa, realDiem: gpa ? Number(gpa.toFixed(2)) : null };
                        } else {
                            const res = await axios.get(`/quanly/grades/student/subject/${selectedSubject}?academicYear=${time.year}&semester=${time.semester}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            const avg = res.data.result?.semesterAverage;
                            return { name: time.label, diem: avg || 0, hasData: !!avg, realDiem: avg ? Number(avg.toFixed(2)) : null };
                        }
                    } catch (e) {
                        return { name: time.label, diem: 0, hasData: false, realDiem: null };
                    }
                });
                const results = await Promise.all(dataPromises);
                setChartData(results);
                setTimeout(() => {
                    if (containerRef.current) setChartWidth(containerRef.current.getBoundingClientRect().width);
                }, 100);
            } catch (err) {
                setError("Có lỗi xảy ra khi tải dữ liệu biểu đồ.");
            } finally {
                setLoading(false);
            }
        };
        fetchChartData();
    }, [selectedSubject, studentInfo]);

    // Label điểm trên đỉnh cột xanh
    const CustomLabel = (props) => {
        const { x, y, width, index } = props;
        const entry = chartData[index];
        if (!entry || !entry.hasData) return null;
        return (
            <text x={x + width / 2} y={y - 8} fill="#1e40af" textAnchor="middle" fontSize={12} fontWeight="700">
                {entry.realDiem}
            </text>
        );
    };

    // Custom XAxis tick: 2 dòng HK1 / năm
    const CustomXTick = ({ x, y, payload }) => {
        const parts = (payload.value || '').split('\n');
        return (
            <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={14} textAnchor="middle" fill="#374151" fontSize={11} fontWeight="700">{parts[0]}</text>
                <text x={0} y={0} dy={28} textAnchor="middle" fill="#6B7280" fontSize={11}>{parts[1]}</text>
            </g>
        );
    };

    if (!studentInfo && loading) return (
        <div style={{ padding: 24, textAlign: 'center', color: '#2563EB', fontWeight: 'bold' }}>
            Đang khởi tạo dữ liệu...
        </div>
    );

    return (
        <div style={{ padding: 24, background: '#F9FAFB', minHeight: '100vh' }}>
            <div style={{ background: 'white', padding: 28, borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #F3F4F6' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, borderBottom: '1px solid #E5E7EB', paddingBottom: 20, flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1D4ED8', textTransform: 'uppercase', margin: 0 }}>
                            Biểu Đồ Kết Quả Học Tập
                        </h2>
                        <p style={{ color: '#6B7280', fontSize: 13, margin: '6px 0 0 0' }}>
                            Khóa học: {studentInfo?.academicYear} – {studentInfo?.academicYear + 4}
                        </p>
                    </div>
                    <div style={{ minWidth: 240 }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                            Chọn dữ liệu hiển thị:
                        </label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            style={{ width: '100%', padding: '9px 12px', border: '1px solid #D1D5DB', borderRadius: 8, outline: 'none', background: '#F9FAFB', fontSize: 14, cursor: 'pointer' }}
                        >
                            <option value="GPA">⭐ Điểm Trung Bình Học Kỳ (GPA)</option>
                            <optgroup label="Điểm từng môn học">
                                {subjects.map(sub => (
                                    <option key={sub.id} value={sub.id}>{sub.subjectName}</option>
                                ))}
                            </optgroup>
                        </select>
                    </div>
                </div>

                {error && (
                    <div style={{ marginBottom: 16, padding: 12, background: '#FEE2E2', color: '#B91C1C', borderRadius: 6 }}>
                        {error}
                    </div>
                )}

                {/* Chart */}
                <div ref={containerRef} style={{ width: '100%' }}>
                    {loading ? (
                        <div style={{ height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <p style={{ color: '#6B7280', fontWeight: 600 }}>Đang phân tích dữ liệu điểm...</p>
                        </div>
                    ) : chartWidth > 0 && (
                        <BarChart
                            width={chartWidth}
                            height={460}
                            data={chartData}
                            margin={{ top: 40, right: 20, left: 0, bottom: 50 }}
                        >
                            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" />

                            {/* Trục X */}
                            <XAxis
                                dataKey="name"
                                axisLine={{ stroke: '#9CA3AF', strokeWidth: 1.5 }}
                                tickLine={false}
                                tick={<CustomXTick />}
                                interval={0}
                                height={50}
                            />

                            {/* Trục Y: 0 → 10 */}
                            <YAxis
                                domain={[0, 10]}
                                ticks={[0, 2, 4, 6, 8, 10]}
                                axisLine={{ stroke: '#9CA3AF', strokeWidth: 1.5 }}
                                tickLine={{ stroke: '#E5E7EB' }}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                width={36}
                            />

                            <Bar
                                dataKey="diem"
                                barSize={Math.floor((chartWidth - 56) / 10 / 1.8)}
                                radius={[5, 5, 0, 0]}
                                minPointSize={6}
                            >
                                <LabelList content={<CustomLabel />} />
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.hasData ? '#3B82F6' : '#D1D5DB'}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    )}
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', gap: 24, marginTop: 12, paddingLeft: 36 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 14, height: 14, borderRadius: 3, background: '#3B82F6' }} />
                        <span style={{ fontSize: 13, color: '#374151' }}>Đã có điểm</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 14, height: 14, borderRadius: 3, background: '#D1D5DB', border: '1px solid #9CA3AF' }} />
                        <span style={{ fontSize: 13, color: '#374151' }}>Chưa có điểm</span>
                    </div>
                </div>

                {/* Ghi chú */}
                <div style={{ marginTop: 20, padding: '14px 16px', background: '#EFF6FF', borderRadius: 10, border: '1px solid #DBEAFE', fontSize: 13, color: '#1D4ED8' }}>
                    <strong>Ghi chú:</strong> Cột màu xám là học kỳ chưa có điểm. Cột màu xanh hiển thị điểm đã được tổng kết.
                </div>
            </div>
        </div>
    );
}