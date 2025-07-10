import React, { useState } from 'react';
import './FoodList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import AddFoodForm from './AddFoodForm.jsx';
import Select from 'react-select';
import { menu_list } from '../../../../assets/frontend_assets/assets';

const categoryOptions = [
  ...menu_list.map(item => ({ value: item.menu_name, label: item.menu_name })),
  { value: 'Others', label: 'Others' }
];


const FoodList = ({ foods, loading, refreshFoods }) => {
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', description: '', category: '' });
  const token = localStorage.getItem('token');

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this food item?')) return;
    await fetch(`/api/food/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    if (refreshFoods) refreshFoods();
  };

  const handleEdit = (food) => {
    setEditId(food._id);
    setEditForm({
      name: food.name,
      price: food.price,
      description: food.description,
      category: food.category
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async (id) => {
    await fetch(`/api/food/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(editForm)
    });
    setEditId(null);
    if (refreshFoods) refreshFoods();
  };

  const handleToggleInStock = async (id) => {
    await fetch(`/api/food/${id}/toggle-instock`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` } });
    if (refreshFoods) refreshFoods();
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('/upload')) {
      return `http://localhost:5000${imagePath}`;
    }
    return imagePath;
  };

  const EditFoodForm = ({ food, onSave, onCancel }) => {
    const [form, setForm] = useState({
      name: food.name || '',
      description: food.description || '',
      price: food.price || '',
      category: food.category || '',
      Dietary: food.Dietary || '',
      image: food.image || null,
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (file) => {
      setForm((prev) => ({ ...prev, image: file }));
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
      if (form.image && form.image instanceof File) {
        data.append('image', form.image);
      }
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/food/${food._id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: data,
        });
        const result = await res.json();
        if (result.success) {
          setStatus('Food item updated successfully!');
          if (onSave) onSave();
        } else {
          setStatus(result.message || 'Failed to update food item.');
        }
      } catch (err) {
        setStatus('Error updating food item.');
      }
    };

    return (
      <form className="add-food-form" onSubmit={handleSubmit} style={{marginBottom:0}}>
        <label>Product Image</label>
        <div className="image-upload-row">
          <div className="image-upload-box">
            {form.image && typeof form.image === 'string' ? (
              <img
                src={getImageUrl(form.image)}
                alt="preview"
                className="image-preview"
                onClick={() => handleImageChange(null)}
              />
            ) : form.image ? (
              <img
                src={URL.createObjectURL(form.image)}
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
          menuPlacement="bottom"
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
          <label>Dietary Option</label>
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
        <div style={{display:'flex',gap:'12px',marginTop:'10px'}}>
          <button type="submit" className="add-btn">Save</button>
          <button type="button" className="add-btn" style={{background:'#e74c3c'}} onClick={onCancel}>Cancel</button>
        </div>
        {status && <p className="status-msg">{status}</p>}
      </form>
    );
  };

  return (
    <div className="food-list">
      <h2>All Product</h2>
      {loading ? <p>Loading...</p> : (
        <table className="food-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Selling Price</th>
              <th>In Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {foods.map(food => (
              <tr key={food._id}>
                {editId === food._id ? (
                  <td colSpan={5} style={{padding:0}}>
                    <div className="edit-food-form-wrapper">
                      <EditFoodForm
                        food={food}
                        onSave={() => { setEditId(null); if (refreshFoods) refreshFoods(); }}
                        onCancel={() => setEditId(null)}
                      />
                    </div>
                  </td>
                ) : (
                  <>
                    <td>
                      <div className="food-product-cell">
                        <img
                          src={getImageUrl(food.image)}
                          alt={food.name}
                          className="food-product-img"
                        />
                        <span className="food-product-name">{food.name}</span>
                      </div>
                    </td>
                    <td><span className="food-category">{food.category}</span></td>
                    <td><span className="food-price">₹{food.price}</span></td>
                    <td>
                      <label className="food-toggle-switch">
                        <input
                          type="checkbox"
                          checked={food.inStock}
                          onChange={() => handleToggleInStock(food._id)}
                        />
                        <span className="food-toggle-slider"></span>
                      </label>
                    </td>
                    <td>
                      <div className="food-actions">
                        <div className="btn-div">
                          <FontAwesomeIcon
                            onClick={() => handleEdit(food)}
                            icon={faPenToSquare}
                            className="edit-btn"
                          />
                          <FontAwesomeIcon
                            onClick={() => handleDelete(food._id)}
                            icon={faTrash}
                            className="delete-btn"
                          />
                        </div>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FoodList; 