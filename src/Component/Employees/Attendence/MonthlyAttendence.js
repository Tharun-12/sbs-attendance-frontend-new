import React, { useState, useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import EmployeeSidebar from "../../Shared/EmployeeSidebar/EmployeeSidebar";
import { useAuth } from "../../Authcontext/Authcontext";
import Employeetabs from "../../Shared/Employeetabs/EmployeeTabs";
import { FaFilePdf } from "react-icons/fa";
import "./MonthlyAttendence.css";

// ✅ Correct imports for PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { baseUrl } from "../../../Apiurls";

function EmployeeMonthlyAttendence() {
  const { user } = useAuth();

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

  const [collapsed, setCollapsed] = useState(false);
  const [currentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(getFormattedMonth(new Date()));
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState(null);

  // ✅ Fetch attendance from Node.js API
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.id) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const [year, month] = selectedMonth.split("-");
      const response = await fetch(
        `${baseUrl}/api/attendance/${user.id}/monthly/${year}/${month}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log("data",data)

      // Ensure data is always an array
      setAttendanceData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching attendance: ", error);
      setError("Failed to fetch attendance data");
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or selectedMonth changes
  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth, user?.id]);

  const processMonthlyAttendanceData = () => {
    const year = currentDate.getFullYear();
    const month = parseInt(selectedMonth.split("-")[1], 10) - 1;
    const monthDates = getMonthDates(year, month);
    const dateKeys = monthDates.map(formatDateForKey);

    let totalPresent = 0;
    const dailyStatuses = dateKeys.map((dateKey) => {
      const record = attendanceData.find((item) => {
        if (!item.date) return false;
        const recordDate = new Date(item.date);
        const formatted = formatDateForKey(recordDate);
        return formatted === dateKey;
      });

      if (record && record.status === "Present") {
        totalPresent++;
        return "P";
      } else {
        return "A";
      }
    });

    return {
      fullName: user?.name || "N/A",
      dailyStatuses,
      totalPresent,
      monthDates,
    };
  };

  // ✅ PDF Export
  const exportToPDF = () => {
    const monthlyData = processMonthlyAttendanceData();
    const year = currentDate.getFullYear();
    const month = parseInt(selectedMonth.split("-")[1], 10) - 1;
    const monthName = new Date(year, month).toLocaleString("default", { month: "long" });

    const doc = new jsPDF("landscape");

    doc.setFontSize(16);
    doc.text(`Monthly Attendance - ${monthName} ${year}`, 14, 15);

    doc.setFontSize(12);
    doc.text(`Employee: ${monthlyData.fullName}`, 14, 25);

    const tableColumnHeaders = ["Employee Name"];
    monthlyData.monthDates.forEach((date) => {
      tableColumnHeaders.push(date.getDate().toString().padStart(2, "0"));
    });
    tableColumnHeaders.push("Total Present");

    const tableRows = [
      [monthlyData.fullName, ...monthlyData.dailyStatuses, monthlyData.totalPresent.toString()],
    ];

    autoTable(doc, {
      startY: 35,
      head: [tableColumnHeaders],
      body: tableRows,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      didParseCell: function (data) {
        if (
          data.section === "body" &&
          data.column.index > 0 &&
          data.column.index < tableColumnHeaders.length - 1
        ) {
          if (data.cell.raw === "P") {
            data.cell.styles.fillColor = [144, 238, 144];
          } else if (data.cell.raw === "A") {
            data.cell.styles.fillColor = [255, 182, 193];
          }
        }

        if (data.section === "body" && data.column.index === tableColumnHeaders.length - 1) {
          data.cell.styles.fillColor = [173, 216, 230];
          data.cell.styles.fontStyle = "bold";
        }
      },
      margin: { top: 35, right: 10, bottom: 10, left: 10 },
      tableWidth: "auto",
    });

    doc.save(`Monthly_Attendance_${monthName}_${year}.pdf`);
  };

  const monthlyData = processMonthlyAttendanceData();
  const maxMonth = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}`;

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

  if (error) {
    return (
      <div className="employee-MonthlyAttendence">
        <EmployeeSidebar onToggleSidebar={setCollapsed} />
        <div className={`employee-MonthlyAttendence1 ${collapsed ? "collapsed" : ""}`}>
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-MonthlyAttendence">
      <EmployeeSidebar onToggleSidebar={setCollapsed} />
      <div className={`employee-MonthlyAttendence1 ${collapsed ? "collapsed" : ""}`}>
        <div className="employee-MonthlyAttendence1_tabs">
          <Employeetabs />
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="employee-monthlyattendance-heading mb-0">Monthly Attendance</h1>
          <button className="btn btn-danger export-button" onClick={exportToPDF}>
            <FaFilePdf className="me-2" /> PDF
          </button>
        </div>

        <div className="d-flex justify-content-between mt-3">
          <div className="d-flex align-items-center">
            <label htmlFor="monthFilter" className="ms-3 me-2">
              Select Month:
            </label>
            <input
              type="month"
              id="monthFilter"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              max={maxMonth}
            />
          </div>
        </div>

        <div className="table-responsive mt-3">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Name</th>
                {getMonthDates(
                  currentDate.getFullYear(),
                  parseInt(selectedMonth.split("-")[1], 10) - 1
                ).map((date) => (
                  <th key={date.getDate()}>{date.getDate().toString().padStart(2, "0")}</th>
                ))}
                <th>Present Days</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{monthlyData.fullName}</td>
                {monthlyData.dailyStatuses.map((status, index) => (
                  <td key={index} className={status === "P" ? "present" : "absent"}>
                    {status}
                  </td>
                ))}
                <td className="present-count">{monthlyData.totalPresent}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EmployeeMonthlyAttendence;