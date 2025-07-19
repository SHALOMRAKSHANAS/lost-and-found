import React, { useRef } from 'react';
import ChartComponent from '../components/ChartComponent';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './AdminPage.css';

function AdminPage({ lostItems, requests }) {
  const listRef = useRef(null);

  const downloadPDF = () => {
    if (!listRef.current) return;
    html2canvas(listRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
      pdf.save('lost-items-list.pdf');
    });
  };

  return (
    <div className="admin-container">
      <h2>Lost Items</h2>
      <div ref={listRef} className="lost-items-list">
        {lostItems.map((item, index) => (
          <div className="lost-item-card" key={index}>
            <h4>{item.name}</h4>
            <p>{item.description}</p>
            <p>Status: {item.status}</p>
          </div>
        ))}
      </div>
      <button className="pdf-button" onClick={downloadPDF}>Download PDF</button>

      <h2>Requests</h2>
      {requests.map((req, index) => (
        <div className="request-section" key={index}>
          <h3>{req.title}</h3>
          <p>{req.details}</p>
          <ChartComponent items={req.items} />
        </div>
      ))}
    </div>
  );
}

export default AdminPage;
