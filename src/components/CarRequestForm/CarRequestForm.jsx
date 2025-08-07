import React, { useState } from 'react';
import apiClient from '../api/apiClient';

const CarRequestForm = () => {
  const [carType, setCarType] = useState('');
  const [carModel, setCarModel] = useState('');
  const [year, setYear] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await apiClient.post('/car-requests', { carType, carModel, year });
      alert('Request submitted');
      setCarType('');
      setCarModel('');
      setYear('');
    } catch {
      alert('Submission failed');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Request New Car</h3>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Car Type"
          value={carType}
          onChange={e => setCarType(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Car Model"
          value={carModel}
          onChange={e => setCarModel(e.target.value)}
        />
        <input
          className="form-control mb-2"
          type="number"
          placeholder="Year"
          value={year}
          onChange={e => setYear(e.target.value)}
        />
        <button className="btn btn-warning">Submit</button>
      </form>
    </div>
  );
};

export default CarRequestForm;
