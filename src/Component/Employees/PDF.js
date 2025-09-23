// src/components/AttendanceReportPDF.js
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";

// Styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 15,
    fontSize: 8,
    fontFamily: "Helvetica",
  },
  headerContainer: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerRight: {
    alignItems: "flex-end",
    fontSize: 7,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  reportTitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
    backgroundColor: "#f0f0f0",
    padding: 3,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    backgroundColor: "#e0e0e0",
    borderStyle: "solid",
    borderColor: "#000",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 3,
    fontWeight: "bold",
    fontSize: 7,
  },
  tableCol: {
    borderStyle: "solid",
    borderColor: "#000",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 3,
    fontSize: 7,
  },
  // Employee Details table column widths
  empNameCol: { width: "12%" },
  empPhoneCol: { width: "15%" },
  empBranchCol: { width: "20%" },
  empDeptCol: { width: "12%" },
  empIdCol: { width: "12%" },
  empDesignationCol: { width: "15%" },
  empScheduleCol: { width: "8%" },
  empHoursCol: { width: "14%" },
  
  // Attendance summary column widths
  summaryCol: { width: "11.11%" },
  
  // Daily attendance table
  dateCol: { width: "8%" },
  dayCol: { width: "6%" },
  statusCol: { width: "6%" },
  timeCol: { width: "8%" },
  hoursCol: { width: "8%" },
  
  // Calendar grid
  calendarTable: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    marginTop: 10,
  },
  calendarHeader: {
    backgroundColor: "#d0d0d0",
    fontWeight: "bold",
    fontSize: 6,
    textAlign: "center",
  },
  calendarCell: {
    fontSize: 5,
    textAlign: "center",
    minHeight: 20,
  },
  calendarDateCol: { width: "3.2%" }, // 31 columns for days
  
  note: {
    fontSize: 7,
    marginTop: 10,
    fontWeight: "bold",
  },
  
  downloadSection: {
    marginTop: 15,
    fontSize: 8,
    color: "#0066cc",
  },
});

