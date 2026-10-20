import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeaveTypeForm from '../components/LeaveTypeForm';
import { createLeaveType } from '../api/leaveTypeApi';

function AddLeaveTypePage({ token }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');

    try {
      const res = await createLeaveType(formData, token);

      if (!res.success) {
        setError(res.message || 'Failed to create leave type');
        setLoading(false);
        return;
      }

      navigate('/admin/leave-types');
    } catch (err) {
      setError('Server error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '640px' }}>
      <div className="card">
        <h2 className="card-title">Add New Leave Type</h2>
        <LeaveTypeForm
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          isEdit={false}
        />
      </div>
    </div>
  );
}

export default AddLeaveTypePage;
