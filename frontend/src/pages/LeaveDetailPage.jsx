import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getLeaveById, cancelLeave } from '../api/leaveRequestApi';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

function LeaveDetailPage({ token, user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLeave = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getLeaveById(id, token);
      if (res.success) {
        setLeave(res.data);
      } else {
        setError(res.message || 'Leave request not found');
      }
    } catch (err) {
      setError('Unable to load leave details. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeave();
  }, [id, token]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this pending leave request?')) {
      return;
    }

    try {
      const res = await cancelLeave(id, token);
      if (res.success) {
        alert('Leave request cancelled successfully');
        navigate('/my-leaves');
      } else {
        alert(res.message || 'Failed to cancel request');
      }
    } catch (err) {
      alert('Error cancelling request');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <LoadingState message="Loading leave details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <ErrorState message={error} onRetry={loadLeave} />
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          ← Go Back
        </button>
      </div>
    );
  }

  if (!leave) return null;

  return (
    <div className="container" style={{ maxWidth: '780px' }}>
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={() => navigate(user && user.role === 'admin' ? '/admin/requests' : '/my-leaves')}
          className="btn btn-secondary btn-sm"
        >
          ← Back to List
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Leave Request Details</h1>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
              Reference ID: <code>{leave._id}</code>
            </p>
          </div>
          <span className={`badge badge-${leave.status}`} style={{ fontSize: '0.95rem', padding: '6px 14px' }}>
            {leave.status}
          </span>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <div className="detail-label">Leave Type</div>
            <div className="detail-value">{leave.leaveType ? leave.leaveType.name : 'N/A'}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">Duration</div>
            <div className="detail-value">{leave.numberOfDays} Day(s)</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">Start Date</div>
            <div className="detail-value">{new Date(leave.startDate).toLocaleDateString()}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">End Date</div>
            <div className="detail-value">{new Date(leave.endDate).toLocaleDateString()}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">Submitted On</div>
            <div className="detail-value">{new Date(leave.createdAt).toLocaleString()}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">Applicant</div>
            <div className="detail-value">
              {leave.employee ? `${leave.employee.name} (${leave.employee.employeeId})` : 'N/A'}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>Reason for Leave:</h3>
          <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            {leave.reason}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>Admin Remarks:</h3>
          <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            {leave.adminRemarks || <em style={{ color: '#94a3b8' }}>No remarks provided yet</em>}
          </div>
        </div>

        {user && user.role === 'employee' && leave.status === 'pending' && (
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleCancel} className="btn btn-danger">
              Cancel Leave Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaveDetailPage;
