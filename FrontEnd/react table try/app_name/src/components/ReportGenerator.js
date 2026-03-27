// ReportGenerator.js
import React, { useEffect, useState } from 'react';
import { API_URLS } from '../config/api';
import { format } from 'date-fns';

export default function MilkCollectionReport() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({
    fromDate: '',
    toDate: '',
    userId: '',
  });

  const fetchReport = () => {
    const query = new URLSearchParams({
      fromDate: filter.fromDate,
      toDate: filter.toDate,
      userId: filter.userId,
    });

    fetch(`${API_URLS.getMilkCollectionReport}?${query}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="report-container">
      <h2>Milk Collection Report</h2>

      <div className="filters">
        <label>From:</label>
        <input type="date" name="fromDate" value={filter.fromDate} onChange={handleChange} />

        <label>To:</label>
        <input type="date" name="toDate" value={filter.toDate} onChange={handleChange} />

        <label>User ID:</label>
        <input type="text" name="userId" value={filter.userId} onChange={handleChange} />

        <button onClick={fetchReport}>Generate Report</button>
      </div>

      <table className="report-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>User</th>
            <th>Shift</th>
            <th>Fat</th>
            <th>SNF</th>
            <th>Rate</th>
            <th>Quantity</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, i) => (
            <tr key={i}>
              <td>{format(new Date(entry.collectionDate), 'yyyy-MM-dd')}</td>
              <td>{entry.username}</td>
              <td>{entry.shift}</td>
              <td>{entry.fat}</td>
              <td>{entry.snf}</td>
              <td>{entry.rate}</td>
              <td>{entry.quantity}</td>
              <td>{entry.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
