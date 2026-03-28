// Form.jsx
import { API_BASE_URL } from "../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../assets/styles/Form.css";

const Form = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);

  const [fullName, setFullName] = useState("");
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    // ✅ Clear all fields and errors when switching between login/signup
    setFullName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setPhoneNumber("");
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    if (!isLogin) {
      if (!/^[a-zA-Z0-9]{3,}$/.test(userName)) {
        newErrors.userName = "Username must be at least 3 characters, letters and numbers only.";
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!isLogin) {
      // ✅ Collect ALL password issues at once instead of overwriting each check
      const pwdErrors = [];
      if (password.length < 8) pwdErrors.push("at least 8 characters");
      if (!/[A-Za-z]/.test(password)) pwdErrors.push("at least one letter");
      if (!/[0-9]/.test(password)) pwdErrors.push("at least one number");
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) pwdErrors.push("at least one symbol");
      if (pwdErrors.length > 0) {
        newErrors.password = `Password must contain: ${pwdErrors.join(", ")}.`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        const res = await axios.post(`${API_BASE_URL}/api/auth/register`, {
          fullName,
          userName,
          email,
          password,
          phoneNumber,
          role: "C",
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      navigate("/HomeScreen");
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";

      // ✅ Show server errors inline instead of alert()
      if (message.toLowerCase().includes("email")) {
        setErrors((prev) => ({ ...prev, email: message }));
      } else if (message.toLowerCase().includes("username")) {
        setErrors((prev) => ({ ...prev, userName: message }));
      } else if (message.toLowerCase().includes("password")) {
        setErrors((prev) => ({ ...prev, password: message }));
      } else {
        setErrors((prev) => ({ ...prev, general: message }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form">
      <h3 id="formSubtext">{isLogin ? "Welcome Back" : "Your First Step Toward Trusted Help"}</h3>
      <h2 id="formMainText">{isLogin ? "Log In to your Account" : "Create an Account"}</h2>

      <form onSubmit={handleSubmit}>

        {/* General error (e.g. server down) */}
        {errors.general && (
          <div className="alert alert-danger py-2">{errors.general}</div>
        )}

        {!isLogin && (
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="fullName"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <label htmlFor="fullName">Full Name</label>
          </div>
        )}

        {!isLogin && (
          <div className="form-floating mb-3">
            <input
              type="text"
              className={`form-control ${errors.userName ? "is-invalid" : ""}`}
              id="username"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="username">Username</label>
            {errors.userName && <div className="invalid-feedback">{errors.userName}</div>}
          </div>
        )}

        <div className="form-floating mb-3">
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            required
          />
          <label htmlFor="email">Email</label>
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="form-floating mb-3">
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        {!isLogin && (
          <div className="form-floating mb-3">
            <input
              type="text"
              className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
              id="phoneNumber"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <label htmlFor="phoneNumber">Phone Number</label>
            {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
          </div>
        )}

        <button type="submit" className="formBtn" disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "CONTINUE" : "GET STARTED"}
        </button>
      </form>

      <div className="hasAnAccDev">
        <span>{isLogin ? "New User?" : "Already have an account?"}</span>
        <button type="button" onClick={toggleForm}>
          {isLogin ? "SIGN UP HERE" : "LOGIN HERE"}
        </button>
      </div>
    </div>
  );
};

export default Form;