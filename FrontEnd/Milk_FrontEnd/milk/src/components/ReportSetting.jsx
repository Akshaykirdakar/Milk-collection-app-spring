import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ReportSettings({ onSave }) {
  const { t } = useTranslation();
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
      <h4>{t('reportSetting')}</h4>
      <form onSubmit={handleSubmit}>
        <label>{t('reportHeading')}:</label><br />
        <input
          type="text"
          value={reportTitle}
          onChange={(e) => setReportTitle(e.target.value)}
        /><br /><br />

        <label>{t('groupBy')}:</label><br />
        <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
          <option value="date">{t('date')}</option>
          <option value="shift">{t('shift')}</option>
          <option value="user">{t('users')}</option>
        </select><br /><br />

        <label>
          <input
            type="checkbox"
            checked={showTotal}
            onChange={(e) => setShowTotal(e.target.checked)}
          /> {t('showTotals')}
        </label><br /><br />

        <button type="submit" className="btn btn-primary">{t('saveSettings')}</button>
      </form>
    </div>
  );
}
