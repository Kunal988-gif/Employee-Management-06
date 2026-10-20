import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLeaveById, cancelLeave } from '../api/leaveRequestApi';

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
      setError('Unable to load leave details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeave();
  }, [id, token]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this pending leave request?')) {
      return;
    }

    try {
      const res = await cancelLeave(id, token);
      if (res.success) {
        alert('Leave request cancelled');
        navigate('/my-leaves');
      } else {
        alert(res.message || 'Failed to cancel');
      }
    } catch (err) {
      alert('Error cancelling request');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p style={{ textAlign: 'center', padding: '20px' }}>Loading leave details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger">{error}</div>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          Go Back
        </button>
      </div>
    );
  }

  if (!leave) return null;

  return (
    <div className="container" style={{ maxWidth: '700px' }}>
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={() => navigate(user && user.role === 'admin' ? '/admin/requests' : '/my-leaves')}
          className="btn btn-secondary btn-sm"
        >
          Back
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>Leave Request Details</h2>
          <span className={`badge badge-${leave.status}`}>
            {leave.status}
          </span>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <div className="detail-label">Leave Type</div>
            <div className="detail-value">{leave.leaveType ? leave.leaveType.name : '-'}</div>
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
            <div className="detail-label">Applicant</div>
            <div className="detail-value">
              {leave.employee ? `${leave.employee.name} (${leave.employee.employeeId})` : '-'}
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-label">Department</div>
            <div className="detail-value">{leave.employee ? leave.employee.department : '-'}</div>
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <h4>Reason:</h4>
          <p style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: '4px', marginTop: '4px' }}>
            {leave.reason}
          </p>
        </div>

        <div style={{ marginTop: '16px' }}>
          <h4>Admin Remarks:</h4>
          <p style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: '4px', marginTop: '4px' }}>
            {leave.adminRemarks || 'No remarks provided'}
          </p>
        </div>

        {user && user.role === 'employee' && leave.status === 'pending' && (
          <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '12px', textAlign: 'right' }}>
            <button onClick={handleCancel} className="btn btn-danger">
              Cancel Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaveDetailPage;
