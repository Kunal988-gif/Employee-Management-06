import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeaveTypes, deleteLeaveType } from '../api/leaveTypeApi';

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
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      const res = await deleteLeaveType(id, token);
      if (res.success) {
        setActionMessage('Leave type deleted successfully');
        loadLeaveTypes();
        setTimeout(() => setActionMessage(''), 3000);
      } else {
        alert(res.message || 'Cannot delete leave type');
      }
    } catch (err) {
      alert('Error deleting leave type');
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>Manage Leave Types</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Configure leave quotas</p>
        </div>
        <Link to="/admin/leave-types/new" className="btn btn-primary">
          + Add Leave Type
        </Link>
      </div>

      {actionMessage && <div className="alert alert-success">{actionMessage}</div>}

      <div className="card">
        {loading && <p style={{ textAlign: 'center', padding: '20px' }}>Loading leave types...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && leaveTypes.length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
            No leave types found. Click "+ Add Leave Type" to create one.
          </p>
        )}

        {!loading && !error && leaveTypes.length > 0 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Leave Type Name</th>
                  <th>Yearly Quota</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveTypes.map((type) => (
                  <tr key={type._id}>
                    <td><strong>{type.name}</strong></td>
                    <td>{type.yearlyQuota} Days / Year</td>
                    <td>
                      <span className={`badge ${type.isActive ? 'badge-active' : 'badge-inactive'}`}>
                        {type.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
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
