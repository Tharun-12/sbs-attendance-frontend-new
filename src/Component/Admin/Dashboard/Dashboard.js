import React, { useState, useEffect } from 'react';
import Navbar from '../../Shared/AdminSidebar/AdminSidebar';
import '../../Layout/Collapse/Collapse.css';
import './Dashboard.css';

const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [attendanceData, setAttendanceData] = useState({
        daily: {
            present: 0,
            absent: 0,
            leave: 0,
            total: 0
        },
        monthly: {
            present: 0,
            absent: 0,
            leave: 0,
            total: 0
        },
        recentActivity: [],
        summary: {
            dailyPresentRate: 0,
            monthlyPresentRate: 0,
            averageDailyAttendance: 0,
            totalWorkingDays: 30
        }
    });
    const [loading, setLoading] = useState(true);

    // Fetch dashboard data dynamically
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/attendance/admin/dashboard-stats');
            const data = await response.json();
            
            if (data.success) {
                setAttendanceData(data.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Check-in employee function
    const handleCheckIn = async (employeeId) => {
        try {
            // Get current location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const location = `${position.coords.latitude},${position.coords.longitude}`;
                        
                        const response = await fetch('/api/attendance/checkin', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                employee_id: employeeId,
                                location: location
                            })
                        });
                        
                        const result = await response.json();
                        if (response.ok) {
                            alert('Checked in successfully!');
                            fetchDashboardData(); // Refresh data
                        } else {
                            alert(result.message || 'Check-in failed');
                        }
                    },
                    (error) => {
                        alert('Unable to get location: ' + error.message);
                    }
                );
            } else {
                alert('Geolocation is not supported by your browser');
            }
        } catch (error) {
            console.error('Check-in error:', error);
            alert('Error during check-in');
        }
    };

    // Check-out employee function
    const handleCheckOut = async (employeeId) => {
        try {
            // Get current location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const location = `${position.coords.latitude},${position.coords.longitude}`;
                        
                        const response = await fetch('/api/attendance/checkout', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                employee_id: employeeId,
                                location: location
                            })
                        });
                        
                        const result = await response.json();
                        if (response.ok) {
                            alert('Checked out successfully!');
                            fetchDashboardData(); // Refresh data
                        } else {
                            alert(result.message || 'Check-out failed');
                        }
                    },
                    (error) => {
                        alert('Unable to get location: ' + error.message);
                    }
                );
            } else {
                alert('Geolocation is not supported by your browser');
            }
        } catch (error) {
            console.error('Check-out error:', error);
            alert('Error during check-out');
        }
    };

    // Get employee ID from activity (you might need to adjust this based on your data structure)
    const getEmployeeIdFromActivity = (activity) => {
        // This is a placeholder - you need to implement based on your data structure
        // Assuming activity has employee_id property
        return activity.employee_id || activity.id;
    };

    useEffect(() => {
        fetchDashboardData();
        
        // Refresh data every 5 minutes
        const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
        
        return () => clearInterval(interval);
    }, []);

    // Calculate percentages
    const dailyPresentPercentage = attendanceData.daily.total > 0 
        ? (attendanceData.daily.present / attendanceData.daily.total * 100).toFixed(1)
        : 0;
    
    const monthlyPresentPercentage = attendanceData.monthly.total > 0
        ? (attendanceData.monthly.present / attendanceData.monthly.total * 100).toFixed(1)
        : 0;

    if (loading) {
        return (
            <div className='CollapseContainer'>
                <Navbar onToggleSidebar={setCollapsed} />
                <div className={`Collapse ${collapsed ? 'collapsed' : ''}`}>
                    <div className="dashboard-container">
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            <p>Loading dashboard data...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                        <button 
                            className="refresh-btn"
                            onClick={fetchDashboardData}
                        >
                            ↻ Refresh Data
                        </button>
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
                                        <span className="stat-item-label">Leave:</span>
                                        <span className="stat-item-value">{attendanceData.daily.leave}</span>
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
                            <div className="quick-stat-card leave">
                                <div className="quick-stat-icon">🏖️</div>
                                <div className="quick-stat-content">
                                    <div className="quick-stat-value">{attendanceData.daily.leave}</div>
                                    <div className="quick-stat-label">On Leave</div>
                                </div>
                            </div>
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
                                        <th>Current Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceData.recentActivity.length > 0 ? (
                                        attendanceData.recentActivity.map(activity => (
                                            <tr key={activity.id}>
                                                <td>{activity.name}</td>
                                                <td>{activity.time}</td>
                                                <td>
                                                    <span className={`status-badge ${activity.status.toLowerCase()}`}>
                                                        {activity.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${activity.currentStatus.toLowerCase().replace(' ', '-')}`}>
                                                        {activity.currentStatus}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button 
                                                            className="checkin-btn"
                                                            onClick={() => handleCheckIn(getEmployeeIdFromActivity(activity))}
                                                        >
                                                            Check In
                                                        </button>
                                                        <button 
                                                            className="checkout-btn"
                                                            onClick={() => handleCheckOut(getEmployeeIdFromActivity(activity))}
                                                        >
                                                            Check Out
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="no-data">
                                                No attendance data available for today
                                            </td>
                                        </tr>
                                    )}
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
                                    <strong>{attendanceData.summary.dailyPresentRate}%</strong>
                                </div>
                                <div className="summary-item">
                                    <span>Monthly Present Rate:</span>
                                    <strong>{attendanceData.summary.monthlyPresentRate}%</strong>
                                </div>
                                <div className="summary-item">
                                    <span>Average Daily Attendance:</span>
                                    <strong>{attendanceData.summary.averageDailyAttendance}</strong>
                                </div>
                                <div className="summary-item">
                                    <span>Total Working Days:</span>
                                    <strong>{attendanceData.summary.totalWorkingDays}</strong>
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