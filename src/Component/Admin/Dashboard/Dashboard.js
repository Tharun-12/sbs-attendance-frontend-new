import React, { useState, useEffect } from 'react';
import Navbar from '../../Shared/AdminSidebar/AdminSidebar';
import '../../Layout/Collapse/Collapse.css';
import './Dashboard.css'; // Create this CSS file for dashboard styling

const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [attendanceData, setAttendanceData] = useState({
        daily: {
            present: 75,
            absent: 10,
            // late: 5,
            total: 90
        },
        monthly: {
            present: 1450,
            absent: 120,
            // late: 80,
            leave: 50,
            total: 1700
        },
        recentActivity: [
            { id: 1, name: 'John Doe', time: '09:00 AM', status: 'Present' },
            { id: 2, name: 'Jane Smith', time: '09:15 AM', status: 'Present' },
            { id: 3, name: 'Mike Johnson', time: 'Absent', status: 'Absent' },
            { id: 4, name: 'Sarah Williams', time: '09:00 AM', status: 'Present' },
        ]
    });

    // Mock data - replace with actual API calls
    useEffect(() => {
        // Fetch attendance data from API
        // Example:
        // fetch('/api/attendance/summary')
        //     .then(response => response.json())
        //     .then(data => setAttendanceData(data));
    }, []);

    // Calculate percentages
    const dailyPresentPercentage = (attendanceData.daily.present / attendanceData.daily.total * 100).toFixed(1);
    const monthlyPresentPercentage = (attendanceData.monthly.present / attendanceData.monthly.total * 100).toFixed(1);

    return (
        <div className='CollapseContainer'>
            <Navbar onToggleSidebar={setCollapsed} />
            <div className={`Collapse ${collapsed ? 'collapsed' : ''}`}>
                <div className="dashboard-container">
                    {/* Header */}
                    <div className="dashboard-header">
                        <h1>Admin Dashboard</h1>
                        <div className="date-display">
                            {new Date().toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="stats-grid">
                        {/* Daily Attendance Card */}
                        <div className="stat-card">
                            <div className="stat-header">
                                <h3>Daily Attendance</h3>
                                <span className="stat-date">{new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="stat-content">
                                <div className="stat-main">
                                    <div className="stat-value">{attendanceData.daily.present}</div>
                                    <div className="stat-label">Present Today</div>
                                </div>
                                <div className="stat-details">
                                    <div className="stat-item">
                                        <span className="stat-item-label">Absent:</span>
                                        <span className="stat-item-value">{attendanceData.daily.absent}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-item-label">Late:</span>
                                        <span className="stat-item-value">{attendanceData.daily.late}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-item-label">Total:</span>
                                        <span className="stat-item-value">{attendanceData.daily.total}</span>
                                    </div>
                                </div>
                                <div className="stat-progress">
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill" 
                                            style={{ width: `${dailyPresentPercentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="progress-text">{dailyPresentPercentage}% Present</span>
                                </div>
                            </div>
                        </div>

                        {/* Monthly Attendance Card */}
                        <div className="stat-card">
                            <div className="stat-header">
                                <h3>Monthly Attendance</h3>
                                <span className="stat-date">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div className="stat-content">
                                <div className="stat-main">
                                    <div className="stat-value">{attendanceData.monthly.present}</div>
                                    <div className="stat-label">Present This Month</div>
                                </div>
                                <div className="stat-details">
                                    <div className="stat-item">
                                        <span className="stat-item-label">Absent:</span>
                                        <span className="stat-item-value">{attendanceData.monthly.absent}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-item-label">Late:</span>
                                        <span className="stat-item-value">{attendanceData.monthly.late}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-item-label">Leave:</span>
                                        <span className="stat-item-value">{attendanceData.monthly.leave}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-item-label">Total:</span>
                                        <span className="stat-item-value">{attendanceData.monthly.total}</span>
                                    </div>
                                </div>
                                <div className="stat-progress">
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill" 
                                            style={{ width: `${monthlyPresentPercentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="progress-text">{monthlyPresentPercentage}% Present</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Cards */}
                        <div className="quick-stats-grid">
                            <div className="quick-stat-card present">
                                <div className="quick-stat-icon">✓</div>
                                <div className="quick-stat-content">
                                    <div className="quick-stat-value">{attendanceData.daily.present}</div>
                                    <div className="quick-stat-label">Present Today</div>
                                </div>
                            </div>
                            <div className="quick-stat-card absent">
                                <div className="quick-stat-icon">✗</div>
                                <div className="quick-stat-content">
                                    <div className="quick-stat-value">{attendanceData.daily.absent}</div>
                                    <div className="quick-stat-label">Absent Today</div>
                                </div>
                            </div>
                            {/* <div className="quick-stat-card late">
                                <div className="quick-stat-icon">⌚</div>
                                <div className="quick-stat-content">
                                    <div className="quick-stat-value">{attendanceData.daily.late}</div>
                                    <div className="quick-stat-label">Late Today</div>
                                </div>
                            </div> */}
                            <div className="quick-stat-card monthly">
                                <div className="quick-stat-icon">📅</div>
                                <div className="quick-stat-content">
                                    <div className="quick-stat-value">{monthlyPresentPercentage}%</div>
                                    <div className="quick-stat-label">Monthly Rate</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="recent-activity">
                        <h2>Recent Attendance Activity</h2>
                        <div className="activity-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Employee</th>
                                        <th>Check-in Time</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceData.recentActivity.map(activity => (
                                        <tr key={activity.id}>
                                            <td>{activity.name}</td>
                                            <td>{activity.time}</td>
                                            <td>
                                                <span className={`status-badge ${activity.status.toLowerCase()}`}>
                                                    {activity.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="view-btn">View Details</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="summary-section">
                        <div className="summary-card">
                            <h3>Attendance Summary</h3>
                            <div className="summary-content">
                                <div className="summary-item">
                                    <span>Daily Present Rate:</span>
                                    <strong>{dailyPresentPercentage}%</strong>
                                </div>
                                <div className="summary-item">
                                    <span>Monthly Present Rate:</span>
                                    <strong>{monthlyPresentPercentage}%</strong>
                                </div>
                                <div className="summary-item">
                                    <span>Average Daily Attendance:</span>
                                    <strong>{(attendanceData.monthly.present / 30).toFixed(0)}</strong>
                                </div>
                                <div className="summary-item">
                                    <span>Total Working Days:</span>
                                    <strong>30</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;