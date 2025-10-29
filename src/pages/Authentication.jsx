import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Authentication.css";
import "../styles/global.css";
import { ThemeContext } from "../context/ThemeContext";
import "../components/ProtectedRoute.jsx"

// InputField component
const InputField = ({ label, name, type, placeholder, value, onChange, error }) => (
  <div className="input-field">
    <label htmlFor={name}>
      {label} <span className="required">*</span>
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={error ? "error" : ""}
      autoComplete="off"
      aria-invalid={error ? "true" : "false"}
      aria-describedby={error ? `${name}-error` : undefined}
    />
    {error && (
      <p className="input-error" id={`${name}-error`} role="alert">
        ⚠ {error}
      </p>
    )}
  </div>
);

const Authentication = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("ticketapp_session"));
    if (session) navigate("/dashboard");
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3500);
  };

  const switchMode = () => {
    setIsLogin((prev) => !prev);
    setFormData({ email: "", password: "", confirmPassword: "", fullName: "" });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    const { email, password, confirmPassword, fullName } = formData;

    if (!email.trim()) errors.email = "Email is required";
    else if (!/^[\w.-]+@gmail\.com$/.test(email))
      errors.email = "Email must be a valid Gmail address";

    if (!password.trim()) errors.password = "Password is required";
    else if (password.length < 5)
      errors.password = "Password must be at least 5 characters";

    if (!isLogin) {
      if (!fullName.trim()) errors.fullName = "Full name is required";
      else if (fullName.trim().length < 3)
        errors.fullName = "Full name must be at least 3 characters";

      if (!confirmPassword.trim())
        errors.confirmPassword = "Please confirm your password";
      else if (password !== confirmPassword)
        errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast("Please correct the errors before proceeding", "error");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("ticketapp_users") || "[]");

      if (isLogin) {
        // LOGIN
        const user = users.find(
          (u) => u.email === formData.email && u.password === formData.password
        );

        if (user) {
          const session = {
            token: btoa(user.email + Date.now()),
            email: user.email,
            fullName: user.fullName,
            loginTime: new Date().toISOString(),
          };
          localStorage.setItem("ticketapp_session", JSON.stringify(session));

          showToast("Login successful! Redirecting...", "success");
          setTimeout(() => navigate("/dashboard"), 1200);
        } else {
          showToast("Invalid email or password. Please try again.", "error");
        }
      } else {
        // SIGNUP
        const userExists = users.some((u) => u.email === formData.email);
        if (userExists) {
          showToast("An account with this email already exists", "error");
        } else {
          const newUser = {
            id: Date.now(),
            ...formData,
            createdAt: new Date().toISOString(),
          };
          localStorage.setItem("ticketapp_users", JSON.stringify([...users, newUser]));
          showToast("Account created! Please log in.", "success");
          setTimeout(() => setIsLogin(true), 1000);
        }
      }

      setIsLoading(false);
    }, 1000);
  };

  return (
    <main className={`auth-page ${theme}`} aria-labelledby="auth-heading">
      {/*  Background shapes */}
      <div className="circle-blue" aria-hidden="true" />
      <div className="circle-purple" aria-hidden="true" />

      {/* Toast Message */}
      {toast.show && (
        <aside className={`toast toast-${toast.type}`} role="status">
          {toast.message}
        </aside>
      )}

      {/* Navbar */}
      <header className="auth-nav">
  <div className="nav-logo">
    <span className="nova" style={{ color: theme === "light" ? "#333" : "#fff" }}>
      Nova
    </span>
    <span className="ticket">Ticket</span>
  </div>

  <button className="btn btn--ghost back-home-btn" onClick={() => navigate("/")}>
    Back to Home
  </button>
</header>

      {/*Form Section */}
      <section className="auth-container">
        <article className="auth-card" aria-labelledby="auth-heading">
          <header className="auth-header">
            <h1 id="auth-heading">{isLogin ? "Welcome Back" : "Create Account"}</h1>
            <p>
              {isLogin
                ? "Sign in to access your dashboard"
                : "Sign up to get started with NovaTicket"}
            </p>
          </header>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <InputField
                label="Full Name"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                error={formErrors.fullName}
              />
            )}

            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              error={formErrors.email}
            />

            <InputField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={isLogin ? "Enter your password" : "Create a password"}
              error={formErrors.password}
            />

            {!isLogin && (
              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                error={formErrors.confirmPassword}
              />
            )}

            {isLogin && (
              <div className="forgot-password">
                <button type="button" onClick={() => alert("Password reset coming soon!")}>
                  Forgot password?
                </button>
              </div>
            )}

            <button type="submit" disabled={isLoading} className={`submit-btn ${isLoading ? "disabled" : ""}`}>
              {isLoading ? <span className="spinner"></span> : isLogin ? "Sign In" : "Sign Up"}
            </button>

            <div className="switch-mode">
              {isLogin ? "Don’t have an account? " : "Already have an account? "}
              <button type="button" onClick={switchMode}>
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </form>
        </article>
      </section>
       <footer className="footer">
        <div className="footer-bottom">
          <p>&copy; 2025 NovaTicket. All rights reserved.</p>
          <ul className="footer-legal">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>
      </footer>
    </main>

    
  );
};

export default Authentication;