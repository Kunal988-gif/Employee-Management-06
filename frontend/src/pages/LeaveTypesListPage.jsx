import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeaveTypes, deleteLeaveType } from '../api/leaveTypeApi';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

function LeaveTypesListPage({ token }) {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const loadLeaveTypes = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getLeaveTypes(token);
      if (res.success) {
        setLeaveTypes(res.data);
      } else {
        setError(res.message || 'Failed to fetch leave types');
      }
    } catch (err) {
      setError('Unable to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaveTypes();
  }, [token]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the leave type "${name}"?`)) {
      return;
    }

    try {
      const res = await deleteLeaveType(id, token);
      if (res.success) {
        setActionMessage(`Leave type "${name}" was deleted successfully.`);
        loadLeaveTypes();
        setTimeout(() => setActionMessage(''), 4000);
      } else {
        alert(res.message || 'Cannot delete leave type');
      }
    } catch (err) {
      alert('Error occurred while deleting leave type');
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Manage Leave Types</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Configure yearly leave quotas and categories</p>
        </div>
        <Link to="/admin/leave-types/new" className="btn btn-primary">
          + Add Leave Type
        </Link>
      </div>

      {actionMessage && <div className="alert alert-success">{actionMessage}</div>}

      <div className="card">
        {loading && <LoadingState message="Loading leave types..." />}
        {error && <ErrorState message={error} onRetry={loadLeaveTypes} />}

        {!loading && !error && leaveTypes.length === 0 && (
          <EmptyState
            title="No Leave Types Configured"
            message="No leave types found. Click '+ Add Leave Type' above to create one."
          />
        )}

        {!loading && !error && leaveTypes.length > 0 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Leave Type Name</th>
                  <th>Yearly Quota</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveTypes.map((type) => (
                  <tr key={type._id}>
                    <td>
                      <strong>{type.name}</strong>
                    </td>
                    <td>{type.yearlyQuota} Days / Year</td>
                    <td>
                      <span className={`badge ${type.isActive ? 'badge-active' : 'badge-inactive'}`}>
                        {type.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(type.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link to={`/admin/leave-types/${type._id}/edit`} className="btn btn-secondary btn-sm">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(type._id, type.name)}
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
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

export default LeaveTypesListPage;
