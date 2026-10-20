import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/authApi';

function RegisterPage({ onLogin }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    employeeId: '',
    department: '',
    designation: '',
    joiningDate: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser(formData);

      if (!data.success) {
        setError(data.message || 'Registration failed');
        setLoading(false);
        return;
      }

      onLogin(data.token, data.user);
      navigate('/my-leaves');
    } catch (err) {
      setError('Server connection error. Please make sure backend is running.');
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '20px' }}>
      <div className="card">
        <h2 className="card-title" style={{ justifyContent: 'center', marginBottom: '20px' }}>
          Employee Registration
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Work Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password (min 6 chars) *</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="employeeId">Employee ID *</label>
              <input
                id="employeeId"
                name="employeeId"
                type="text"
                className="form-control"
                placeholder="Employee ID"
                value={formData.employeeId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <input
                id="department"
                name="department"
                type="text"
                className="form-control"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="designation">Designation / Role *</label>
              <input
                id="designation"
                name="designation"
                type="text"
                className="form-control"
                placeholder="Designation"
                value={formData.designation}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="joiningDate">Joining Date *</label>
              <input
                id="joiningDate"
                name="joiningDate"
                type="date"
                className="form-control"
                value={formData.joiningDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '12px' }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
          Already have an account? <Link to="/login" style={{ color: '#0f766e', fontWeight: 600 }}>Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
