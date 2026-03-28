    import React, { useState } from "react";
    import "../../assets/styles/ContactUs.css";

    export default function ContactUs() {
      const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        alert(
          `Message sent!\n\nTo: owner@example.com\nFrom: ${formData.email}\nSubject: ${formData.subject}\nMessage: ${formData.message}`
        );
        setFormData({ name: "", email: "", subject: "", message: "" });
      };

      return (
        <div className="contact-page">
          <div className="contact-card">
            <h1 className="contact-title">Contact Us</h1>
            <p className="contact-subtitle">
              Have a question or feedback? Send us a message and we'll get back to you soon.
            </p>

            <form className="contact-form" onSubmit={handleSubmit}>

              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                type="text"
                placeholder="Message subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />

              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows="5"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleChange}
                required
              />

              <button type="submit" className="contact-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      );
    }
