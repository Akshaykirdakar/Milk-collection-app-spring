import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URLS } from '../config/api';
import SupplierReport from './SupplierReport';

const MilkReport = ({ fromDate, toDate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!fromDate || !toDate) return;

    setLoading(true);
    axios
      .get(API_URLS.getMilkCollectionsDateWise, {
        params: { fromDate, toDate },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error('API call error:', err))
      .finally(() => setLoading(false));
  }, [fromDate, toDate]);

  if (loading) return <div>Loading...</div>;
  if (!data || data.length === 0) return <div>डेटा उपलब्ध नाही.</div>;

  return (
    <div className="milk-report-wrapper" style={{ width: '100%' }}>
      {data.map((report, idx) => (
        <div 
          className="report-container" 
          key={idx} 
          style={{ 
            width: '100%',
            pageBreakAfter: 'always' 
          }}
        >
          <SupplierReport report={report} fromDate={fromDate} toDate={toDate} />
        </div>
      ))}
    </div>
  );
};

export default MilkReport;
