import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Page.css';

function FileLostItemForm() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    itemDescription: '',
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', form.name);
    data.append('phone', form.phone);
    data.append('email', form.email);
    data.append('itemDescription', form.itemDescription);
    if (image) data.append('image', image);

    await axios.post('http://localhost:5000/api/lost-items', data);
    alert('Lost item filed successfully!');
    setForm({ name: '', phone: '', email: '', itemDescription: '' });
    setImage(null);
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h2>📂 File for Lost Item</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
          <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
          <input name="email" placeholder="College Email ID" value={form.email} onChange={handleChange} required />
          <textarea name="itemDescription" placeholder="Describe the lost item" value={form.itemDescription} onChange={handleChange} required />
          <label className="upload-label">
  {image ? "✔️ Image uploaded!" : "Click here to add Image"}
  <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" hidden />
</label>

          <button type="submit" className="gradient-button">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default FileLostItemForm;
