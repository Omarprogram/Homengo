// ChangePasswordModal.jsx
import { useState } from "react";
import "../../assets/styles/ChangePasswordModal.css";
import axios from "axios";
import { API_BASE_URL } from "../../api"; // adjust path

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/api/users/profile`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) setError(err.response.data.message);
      else setError("Failed to update password. Try again.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Change Password</h2>
        <form onSubmit={handleSubmit} className="change-password-form">
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <label>
            Current Password
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </label>

          <label>
            New Password
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </label>

          <label>
            Confirm New Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn submit">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
