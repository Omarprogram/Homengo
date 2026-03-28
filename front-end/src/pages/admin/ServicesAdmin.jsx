// ServicesAdmin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/ServicesAdmin.css";
import CategoryModal from "../../components/admin/categoryModal.jsx";
import ServiceModal from "../../components/admin/serviceModal.jsx";
import deleteIcon from "../../assets/images/deleteIcon.png";
import editIcon from "../../assets/images/editIcon.png";
import { API_BASE_URL } from "../../api";

export default function AdminServicesPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);

  console.log(showCategoryModal);
  console.log(showServiceModal);
  // 🔥 New state for delete category modal
  const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/categories/with-services`);
      const data = res.data;
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data && typeof data === "object") {
        setCategories(Object.values(data));
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error(err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleStatus = async (type, id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/${type}/${id}/status`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/services/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 New: Delete Category
  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/categories/${id}`);
      setDeleteCategoryConfirm(null); // close modal
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to delete category");
    }
  };

  return (
    <div className="services-container">
      <h2>Services</h2>
      <div className="admin-page">
        {/* Top buttons */}
        <div className="top-buttons">
          <button onClick={() => setShowCategoryModal(true)}>Add Category</button>
          <button onClick={() => setShowServiceModal(true)}>Add Service</button>
        </div>

        {/* Categories */}
        {Array.isArray(categories) &&
          categories.map((cat) => (
            <div key={cat._id} className="category-card">
              <div className="category-header">
                <h2>{cat.name}</h2>

                <div className="category-action-buttons">
                  {/* Edit button */}
                  <button
                    className="icon-btn"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowCategoryModal(true);
                    }}
                  >
                    <img src={editIcon} alt="Edit" />
                  </button>

                  {/* Delete button */}
                  <button
                    className="icon-btn"
                    onClick={() => setDeleteCategoryConfirm(cat)}
                  >
                    <img src={deleteIcon} alt="Delete" />
                  </button>

                  {/* Activate/Deactivate toggle */}
                  <div className="toggle-wrapper">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={cat.status === "active"}
                        onChange={() => toggleStatus("categories", cat._id)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>

              </div>

              {/* Services under this category */}
              <div className="services-list">
                {Array.isArray(cat.services) &&
                  cat.services.map((srv) => (
                    <div key={srv._id} className="service-card"
                    style={{
                            backgroundImage: srv.image ? `url(${API_BASE_URL}/uploads/${srv.image})` : "none"
                          }}>
                      <h3>{srv.name}</h3>
                      <p>{srv.description}</p>
                      {/* {srv.image && <img src={`${API_BASE_URL}/uploads/${srv.image}`} alt={srv.name} />} Replace with Icon later */}
                      <div className="service-buttons">
                        <div className="service-action-buttons">
                          <button onClick={() => deleteService(srv._id)}>
                            <img src={deleteIcon} alt="Delete" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedService(srv);
                              setShowServiceModal(true);
                            }}
                          >
                            <img src={editIcon} alt="Edit" />
                          </button>
                        </div>

                        <div
                          className={`toggle-switch ${
                            srv.status === "active" ? "" : "off"
                          }`}
                          onClick={() => toggleStatus("services", srv._id)}
                        ></div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>

      {/* Modals */}
      {showCategoryModal && (
        <CategoryModal
          category={selectedCategory}
          onClose={() => {
            setShowCategoryModal(false);
            setSelectedCategory(null);
            fetchCategories();
          }}
        />
      )}

      {showServiceModal && (
        <ServiceModal
          service={selectedService}
          categories={categories}
          onClose={() => {
            setShowServiceModal(false);
            setSelectedService(null);
            fetchCategories();
          }}
        />
      )}

      {/* 🔥 Delete Category Confirmation Modal */}
      {deleteCategoryConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Category</h3>
            <p>
              Are you sure you want to delete <b>{deleteCategoryConfirm.name}</b>? 
              All services related to it will be deleted as well.
            </p>
            <div className="modal-buttons">
              <button onClick={() => deleteCategory(deleteCategoryConfirm._id)}>
                Yes, Delete
              </button>
              <button onClick={() => setDeleteCategoryConfirm(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
