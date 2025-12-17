// src/components/Register.js
import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../../Shared/AdminSidebar/AdminSidebar";
import "../../../Layout/Collapse/Collapse.css";
import { baseUrl } from "../../../../Apiurls";

const Register = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get employee ID from query params if in edit mode
  const queryParams = new URLSearchParams(location.search);
  const editEmployeeId = queryParams.get('edit');
  const isEditMode = !!editEmployeeId;
  
  // Updated form data to match database structure
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact_no: "",
    alternate_contact_no: "",
    aadhaar_card_number: "",
    pan_card: "",
    driving_license: "",
    dob: "",
    gender: "",
    department: "",
    education_qualification: "",
    experience: "",
    skills: "",
    ctc: "",
    expected_ctc: "",
    current_organization: "",
    current_industry_type: "",
    location: "",
    city: "",
    state: "",
    image: "",
    resume: "",
    aadhaar_card: "",
    status: "active",
    uan_number: "",
    updatePassword: "false" // Flag to regenerate password on name change
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");

  // API Base URL
  const API_BASE_URL = `${baseUrl}/api`;

  // Function to generate password
  const generatePassword = (name) => {
    if (!name) return "";
    const firstName = name.split(' ')[0];
    const formattedName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    return `${formattedName}@123`;
  };

  // Auto-update password when name changes
  useEffect(() => {
    if (formData.name && !isEditMode) {
      const newPassword = generatePassword(formData.name);
      setGeneratedPassword(newPassword);
    }
  }, [formData.name, isEditMode]);

  // Fetch employee data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchEmployeeData();
    }
  }, [editEmployeeId]);

 const fetchEmployeeData = async () => {
  try {
    setFetching(true);
    const response = await fetch(`${API_BASE_URL}/employees/${editEmployeeId}`);
    const data = await response.json();
    
    if (data.success) {
      const employee = data.data;
      
      // Format the date properly for input[type="date"]
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        return date.toISOString().split('T')[0];
      };
      
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        contact_no: employee.contactNo || "",
        alternate_contact_no: employee.alternateContactNo || "",
        aadhaar_card_number: employee.aadhaarCardNumber || "",
        pan_card: employee.panCard || "",
        driving_license: employee.drivingLicense || "",
        dob: formatDateForInput(employee.dob) || "", // Fixed date formatting
        gender: employee.gender || "",
        department: employee.department || "",
        education_qualification: employee.educationQualification || "",
        experience: employee.experience || "",
        skills: employee.skills || "",
        ctc: employee.ctc || "",
        expected_ctc: employee.expectedCtc || "",
        current_organization: employee.currentOrganization || "",
        current_industry_type: employee.currentIndustryType || "",
        location: employee.location || "",
        city: employee.city || "",
        state: employee.state || "",
        image: employee.image || "",
        resume: employee.resume || "",
        aadhaar_card: employee.aadhaarCard || "",
        status: employee.status || "active",
        uan_number: employee.uanNumber || "",
        updatePassword: "false"
      });
    } else {
      setError("Failed to fetch employee data");
    }
  } catch (error) {
    console.error("Error fetching employee:", error);
    setError("Failed to fetch employee data");
  } finally {
    setFetching(false);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // If name changes in edit mode, show option to update password
    if (isEditMode && name === 'name') {
      setGeneratedPassword(generatePassword(value));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  setSuccess("");

  try {
    const formDataToSend = new FormData();

    // Append only file fields to FormData
    if (formData.image instanceof File) {
      formDataToSend.append("image", formData.image);
    }
    if (formData.resume instanceof File) {
      formDataToSend.append("resume", formData.resume);
    }
    if (formData.aadhaar_card instanceof File) {
      formDataToSend.append("aadhaar_card", formData.aadhaar_card);
    }

    // Create a separate object for text fields
    const textFields = {
      name: formData.name,
      email: formData.email,
      contact_no: formData.contact_no,
      alternate_contact_no: formData.alternate_contact_no,
      aadhaar_card_number: formData.aadhaar_card_number,
      pan_card: formData.pan_card,
      driving_license: formData.driving_license,
      dob: formData.dob,
      gender: formData.gender,
      department: formData.department,
      education_qualification: formData.education_qualification,
      experience: formData.experience,
      skills: formData.skills,
      ctc: formData.ctc,
      expected_ctc: formData.expected_ctc,
      current_organization: formData.current_organization,
      current_industry_type: formData.current_industry_type,
      location: formData.location,
      city: formData.city,
      state: formData.state,
      status: formData.status,
      uan_number: formData.uan_number,
      updatePassword: formData.updatePassword
    };

    // Append text fields as JSON string
    formDataToSend.append("data", JSON.stringify(textFields));

    let url, method;
    
    if (isEditMode) {
      url = `${API_BASE_URL}/employees/${editEmployeeId}`;
      method = 'PUT';
    } else {
      url = `${API_BASE_URL}/employees`;
      method = 'POST';
    }

    const response = await fetch(url, {
      method: method,
      body: formDataToSend,
    });

    const data = await response.json();

    if (data.success) {
      const successMessage = isEditMode 
        ? "Employee updated successfully!" 
        : "Employee registered successfully!";
      
      setSuccess(successMessage);
      
      if (data.generatedPassword) {
        setGeneratedPassword(data.generatedPassword);
      }
      
      // Reset form if not in edit mode
      if (!isEditMode) {
        setFormData({
          name: "",
          email: "",
          contact_no: "",
          alternate_contact_no: "",
          aadhaar_card_number: "",
          pan_card: "",
          driving_license: "",
          dob: "",
          gender: "",
          department: "",
          education_qualification: "",
          experience: "",
          skills: "",
          ctc: "",
          expected_ctc: "",
          current_organization: "",
          current_industry_type: "",
          location: "",
          city: "",
          state: "",
          image: "",
          resume: "",
          aadhaar_card: "",
          status: "active",
          uan_number: "",
          updatePassword: "false"
        });
      }
      
      setTimeout(() => navigate('/employeelist'), 2000);
    } else {
      setError(data.message || (isEditMode ? "Update failed" : "Registration failed"));
    }
  } catch (err) {
    setError("Network error. Please check if the server is running.");
    console.error("Form submission error:", err);
  }

  setLoading(false);
};

  return (
    <div className="CollapseContainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`Collapse ${collapsed ? "collapsed" : ""}`}>
        <Container className="mt-5">
          <Row className="justify-content-md-center">
            <Col md={10}>
              <Card className="p-4 shadow-sm">
                <h3 className="text-center mb-4">
                  {isEditMode ? "Edit Employee" : "Employee Registration"}
                </h3>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                
                {/* {generatedPassword && !isEditMode && (
                  <Alert variant="info">
                    <strong>Auto-generated Password:</strong> {generatedPassword}
                    <br />
                    <small>Password format: FirstWord@123 (e.g., Tharun@123)</small>
                  </Alert>
                )} */}

                {isEditMode && generatedPassword && formData.updatePassword === "true" && (
                  <Alert variant="warning">
                    <strong>New Password will be:</strong> {generatedPassword}
                    <br />
                    <small>This will be set if you check "Regenerate Password"</small>
                  </Alert>
                )}

                {fetching ? (
                  <div className="text-center">
                    <Spinner animation="border" />
                    <p>Loading employee data...</p>
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    {/* Basic Details */}
                    <h5 className="mt-4 mb-3">Basic Details</h5>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                              <Form.Label>Full Name *</Form.Label>
                              <Form.Control
                                type="text"
                                name="name"
                                placeholder="Enter full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                readOnly={isEditMode}  // Add this line
                              />
                              {isEditMode && (
                                <Form.Text className="text-muted">
                                  Name cannot be changed in edit mode
                                </Form.Text>
                              )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email *</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Contact Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="contact_no"
                            placeholder="Enter contact number"
                            value={formData.contact_no}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Alternate Contact Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="alternate_contact_no"
                            placeholder="Enter alternate contact number"
                            value={formData.alternate_contact_no}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Date of Birth</Form.Label>
                          <Form.Control
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Gender</Form.Label>
                          <Form.Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Password Regeneration for Edit Mode */}
                   {/* Remove this section entirely from edit mode */}
{isEditMode && generatedPassword && formData.updatePassword === "true" && (
  <Alert variant="warning">
    <strong>New Password will be:</strong> {generatedPassword}
    <br />
    <small>This will be set if you check "Regenerate Password"</small>
  </Alert>
)}

{/* Remove this checkbox from the form */}
{isEditMode && generatedPassword && (
  <Row>
    <Col md={6}>
      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          name="updatePassword"
          label="Regenerate Password based on new name"
          checked={formData.updatePassword === "true"}
          onChange={(e) => setFormData({
            ...formData,
            updatePassword: e.target.checked ? "true" : "false"
          })}
        />
        <Form.Text className="text-muted">
          New password: {generatedPassword}
        </Form.Text>
      </Form.Group>
    </Col>
  </Row>
)}

                    {/* Address Details */}
                    <h5 className="mt-4 mb-3">Address Details</h5>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            name="city"
                            placeholder="Enter city"
                            value={formData.city}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>State</Form.Label>
                          <Form.Control
                            type="text"
                            name="state"
                            placeholder="Enter state"
                            value={formData.state}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Full Address</Form.Label>
                          <Form.Control
                            type="text"
                            name="location"
                            placeholder="Enter complete address"
                            value={formData.location}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Employee Details */}
                    <h5 className="mt-4 mb-3">Employment Details</h5>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Department</Form.Label>
                          <Form.Control
                            type="text"
                            name="department"
                            placeholder="Enter department"
                            value={formData.department}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Education Qualification</Form.Label>
                          <Form.Control
                            type="text"
                            name="education_qualification"
                            placeholder="Enter highest qualification"
                            value={formData.education_qualification}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Experience (Years)</Form.Label>
                          <Form.Control
                            type="number"
                            name="experience"
                            placeholder="Enter years of experience"
                            value={formData.experience}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Skills</Form.Label>
                          <Form.Control
                            type="text"
                            name="skills"
                            placeholder="Enter skills (comma separated)"
                            value={formData.skills}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Salary Details */}
                    <h5 className="mt-4 mb-3">Salary Details</h5>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Current CTC</Form.Label>
                          <Form.Control
                            type="number"
                            name="ctc"
                            placeholder="Enter current CTC"
                            value={formData.ctc}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Expected CTC</Form.Label>
                          <Form.Control
                            type="number"
                            name="expected_ctc"
                            placeholder="Enter expected CTC"
                            value={formData.expected_ctc}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Previous Organization Details */}
                    <h5 className="mt-4 mb-3">Previous Organization Details</h5>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Current Organization</Form.Label>
                          <Form.Control
                            type="text"
                            name="current_organization"
                            placeholder="Enter current/previous organization"
                            value={formData.current_organization}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Industry Type</Form.Label>
                          <Form.Control
                            type="text"
                            name="current_industry_type"
                            placeholder="Enter industry type"
                            value={formData.current_industry_type}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Document Details */}
                    <h5 className="mt-4 mb-3">Document Details</h5>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Aadhaar Card Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="aadhaar_card_number"
                            placeholder="Enter Aadhaar card number"
                            value={formData.aadhaar_card_number}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>PAN Card</Form.Label>
                          <Form.Control
                            type="text"
                            name="pan_card"
                            placeholder="Enter PAN card number"
                            value={formData.pan_card}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Driving License</Form.Label>
                          <Form.Control
                            type="text"
                            name="driving_license"
                            placeholder="Enter driving license number"
                            value={formData.driving_license}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>UAN Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="uan_number"
                            placeholder="Enter UAN number"
                            value={formData.uan_number}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* File Upload Fields */}
                    <h5 className="mt-4 mb-3">File Uploads (Optional)</h5>
                    <Form.Group className="mb-3">
                      <Form.Label>Profile Image</Form.Label>
                      <Form.Control
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      {isEditMode && formData.image && !(formData.image instanceof File) && (
                        <Form.Text className="text-muted">
                          Current file: {formData.image}
                        </Form.Text>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Resume</Form.Label>
                      <Form.Control
                        type="file"
                        name="resume"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                      {isEditMode && formData.resume && !(formData.resume instanceof File) && (
                        <Form.Text className="text-muted">
                          Current file: {formData.resume}
                        </Form.Text>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Aadhaar Card</Form.Label>
                      <Form.Control
                        type="file"
                        name="aadhaar_card"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                      />
                      {isEditMode && formData.aadhaar_card && !(formData.aadhaar_card instanceof File) && (
                        <Form.Text className="text-muted">
                          Current file: {formData.aadhaar_card}
                        </Form.Text>
                      )}
                    </Form.Group>

                    {/* Status */}
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Status</Form.Label>
                          <Form.Select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Submit Button */}
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={() => navigate('/employeelist')}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 
                         isEditMode ? "Update Employee" : "Register Employee"}
                      </Button>
                    </div>
                  </Form>
                )}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Register;