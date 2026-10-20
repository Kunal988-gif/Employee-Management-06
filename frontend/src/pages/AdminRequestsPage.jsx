import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllLeaves, updateLeaveStatus } from '../api/leaveRequestApi';

function AdminRequestsPage({ token }) {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const loadRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAllLeaves(statusFilter, token);
      if (res.success) {
        setRequests(res.data);
      } else {
        setError(res.message || 'Failed to fetch leave requests');
      }
    } catch (err) {
      setError('Unable to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [statusFilter, token]);

  const handleUpdateStatus = async (id, status) => {
    const remarks = prompt(`Enter remarks for ${status} (optional):`) || '';

    try {
      const res = await updateLeaveStatus(id, { status, adminRemarks: remarks }, token);
      if (res.success) {
        setActionSuccess(`Leave request ${status} successfully`);
        loadRequests();
        setTimeout(() => setActionSuccess(''), 3000);
      } else {
        alert(res.message || `Failed to ${status} request`);
      }
    } catch (err) {
      alert('Error updating leave status');
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>Employee Leave Requests</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Review and process leave applications</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="statusFilter" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
            Filter:
          </label>
          <select
            id="statusFilter"
            className="form-control"
            style={{ width: 'auto' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {actionSuccess && <div className="alert alert-success">{actionSuccess}</div>}

      <div className="card">
        {loading && <p style={{ textAlign: 'center', padding: '20px' }}>Loading requests...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && requests.length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
            No leave requests found.
          </p>
        )}

        {!loading && !error && requests.length > 0 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Leave Type</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <strong>{item.employee ? item.employee.name : 'Unknown'}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {item.employee ? item.employee.employeeId : ''}
                      </div>
                    </td>
                    <td>{item.employee ? item.employee.department : ''}</td>
                    <td>
                      <span className="badge badge-active">
                        {item.leaveType ? item.leaveType.name : 'Unknown'}
                      </span>
                    </td>
                    <td>
                      {new Date(item.startDate).toLocaleDateString()} to {new Date(item.endDate).toLocaleDateString()}
                    </td>
                    <td>{item.numberOfDays}</td>
                    <td style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.reason}
                    </td>
                    <td>
                      <span className={`badge badge-${item.status}`}>{item.status}</span>
                      {item.adminRemarks && (
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                          {item.adminRemarks}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Link to={`/my-leaves/${item._id}`} className="btn btn-secondary btn-sm">
                          View
                        </Link>
                        {item.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(item._id, 'approved')}
                              className="btn btn-success btn-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(item._id, 'rejected')}
                              className="btn btn-danger btn-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
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

export default AdminRequestsPage;
