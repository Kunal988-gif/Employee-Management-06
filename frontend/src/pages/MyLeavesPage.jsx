import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyLeaves, cancelLeave, getMyBalances } from '../api/leaveRequestApi';

function MyLeavesPage({ token }) {
  const [leaves, setLeaves] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [leavesRes, balancesRes] = await Promise.all([
        getMyLeaves(token),
        getMyBalances(token)
      ]);

      if (leavesRes.success) {
        setLeaves(leavesRes.data);
      } else {
        setError(leavesRes.message || 'Failed to load leaves');
      }

      if (balancesRes.success) {
        setBalances(balancesRes.data);
      }
    } catch (err) {
      setError('Unable to load leave data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this pending leave request?')) {
      return;
    }

    try {
      const res = await cancelLeave(id, token);
      if (res.success) {
        setActionMessage('Leave request cancelled');
        loadData();
        setTimeout(() => setActionMessage(''), 3000);
      } else {
        alert(res.message || 'Failed to cancel');
      }
    } catch (err) {
      alert('Error cancelling leave request');
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>My Leaves & Balances</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Check your leave balances and history</p>
        </div>
        <Link to="/apply-leave" className="btn btn-primary">
          + Apply for Leave
        </Link>
      </div>

      {actionMessage && <div className="alert alert-success">{actionMessage}</div>}

      <div className="stats-grid">
        {balances.map((b) => (
          <div key={b.leaveTypeId} className="stat-card">
            <span className="stat-label">{b.leaveTypeName}</span>
            <div className="stat-value">{b.availableBalance}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
              Used: {b.usedDays} / {b.yearlyQuota} days
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>Leave History</h3>

        {loading && <p style={{ textAlign: 'center', padding: '20px' }}>Loading leaves...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && leaves.length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
            No leave requests submitted yet. Click "+ Apply for Leave" to apply.
          </p>
        )}

        {!loading && !error && leaves.length > 0 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((item) => (
                  <tr key={item._id}>
                    <td><strong>{item.leaveType ? item.leaveType.name : 'Unknown'}</strong></td>
                    <td>
                      {new Date(item.startDate).toLocaleDateString()} to {new Date(item.endDate).toLocaleDateString()}
                    </td>
                    <td>{item.numberOfDays}</td>
                    <td style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.reason}
                    </td>
                    <td>
                      <span className={`badge badge-${item.status}`}>{item.status}</span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {item.adminRemarks || '-'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Link to={`/my-leaves/${item._id}`} className="btn btn-secondary btn-sm">
                          View
                        </Link>
                        {item.status === 'pending' && (
                          <button
                            onClick={() => handleCancel(item._id)}
                            className="btn btn-danger btn-sm"
                          >
                            Cancel
                          </button>
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

export default MyLeavesPage;
