import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../api/dashboardApi';

function AdminDashboardPage({ token }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getDashboardStats(token);
      if (res.success) {
        setStats(res.data);
      } else {
        setError(res.message || 'Failed to load dashboard metrics');
      }
    } catch (err) {
      setError('Unable to connect to the backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [token]);

  if (loading) {
    return (
      <div className="container">
        <p style={{ textAlign: 'center', padding: '20px' }}>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>Admin Dashboard</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Overview of leave requests and statistics</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/admin/requests" className="btn btn-primary btn-sm">
            Leave Requests
          </Link>
          <Link to="/admin/leave-types" className="btn btn-secondary btn-sm">
            Leave Types
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Pending Requests</span>
          <div className="stat-value">{stats ? stats.pendingCount : 0}</div>
          <Link to="/admin/requests" style={{ fontSize: '0.8rem', color: '#2563eb', marginTop: '4px' }}>
            View requests
          </Link>
        </div>

        <div className="stat-card">
          <span className="stat-label">Employees on Leave Today</span>
          <div className="stat-value">{stats ? stats.employeesOnLeaveToday : 0}</div>
        </div>

        <div className="stat-card">
          <span className="stat-label">Total Employees</span>
          <div className="stat-value">{stats?.summary ? stats.summary.totalEmployees : 0}</div>
        </div>

        <div className="stat-card">
          <span className="stat-label">Approved Requests</span>
          <div className="stat-value">{stats?.summary ? stats.summary.approvedCount : 0}</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>Department-Wise Approved Leaves</h3>

        {!stats || !stats.departmentWiseLeaveCount || stats.departmentWiseLeaveCount.length === 0 ? (
          <p style={{ color: '#64748b', padding: '12px 0' }}>
            No approved leaves recorded yet.
          </p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Total Leaves</th>
                  <th>Total Days</th>
                </tr>
              </thead>
              <tbody>
                {stats.departmentWiseLeaveCount.map((dept, index) => (
                  <tr key={index}>
                    <td><strong>{dept.department}</strong></td>
                    <td>{dept.totalLeaves}</td>
                    <td>{dept.totalDays} Days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
