// src/components/Register.js
import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import Navbar from "../../../Shared/AdminSidebar/AdminSidebar";
import "../../../Layout/Collapse/Collapse.css";
import { baseUrl } from "../../../../Apiurls";

const Register = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  
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
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // API Base URL - adjust this to your backend URL
  const API_BASE_URL = `${baseUrl}/api`;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  setSuccess("");

  try {
    const formDataToSend = new FormData();

    // Append all text fields
    Object.keys(formData).forEach((key) => {
      if (formData[key] && key !== "image" && key !== "resume" && key !== "aadhaar_card") {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append files
    if (formData.image instanceof File) {
      formDataToSend.append("image", formData.image);
    }
    if (formData.resume instanceof File) {
      formDataToSend.append("resume", formData.resume);
    }
    if (formData.aadhaar_card instanceof File) {
      formDataToSend.append("aadhaar_card", formData.aadhaar_card);
    }

    // 🔹 Debug: log what you're about to send
    console.log("Submitting Employee Data:");
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      body: formDataToSend,
    });

    const data = await response.json();

    // 🔹 Debug: log backend response
    console.log("API Response:", data);

    if (data.success) {
      setSuccess("Employee registered successfully!");
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
      });
      setTimeout(() => navigate('/employeelist'), 2000);
    } else {
      setError(data.message || "Registration failed");
    }
  } catch (err) {
    setError("Network error. Please check if the server is running.");
    console.error("Registration error:", err);
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
                <h3 className="text-center mb-4">Employee Registration</h3>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

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
                        />
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

                  {/* File Upload Fields - Note: These would need proper file handling implementation */}
                  <h5 className="mt-4 mb-3">File Uploads (Optional)</h5>
                  <Form.Group className="mb-3">
  <Form.Label>Profile Image</Form.Label>
  <Form.Control
    type="file"
    name="image"
    accept="image/*"
    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
  />
</Form.Group>

<Form.Group className="mb-3">
  <Form.Label>Resume</Form.Label>
  <Form.Control
    type="file"
    name="resume"
    accept=".pdf,.doc,.docx"
    onChange={(e) => setFormData({ ...formData, resume: e.target.files[0] })}
  />
</Form.Group>

<Form.Group className="mb-3">
  <Form.Label>Aadhaar Card</Form.Label>
  <Form.Control
    type="file"
    name="aadhaar_card"
    accept="image/*,.pdf"
    onChange={(e) => setFormData({ ...formData, aadhaar_card: e.target.files[0] })}
  />
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
                      onClick={() => navigate('/employees')}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? <Spinner animation="border" size="sm" /> : "Register Employee"}
                    </Button>
                  </div>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Register;