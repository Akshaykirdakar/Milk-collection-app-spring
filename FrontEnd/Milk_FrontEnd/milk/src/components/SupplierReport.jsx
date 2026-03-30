import React from 'react';
import './SupplierReport.css';

const SupplierReport = ({ report }) => {
  const totalLiters = report.entries.reduce((sum, e) => sum + e.liters, 0);
  const totalAmount = report.entries.reduce((sum, e) => sum + e.totalAmount, 0);

  return (
    <>
      <div className="report-wrapper">
        <div className="report-container">
          <div className="report-header print-repeat">
            <h2>शिवामृत दूध संकलन केंद्र</h2>
            <p>गिरजणी (भावनगर) ता. माळशिरस, जि. सोलापूर</p>
            <p><strong>दूध बिल</strong></p>
            <p>सप्लायर: {report.supplierName} | युजर ID: {report.userId}</p>
          </div>

          <div className="table-container">
            <table className="report-table">
              <thead className="print-repeat">
                <tr>
                  <th>दिनांक</th>
                  <th>लिटर</th>
                  <th>फॅट</th>
                  <th>CLR</th>
                  <th>SNF</th>
                  <th>रेट</th>
                  <th>रक्कम</th>
                </tr>
              </thead>
              <tbody>
                {report.entries.map((entry, i) => (
                  <tr key={i}>
                    <td>{entry.date}</td>
                    <td>{entry.liters.toFixed(2)}</td>
                    <td>{entry.fat.toFixed(1)}</td>
                    <td>{entry.clr}</td>
                    <td>{entry.snf.toFixed(2)}</td>
                    <td>{entry.rate.toFixed(2)}</td>
                    <td>{entry.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="print-footer">
                <tr>
                  <td><strong>एकूण</strong></td>
                  <td><strong>{totalLiters.toFixed(2)}</strong></td>
                  <td colSpan="4"></td>
                  <td><strong>{totalAmount.toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <div className="report-footer">
        <p>सदर बिल संगणक प्रणालीद्वारे तयार करण्यात आले आहे.</p>
        <p>सर्वसाधारण दर: {(totalAmount / totalLiters).toFixed(2)} ₹/लिटर</p>
      </div>
    </>
  );
};

export default SupplierReport;
