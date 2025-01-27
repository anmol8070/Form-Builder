import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const loginData = { username, password };
      const response = await axios.post(
        'https://form-builder-38h6.onrender.com/api/auth/login',
        loginData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      alert("Login successful")
      console.log('Login successful:', response.data);

      const userRole = response.data.user.role;
      console.log(userRole)
      if (userRole === 'Admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'User') {
        navigate('/user/dashboard');
      } else {
        setError('Unknown user role.');
      }
    } catch (err) {
      console.error(
        'Error during login:',
        err.response?.data || err.message
      );
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div>
      
      <div className="login-container">
        <div className="login-form-wrapper card shadow p-4">
          <h2 className="text-center mb-4 login-heading">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label login-label">
                Username
              </label>
              <input
                type="text"
                className="form-control login-input"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label login-label">
                Password
              </label>
              <input
                type="password"
                className="form-control login-input"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary w-100 login-button">
              Login
            </button>
            <div className="mt-3 text-center">
              <p>
                Don't have an account? <Link to="/register">Register here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;