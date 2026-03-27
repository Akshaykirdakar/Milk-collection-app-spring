import React, { useState } from 'react';

export default function ReportSettings({ onSave }) {
  const [reportTitle, setReportTitle] = useState('Milk Collection Report');
  const [showTotal, setShowTotal] = useState(true);
  const [groupBy, setGroupBy] = useState('date');

  const handleSubmit = (e) => {
    e.preventDefault();
    const settings = {
      reportTitle,
      showTotal,
      groupBy,
    };
    onSave(settings);
  };

  return (
    <div className="info-card">
      <h4>Report Settings</h4>
      <form onSubmit={handleSubmit}>
        <label>Report Heading:</label><br />
        <input
          type="text"
          value={reportTitle}
          onChange={(e) => setReportTitle(e.target.value)}
        /><br /><br />

        <label>Group By:</label><br />
        <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
          <option value="date">Date</option>
          <option value="shift">Shift</option>
          <option value="user">User</option>
        </select><br /><br />

        <label>
          <input
            type="checkbox"
            checked={showTotal}
            onChange={(e) => setShowTotal(e.target.checked)}
          /> Show Totals
        </label><br /><br />

        <button type="submit" className="btn btn-primary">Save Settings</button>
      </form>
    </div>
  );
}