const AttendanceReportPDF = ({ data }) => {
  // Generate days array for the month
  const generateDaysArray = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i.toString().padStart(2, '0'));
    }
    return days;
  };

  const days = generateDaysArray();
  const dayLabels = ['Fri', 'Sat', 'WO', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'PH', 'WO', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'WO', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'WO', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'WO'];
  const statusArray = ['P', 'P', '-', 'P', 'P', 'P', 'P', 'P', '-', '-', 'P', 'P', 'P', 'P', 'P', 'P', '-', 'P', 'P', 'P', 'P', 'P', 'P', '-', 'P', 'P', 'P', 'P', 'P', 'P', '-'];
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerCenter}>
            <Text style={styles.companyName}>M/S Superb Bearing Stores</Text>
            <Text style={styles.reportTitle}>
              ATTENDANCE REPORT FOR THE MONTH OF August 2025
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text>Report Date: 22-09-2025</Text>
            <Text>Address:</Text>
            <Text>Tali main road</Text>
            <Text>Gstin: 23ACFFS9465E2ZX</Text>
          </View>
        </View>

        {/* Employee Details */}
        <Text style={styles.sectionTitle}>Employee Details</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, styles.empNameCol]}>
              <Text>Name</Text>
            </View>
            <View style={[styles.tableColHeader, styles.empPhoneCol]}>
              <Text>Phone Number</Text>
            </View>
            <View style={[styles.tableColHeader, styles.empBranchCol]}>
              <Text>Branch</Text>
            </View>
            <View style={[styles.tableColHeader, styles.empDeptCol]}>
              <Text>Department</Text>
            </View>
            <View style={[styles.tableColHeader, styles.empIdCol]}>
              <Text>Employee Id</Text>
            </View>
            <View style={[styles.tableColHeader, styles.empDesignationCol]}>
              <Text>Designation</Text>
            </View>
            <View style={[styles.tableColHeader, styles.empScheduleCol]}>
              <Text>Schedule</Text>
            </View>
            <View style={[styles.tableColHeader, styles.empHoursCol]}>
              <Text>Scheduled Working Hours</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, styles.empNameCol]}>
              <Text>{data.name}</Text>
            </View>
            <View style={[styles.tableCol, styles.empPhoneCol]}>
              <Text>{data.phone}</Text>
            </View>
            <View style={[styles.tableCol, styles.empBranchCol]}>
              <Text>{data.branch}</Text>
            </View>
            <View style={[styles.tableCol, styles.empDeptCol]}>
              <Text>{data.department}</Text>
            </View>
            <View style={[styles.tableCol, styles.empIdCol]}>
              <Text>{data.empId}</Text>
            </View>
            <View style={[styles.tableCol, styles.empDesignationCol]}>
              <Text>{data.designation}</Text>
            </View>
            <View style={[styles.tableCol, styles.empScheduleCol]}>
              <Text>-</Text>
            </View>
            <View style={[styles.tableCol, styles.empHoursCol]}>
              <Text>200h 00m</Text>
            </View>
          </View>
        </View>

        {/* Attendance Summary */}
        <Text style={styles.sectionTitle}>Attendance summary</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            {[
              "Payable Days",
              "Present", 
              "Absent",
              "Half Days",
              "Double Present",
              "Week Off",
              "Paid Leaves",
              "Unpaid Leaves",
              "Public Holiday"
            ].map((header, i) => (
              <View style={[styles.tableColHeader, styles.summaryCol]} key={i}>
                <Text>{header}</Text>
              </View>
            ))}
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, styles.summaryCol]}>
              <Text>{data.payableDays}</Text>
            </View>
            <View style={[styles.tableCol, styles.summaryCol]}>
              <Text>{data.present}</Text>
            </View>
            <View style={[styles.tableCol, styles.summaryCol]}>
              <Text>{data.absent}</Text>
            </View>
            <View style={[styles.tableCol, styles.summaryCol]}>
              <Text>{data.halfDays}</Text>
            </View>
            <View style={[styles.tableCol, styles.summaryCol]}>
              <Text>{data.doublePresent}</Text>
            </View>
            <View style={[styles.tableCol, styles.summaryCol]}>
              <Text>{data.weekOff}</Text>
            </View>
            <View style={[styles.tableCol, styles.summaryCol]}>
              <Text>{data.paidLeaves}</Text>
            </View>
            <View style={[styles.tableCol, styles.summaryCol]}>
              <Text>{data.unpaidLeaves}</Text>
            </View>
            <View style={[styles.tableCol, styles.summaryCol]}>
              <Text>{data.publicHoliday}</Text>
            </View>
          </View>
        </View>

        {/* Daily Attendance Calendar */}
        <View style={styles.calendarTable}>
          {/* Date Row */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>Date</Text>
            </View>
            {days.map((day, i) => (
              <View style={[styles.tableColHeader, styles.calendarDateCol]} key={i}>
                <Text style={styles.calendarHeader}>Aug {day}</Text>
              </View>
            ))}
          </View>

          {/* Day Row */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>Day</Text>
            </View>
            {dayLabels.map((day, i) => (
              <View style={[styles.tableCol, styles.calendarDateCol]} key={i}>
                <Text style={styles.calendarCell}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Status Row */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>Status</Text>
            </View>
            {statusArray.map((status, i) => (
              <View style={[styles.tableCol, styles.calendarDateCol]} key={i}>
                <Text style={styles.calendarCell}>{status}</Text>
              </View>
            ))}
          </View>

          {/* Punch In Times */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>Punch Timings In</Text>
            </View>
            {data.punchInTimes.map((time, i) => (
              <View style={[styles.tableCol, styles.calendarDateCol]} key={i}>
                <Text style={styles.calendarCell}>{time}</Text>
              </View>
            ))}
          </View>

          {/* Punch Out Times */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>Out</Text>
            </View>
            {data.punchOutTimes.map((time, i) => (
              <View style={[styles.tableCol, styles.calendarDateCol]} key={i}>
                <Text style={styles.calendarCell}>{time}</Text>
              </View>
            ))}
          </View>

          {/* Hours Worked */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>Hrs Worked Total: 208h 14m</Text>
            </View>
            {data.hoursWorked.map((hours, i) => (
              <View style={[styles.tableCol, styles.calendarDateCol]} key={i}>
                <Text style={styles.calendarCell}>{hours}</Text>
              </View>
            ))}
          </View>

          {/* Late Hours */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>Late Hrs Total: 05h 54m</Text>
            </View>
            {data.lateHours.map((hours, i) => (
              <View style={[styles.tableCol, styles.calendarDateCol]} key={i}>
                <Text style={styles.calendarCell}>{hours}</Text>
              </View>
            ))}
          </View>

          {/* Early Hours */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>Early Hrs Total: 03h 54m</Text>
            </View>
            {data.earlyHours.map((hours, i) => (
              <View style={[styles.tableCol, styles.calendarDateCol]} key={i}>
                <Text style={styles.calendarCell}>{hours}</Text>
              </View>
            ))}
          </View>

          {/* Overtime Hours */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: "8%" }]}>
              <Text>Overtime Hrs Total: 13h 14m</Text>
            </View>
            {data.overtimeHours.map((hours, i) => (
              <View style={[styles.tableCol, styles.calendarDateCol]} key={i}>
                <Text style={styles.calendarCell}>{hours}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Note */}
        <Text style={styles.note}>
          Note: Present: P, Absent: A, Paid leave: PL, Unpaid leave: UPL, Half Day: HD, Week off: WO, Public holidays: PH, Half-day paid leave: HD/PL, Double present: 2P
        </Text>

        {/* Download Section */}
        <View style={styles.downloadSection}>
          <Text>Download the App now to check your attendance</Text>
        </View>
      </Page>
    </Document>
  );
};

// Usage with a download link
const AttendanceReportDownload = () => {
  const reportData = {
    name: "ARTI",
    phone: "+91 8818840703",
    branch: "Superb bearing stores",
    department: "-",
    empId: "12200206",
    designation: "SALES SUPPORT",
    payableDays: "31.0",
    present: 25,
    absent: 0,
    halfDays: 0,
    doublePresent: 0,
    weekOff: 5,
    paidLeaves: 0,
    unpaidLeaves: 0,
    publicHoliday: 1,
    punchInTimes: ["10:50", "11:16", "-", "11:41", "09:30", "09:44", "09:54", "10:03", "-", "-", "09:57", "11:01", "10:41", "10:15", "10:29", "10:21", "-", "10:19", "10:18", "10:07", "10:17", "10:30", "10:42", "-", "10:17", "10:49", "12:20", "10:05", "10:13", "10:25", "-"],
    punchOutTimes: ["19:10", "17:51", "-", "19:11", "18:12", "19:20", "19:18", "18:57", "-", "-", "19:15", "16:10", "18:59", "19:21", "19:02", "19:00", "-", "18:20", "19:13", "19:02", "18:44", "19:00", "19:00", "-", "19:18", "18:01", "18:54", "19:07", "19:14", "19:42", "-"],
    hoursWorked: ["08:19", "06:35", "-", "07:30", "08:41", "09:36", "09:23", "08:54", "-", "-", "09:19", "05:09", "08:18", "09:05", "08:34", "08:39", "-", "08:01", "08:55", "08:55", "08:27", "08:31", "08:18", "-", "09:01", "07:12", "06:34", "09:02", "09:01", "08:17", "-"],
    lateHours: ["00:21", "00:46", "-", "01:11", "-", "-", "-", "-", "-", "-", "-", "00:32", "00:11", "-", "-", "-", "-", "-", "-", "-", "-", "-", "00:12", "-", "-", "00:20", "01:50", "-", "-", "-", "-"],
    earlyHours: ["-", "00:39", "-", "-", "00:18", "-", "-", "-", "-", "-", "-", "02:19", "-", "-", "-", "-", "-", "00:10", "-", "-", "-", "-", "-", "-", "-", "00:28", "-", "-", "-", "-", "-"],
    overtimeHours: ["00:19", "-", "-", "-", "00:41", "01:36", "01:23", "00:54", "-", "-", "01:19", "-", "00:18", "01:05", "00:34", "00:39", "-", "00:01", "00:55", "00:55", "00:27", "00:31", "00:18", "-", "01:01", "-", "-", "01:02", "01:01", "00:17", "-"]
  };

  return (
    <PDFDownloadLink
      document={<AttendanceReportPDF data={reportData} />}
      fileName="attendance-report.pdf"
    >
      {({ loading }) => (loading ? "Loading PDF..." : "Download Attendance Report")}
    </PDFDownloadLink>
  );
};

export default AttendanceReportDownload;