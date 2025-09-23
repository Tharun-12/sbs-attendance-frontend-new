import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Replace Redirect with Navigate
import "bootstrap/dist/css/bootstrap.min.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "./Component/Authcontext/Authcontext";
import Login from "./Component/Userlogin/Login";
import AdminLogin from "./Component/AdminLogin/AdminLogin";
import EmployeeRegistration from "./Component/Admin/EmployeeRegistartion/Registration/Registration";
import ViewEmployeeDetails from "./Component/Admin/EmployeeRegistartion/ViewEmployee/ViewEmployee";
import AdminDailyAttendance from "./Component/Admin/AdminAttendence/AdminAttendence";
import Attendance from "./Component/Employees/Attendence/Attendence";
import AdminMonthlyAttendance from "./Component/Admin/AdminAttendence/MonthlyAttendence";
import Dashboard from "./Component/Admin/Dashboard/Dashboard";
import EmployeeMonthlyAttendence from "./Component/Employees/Attendence/MonthlyAttendence";
import PDF from "./Component/Employees/PDF"

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />  {/* Login route */}
            <Route path="/admin-login" element={<AdminLogin />} />  {/* Admin login route */}
             <Route path="/employeeregister" element={<EmployeeRegistration />} /> 
              <Route path="/employeelist" element={<ViewEmployeeDetails />} /> 
               <Route path="/admin-dailyattendance" element={<AdminDailyAttendance />} /> 
               <Route path="/admin-Monthlyattendance" element={<AdminMonthlyAttendance />} /> 
               <Route path="/attendance" element={<Attendance />} /> 
               <Route path="/monthlyattendance" element={<EmployeeMonthlyAttendence />} /> 
                <Route path="/admindashboard" element={<Dashboard />} /> 
                 <Route path="/pdf" element={<PDF />} /> 
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
