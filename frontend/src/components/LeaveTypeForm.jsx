import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LeaveTypeForm({ initialValues, onSubmit, loading, error, isEdit = false }) {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [yearlyQuota, setYearlyQuota] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [clientError, setClientError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name || '');
      setYearlyQuota(initialValues.yearlyQuota !== undefined ? initialValues.yearlyQuota : '');
      setIsActive(initialValues.isActive !== undefined ? initialValues.isActive : true);
    }
  }, [initialValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setClientError('');

    if (!name.trim()) {
      setClientError('Leave type name is required');
      return;
    }

    if (!yearlyQuota || Number(yearlyQuota) <= 0) {
      setClientError('Yearly quota must be a number greater than 0');
      return;
    }

    onSubmit({
      name: name.trim(),
      yearlyQuota: Number(yearlyQuota),
      isActive
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {clientError && <div className="alert alert-danger">{clientError}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="form-group">
        <label htmlFor="leaveTypeName">Leave Type Name *</label>
        <input
          id="leaveTypeName"
          type="text"
          className="form-control"
          placeholder="e.g. Casual Leave, Sick Leave, Earned Leave"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="yearlyQuota">Yearly Quota (in days) *</label>
        <input
          id="yearlyQuota"
          type="number"
          min="1"
          className="form-control"
          placeholder="e.g. 12"
          value={yearlyQuota}
          onChange={(e) => setYearlyQuota(e.target.value)}
          required
        />
      </div>

      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          id="isActive"
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          style={{ width: '18px', height: '18px' }}
        />
        <label htmlFor="isActive" style={{ margin: 0, cursor: 'pointer' }}>
          Active (Available for employees to select when applying for leave)
        </label>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Leave Type' : 'Create Leave Type'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/leave-types')}
          className="btn btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default LeaveTypeForm;
