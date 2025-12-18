import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import logo from "../Assets/sbslogo.png";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 8,
    fontFamily: 'Helvetica',
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  logoContainer: {
    width: 80,
    height: 80,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    alignItems: 'flex-end',
    fontSize: 8,
    justifyContent: 'center',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  reportTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
    backgroundColor: '#e8e8e8',
    padding: 5,
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    backgroundColor: '#d9d9d9',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 5,
    fontWeight: 'bold',
    fontSize: 8,
    textAlign: 'center',
    justifyContent: 'center',
  },
  tableCol: {
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 4,
    fontSize: 7,
    textAlign: 'center',
    justifyContent: 'center',
  },
  lastCol: {
    borderRightWidth: 0,
  },
  note: {
    fontSize: 8,
    marginTop: 15,
    color: '#666',
  },
  footer: {
    marginTop: 20,
    fontSize: 9,
    textAlign: 'right',
  },
  headerVerticalCenter: {
    justifyContent: 'center',
  },
});

const AttendanceReportPDF = () => {
  // November 2025 data - 30 days
  const novemberDays = Array.from({ length: 30 }, (_, i) => ({
    date: `Nov ${String(i + 1).padStart(2, '0')}`,
    day: ['Sat', 'WO', 'Mon', 'Tue', 'PH', 'Thu', 'Fri', 'Sat', 'WO', 'Mon', 
          'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'WO', 'Mon', 'Tue', 'Wed', 'Thu',
          'Fri', 'Sat', 'WO', 'PH', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'WO'][i],
    status: ['P', '-', 'P', 'P', 'P', 'P', 'P', 'P', '-', 'P',
             'P', 'P', 'P', 'P', 'PL', '-', 'P', 'P', 'P', 'P',
             'P', 'P', '-', 'P', 'P', 'P', 'P', 'P', 'P', '-'][i],
    punchIn: ['12:21', '-', '11:02', '10:24', '12:15', '10:57', '11:03', '10:34', '-', '10:25',
              '10:40', '10:17', '10:51', '10:36', '-', '-', '10:48', '12:01', '10:46', '11:09',
              '10:41', '10:52', '-', '10:54', '10:29', '10:51', '10:35', '11:06', '12:45', '-'][i],
    punchOut: ['18:55', '-', '19:24', '19:07', '19:13', '17:46', '19:05', '18:30', '-', '18:46',
               '19:10', '19:16', '18:44', '19:14', '-', '-', '18:17', '18:48', '18:41', '18:47',
               '19:07', '19:05', '-', '18:55', '18:56', '19:06', '18:30', '18:50', '18:53', '-'][i],
    hoursWorked: ['06:33', '-', '08:22', '08:43', '06:57', '06:49', '08:02', '07:56', '-', '08:21',
                  '08:29', '08:58', '07:52', '08:38', '-', '-', '07:29', '06:46', '07:55', '07:38',
                  '08:26', '08:14', '-', '08:01', '08:27', '08:14', '07:55', '07:24', '06:08', '-'][i],
    lateHrs: ['01:51', '-', '00:32', '-', '01:46', '00:28', '00:34', '00:04', '-', '-',
              '00:11', '-', '00:22', '00:07', '-', '-', '00:18', '01:32', '00:17', '00:39',
              '00:11', '00:22', '-', '00:25', '-', '00:22', '00:05', '00:37', '02:16', '-'][i],
    earlyHrs: ['-', '-', '-', '-', '-', '00:44', '-', '-', '-', '-',
               '-', '-', '-', '-', '-', '-', '00:13', '-', '-', '-',
               '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'][i],
    overtimeHrs: ['-', '-', '00:22', '00:43', '-', '-', '00:02', '-', '-', '00:21',
                  '00:29', '00:58', '-', '00:38', '-', '-', '-', '-', '-', '-',
                  '00:26', '00:14', '-', '00:01', '00:27', '00:14', '-', '-', '-', '-'][i],
  }));

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            {/* Use Image component instead of img tag */}
            <Image
              src={logo}
              style={styles.logo}
            />
          </View>
          <View style={[styles.headerCenter, styles.headerVerticalCenter]}>
            <Text style={styles.companyName}>M/S Superb Bearing Stores</Text>
            <Text style={styles.reportTitle}>ATTENDANCE REPORT FOR THE MONTH of November 2025</Text>
          </View>
          <View style={[styles.headerRight, styles.headerVerticalCenter]}>
            <Text>Report Date: 17-12-2025</Text>
            <Text>Address:</Text>
            <Text>Tali main road</Text>
            <Text>Gstin: 23ACFFS9465E2ZX</Text>
          </View>
        </View>

        {/* Employee Details */}
        <Text style={styles.sectionTitle}>Employee Details</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: '8%' }]}>
              <Text>Name</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '13%' }]}>
              <Text>Phone Number</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '18%' }]}>
              <Text>Branch</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '13%' }]}>
              <Text>Department</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '11%' }]}>
              <Text>Employee Id</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '14%' }]}>
              <Text>Designation</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '9%' }]}>
              <Text>Schedule</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '14%', borderRightWidth: 0 }]}>
              <Text>Scheduled Working Hours</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '8%' }]}>
              <Text>ARTI</Text>
            </View>
            <View style={[styles.tableCol, { width: '13%' }]}>
              <Text>+91 8818840703</Text>
            </View>
            <View style={[styles.tableCol, { width: '18%' }]}>
              <Text>Superb bearing stores</Text>
            </View>
            <View style={[styles.tableCol, { width: '13%' }]}>
              <Text></Text>
            </View>
            <View style={[styles.tableCol, { width: '11%' }]}>
              <Text>12200206</Text>
            </View>
            <View style={[styles.tableCol, { width: '14%' }]}>
              <Text>SALES SUPPORT</Text>
            </View>
            <View style={[styles.tableCol, { width: '9%' }]}>
              <Text>-</Text>
            </View>
            <View style={[styles.tableCol, { width: '14%', borderRightWidth: 0 }]}>
              <Text>184h 00m</Text>
            </View>
          </View>
        </View>

        {/* Attendance Summary */}
        <Text style={styles.sectionTitle}>Attendance summary</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            {['Payable Days', 'Present', 'Absent', 'Half Days', 'Double Present', 'Week Off', 'Paid Leaves', 'Unpaid Leaves', 'Public Holiday'].map((header, i) => (
              <View key={i} style={[styles.tableColHeader, { width: '11.11%', borderRightWidth: i === 8 ? 0 : 1 }]}>
                <Text>{header}</Text>
              </View>
            ))}
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '11.11%' }]}>
              <Text>30.0</Text>
            </View>
            <View style={[styles.tableCol, { width: '11.11%' }]}>
              <Text>24</Text>
            </View>
            <View style={[styles.tableCol, { width: '11.11%' }]}>
              <Text>0</Text>
            </View>
            <View style={[styles.tableCol, { width: '11.11%' }]}>
              <Text>0</Text>
            </View>
            <View style={[styles.tableCol, { width: '11.11%' }]}>
              <Text>0</Text>
            </View>
            <View style={[styles.tableCol, { width: '11.11%' }]}>
              <Text>5</Text>
            </View>
            <View style={[styles.tableCol, { width: '11.11%' }]}>
              <Text>1</Text>
            </View>
            <View style={[styles.tableCol, { width: '11.11%' }]}>
              <Text>0</Text>
            </View>
            <View style={[styles.tableCol, { width: '11.11%', borderRightWidth: 0 }]}>
              <Text>0</Text>
            </View>
          </View>
        </View>

        {/* Calendar Grid */}
        <View style={[styles.table, { marginTop: 15 }]}>
          {/* Date Row */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: '6%' }]}>
              <Text>Date</Text>
            </View>
            {novemberDays.map((day, i) => (
              <View key={i} style={[styles.tableColHeader, { width: '3.13%', fontSize: 6, borderRightWidth: i === 29 ? 0 : 1 }]}>
                <Text>{day.date}</Text>
              </View>
            ))}
          </View>

          {/* Day Row */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: '6%' }]}>
              <Text>Day</Text>
            </View>
            {novemberDays.map((day, i) => (
              <View key={i} style={[styles.tableCol, { width: '3.13%', fontSize: 6, borderRightWidth: i === 29 ? 0 : 1 }]}>
                <Text>{day.day}</Text>
              </View>
            ))}
          </View>

          {/* Status Row */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: '6%' }]}>
              <Text>Status</Text>
            </View>
            {novemberDays.map((day, i) => (
              <View key={i} style={[styles.tableCol, { width: '3.13%', fontSize: 6, borderRightWidth: i === 29 ? 0 : 1 }]}>
                <Text>{day.status}</Text>
              </View>
            ))}
          </View>

          {/* Punch Timings In/Out - Combined */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: '6%' }]}>
              <Text>Punch Timings In/Out</Text>
            </View>
            {novemberDays.map((day, i) => (
              <View key={i} style={[styles.tableCol, { width: '3.13%', fontSize: 5, borderRightWidth: i === 29 ? 0 : 1 }]}>
                <Text>{day.punchIn}</Text>
                <Text>{day.punchOut}</Text>
              </View>
            ))}
          </View>

          {/* Hours Worked */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: '6%', fontSize: 6.5 }]}>
              <Text>Hrs Worked Total: 188h 20m</Text>
            </View>
            {novemberDays.map((day, i) => (
              <View key={i} style={[styles.tableCol, { width: '3.13%', fontSize: 5.5, borderRightWidth: i === 29 ? 0 : 1 }]}>
                <Text>{day.hoursWorked}</Text>
              </View>
            ))}
          </View>

          {/* Late Hrs */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: '6%', fontSize: 6.5 }]}>
              <Text>Late Hrs Total: 12h 58m</Text>
            </View>
            {novemberDays.map((day, i) => (
              <View key={i} style={[styles.tableCol, { width: '3.13%', fontSize: 5.5, borderRightWidth: i === 29 ? 0 : 1 }]}>
                <Text>{day.lateHrs}</Text>
              </View>
            ))}
          </View>

          {/* Early Hrs */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: '6%', fontSize: 6.5 }]}>
              <Text>Early Hrs Total: 00h 56m</Text>
            </View>
            {novemberDays.map((day, i) => (
              <View key={i} style={[styles.tableCol, { width: '3.13%', fontSize: 5.5, borderRightWidth: i === 29 ? 0 : 1 }]}>
                <Text>{day.earlyHrs}</Text>
              </View>
            ))}
          </View>

          {/* Overtime Hrs */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: '6%', fontSize: 6.5 }]}>
              <Text>Overtime Hrs Total: 05h 59m</Text>
            </View>
            {novemberDays.map((day, i) => (
              <View key={i} style={[styles.tableCol, { width: '3.13%', fontSize: 5.5, borderRightWidth: i === 29 ? 0 : 1 }]}>
                <Text>{day.overtimeHrs}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Note */}
        <Text style={styles.note}>
          Note: Present: P, Absent: A, Paid leave: PL, Unpaid leave: UPL, Half Day: HD, Week off: WO, Public holidays: PH, Half-day paid leave: HD/PL, Double present: 2P
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>SalaryBox Logo</Text>
          <Text>Download the App now to check your attendance</Text>
        </View>
      </Page>
    </Document>
  );
};

// Viewer Component
export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <PDFViewer width="100%" height="100%">
        <AttendanceReportPDF />
      </PDFViewer>
    </div>
  );
}