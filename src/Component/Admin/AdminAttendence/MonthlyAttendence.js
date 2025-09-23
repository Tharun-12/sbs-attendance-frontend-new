// src/components/MonthlyAttendance/MonthlyAttendance.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import "./MonthlyAttendence.css";
import Navbar from "../../Shared/AdminSidebar/AdminSidebar";
import ReusableTable from "../../Layout/ReusableTable";
import "../../Layout/Collapse/Collapse.css";
import { FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { baseUrl } from "../../../Apiurls";

function MonthlyAttendance() {
  // Utils
  const getFormattedMonth = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const getMonthDates = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
  };

  const formatDateForKey = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const getAttendanceStatus = (records, dateKey, date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date > today) return ""; // future dates

    const record = records.find((r) => r.date.startsWith(dateKey));
    
    // FIX: Check if record exists and has status
    if (record) {
      return record.status === "Present" ? "P" : "A";
    }
    
    // If no record found, check if it's today
    const isToday = date.getDate() === today.getDate() && 
                   date.getMonth() === today.getMonth() && 
                   date.getFullYear() === today.getFullYear();
    
    // For today, if no record yet, show empty instead of A
    if (isToday) return "";
    
    return "A"; // Default to absent for past dates with no record
  };

  const [collapsed, setCollapsed] = useState(false);
  const [users, setUsers] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [currentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(getFormattedMonth(new Date()));
  const [loading, setLoading] = useState(true);

  // ✅ Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/employees`);
      console.log("Users API response:", res.data);

      if (Array.isArray(res.data.data)) {
        setUsers(res.data.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  // ✅ Fetch attendance for each user for selected month
  const fetchAttendance = async () => {
    try {
      const [year, month] = selectedMonth.split("-");
      const attendanceMap = {};

      for (const user of users) {
        const res = await axios.get(
          `${baseUrl}/api/attendance/${user.id}/monthly/${year}/${parseInt(month)}`
        );
        attendanceMap[user.id] = res.data || [];
      }

      console.log("attendanceData", attendanceMap);
      setAttendanceData(attendanceMap);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchUsers();
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      fetchAttendance();
    }
  }, [users, selectedMonth]);

  // ✅ Process monthly data
  const processMonthlyAttendanceData = () => {
    const year = currentDate.getFullYear();
    const month = parseInt(selectedMonth.split("-")[1], 10) - 1;
    const monthDates = getMonthDates(year, month);
    const dateKeys = monthDates.map((d) => formatDateForKey(d));

    return users.map((user) => {
      const records = attendanceData[user.id] || [];
      let totalPresent = 0;

      const dailyStatuses = dateKeys.map((dateKey, index) => {
        const status = getAttendanceStatus(records, dateKey, monthDates[index]);
        if (status === "P") totalPresent++;
        return status;
      });

      return {
        id: user.id,
        name: user.name || "N/A",
        dailyStatuses,
        totalPresent,
      };
    });
  };

  const monthlyData = processMonthlyAttendanceData();

  // ✅ Table columns
  const columns = [
    { key: "name", title: "User Name" },
    ...getMonthDates(currentDate.getFullYear(), parseInt(selectedMonth.split("-")[1], 10) - 1).map(
      (date, idx) => ({
        key: `day-${idx}`,
        title: date.getDate().toString().padStart(2, "0"),
        render: (row) => {
          const status = row.dailyStatuses[idx];
          return (
            <span
              style={{
                color: status === "P" ? "green" : status === "A" ? "red" : "gray",
                fontWeight: "bold",
              }}
            >
              {status}
            </span>
          );
        },
      })
    ),
    { key: "totalPresent", title: "Total Present" },
  ];

  // ✅ Loader
  if (loading) {
    return (
      <div className="loader-container">
        <ThreeDots height="80" width="80" radius="9" color="#00BFFF" ariaLabel="three-dots-loading" visible={true} />
      </div>
    );
  }

  // ✅ PDF Export with colors
  const downloadPDF = () => {
    const year = currentDate.getFullYear();
    const month = parseInt(selectedMonth.split("-")[1], 10) - 1;
    const monthName = new Date(year, month).toLocaleString("default", { month: "long" });
    const monthDates = getMonthDates(year, month);

    const doc = new jsPDF("landscape");
    doc.setFontSize(16);
    doc.text(`Monthly Attendance - ${monthName} ${year}`, 14, 15);

    const tableColumnHeaders = ["Employee Name"];
    monthDates.forEach((date) => {
      tableColumnHeaders.push(date.getDate().toString().padStart(2, "0"));
    });
    tableColumnHeaders.push("Total Present");

    const tableRows = [];
    monthlyData.forEach((user) => {
      const row = [user.name];
      
      // Add daily statuses with color information
      user.dailyStatuses.forEach((status) => {
        row.push(status);
      });
      
      row.push(user.totalPresent.toString());
      tableRows.push(row);
    });

    autoTable(doc, {
      startY: 25,
      head: [tableColumnHeaders],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      didDrawCell: (data) => {
        // Skip header row and first column (employee name)
        if (data.section === 'body' && data.column.index > 0 && data.column.index <= monthDates.length) {
          const status = data.cell.raw;
          
          if (status === 'P') {
            doc.setFillColor(144, 238, 144); // Light green
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
          } else if (status === 'A') {
            doc.setFillColor(255, 182, 193); // Light red
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
          }
          
          // Add text on top of the background
          doc.setTextColor(0, 0, 0);
          doc.text(status, data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2, {
            align: 'center',
            baseline: 'middle'
          });
        }
      }
    });

    doc.save(`Monthly_Attendance_${monthName}_${year}.pdf`);
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const maxMonth = `${currentYear}-${currentMonth}`;

  return (
    <div className="CollapseContainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`Collapse ${collapsed ? "collapsed" : ""}`}>
        <div className="d-flex justify-content-center">
          <h1 className="monthlyattendance-heading">
            Monthly Attendance for{" "}
            {new Date(currentDate.getFullYear(), parseInt(selectedMonth.split("-")[1], 10) - 1).toLocaleString(
              "default",
              { month: "long" }
            )}{" "}
            {currentDate.getFullYear()}
          </h1>
        </div>

        <div className="monthly-filter-container d-flex align-items-center">
          <label htmlFor="monthFilter" className="me-2">
            Select Month:
          </label>
          <input
            type="month"
            id="monthFilter"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            max={maxMonth}
            className="me-3 filter-month"
          />

          <button className="btn btn-danger ms-auto" onClick={downloadPDF}>
            <FaFilePdf className="me-2" /> Download PDF
          </button>
        </div>

        <ReusableTable
          title="Monthly Attendance"
          data={monthlyData}
          columns={columns}
          initialEntriesPerPage={5}
          searchPlaceholder="Search users..."
          showSearch={true}
          showEntriesSelector={true}
          showPagination={true}
        />
      </div>
    </div>
  );
}

export default MonthlyAttendance;