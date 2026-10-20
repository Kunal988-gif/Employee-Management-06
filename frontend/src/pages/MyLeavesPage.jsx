import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyLeaves, cancelLeave, getMyBalances } from '../api/leaveRequestApi';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

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
      setError('Unable to load leave data. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this pending leave request?')) {
      return;
    }

    try {
      const res = await cancelLeave(id, token);
      if (res.success) {
        setActionMessage('Leave request cancelled successfully');
        loadData();
        setTimeout(() => setActionMessage(''), 4000);
      } else {
        alert(res.message || 'Failed to cancel leave request');
      }
    } catch (err) {
      alert('Error cancelling leave request');
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Leaves & Balances</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Track your leave balances and request history</p>
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
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '6px' }}>
              Used: {b.usedDays} / {b.yearlyQuota} days quota
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="card-title">Leave History</h2>

        {loading && <LoadingState message="Loading your leave history..." />}
        {error && <ErrorState message={error} onRetry={loadData} />}

        {!loading && !error && leaves.length === 0 && (
          <EmptyState
            title="No Leave Requests Found"
            message="You have not submitted any leave requests yet. Click 'Apply for Leave' to get started."
          />
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
                    <td>
                      <strong>{item.leaveType ? item.leaveType.name : 'Unknown'}</strong>
                    </td>
                    <td>
                      {new Date(item.startDate).toLocaleDateString()} to {new Date(item.endDate).toLocaleDateString()}
                    </td>
                    <td>{item.numberOfDays}</td>
                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.reason}
                    </td>
                    <td>
                      <span className={`badge badge-${item.status}`}>{item.status}</span>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                      {item.adminRemarks || '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
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
