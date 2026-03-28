//serviceModal.jsx

import React, { useState } from "react";
import axios from "axios";
import "../../assets/styles/ServicesAdminModals.css";
import { API_BASE_URL } from "../../api"; // adjust path

export default function ServiceModal({ service, categories, onClose }) {
  const [name, setName] = useState(service ? service.name : "");
  const [description, setDescription] = useState(service ? service.description : "");
  const [category, setCategory] = useState(service ? service.category : (categories[0]?._id || ""));
  const [status, setStatus] = useState(service ? service.status : "inactive");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      alert("Please select a category");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("status", status);
      if (image) formData.append("image", image);

      if (service) {
        // Update existing service
        await axios.put(`${API_BASE_URL}/api/services/${service._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Create new service
        await axios.post(`${API_BASE_URL}/api/services`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onClose(); // refresh admin page
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{service ? "Edit Service" : "Add Service"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Description:
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </label>
          <label>
            Category:
            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name} {cat.status === "inactive" ? "(Inactive)" : ""}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status:
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <label>
            Image:
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </label>
          <div className="modal-buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : service ? "Update Service" : "Add Service"}
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
