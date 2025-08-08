import React, { useState } from 'react';
import apiClient from '../api/apiClient';

const CarRequestForm = () => {
  const [carType, setCarType] = useState('');
  const [carModel, setCarModel] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const currentYear = new Date().getFullYear();

  const clearForm = () => {
    setCarType('');
    setCarModel('');
    setYear('');
  };

  const validateInputs = () => {
    const t = (typeof carType === 'string') ? carType.trim() : '';
    const m = (typeof carModel === 'string') ? carModel.trim() : '';
    const y = (year !== undefined && year !== null) ? year.toString().trim() : '';

    if (t === '') {
      setMessage({ type: 'error', text: 'Car type is required' });
      return false;
    }
    if (m === '') {
      setMessage({ type: 'error', text: 'Car model is required' });
      return false;
    }

    const parsedYear = Number(y);
    if (!Number.isInteger(parsedYear)) {
      setMessage({ type: 'error', text: 'Year must be a valid integer' });
      return false;
    }
    if (parsedYear < 1886) {
      setMessage({ type: 'error', text: 'Year is too small' });
      return false;
    }
    if (parsedYear > currentYear + 1) {
      setMessage({ type: 'error', text: 'Year is in the future' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (loading === true) {
      return;
    }

    const ok = validateInputs();
    if (ok === false) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        carType: carType.trim(),
        carModel: carModel.trim(),
        year: Number(year)
      };

 const response = await apiClient.post('/requests', payload);

      setMessage({ type: 'success', text: 'Request submitted successfully' });
      clearForm();
    } catch (err) {
      console.error('Car request submission error:', err);
      let errText = 'Submission failed';

      if (err !== undefined && err !== null) {
        if (err.response !== undefined && err.response !== null) {
          if (err.response.data !== undefined && err.response.data !== null) {
            if (err.response.data.message !== undefined && err.response.data.message !== null) {
              errText = String(err.response.data.message);
            }
          }
        }
      }

      setMessage({ type: 'error', text: errText });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Request New Car</h3>

      {message !== null && (
        <div
          role="alert"
          className={message.type === 'success' ? 'alert alert-success' : 'alert alert-danger'}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-2">
          <label htmlFor="carType" className="form-label">Car Type</label>
          <input
            id="carType"
            name="carType"
            className="form-control"
            placeholder="e.g. Sedan, SUV"
            value={carType}
            onChange={e => setCarType(e.target.value)}
            required
            aria-required="true"
          />
        </div>

        <div className="mb-2">
          <label htmlFor="carModel" className="form-label">Car Model</label>
          <input
            id="carModel"
            name="carModel"
            className="form-control"
            placeholder="e.g. Corolla"
            value={carModel}
            onChange={e => setCarModel(e.target.value)}
            required
            aria-required="true"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="year" className="form-label">Year</label>
          <input
            id="year"
            name="year"
            className="form-control"
            type="number"
            placeholder="YYYY"
            value={year}
            onChange={e => setYear(e.target.value)}
            required
            aria-required="true"
            min={1886}
            max={currentYear + 1}
          />
        </div>

        <button
          type="submit"
          className="btn btn-warning"
          disabled={loading === true}
          aria-busy={loading === true}
        >
          {loading === true ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default CarRequestForm;
