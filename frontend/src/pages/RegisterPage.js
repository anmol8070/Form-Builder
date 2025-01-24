import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/RegisterPage.css'; // Import the CSS

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User'); // Default to User role
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const registrationData = { username, password, role }; // Pass data as an object
      const response = await axios.post(
        'https://form-builder-38h6.onrender.com/api/auth/register',
        registrationData,
        { headers: { 'Content-Type': 'application/json' } } // Add headers explicitly
      );

      alert("Registration successful")
      console.log('Registration successful:', response.data);

      if (response.status === 200) {
        // Redirect to login page
        navigate('/');
      }
    } catch (error) {
      console.error(
        'Error during registration:',
        error.response?.data || error.message
      );
      setError(error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container justify-content-center">
          <span className="navbar-brand text-center">Form Builder App</span>
        </div>
      </nav>
      <div className="register-container">
        <div className="register-form-wrapper card shadow p-4">
          <h2 className="text-center mb-4 register-heading">Register</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label register-label">
                Username
              </label>
              <input
                type="text"
                className="form-control register-input"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label register-label">
                Password
              </label>
              <input
                type="password"
                className="form-control register-input"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label register-label">
                Role
              </label>
              <select
                className="form-select register-select"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary w-100 register-button">
              Register
            </button>
            <div className="mt-3 text-center">
              <p>
                Already have an account? <Link to="/">Login here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
