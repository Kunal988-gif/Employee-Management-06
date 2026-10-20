import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LeaveTypeForm from '../components/LeaveTypeForm';
import { getLeaveTypeById, updateLeaveType } from '../api/leaveTypeApi';

function EditLeaveTypePage({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');

  const loadLeaveType = async () => {
    setPageLoading(true);
    setFetchError('');
    try {
      const res = await getLeaveTypeById(id, token);
      if (res.success) {
        setInitialData(res.data);
      } else {
        setFetchError(res.message || 'Leave type not found');
      }
    } catch (err) {
      setFetchError('Unable to load leave type');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadLeaveType();
  }, [id, token]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError('');

    try {
      const res = await updateLeaveType(id, formData, token);

      if (!res.success) {
        setError(res.message || 'Failed to update leave type');
        setSubmitting(false);
        return;
      }

      navigate('/admin/leave-types');
    } catch (err) {
      setError('Server error');
      setSubmitting(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="container">
        <p style={{ textAlign: 'center', padding: '20px' }}>Loading...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="container">
        <div className="alert alert-danger">{fetchError}</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '540px' }}>
      <div className="card">
        <h2 style={{ marginBottom: '16px' }}>Edit Leave Type</h2>
        <LeaveTypeForm
          initialValues={initialData}
          onSubmit={handleSubmit}
          loading={submitting}
          error={error}
          isEdit={true}
        />
      </div>
    </div>
  );
}

export default EditLeaveTypePage;
