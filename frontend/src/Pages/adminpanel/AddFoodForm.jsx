import React, { useState } from 'react';
import './AddFoodForm.css';
import Select from 'react-select';
import { menu_list } from '../../../../assets/frontend_assets/assets';

const categoryOptions = [
  ...menu_list.map(item => ({ value: item.menu_name, label: item.menu_name })),
  { value: 'Others', label: 'Others' }
];

const AddFoodForm = ({ refreshFoods }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    Dietary: '',
    images: [null], // keep as array for now for minimal change
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file) => {
    setForm((prev) => ({ ...prev, images: [file] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    const data = new FormData();
    data.append('name', form.name);
    data.append('description', form.description);
    data.append('price', form.price);
    data.append('category', form.category);
    data.append('Dietary', form.Dietary);
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
        setForm({ name: '', description: '', price: '', category: '', Dietary: '', images: [null] });
        if (refreshFoods) refreshFoods();
      } else {
        setStatus(result.message || 'Failed to add food item.');
      }
    } catch (err) {
      setStatus('Error adding food item.');
    }
  };

  const getImageUrl = (image) => {
    if (!image) return '';
    if (typeof image === 'string') {
      if (image.startsWith('/upload')) {
        return `http://localhost:5000${image}`;
      }
      return image;
    }
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return '';
  };

  return (
    <form className="add-food-form" onSubmit={handleSubmit}>
      <label>Product Image</label>
      <div className="image-upload-row">
        <div className="image-upload-box">
          {form.images[0] ? (
            <img
              src={getImageUrl(form.images[0])}
              alt="preview"
              className="image-preview"
              onClick={() => handleImageChange(null)}
            />
          ) : (
            <label className="image-upload-label">
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleImageChange(e.target.files[0])}
              />
              <div className="image-upload-placeholder">Upload</div>
            </label>
          )}
        </div>
      </div>
      <label>Product Name</label>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Type here" required />
      <label>Product Description</label>
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Type here" required />
      <label>Category</label>
      <Select
        options={categoryOptions}
        value={categoryOptions.find(opt => opt.value === form.category) || null}
        onChange={option => setForm(prev => ({ ...prev, category: option.value }))}
        placeholder="Select category"
        menuPlacement="bottom" // This will always try to open downward
        styles={{
          control: (base, state) => ({
            ...base,
            borderRadius: 6,
            borderColor: state.isFocused ? '#5b5bf6' : '#e5e7eb',
            minHeight: 44,
            boxShadow: state.isFocused ? '0 0 0 2px #e5e7ff' : '0 2px 8px rgba(91,91,246,0.04)',
            fontSize: '1rem',
            background: '#f8f9ff'
          }),
          menu: (base) => ({
            ...base,
            borderRadius: 8,
            marginTop: 2,
            zIndex: 9999
          }),
          option: (base, state) => ({
            ...base,
            background: state.isSelected
              ? '#5b5bf6'
              : state.isFocused
              ? '#e5e7ff'
              : '#fff',
            color: state.isSelected ? '#fff' : '#333',
            fontWeight: state.isSelected ? 700 : 400,
            cursor: 'pointer'
          })
        }}
        isSearchable={false}
      />
      <div className="price-row">
        <div>
          <label>Product Price</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} required />
        </div>
      </div>
      <div className="dietary-row">
        <label >Dietary Option</label>
        <div className="dietary-options">
          <label className='dietary-label'>
            <input
              type="radio"
              name="Dietary"
              value="Veg"
              checked={form.Dietary === 'Veg'}
              onChange={handleChange}
              required
            />
            Vegetarian
          </label>
          <label className='dietary-label' style={{ marginLeft: '24px' }}>
            <input
              type="radio"
              name="Dietary"
              value="Non Veg"
              checked={form.Dietary === 'Non Veg'}
              onChange={handleChange}
              required
            />
            Non Vegetarian
          </label>
        </div>
      </div>
      <button type="submit" className="add-btn">ADD</button>
      {status && <p className="status-msg">{status}</p>}
    </form>
  );
};

export default AddFoodForm; 