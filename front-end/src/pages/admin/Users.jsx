import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, User } from "lucide-react";
import "../../assets/styles/AdminUsers.css";
import { API_BASE_URL } from "../../api"; // adjust path

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [blockingLoading, setBlockingLoading] = useState(false);
  const [blockingError, setBlockingError] = useState("");

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token"); // <-- Use your login token
        if (!token) {
          setError("Admin token missing. Please login as admin.");
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setUsers(res.data.users);
        } else {
          setError(res.data.message || "Failed to fetch users");
        }
      } catch (err) {
        console.error(err);
        setError("Server error while fetching users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (user) => {
    setSelectedUser(user);
    setAdminPassword("");
    setBlockingError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setAdminPassword("");
    setBlockingError("");
    setModalOpen(false);
  };

  const handleBlockUnblock = async () => {
    if (!adminPassword.trim()) {
      setBlockingError("Please enter your admin password.");
      return;
    }

    try {
      setBlockingLoading(true);
      const token = localStorage.getItem("token");
      const endpoint = selectedUser.isBlocked
        ? `${API_BASE_URL}/api/admin/unblock-user`
        : `${API_BASE_URL}/api/admin/block-user`;

      const res = await axios.post(
        endpoint,
        { userId: selectedUser._id, adminPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === selectedUser._id
              ? { ...u, isBlocked: !u.isBlocked }
              : u
          )
        );
        closeModal();
      } else {
        setBlockingError(res.data.message || "Action failed");
      }
    } catch (err) {
      console.error(err);
      setBlockingError(err.response?.data?.message || "Server error");
    } finally {
      setBlockingLoading(false);
    }
  };

  const UserAvatar = ({ src, userName }) => {
    const [imageError, setImageError] = useState(false);
    if (!src || imageError) {
      return (
        <div className="user-avatar-placeholder">
          <User size={20} />
        </div>
      );
    }
    return (
      <img
        src={src}
        alt={userName}
        className="user-avatar"
        onError={() => setImageError(true)}
      />
    );
  };

  return (
    <div className="users-container">
      <div className="users-header">
        <h1 className="users-title">Users</h1>
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search for a user"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="user-search"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-container">Loading users...</div>
      ) : error ? (
        <div className="error-container">
          <p style={{ color: "red" }}>{error}</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="no-users-container">No users found</div>
      ) : (
        <div className="users-table">
          <div className="users-table-header">
            <span>User name</span>
            <span>Number</span>
            <span>Joining Date</span>
            <span>Status</span>
          </div>

          {filteredUsers.map((user) => (
            <div className="users-table-row" key={user._id}>
              <div className="user-info">
                <UserAvatar src={user.profilePicture} userName={user.userName} />
                <span>{user.userName}</span>
              </div>
              <span>{user.phoneNumber || "N/A"}</span>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              <div className="user-status">
                <button
                  className={`status-btn ${user.isBlocked ? "inactive" : "active"}`}
                  onClick={() => openModal(user)}
                >
                  {user.isBlocked ? "Not Active" : "Active"}
                  {!user.isBlocked && <CheckCircle size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">!</div>
              <p className="modal-title">
                {selectedUser.isBlocked ? "Unblock User" : "Block User"}
              </p>
            </div>
            <p className="modal-message">
              Are you sure you want to{" "}
              {selectedUser.isBlocked ? "unblock" : "block"}{" "}
              <strong>{selectedUser.userName}</strong>?
              <br />
              Please enter your admin password to confirm.
            </p>
            <input
              type="password"
              placeholder="Enter your admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="modal-input"
              disabled={blockingLoading}
            />
            {blockingError && (
              <p className="blocking-error">{blockingError}</p>
            )}
            <div className="modal-buttons">
              <button
                onClick={closeModal}
                className="cancel-btn"
                disabled={blockingLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleBlockUnblock}
                className="confirm-btn"
                disabled={blockingLoading || !adminPassword.trim()}
              >
                {blockingLoading
                  ? selectedUser.isBlocked
                    ? "Unblocking..."
                    : "Blocking..."
                  : selectedUser.isBlocked
                  ? "Confirm & Unblock"
                  : "Confirm & Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
