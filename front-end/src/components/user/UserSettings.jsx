// UserSettings.jsx
import React, { useState } from "react";
import "../../assets/styles/UserSettings.css";
import ChangePasswordModal from "./ChangePasswordModal";
import { API_BASE_URL } from "../../api"; // ✅ was using import.meta.env.VITE_API_URL inconsistently

const UserSettings = ({ user }) => {
  const [profile, setProfile] = useState({
    fullName: user?.fullName || "",
    userName: user?.userName || "",   // ✅ consistent casing — was mixing userName/username
    email: user?.email || "",
    phone: user?.phoneNumber || "",
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: profile.fullName,
          phoneNumber: profile.phone, // ✅ was sending "username" (wrong field) instead of phoneNumber
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Profile update failed");

      // ✅ Update localStorage so sidebar reflects new name immediately
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, fullName: profile.fullName, phoneNumber: profile.phone }));

      setSuccessMsg("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    }
  };

  const handleReset = () => {
    // ✅ Reset back to original user data, not hardcoded strings
    setProfile({
      fullName: user?.fullName || "",
      userName: user?.userName || "",
      email: user?.email || "",
      phone: user?.phoneNumber || "",
    });
    setSuccessMsg("");
    setErrorMsg("");
  };

  return (
    <div className="settings-container">
      <h2>Account Settings</h2>

      <div className="profile-pic-upload">
        <label className="upload-label">
          <input type="file" style={{ display: "none" }} />
          <div className="upload-box">Upload your photo</div>
        </label>
      </div>

      <form className="settings-form" onSubmit={handleUpdate}>

        {successMsg && <p className="success-msg">{successMsg}</p>}
        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        {/* Username and email are read-only — user cannot change them */}
        <label>
          Username
          <input type="text" value={profile.userName} disabled />
        </label>

        <label>
          Email
          <input type="email" value={profile.email} disabled />
        </label>

        <label>
          Full Name
          <input
            type="text"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
          />
        </label>

        <label>
          Phone Number
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
          />
        </label>

        <div className="form-buttons">
          <button type="submit" className="update-btn">Update Profile</button>
          <button type="button" className="reset-btn" onClick={handleReset}>Reset</button>
        </div>

        <div className="change-password-section">
          <button
            type="button"
            className="update-btn"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            Change Password
          </button>
        </div>
      </form>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        userId={user?._id}
        token={token}
      />
    </div>
  );
};

export default UserSettings;