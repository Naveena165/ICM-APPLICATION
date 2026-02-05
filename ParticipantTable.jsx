import React, { useState } from 'react';

function ParticipantTable({ data, onPayeeClick }) {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Payee ID</th>
              <th>Display Name</th>
              <th>Employee Code</th>
              <th>Payee Type</th>
              <th>Role</th>
              <th>Business Unit</th>
              <th>Region</th>
              <th>Status</th>
              <th>Eligibility</th>
              <th>Effective Start</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                onMouseEnter={() => setHoveredRow(row.id)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => onPayeeClick(row)}
              >
                <td>{row.payeeId}</td>
                <td className="link">{row.displayName}</td>
                <td>{row.employeeCode}</td>
                <td>{row.payeeType}</td>
                <td>{row.role}</td>
                <td>{row.businessUnit}</td>
                <td>{row.region}</td>
                <td>{row.status}</td>
                <td>{row.eligibility}</td>
                <td>{row.effectiveStart}</td>

                <td>
                  {hoveredRow === row.id && (
                    <button className="action-menu">⋯</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ParticipantTable;

