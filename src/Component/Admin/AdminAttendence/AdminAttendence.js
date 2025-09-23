// src/components/AdminAttendence.js
import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import Navbar from "../../Shared/AdminSidebar/AdminSidebar";
import '../../Layout/Collapse/Collapse.css';
import ReusableTable from "../../Layout/ReusableTable";
import "./AdminAttendence.css";
import { baseUrl } from "../../../Apiurls";

const AdminAttendence = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  // Get today's date in YYYY-MM-DD format (for input type="date")
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Convert YYYY-MM-DD to DD-MM-YYYY format
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  // Convert DD-MM-YYYY to YYYY-MM-DD format
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  };

  // Convert MySQL datetime string to Indian time format
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // Format date from MySQL date format to DD-MM-YYYY
  const formatDateOnly = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Convert milliseconds → hh:mm:ss
  const formatDuration = (millis) => {
    if (!millis) return "N/A";
    const totalSeconds = Math.floor(millis / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // Calculate working hours excluding lunch break
  const calculateWorkingHours = (checkIn, checkOut, lunchStart, lunchEnd) => {
    if (!checkIn || !checkOut) return "N/A";
    
    const checkInTime = new Date(checkIn).getTime();
    const checkOutTime = new Date(checkOut).getTime();
    
    let totalTime = checkOutTime - checkInTime;
    
    // Subtract lunch break if available
    if (lunchStart && lunchEnd) {
      const lunchStartTime = new Date(lunchStart).getTime();
      const lunchEndTime = new Date(lunchEnd).getTime();
      const lunchDuration = lunchEndTime - lunchStartTime;
      totalTime -= lunchDuration;
    }
    
    return formatDuration(totalTime);
  };

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/attendance/admin/all`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch attendance data: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result); // Debug log
      const attendance = [];

      if (result.success && result.data && result.data.length > 0) {
        result.data.forEach((record) => {
          attendance.push({
            id: record.id,
            date: formatDateOnly(record.date),
            employeeName: record.employee_name || "N/A",
            checkIn: record.check_in ? formatDateTime(record.check_in) : "N/A",
            checkInLocation: record.check_in_location || "N/A",
            checkOut: record.check_out ? formatDateTime(record.check_out) : "N/A",
            checkOutLocation: record.check_out_location || "N/A",
            status: record.status || "N/A",
            lunchStart: record.lunch_start ? formatDateTime(record.lunch_start) : "N/A",
            lunchEnd: record.lunch_end ? formatDateTime(record.lunch_end) : "N/A",
            workingHours: calculateWorkingHours(
              record.check_in,
              record.check_out,
              record.lunch_start,
              record.lunch_end
            )
          });
        });
      } else {
        console.log('No attendance data found or API returned empty data');
      }

      setAttendanceData(attendance);
      
      // Set today's date as default filter
      const today = getTodayDate();
      setSelectedDate(today);
      const todayFormatted = formatDateForDisplay(today);
      filterDataByDate(attendance, todayFormatted);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      alert(`Error fetching attendance: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter data by selected date
  const filterDataByDate = (data, date) => {
    if (date === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item => item.date === date);
      setFilteredData(filtered);
    }
  };

  // Handle date change
  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    setSelectedDate(dateValue);
    const formattedDate = formatDateForDisplay(dateValue);
    filterDataByDate(attendanceData, formattedDate);
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const columns = [
    {
      key: "sno",
      title: "S.No",
      render: (row, index) => index + 1,
    },
    { key: "date", title: "Date" },
    { key: "employeeName", title: "Name" },
    { key: "checkIn", title: "Check-In" },
    // { key: "checkInLocation", title: "Check-In Location" },
    { key: "checkOut", title: "Check-Out" },
    // { key: "checkOutLocation", title: "Check-Out Location" },
    { key: "lunchStart", title: "Lunch Start" },
    { key: "lunchEnd", title: "Lunch End" },
    { key: "status", title: "Status" },
    { key: "workingHours", title: "Working Hours" },
  ];

  if (loading) {
    return (
      <div className="loader-container">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#00BFFF"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </div>
    );
  }

  return (
   <div className='CollapseContainer'>
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`Collapse ${collapsed ? 'collapsed' : ''}`}>
        <div className="date-filter-container">
          <label htmlFor="dateFilter" className="date-filter-label">
            Filter by Date:
          </label>
          <input
            type="date"
            id="dateFilter"
            value={selectedDate}
            onChange={handleDateChange}
            className="date-filter-input"
          />
        </div>
        
        <ReusableTable
          title="Employee Attendance"
          data={filteredData}
          columns={columns}
          initialEntriesPerPage={5}
          searchPlaceholder="Search employees..."
          showSearch={true}
          showEntriesSelector={true}
          showPagination={true}
        />
      </div>
    </div>
  );
};

export default AdminAttendence;