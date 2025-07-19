import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Pie, Bar, Line } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import 'react-toastify/dist/ReactToastify.css';
import '../styles/Dashboard.css';

function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showStarred, setShowStarred] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalImage, setModalImage] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const scrollRef = useRef(null);
  const token = localStorage.getItem('adminToken') || '';

  // ✅ Play notification sound function
  const playNotificationSound = () => {
    const audio = new Audio('/notify.mp3');
    audio.play().catch(err => {
      console.error('Audio play error:', err);
    });
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/lost-items');
      setItems(res.data);
    } catch (err) {
      console.error('Error loading items:', err);
      toast.error('Failed to load items');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [items]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/lost-items/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Status updated!');
      playNotificationSound();
      fetchItems();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleStar = async (id, current) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/lost-items/${id}`,
        { starred: !current },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(!current ? '⭐ Starred!' : '☆ Unstarred!');
      playNotificationSound();
      fetchItems();
    } catch {
      toast.error('Failed to update star');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:5000/api/lost-items/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Item deleted!');
        playNotificationSound();
        fetchItems();
      } catch {
        toast.error('Failed to delete item');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/';
  };

  const filteredItems = items
    .filter(item =>
      !searchText ||
      item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter(item => (statusFilter === 'All' ? true : item.status === statusFilter))
    .filter(item => (showStarred ? item.starred : true));

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Lost Items Report', 14, 15);

    const tableData = filteredItems.map((item, index) => [
      index + 1,
      item.name,
      item.description,
      item.status,
      item.starred ? '⭐' : '☆',
      new Date(item.createdAt).toLocaleString()
    ]);

    autoTable(doc, {
      head: [['#', 'Name', 'Description', 'Status', 'Starred', 'Created At']],
      body: tableData
    });

    doc.save('lost_items_report.pdf');
  };

  const statusCounts = filteredItems.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(statusCounts),
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384']
    }]
  };

  const barData = {
    labels: filteredItems.map(i => new Date(i.createdAt).toLocaleDateString()),
    datasets: [{
      label: 'Items per Day',
      data: filteredItems.map(() => 1),
      backgroundColor: '#36A2EB'
    }]
  };

  const lineData = {
    labels: filteredItems.map(i => new Date(i.createdAt).toLocaleDateString()),
    datasets: [{
      label: 'Created Over Time',
      data: filteredItems.map((_, idx) => idx + 1),
      borderColor: '#FF6384',
      fill: false
    }]
  };

  return (
    <div className="dashboard-container">

      <div className="dashboard-header">
        <h2>📋 Admin Dashboard</h2>
        <div className="dashboard-actions">
          <button onClick={() => window.location.href = '/forgot-password'}>🔐 Change Password</button>
          <button onClick={handleLogout}>🔙 Logout</button>
          <button onClick={() => setItems([])}>🗑️ Clear All Complaints</button>
          <button onClick={handleDownloadPDF}>📥 Download PDF</button>
        </div>
        <input
          type="text"
          placeholder="🔎 Search text..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div className="filters">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Resolved">Resolved</option>
          </select>
          <label>
            <input
              type="checkbox"
              checked={showStarred}
              onChange={() => setShowStarred(!showStarred)}
            />
            ⭐ Show only
          </label>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <Pie data={pieData} options={{ maintainAspectRatio: false }} />
        </div>
        <div className="chart-card">
          <Bar data={barData} options={{ maintainAspectRatio: false }} />
        </div>
        <div className="chart-card">
          <Line data={lineData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

      <div className="items-scroll-area" ref={scrollRef}>
        {filteredItems.length === 0 ? (
          <div className="no-items-card">
            No lost items found. Add some to get started!
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="item-card-horizontal">
              <div className="item-left">
                {item.image ? (
                  <img
                    src={`http://localhost:5000${item.image}`}
                    alt="Lost"
                    className="item-image-horizontal"
                    onClick={() => setModalImage(item.image)}
                  />
                ) : (
                  <div className="item-image-placeholder">No Image</div>
                )}
                <div className="item-date">{new Date(item.createdAt).toLocaleString()}</div>
              </div>

              <div className="item-middle">
                <div className="item-name">{item.name}</div>
                <div className="item-description">{item.description || 'No description provided.'}</div>
                <div className="item-actions-row">
                  <button
                    className="view-button"
                    onClick={() => setViewItem(item)}
                  >
                    📎 View Details
                  </button>
                  <div className="status-selector">
                    Status:
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    >
                      <option value="Open">Open</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="item-right">
                <button
                  className="delete-button"
                  onClick={() => handleDelete(item.id)}
                >
                  🗑️
                </button>
                <button
                  className={item.starred ? 'star-button starred' : 'star-button'}
                  onClick={() => handleStar(item.id, item.starred)}
                >
                  {item.starred ? '⭐' : '☆'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {modalImage && (
        <div className="modal" onClick={() => setModalImage(null)}>
          <img src={`http://localhost:5000${modalImage}`} alt="Full View" />
        </div>
      )}

      {viewItem && (
        <div className="modal" onClick={() => setViewItem(null)}>
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <h3>📂 Lost Item Details</h3>
            <p><strong>Item Name:</strong> {viewItem.name}</p>
            <p><strong>Description:</strong> {viewItem.description}</p>
            <hr/>
            <p><strong>Student Name:</strong> {viewItem.name}</p>
            <p><strong>Phone Number:</strong> {viewItem.phone}</p>
            <p><strong>College Email ID:</strong> {viewItem.email}</p>
            {viewItem.image && (
              <img
                src={`http://localhost:5000${viewItem.image}`}
                alt="Lost Item"
                className="details-modal-image"
              />
            )}
            <button onClick={() => setViewItem(null)}>❌ Close</button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default AdminDashboard;
