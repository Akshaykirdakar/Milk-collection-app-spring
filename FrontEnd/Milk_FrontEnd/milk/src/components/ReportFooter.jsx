import React from "react";

const ReportFooter = ({ labels, totals, averageRate, deductions }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '11px', marginTop: '10px' }}>
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        {labels.vetCheckLabel} {labels.insuranceLabel} {labels.electricityLabel} {labels.feedBalanceLabel}
      </div>
      <div>{deductions.doctorFee} {deductions.insurance} {deductions.electricity} {deductions.feed}</div>
    </div>
    <div>
      <div style={{ marginBottom: '4px' }}>{labels.avgRateLabel} {averageRate}</div>
      <div style={{ marginBottom: '4px' }}>{labels.totalAmountLabel} {labels.currencySymbol} {totals.grand.amount}</div>
      <div style={{ marginBottom: '4px' }}>{labels.totalDeductionLabel} {labels.currencySymbol} {deductions.total}</div>
      <div style={{ fontWeight: 'bold' }}>{labels.payableAmountLabel} {labels.currencySymbol} {(parseFloat(totals.grand.amount) - parseFloat(deductions.total)).toFixed(2)}</div>
    </div>
  </div>
);

export default ReportFooter;
