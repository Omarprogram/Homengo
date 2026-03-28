//categoryModal.jsx
import React, { useState } from "react";
import axios from "axios";
import "../../assets/styles/ServicesAdminModals.css";
import { API_BASE_URL } from "../../api"; // adjust path

export default function CategoryModal({ category, onClose }) {
  const [name, setName] = useState(category ? category.name : "");
  const [description, setDescription] = useState(category ? category.description : "");
  const [status, setStatus] = useState(category ? category.status : "active");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (category) {
        // Update existing category
        await axios.put(`${API_BASE_URL}/api/categories/${category._id}`, { name, description, status });
      } else {
        // Create new category
        await axios.post(`${API_BASE_URL}/api/categories`, { name, description });
      }
      onClose(); // refresh admin page
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{category ? "Edit Category" : "Add Category"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Description:
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          {category && (
            <label>
              Status:
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          )}
          <div className="modal-buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : category ? "Update Category" : "Add Category"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
