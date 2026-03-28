// Settings.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Camera, Edit2, AlertCircle } from "lucide-react";
import "../../assets/styles/AdminSettings.css";
import { API_BASE_URL } from "../../api"; // adjust to your config

export default function AdminSettings({ profileImage, setProfileImage }) {
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    phoneNumber: "",
    profilePicture: null,
  });
  const [loading, setLoading] = useState(false);
  const [editableFields, setEditableFields] = useState({});
  const [fetchError, setFetchError] = useState("");

  const token = localStorage.getItem("token"); // Admin token stored in "token"

  const fetchProfile = useCallback(async () => {
    if (!token) {
      setFetchError("No authentication token found. Please log in as an admin.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 403) setFetchError("Access forbidden. You are not an admin.");
        else setFetchError("Failed to fetch profile.");
        return;
      }

      const data = await res.json();
      if (data.success && data.admin) {
        setFormData({
          fullName: data.admin.fullName || "",
          userName: data.admin.userName || "",
          email: data.admin.email || "",
          phoneNumber: data.admin.phoneNumber || "",
          profilePicture: null,
          password: "",
        });

        if (data.admin.profilePicture) setProfileImage(data.admin.profilePicture);
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
      setFetchError("Server error. Please try again later.");
    }
  }, [token, setProfileImage]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditField = (field) => {
    setEditableFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePicture: file }));
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!token) {
        alert("No authentication token. Please log in again.");
        setLoading(false);
        return;
      }

      const payload = new FormData();
      payload.append("fullName", formData.fullName);
      payload.append("userName", formData.userName);
      payload.append("email", formData.email);
      payload.append("phoneNumber", formData.phoneNumber);
      if (formData.password?.trim()) payload.append("password", formData.password);
      if (formData.profilePicture) payload.append("profilePicture", formData.profilePicture);

      const res = await fetch(`${API_BASE_URL}/api/admin/update-profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("Profile updated successfully!");
        setFormData((prev) => ({ ...prev, password: "", profilePicture: null }));
        setEditableFields({});
        fetchProfile();
      } else {
        alert(data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Update profile error:", err);
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    fetchProfile();
    setEditableFields({});
    setProfileImage(null);
  };

  if (fetchError) {
    return (
      <div className="admin-settings-container">
        <div className="error-box">
          <AlertCircle size={48} style={{ color: "#dc3545", marginBottom: "1rem" }} />
          <h2>Access Denied</h2>
          <p>{fetchError}</p>
          <button
            onClick={() => (window.location.href = "/signup")}
            className="reset-btn"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-settings-container">
      <main className="main-content">
        <h1>Admin Account Settings</h1>
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="profile-pic-upload">
            <label className="upload-box">
              {profileImage || formData.profilePicture ? (
                <img
                  src={profileImage || URL.createObjectURL(formData.profilePicture)}
                  alt="Profile"
                />
              ) : (
                <>
                  <Camera size={20} />
                  <p>Upload your photo</p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <div className="form-fields">
            {["fullName", "userName", "email", "password", "phoneNumber"].map((field) => (
              <div className="form-group" key={field}>
                <label>
                  {field === "fullName"
                    ? "Full Name"
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <div className={`input-with-icon ${editableFields[field] ? "editable" : ""}`}>
                  <input
                    type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    readOnly={!editableFields[field]}
                    placeholder={
                      field === "password" ? "Leave blank to keep current password" : ""
                    }
                  />
                  <Edit2 className="edit-icon" onClick={() => toggleEditField(field)} />
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="submit" className="update-btn" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </button>
            <button type="button" className="reset-btn" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
