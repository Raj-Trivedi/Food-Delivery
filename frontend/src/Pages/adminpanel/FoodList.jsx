import React, { useState } from 'react';
import './FoodList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import AddFoodForm from './AddFoodForm.jsx';


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

  const EditFoodForm = ({ food, onSave, onCancel }) => {
    const [form, setForm] = useState({
      name: food.name || '',
      description: food.description || '',
      price: food.price || '',
      offerPrice: food.offerPrice || '',
      category: food.category || '',
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
      const payload = {
        name: form.name,
        description: form.description,
        price: form.price,
        category: form.category,
        offerPrice: form.offerPrice,
      };
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/food/${food._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload),
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
                src={form.image.startsWith('http') ? form.image : `http://localhost:5000/upload/${form.image}`}
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
                          src={food.image && !food.image.startsWith('http') ? `http://localhost:5000/upload/${food.image}` : food.image}
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