// ReportGenerator.js
import React, { useState } from 'react';
import { API_URLS } from '../config/api';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

export default function MilkCollectionReport() {
  const { t } = useTranslation();
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
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="report-container">
      <h2>{t('milkCollectionReport', 'Milk Collection Report')}</h2>

      <div className="filters">
        <label>{t('fromDate', 'From Date')}:</label>
        <input type="date" name="fromDate" value={filter.fromDate} onChange={handleChange} />

        <label>{t('toDate', 'To Date')}:</label>
        <input type="date" name="toDate" value={filter.toDate} onChange={handleChange} />

        <label>{t('userId', 'Supplier ID')}:</label>
        <input type="text" name="userId" value={filter.userId} onChange={handleChange} />

        <button onClick={fetchReport}>{t('generateReport', 'Generate Report')}</button>
      </div>

      <table className="report-table">
        <thead>
          <tr>
            <th>{t('date', 'Date')}</th>
            <th>{t('supplierName', 'Supplier Name')}</th>
            <th>{t('time', 'Shift')}</th>
            <th>{t('fat', 'Fat')}</th>
            <th>{t('snf', 'SNF')}</th>
            <th>{t('rate', 'Rate')}</th>
            <th>{t('liters', 'Liters')}</th>
            <th>Amount</th>
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
