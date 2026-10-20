import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../api/dashboardApi';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

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
        <LoadingState message="Loading dashboard statistics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <ErrorState message={error} onRetry={loadStats} />
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Admin Dashboard</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Overview of employee leave requests and company metrics</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/admin/requests" className="btn btn-primary btn-sm">
            Review Requests
          </Link>
          <Link to="/admin/leave-types" className="btn btn-secondary btn-sm">
            Leave Types
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card warning">
          <span className="stat-label">Pending Requests</span>
          <div className="stat-value">{stats ? stats.pendingCount : 0}</div>
          <Link to="/admin/requests?status=pending" style={{ fontSize: '0.82rem', color: '#d97706', marginTop: '6px', fontWeight: 600 }}>
            Review pending →
          </Link>
        </div>

        <div className="stat-card primary">
          <span className="stat-label">Employees on Leave Today</span>
          <div className="stat-value">{stats ? stats.employeesOnLeaveToday : 0}</div>
          <span style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '6px' }}>
            Active approved leaves
          </span>
        </div>

        <div className="stat-card success">
          <span className="stat-label">Total Employees</span>
          <div className="stat-value">{stats?.summary ? stats.summary.totalEmployees : 0}</div>
          <span style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '6px' }}>
            Registered staff members
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Approved Total</span>
          <div className="stat-value">{stats?.summary ? stats.summary.approvedCount : 0}</div>
          <span style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '6px' }}>
            All-time approvals
          </span>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Department-Wise Approved Leaves</h2>

        {!stats || !stats.departmentWiseLeaveCount || stats.departmentWiseLeaveCount.length === 0 ? (
          <p style={{ color: '#64748b', fontStyle: 'italic', padding: '12px 0' }}>
            No approved leaves recorded across departments yet.
          </p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Total Leave Requests</th>
                  <th>Total Days Taken</th>
                </tr>
              </thead>
              <tbody>
                {stats.departmentWiseLeaveCount.map((dept, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{dept.department || 'Unassigned'}</strong>
                    </td>
                    <td>{dept.totalLeaves} Requests</td>
                    <td>
                      <span className="badge badge-active">{dept.totalDays} Days</span>
                    </td>
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
