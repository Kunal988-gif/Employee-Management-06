import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeaveTypes } from '../api/leaveTypeApi';
import { applyLeave, getMyBalances } from '../api/leaveRequestApi';
import LoadingState from '../components/LoadingState';

function ApplyLeavePage({ token }) {
  const navigate = useNavigate();

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [balances, setBalances] = useState([]);
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesData, balancesData] = await Promise.all([
          getLeaveTypes(token),
          getMyBalances(token)
        ]);

        if (typesData.success && typesData.data.length > 0) {
          setLeaveTypes(typesData.data);
          setLeaveType(typesData.data[0]._id);
        }

        if (balancesData.success) {
          setBalances(balancesData.data);
        }
      } catch (err) {
        setError('Failed to load leave types or balances');
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const calculateEstimatedDays = () => {
    if (!startDate || !endDate) return 0;
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (e < s) return 0;

    let count = 0;
    const cur = new Date(s);
    while (cur <= e) {
      if (cur.getDay() !== 0) count++;
      cur.setDate(cur.getDate() + 1);
    }
    return count;
  };

  const estimatedDays = calculateEstimatedDays();
  const selectedBalance = balances.find((b) => b.leaveTypeId === leaveType);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be earlier than start date');
      return;
    }

    setSubmitting(true);

    try {
      const result = await applyLeave(
        {
          leaveType,
          startDate,
          endDate,
          reason
        },
        token
      );

      if (!result.success) {
        setError(result.message || 'Failed to submit leave request');
        setSubmitting(false);
        return;
      }

      navigate('/my-leaves');
    } catch (err) {
      setError('Server connection error. Please try again.');
      setSubmitting(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="container">
        <LoadingState message="Loading leave application form..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '680px' }}>
      <div className="card">
        <h2 className="card-title">Apply for Leave</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {selectedBalance && (
          <div className="alert alert-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{selectedBalance.leaveTypeName} Balance:</strong> Available{' '}
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{selectedBalance.availableBalance}</span> of {selectedBalance.yearlyQuota} days
            </div>
            {selectedBalance.usedDays > 0 && (
              <span style={{ fontSize: '0.85rem' }}>({selectedBalance.usedDays} days already used)</span>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="leaveType">Leave Type *</label>
            <select
              id="leaveType"
              className="form-control"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              required
            >
              {leaveTypes.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name} ({type.yearlyQuota} days/year)
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date *</label>
              <input
                id="startDate"
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date *</label>
              <input
                id="endDate"
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          {startDate && endDate && (
            <div style={{ marginBottom: '16px', fontSize: '0.9rem', color: '#475569' }}>
              <strong>Estimated working days:</strong> {estimatedDays} day(s) (Sundays are excluded)
            </div>
          )}

          <div className="form-group">
            <label htmlFor="reason">Reason for Leave *</label>
            <textarea
              id="reason"
              rows="4"
              className="form-control"
              placeholder="Please describe the reason for your leave request..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={submitting}
          >
            {submitting ? 'Submitting Application...' : 'Submit Leave Request'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ApplyLeavePage;
