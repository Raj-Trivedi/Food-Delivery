import React, { useState } from 'react';
import './AddFoodForm.css';

const AddFoodForm = ({ refreshFoods }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    offerPrice: '',
    category: '',
    images: [null, null, null, null],
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (idx, file) => {
    setForm((prev) => {
      const newImages = [...prev.images];
      newImages[idx] = file;
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    const data = new FormData();
    data.append('name', form.name);
    data.append('description', form.description);
    data.append('price', form.price);
    data.append('category', form.category);
    // Only send the first image to backend for now
    if (form.images[0]) data.append('image', form.images[0]);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/food/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        setStatus('Food item added successfully!');
        setForm({ name: '', description: '', price: '', offerPrice: '', category: '', images: [null, null, null, null] });
        if (refreshFoods) refreshFoods();
      } else {
        setStatus(result.message || 'Failed to add food item.');
      }
    } catch (err) {
      setStatus('Error adding food item.');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('/upload')) {
      return `http://localhost:5000${imagePath}`;
    }
    return imagePath;
  };

  return (
    <form className="add-food-form" onSubmit={handleSubmit}>
      <label>Product Image</label>
      <div className="image-upload-row">
        {[0, 1, 2, 3].map((idx) => (
          <div className="image-upload-box" key={idx}>
            {form.images[idx] ? (
              <img
                src={getImageUrl(form.images[idx])}
                alt="preview"
                className="image-preview"
                onClick={() => handleImageChange(idx, null)}
              />
            ) : (
              <label className="image-upload-label">
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleImageChange(idx, e.target.files[0])}
                />
                <div className="image-upload-placeholder">Upload</div>
              </label>
            )}
          </div>
        ))}
      </div>
      <label>Product Name</label>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Type here" required />
      <label>Product Description</label>
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Type here" required />
      <label>Category</label>
      <input name="category" value={form.category} onChange={handleChange} placeholder="Type category here" required />
      <div className="price-row">
        <div>
          <label>Product Price</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} required />
        </div>
        <div>
          <label>Offer Price</label>
          <input name="offerPrice" type="number" value={form.offerPrice} onChange={handleChange} />
        </div>
      </div>
      <button type="submit" className="add-btn">ADD</button>
      {status && <p className="status-msg">{status}</p>}
    </form>
  );
};

export default AddFoodForm; 