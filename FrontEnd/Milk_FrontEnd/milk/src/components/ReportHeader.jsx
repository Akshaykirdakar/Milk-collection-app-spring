import React from "react";

const ReportHeader = ({ labels, memberName, memberCode, accountNo, billNo, printDate, fromDate, toDate }) => (
  <div style={{ marginBottom: '10px' }}>
    <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
      {labels.centerName}
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
      <div>{labels.mobileLabel} {labels.contactNumbers}</div>
      <div style={{ backgroundColor: 'black', color: 'white', padding: '4px 16px', fontWeight: 'bold' }}>
        {labels.reportTitle}
      </div>
      <div>
        <div>{labels.billNoLabel} {billNo}</div>
        <div>{labels.dateLabel} {printDate}</div>
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
      <div>{labels.datePeriodLabel} {fromDate} {labels.toLabel} {toDate}</div>
      <div>{labels.bankAccountLabel} {accountNo}</div>
    </div>
    <div style={{ display: 'flex', fontSize: '12px', marginTop: '4px' }}>
      <div style={{ flex: 1 }}>{labels.codeLabel} {memberCode}</div>
      <div style={{ flex: 1 }}>{labels.nameLabel} {memberName}</div>
    </div>
  </div>
);

export default ReportHeader;
