import React from "react";

const ReportTable = ({ labels, collections }) => (
  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '11px' }}>
    <thead>
      <tr style={{ backgroundColor: '#f3f4f6' }}>
        <th rowSpan="2" style={{ border: '1px solid black', padding: '4px' }}>{labels.dateColumn}</th>
        <th rowSpan="2" style={{ border: '1px solid black', padding: '4px' }}>{labels.shiftColumn}</th>
        <th colSpan="6" style={{ border: '1px solid black', padding: '4px' }}>{labels.morningLabel}</th>
        <th colSpan="6" style={{ border: '1px solid black', padding: '4px' }}>{labels.eveningLabel}</th>
      </tr>
      <tr style={{ backgroundColor: '#f3f4f6' }}>
        <th>{labels.litreColumn}</th>
        <th>{labels.fatColumn}</th>
        <th>{labels.clrColumn}</th>
        <th>{labels.snfColumn}</th>
        <th>{labels.rateColumn}</th>
        <th>{labels.amountColumn}</th>
        <th>{labels.litreColumn}</th>
        <th>{labels.fatColumn}</th>
        <th>{labels.clrColumn}</th>
        <th>{labels.snfColumn}</th>
        <th>{labels.rateColumn}</th>
        <th>{labels.amountColumn}</th>
      </tr>
    </thead>
    <tbody>
      {collections.map((row, idx) => (
        <tr key={idx}>
          <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{row.date}</td>
          <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{row.shift}</td>
          <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{row.morning.litre || 0}</td>
          <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{row.morning.fat || 0}</td>
          <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{row.morning.clr || 0}</td>
          <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{row.morning.snf || 0}</td>
          <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{row.morning.rate || 0}</td>
          <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{row.morning.amount || 0}</td>
          <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{row.evening.litre || 0}</td>
          <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{row.evening.fat || 0}</td>
          <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{row.evening.clr || 0}</td>
          <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{row.evening.snf || 0}</td>
          <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{row.evening.rate || 0}</td>
          <td style={{ border: '1px solid black', padding: '3px', textAlign: 'center' }}>{row.evening.amount || 0}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ReportTable;
