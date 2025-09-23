import React, { useState, useEffect } from "react";
import EmployeeSidebar from "../../Shared/EmployeeSidebar/EmployeeSidebar";
import { useAuth } from "../../Authcontext/Authcontext";
import Employeetabs from "../../Shared/Employeetabs/EmployeeTabs";
import axios from "axios";
import "./Attendence.css";
import { baseUrl } from "../../../Apiurls";

const Attendence = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Attendance states
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [lunchStarted, setLunchStarted] = useState(false);
  const [lunchEnded, setLunchEnded] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [lunchStartTime, setLunchStartTime] = useState(null);
  const [lunchEndTime, setLunchEndTime] = useState(null);
  const [status, setStatus] = useState("N/A");
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [companyLocation, setCompanyLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  // Format date as dd-mm-yyyy
  const formatDate = (date) => {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };
  const today = formatDate(new Date());

  // Fetch company location from backend
  const fetchCompanyLocation = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/attendance/company-location`);
      if (res.data.success) {
        setCompanyLocation(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch company location:", err);
      // Fallback to default location
      setCompanyLocation({
        latitude: 24.071207,
        longitude: 82.622665
      });
    }
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    return distance;
  };

  // Get user's current location
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          resolve(location);
        },
        (error) => {
          reject(new Error(`Unable to retrieve location: ${error.message}`));
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  };

  // Validate if user is within company premise
  const validateUserLocation = async () => {
    if (!companyLocation) {
      throw new Error("Company location not available");
    }

    try {
      const location = await getUserLocation();
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        companyLocation.latitude,
        companyLocation.longitude
      );

      if (distance > 0.1) {
        throw new Error(`You are ${distance.toFixed(2)}km away from company. Must be within 100m.`);
      }

      return location;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchCompanyLocation();
  }, []);

  useEffect(() => {
    const fetchTodayAttendance = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/attendance/today`, {
          params: { employee_id: user.id }
        });

        if (res.data.success && res.data.data) {
          const record = res.data.data;

          if (record.check_in) {
            setCheckedIn(true);
            setCheckInTime(new Date(record.check_in));
            setStatus(record.status || "Present");
          }
          if (record.lunch_start) {
            setLunchStarted(true);
            setLunchStartTime(new Date(record.lunch_start));
          }
          if (record.lunch_end) {
            setLunchEnded(true);
            setLunchEndTime(new Date(record.lunch_end));
          }
          if (record.check_out) {
            setCheckedOut(true);
            setCheckOutTime(new Date(record.check_out));
          }
        } else {
          // No record → reset all states (new day)
          setCheckedIn(false);
          setCheckedOut(false);
          setLunchStarted(false);
          setLunchEnded(false);
          setCheckInTime(null);
          setCheckOutTime(null);
          setLunchStartTime(null);
          setLunchEndTime(null);
          setStatus("N/A");
        }
      } catch (err) {
        console.error("Failed to fetch today attendance:", err);
      }
    };

    if (user?.id) {
      fetchTodayAttendance();
    }
  }, [user]);

  const handleCheckIn = async () => {
    setLoading(true);
    setError(null);
    setLocationError(null);

    try {
      if (!companyLocation) {
        await fetchCompanyLocation();
      }

      const location = await validateUserLocation();
      const locationString = `${location.latitude},${location.longitude}`;

      const res = await axios.post(`${baseUrl}/api/attendance/checkin`, {
        employee_id: user.id,
        location: locationString,
      });

      setUserLocation(location);
      setCheckedIn(true);
      setCheckInTime(new Date(res.data.check_in));
      setStatus("Present");
      alert("Checked in successfully");
    } catch (err) {
      console.error("Check-in error:", err);
      setError(err.message);
      alert(err.message || "Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLunchStart = async () => {
    setLoading(true);
    setError(null);
    setLocationError(null);

    try {
      if (!companyLocation) {
        await fetchCompanyLocation();
      }

      const location = await validateUserLocation();
      const locationString = `${location.latitude},${location.longitude}`;

      const res = await axios.post(`${baseUrl}/api/attendance/lunchstart`, {
        employee_id: user.id,
        location: locationString,
      });

      setUserLocation(location);
      setLunchStarted(true);
      setLunchStartTime(new Date(res.data.lunch_start));
      alert("Lunch started successfully");
    } catch (err) {
      console.error("Lunch start error:", err);
      setError(err.message);
      alert(err.message || "Lunch start failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLunchEnd = async () => {
    setLoading(true);
    setError(null);
    setLocationError(null);

    try {
      if (!companyLocation) {
        await fetchCompanyLocation();
      }

      const location = await validateUserLocation();
      const locationString = `${location.latitude},${location.longitude}`;

      const res = await axios.post(`${baseUrl}/api/attendance/lunchend`, {
        employee_id: user.id,
        location: locationString,
      });

      setUserLocation(location);
      setLunchEnded(true);
      setLunchEndTime(new Date(res.data.lunch_end));
      alert("Lunch ended successfully");
    } catch (err) {
      console.error("Lunch end error:", err);
      setError(err.message);
      alert(err.message || "Lunch end failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    setError(null);
    setLocationError(null);

    try {
      if (!companyLocation) {
        await fetchCompanyLocation();
      }

      const location = await validateUserLocation();
      const locationString = `${location.latitude},${location.longitude}`;

      const res = await axios.post(`${baseUrl}/api/attendance/checkout`, {
        employee_id: user.id,
        location: locationString,
      });

      setUserLocation(location);
      setCheckedOut(true);
      setCheckOutTime(new Date(res.data.check_out));
      setStatus("Present");
      alert("Checked out successfully");
    } catch (err) {
      console.error("Check-out error:", err);
      setError(err.message);
      alert(err.message || "Check-out failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-attendenceContainer1">
      <EmployeeSidebar onToggleSidebar={setCollapsed} />
      <div className={`employee-attendence1 ${collapsed ? "collapsed" : ""}`}>
        <h1 className="mt-4 text-center">My Attendance</h1>
        <div className="mt-3 mb-3">
          <Employeetabs />
        </div>

        <div className="attendance-card mt-3">
          <h5>
            Welcome,{" "}
            <span style={{ fontWeight: "bold", color: "cadetblue" }}>
              {user?.name}
            </span>
          </h5>
          <p><strong>Date:</strong> {today}</p>
          {companyLocation ? (
            <p><strong>Company Location:</strong> {companyLocation.latitude.toFixed(6)}, {companyLocation.longitude.toFixed(6)}</p>
          ) : (
            <p><strong>Company Location:</strong> Loading...</p>
          )}
          {userLocation && (
            <p><strong>Your Location:</strong> {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}</p>
          )}
          {locationError && (
            <p style={{ color: "red" }}><strong>Location Error:</strong> {locationError}</p>
          )}

          <div className="attendance-info">
            <p><strong>Check-In:</strong> {checkInTime ? checkInTime.toLocaleTimeString() : "Not yet"}</p>
            <p><strong>Lunch Start:</strong> {lunchStartTime ? lunchStartTime.toLocaleTimeString() : "Not yet"}</p>
            <p><strong>Lunch End:</strong> {lunchEndTime ? lunchEndTime.toLocaleTimeString() : "Not yet"}</p>
            <p><strong>Check-Out:</strong> {checkOutTime ? checkOutTime.toLocaleTimeString() : "Not yet"}</p>
            <p><strong>Status:</strong> {status}</p>
          </div>

          <div className="button-container">
            <button
              onClick={handleCheckIn}
              disabled={checkedIn || loading}
              className="checkedIn-btn"
            >
              {loading ? "Processing..." : "Check In"}
            </button>
            <button
              onClick={handleLunchStart}
              disabled={!checkedIn || lunchStarted || checkedOut || loading}
              className="lunchStart-btn"
            >
              {loading ? "Processing..." : "Lunch Start"}
            </button>
            <button
              onClick={handleLunchEnd}
              disabled={!lunchStarted || lunchEnded || checkedOut || loading}
              className="lunchEnd-btn"
            >
              {loading ? "Processing..." : "Lunch End"}
            </button>
            <button
              onClick={handleCheckOut}
              disabled={!checkedIn || checkedOut || loading}
              className="checkedOut-btn"
            >
              {loading ? "Processing..." : "Check Out"}
            </button>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Attendence;