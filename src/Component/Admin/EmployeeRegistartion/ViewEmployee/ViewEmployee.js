// src/components/EmployeeDetails.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReusableTable from "../../../Layout/ReusableTable";
import Navbar from "../../../Shared/AdminSidebar/AdminSidebar";
import '../../../Layout/Collapse/Collapse.css';
import {FaEdit,FaTrash} from "react-icons/fa";
import { baseUrl } from "../../../../Apiurls";

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // API Base URL - adjust this to your backend URL
  const API_BASE_URL = `${baseUrl}/api`;

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/employees`);
      const data = await response.json();
      
      if (data.success) {
        // Map the database fields to match your table structure
        const mappedEmployees = data.data.map(employee => ({
  id: employee.id,
  name: employee.name,
  email: employee.email,
  mobile: employee.contactNo, // 👈 updated
  role: employee.department,
  address: `${employee.city || ''}, ${employee.state || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, '') || employee.location,
  department: employee.department,
  designation: employee.educationQualification, // 👈 updated
  experience: employee.experience,
  status: employee.status,
  created_at: employee.createdAt // 👈 updated
}));

        setEmployees(mappedEmployees);
      } else {
        setError(data.message || "Failed to fetch employees");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to fetch employees. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        
        if (data.success) {
          // Remove the deleted employee from the local state
          setEmployees(employees.filter(emp => emp.id !== employeeId));
          alert("Employee deleted successfully!");
        } else {
          alert(data.message || "Failed to delete employee");
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert("Failed to delete employee");
      }
    }
  };

  const handleUpdateStatus = async (employeeId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${employeeId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      
      if (data.success) {
        // Update the employee status in local state
        setEmployees(employees.map(emp => 
          emp.id === employeeId ? { ...emp, status: newStatus } : emp
        ));
        alert("Employee status updated successfully!");
      } else {
        alert(data.message || "Failed to update employee status");
      }
    } catch (error) {
      console.error("Error updating employee status:", error);
      alert("Failed to update employee status");
    }
  };

  // Define table columns
  const columns = [
    {
      key: "sno",
      title: "S.No",
      render: (row, index) => index + 1, // Auto serial number
    },
    { key: "name", title: "Name" },
    { key: "email", title: "Email" },
    { key: "mobile", title: "Mobile" },
    { key: "role", title: "Department" },
    { key: "address", title: "Address" },
    // { 
    //   key: "status", 
    //   title: "Status",
    //   render: (row) => (
    //     <span 
    //       className={`badge ${
    //         row.status === 'active' ? 'bg-success' : 
    //         row.status === 'inactive' ? 'bg-warning' : 'bg-danger'
    //       }`}
    //       style={{ 
    //         padding: '5px 10px', 
    //         borderRadius: '12px',
    //         fontSize: '11px',
    //         textTransform: 'capitalize'
    //       }}
    //     >
    //       {row.status}
    //     </span>
    //   )
    // },
    // {
    //   key: "actions",
    //   title: "Actions",
    //   render: (row) => (
    //     <div style={{ display: 'flex', gap: '5px' }}>
    //       <button
    //         onClick={() => navigate(`/employee/edit/${row.id}`)}
    //         style={{
    //           backgroundColor: "blue",
    //           color: "#fff",
    //           border: "none",
    //           padding: "4px 8px",
    //           borderRadius: "4px",
    //           cursor: "pointer",
    //           fontSize: "12px",
    //         }}
    //         title="Edit Employee"
    //       >
    //         <FaEdit />
    //       </button>
    //       {/* <button
    //         onClick={() => navigate(`/employee/view/${row.id}`)}
    //         style={{
    //           backgroundColor: "#17a2b8",
    //           color: "#fff",
    //           border: "none",
    //           padding: "4px 8px",
    //           borderRadius: "4px",
    //           cursor: "pointer",
    //           fontSize: "12px",
    //         }}
    //         title="View Employee"
    //       >
    //         View
    //       </button> */}
    //       {/* <select
    //         value={row.status}
    //         onChange={(e) => handleUpdateStatus(row.id, e.target.value)}
    //         style={{
    //           padding: "2px 4px",
    //           borderRadius: "4px",
    //           border: "1px solid #ddd",
    //           fontSize: "12px",
    //           cursor: "pointer",
    //         }}
    //         title="Change Status"
    //       >
    //         <option value="active">Active</option>
    //         <option value="inactive">Inactive</option>
    //         <option value="terminated">Terminated</option>
    //       </select> */}
    //       <button
    //         onClick={() => handleDeleteEmployee(row.id)}
    //         style={{
    //           backgroundColor: "#dc3545",
    //           color: "#fff",
    //           border: "none",
    //           padding: "4px 8px",
    //           borderRadius: "4px",
    //           cursor: "pointer",
    //           fontSize: "12px",
    //         }}
    //         title="Delete Employee"
    //       >
    //         <FaTrash />
    //       </button>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="CollapseContainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`Collapse ${collapsed ? "collapsed" : ""}`}>

        {/* Error Display */}
        {error && (
          <div style={{ 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            padding: '10px', 
            borderRadius: '4px',
            marginBottom: '10px',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        {/* Top section with Add button */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
          <button
            onClick={() => navigate("/employeeregister")}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            + Add Employee
          </button>
        </div>

        {/* Employee Table */}
        <ReusableTable
          title="Employee Details"
          data={employees}
          columns={columns}
          initialEntriesPerPage={5}
          searchPlaceholder="Search employees..."
          showSearch={true}
          showEntriesSelector={true}
          showPagination={true}
        />

        {loading && <p style={{ textAlign: "center" }}>Loading employees...</p>}
      </div>
    </div>
  );
};

export default EmployeeDetails;