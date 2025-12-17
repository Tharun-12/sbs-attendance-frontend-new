// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  Badge,
  Image
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Authcontext/Authcontext';
import { baseUrl } from '../../../Apiurls';
import { FaArrowLeft } from 'react-icons/fa'; // Import back icon
import EmployeeSidebar from "../../Shared/EmployeeSidebar/EmployeeSidebar";
import Employeetabs from "../../Shared/Employeetabs/EmployeeTabs";


const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNo: '',
    alternateContactNo: '',
    aadhaarCardNumber: '',
    panCard: '',
    drivingLicense: '',
    dob: '',
    gender: '',
    department: '',
    educationQualification: '',
    experience: '',
    skills: '',
    ctc: '',
    expectedCtc: '',
    currentOrganization: '',
    currentIndustryType: '',
    location: '',
    city: '',
    state: '',
    uanNumber: ''
  });

  // File states
  const [imageFile, setImageFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Get logged in employee email
  const getLoggedInEmployeeEmail = () => {
    // Try to get from AuthContext first
    if (user && user.email) {
      return user.email;
    }
    
    // Fall back to localStorage
    const employeeData = localStorage.getItem('employeeData');
    if (employeeData) {
      try {
        const parsedData = JSON.parse(employeeData);
        return parsedData.email;
      } catch (err) {
        console.error('Error parsing employeeData:', err);
      }
    }
    
    return null;
  };

  // Fix: Add back button handler
  const handleBackToAttendance = () => {
    navigate('/attendance');
  };

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const email = getLoggedInEmployeeEmail();
      
      if (!email) {
        setError('Please log in to view profile');
        navigate('/login');
        return;
      }

      const response = await fetch(`${baseUrl}/api/employees/profile/${email}`);
      const data = await response.json();
      
      if (data.success) {
        const employeeData = data.data;
        setProfile(employeeData);
        
        // Debug: Log document fields
        console.log('Profile data:', {
          resume: employeeData.resume,
          aadhaarCard: employeeData.aadhaarCard,
          image: employeeData.image
        });
        
        // Set form data for editing
        setFormData({
          name: employeeData.name || '',
          email: employeeData.email || '',
          contactNo: employeeData.contactNo || '',
          alternateContactNo: employeeData.alternateContactNo || '',
          aadhaarCardNumber: employeeData.aadhaarCardNumber || '',
          panCard: employeeData.panCard || '',
          drivingLicense: employeeData.drivingLicense || '',
          dob: employeeData.dob ? formatDateForInput(employeeData.dob) : '',
          gender: employeeData.gender || '',
          department: employeeData.department || '',
          educationQualification: employeeData.educationQualification || '',
          experience: employeeData.experience || '',
          skills: employeeData.skills || '',
          ctc: employeeData.ctc || '',
          expectedCtc: employeeData.expectedCtc || '',
          currentOrganization: employeeData.currentOrganization || '',
          currentIndustryType: employeeData.currentIndustryType || '',
          location: employeeData.location || '',
          city: employeeData.city || '',
          state: employeeData.state || '',
          uanNumber: employeeData.uanNumber || ''
        });

        // Fix: Set image preview only if image exists
        if (employeeData.image) {
          const imageUrl = `${baseUrl}/uploads/${employeeData.image}`;
          console.log('Setting image preview:', imageUrl);
          setImagePreview(imageUrl);
        } else {
          setImagePreview('');
        }
      } else {
        setError(data.message || 'Failed to load profile data');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Helper function to format date for input field
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  // Helper function to format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fix: Function to safely construct document URLs
  const getDocumentUrl = (fileName) => {
    if (!fileName) return null;
    return `${baseUrl}/uploads/${fileName}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    switch (type) {
      case 'image':
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        break;
      case 'resume':
        setResumeFile(file);
        break;
      case 'aadhaar':
        setAadhaarFile(file);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      
      // Create editable fields object with null for empty values
      const editableFields = {
        name: profile.name, // Always send name from profile
        email: profile.email, // Always send email from profile
        contact_no: formData.contactNo || null,
        alternate_contact_no: formData.alternateContactNo || null,
        aadhaar_card_number: formData.aadhaarCardNumber || null,
        pan_card: formData.panCard || null,
        driving_license: formData.drivingLicense || null,
        dob: formData.dob || null,
        gender: formData.gender || null,
        department: profile.department, // Send from profile since it's not editable
        education_qualification: formData.educationQualification || null,
        experience: formData.experience || null,
        skills: formData.skills || null,
        ctc: formData.ctc || null,
        expected_ctc: formData.expectedCtc || null,
        current_organization: formData.currentOrganization || null,
        current_industry_type: formData.currentIndustryType || null,
        location: formData.location || null,
        city: formData.city || null,
        state: formData.state || null,
        uan_number: formData.uanNumber || null,
        status: profile.status || 'active' // Send status from profile
      };

      // Append editable fields as JSON
      formDataToSend.append('data', JSON.stringify(editableFields));

      // Fix: Only append files if they exist
      if (imageFile) {
        console.log('Appending image file:', imageFile.name);
        formDataToSend.append('image', imageFile);
      }
      if (resumeFile) {
        console.log('Appending resume file:', resumeFile.name);
        formDataToSend.append('resume', resumeFile);
      }
      if (aadhaarFile) {
        console.log('Appending aadhaar file:', aadhaarFile.name);
        formDataToSend.append('aadhaar_card', aadhaarFile);
      }

      console.log('Sending update request for employee ID:', profile.id);
      
      const response = await fetch(
        `${baseUrl}/api/employees/${profile.id}`,
        {
          method: 'PUT',
          body: formDataToSend,
        }
      );

      const data = await response.json();
      console.log('Update response:', data);

      if (data.success) {
        setSuccess('Profile updated successfully!');
        setEditing(false);
        fetchProfile(); // Refresh profile data
        
        // Update localStorage with new name
        const employeeData = localStorage.getItem('employeeData');
        if (employeeData) {
          const parsedData = JSON.parse(employeeData);
          parsedData.name = formData.name;
          localStorage.setItem('employeeData', JSON.stringify(parsedData));
        }
      } else {
        setError(data.message || 'Update failed');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset form to original profile data
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        contactNo: profile.contactNo || '',
        alternateContactNo: profile.alternateContactNo || '',
        aadhaarCardNumber: profile.aadhaarCardNumber || '',
        panCard: profile.panCard || '',
        drivingLicense: profile.drivingLicense || '',
        dob: profile.dob ? formatDateForInput(profile.dob) : '',
        gender: profile.gender || '',
        department: profile.department || '',
        educationQualification: profile.educationQualification || '',
        experience: profile.experience || '',
        skills: profile.skills || '',
        ctc: profile.ctc || '',
        expectedCtc: profile.expectedCtc || '',
        currentOrganization: profile.currentOrganization || '',
        currentIndustryType: profile.currentIndustryType || '',
        location: profile.location || '',
        city: profile.city || '',
        state: profile.state || '',
        uanNumber: profile.uanNumber || ''
      });
      setImagePreview(profile.image ? `${baseUrl}/uploads/${profile.image}` : '');
    }
    setImageFile(null);
    setResumeFile(null);
    setAadhaarFile(null);
  };

  if (loading) {
    return (
      <div className="employee-attendenceContainer1">
        <EmployeeSidebar onToggleSidebar={setCollapsed} />
        <div className={`employee-attendence1 ${collapsed ? "collapsed" : ""}`}>
          <Container className="mt-5 text-center">
            <Spinner animation="border" />
            <p>Loading profile...</p>
          </Container>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="employee-attendenceContainer1">
        <EmployeeSidebar onToggleSidebar={setCollapsed} />
        <div className={`employee-attendence1 ${collapsed ? "collapsed" : ""}`}>
          <Container className="mt-5">
            <Alert variant="danger">
              No profile data found. Please contact administrator.
            </Alert>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-attendenceContainer1">
      <EmployeeSidebar onToggleSidebar={setCollapsed} />
      <div className={`employee-attendence1 ${collapsed ? "collapsed" : ""}`}>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Container className="mt-4">
          {/* Header row with profile image, name, status, and buttons in same line */}
          <Row className="mb-4 align-items-center">
            <Col md={2}>
              {/* Profile Image */}
              <div className="text-center">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    roundedCircle
                    fluid
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    className="mb-2"
                  />
                ) : (
                  <div 
                    className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto"
                    style={{ width: '100px', height: '100px' }}
                  >
                    <span className="text-muted">No Image</span>
                  </div>
                )}
              </div>
            </Col>
            
            <Col md={7}>
              <div className="d-flex flex-column">
                <h2 className="mb-1">{profile.name}</h2>
                <div className="d-flex align-items-center gap-2">
                  <Badge bg={profile.status === 'active' ? 'success' : 'secondary'}>
                    {profile.status?.toUpperCase()}
                  </Badge>
                  <span className="text-muted">{profile.department}</span>
                </div>
              </div>
            </Col>
            
            <Col md={3} className="text-end">
              <div className="d-flex gap-2 justify-content-end">
                <Button 
                  variant="outline-secondary" 
                  onClick={handleBackToAttendance}
                  className="d-flex align-items-center gap-1"
                  size="sm"
                >
                  <FaArrowLeft /> Back
                </Button>
                
                {!editing ? (
                  <Button variant="primary" onClick={() => setEditing(true)} size="sm">
                    Edit Profile
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={handleCancel} size="sm">
                    Cancel
                  </Button>
                )}
              </div>
            </Col>
          </Row>

          {editing ? (
            <Card className="mb-4">
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row className="mb-4">
                    <Col md={3} className="text-center">
                      <div className="mb-3">
                        {imagePreview ? (
                          <Image
                            src={imagePreview}
                            roundedCircle
                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '150px', height: '150px' }}>
                            <span className="text-muted">No Image</span>
                          </div>
                        )}
                      </div>
                      <Form.Group>
                        <Form.Label>Change Profile Picture</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'image')}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={9}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                              type="text"
                              value={formData.name}
                              readOnly
                              disabled
                            />
                            <Form.Text className="text-muted">
                              Name cannot be changed
                            </Form.Text>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              value={formData.email}
                              readOnly
                              disabled
                            />
                            <Form.Text className="text-muted">
                              Email cannot be changed
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Contact Number</Form.Label>
                            <Form.Control
                              type="text"
                              name="contactNo"
                              value={formData.contactNo}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Alternate Contact</Form.Label>
                            <Form.Control
                              type="text"
                              name="alternateContactNo"
                              value={formData.alternateContactNo}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  {/* Personal Details */}
                  <h5 className="mt-4 mb-3">Personal Details</h5>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
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
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Employment Details */}
                  <h5 className="mt-4 mb-3">Employment Details</h5>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Department</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.department}
                          readOnly
                          disabled
                        />
                        <Form.Text className="text-muted">
                          Department cannot be changed
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Education Qualification</Form.Label>
                        <Form.Control
                          type="text"
                          name="educationQualification"
                          value={formData.educationQualification}
                          onChange={handleInputChange}
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
                          value={formData.experience}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Skills</Form.Label>
                        <Form.Control
                          type="text"
                          name="skills"
                          value={formData.skills}
                          onChange={handleInputChange}
                          placeholder="HTML, CSS, JavaScript, React"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Document Details */}
                  <h5 className="mt-4 mb-3">Document Details</h5>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Aadhaar Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="aadhaarCardNumber"
                          value={formData.aadhaarCardNumber}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>PAN Card</Form.Label>
                        <Form.Control
                          type="text"
                          name="panCard"
                          value={formData.panCard}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>UAN Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="uanNumber"
                          value={formData.uanNumber}
                          onChange={handleInputChange}
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
                          name="drivingLicense"
                          value={formData.drivingLicense}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* File Uploads */}
                  <h5 className="mt-4 mb-3">Update Documents</h5>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Resume</Form.Label>
                        <Form.Control
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileChange(e, 'resume')}
                        />
                        {profile.resume && (
                          <Form.Text className="text-muted">
                            Current: <a href={getDocumentUrl(profile.resume)} target="_blank" rel="noopener noreferrer">
                              {profile.resume}
                            </a>
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Aadhaar Card</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange(e, 'aadhaar')}
                        />
                        {profile.aadhaarCard && (
                          <Form.Text className="text-muted">
                            Current: <a href={getDocumentUrl(profile.aadhaarCard)} target="_blank" rel="noopener noreferrer">
                              {profile.aadhaarCard}
                            </a>
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Submit Button */}
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                    <Button type="submit" variant="primary" disabled={saving}>
                      {saving ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            // View Mode
            <>
              <Card className="mb-4">
                <Card.Body>
                  <Row>
                    <Col md={12}>
                      <Row className="mt-3">
                        <Col md={6}>
                          <h6>Contact Information</h6>
                          <p><strong>Email:</strong> {profile.email}</p>
                          <p><strong>Phone:</strong> {profile.contactNo || 'N/A'}</p>
                          <p><strong>Alternate Phone:</strong> {profile.alternateContactNo || 'N/A'}</p>
                        </Col>
                        <Col md={6}>
                          <h6>Personal Details</h6>
                          <p><strong>Date of Birth:</strong> {formatDateForDisplay(profile.dob)}</p>
                          <p><strong>Gender:</strong> {profile.gender || 'N/A'}</p>
                          <p><strong>Employee ID:</strong> {profile.id}</p>
                        </Col>
                      </Row>
                      
                      <Row className="mt-3">
                        <Col md={12}>
                          <h6>Address</h6>
                          <p>{profile.location || 'N/A'}</p>
                          <p>{profile.city}, {profile.state}</p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Row>
                <Col md={6}>
                  <Card className="mb-4">
                    <Card.Header>
                      <h5 className="mb-0">Employment Details</h5>
                    </Card.Header>
                    <Card.Body>
                      <p><strong>Department:</strong> {profile.department || 'N/A'}</p>
                      <p><strong>Education:</strong> {profile.educationQualification || 'N/A'}</p>
                      <p><strong>Experience:</strong> {profile.experience ? `${profile.experience} years` : 'N/A'}</p>
                      <p><strong>Skills:</strong> {profile.skills || 'N/A'}</p>
                      <p><strong>Join Date:</strong> {formatDateForDisplay(profile.createdAt)}</p>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className="mb-4">
                    <Card.Header>
                      <h5 className="mb-0">Document Details</h5>
                    </Card.Header>
                    <Card.Body>
                      <p><strong>Aadhaar:</strong> {profile.aadhaarCardNumber || 'N/A'}</p>
                      <p><strong>PAN:</strong> {profile.panCard || 'N/A'}</p>
                      <p><strong>Driving License:</strong> {profile.drivingLicense || 'N/A'}</p>
                      <p><strong>UAN:</strong> {profile.uanNumber || 'N/A'}</p>
                      <div className="mt-3">
                        <h6>Download Documents:</h6>
                        <div className="d-flex gap-2">
                          {/* Fix: Use correct field names and URL construction */}
                          {profile.resume && (
                            <Button
                              variant="outline-primary"
                              size="sm"
                              as="a"
                              href={getDocumentUrl(profile.resume)}
                              target="_blank"
                              download
                            >
                              Resume
                            </Button>
                          )}
                          {profile.aadhaarCard && (
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              as="a"
                              href={getDocumentUrl(profile.aadhaarCard)}
                              target="_blank"
                              download
                            >
                              Aadhaar Card
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Salary & Previous Organization</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <h6>Salary Details</h6>
                      <p><strong>Current CTC:</strong> {profile.ctc ? `₹${profile.ctc}` : 'N/A'}</p>
                      <p><strong>Expected CTC:</strong> {profile.expectedCtc ? `₹${profile.expectedCtc}` : 'N/A'}</p>
                    </Col>
                    <Col md={6}>
                      <h6>Previous Organization</h6>
                      <p><strong>Organization:</strong> {profile.currentOrganization || 'N/A'}</p>
                      <p><strong>Industry Type:</strong> {profile.currentIndustryType || 'N/A'}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </>
          )}
        </Container>
      </div>
    </div>
  );
};

export default Profile;