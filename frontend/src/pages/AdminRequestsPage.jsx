import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllLeaves, updateLeaveStatus } from '../api/leaveRequestApi';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

function AdminRequestsPage({ token }) {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const [activeRequest, setActiveRequest] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [processingStatus, setProcessingStatus] = useState(null);
  const [processingLoading, setProcessingLoading] = useState(false);
  const [modalError, setModalError] = useState('');

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

  const openActionModal = (request, targetStatus) => {
    setActiveRequest(request);
    setProcessingStatus(targetStatus);
    setRemarks('');
    setModalError('');
  };

  const closeActionModal = () => {
    setActiveRequest(null);
    setProcessingStatus(null);
    setRemarks('');
    setModalError('');
  };

  const handleConfirmAction = async () => {
    if (!activeRequest || !processingStatus) return;

    setProcessingLoading(true);
    setModalError('');

    try {
      const res = await updateLeaveStatus(
        activeRequest._id,
        {
          status: processingStatus,
          adminRemarks: remarks
        },
        token
      );

      if (!res.success) {
        setModalError(res.message || `Failed to ${processingStatus} leave request`);
        setProcessingLoading(false);
        return;
      }

      setActionSuccess(`Leave request for ${activeRequest.employee?.name} has been ${processingStatus}.`);
      closeActionModal();
      loadRequests();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      setModalError('Server error while processing request');
    } finally {
      setProcessingLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Employee Leave Requests</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Review, approve, or reject employee leave applications</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="statusFilter" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
            Filter Status:
          </label>
          <select
            id="statusFilter"
            className="form-control"
            style={{ width: 'auto' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {actionSuccess && <div className="alert alert-success">{actionSuccess}</div>}

      <div className="card">
        {loading && <LoadingState message="Loading leave requests..." />}
        {error && <ErrorState message={error} onRetry={loadRequests} />}

        {!loading && !error && requests.length === 0 && (
          <EmptyState
            title="No Requests Found"
            message={statusFilter ? `There are no ${statusFilter} leave requests right now.` : 'No leave requests submitted yet.'}
          />
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
                        ID: {item.employee ? item.employee.employeeId : '—'}
                      </div>
                    </td>
                    <td>{item.employee ? item.employee.department : '—'}</td>
                    <td>
                      <span className="badge badge-active">
                        {item.leaveType ? item.leaveType.name : 'Unknown'}
                      </span>
                    </td>
                    <td>
                      {new Date(item.startDate).toLocaleDateString()} to {new Date(item.endDate).toLocaleDateString()}
                    </td>
                    <td>{item.numberOfDays}</td>
                    <td style={{ maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.reason}
                    </td>
                    <td>
                      <span className={`badge badge-${item.status}`}>{item.status}</span>
                      {item.adminRemarks && (
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                          Remarks: {item.adminRemarks}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Link to={`/my-leaves/${item._id}`} className="btn btn-secondary btn-sm">
                          Details
                        </Link>
                        {item.status === 'pending' && (
                          <>
                            <button
                              onClick={() => openActionModal(item, 'approved')}
                              className="btn btn-success btn-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openActionModal(item, 'rejected')}
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

      {activeRequest && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
        >
          <div className="card" style={{ maxWidth: '500px', width: '100%', margin: 0 }}>
            <h3 className="card-title" style={{ textTransform: 'capitalize' }}>
              {processingStatus} Leave Request
            </h3>

            <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '16px' }}>
              Employee: <strong>{activeRequest.employee?.name}</strong> ({activeRequest.numberOfDays} days of{' '}
              {activeRequest.leaveType?.name})
            </p>

            {modalError && <div className="alert alert-danger">{modalError}</div>}

            <div className="form-group">
              <label htmlFor="adminRemarks">Admin Remarks (Optional)</label>
              <textarea
                id="adminRemarks"
                rows="3"
                className="form-control"
                placeholder="Enter remarks or feedback for the employee..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              ></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={closeActionModal}
                className="btn btn-secondary"
                disabled={processingLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`btn ${processingStatus === 'approved' ? 'btn-success' : 'btn-danger'}`}
                disabled={processingLoading}
              >
                {processingLoading ? 'Processing...' : `Confirm ${processingStatus}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRequestsPage;
