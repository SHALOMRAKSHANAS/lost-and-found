import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Page.css';

function ViewLostItemsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('https://api.lokihere.me/api/lost-items').then(res => setItems(res.data));
  }, []);

  return (
    <div className="page-container">
      <h2>🔍 View Lost Items</h2>
      <div className="items-grid">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            {item.image && <img src={`https://api.lokihere.me${item.image}`} alt="Lost Item" className="item-image" />}
            <p><strong>Name:</strong> {item.name}</p>
            <p><strong>Email:</strong> {item.email}</p>
            <p>{item.description}</p>
            <span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewLostItemsPage;
