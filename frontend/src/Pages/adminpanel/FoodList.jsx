import React, { useEffect, useState } from 'react';
import './FoodList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', description: '', category: '' });

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/food/');
      const data = await res.json();
      if (data.success) {
        setFoods(data.data);
      }
    } catch (err) {
      // handle error
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this food item?')) return;
    await fetch(`/api/food/${id}`, { method: 'DELETE' });
    setFoods(foods.filter(f => f._id !== id));
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    });
    setEditId(null);
    fetchFoods();
  };

  const handleToggleInStock = async (id) => {
    await fetch(`/api/food/${id}/toggle-instock`, { method: 'PATCH' });
    setFoods(foods => foods.map(f => f._id === id ? { ...f, inStock: !f.inStock } : f));
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
                <td>
                  <div className="food-product-cell">
                    <img
                      src={food.image && !food.image.startsWith('http') ? `http://localhost:5000/upload/${food.image}` : food.image}
                      alt={food.name}
                      className="food-product-img"
                    />
                    {editId === food._id ? (
                      <input name="name" value={editForm.name} onChange={handleEditChange} className="food-product-name" />
                    ) : (
                      <span className="food-product-name">{food.name}</span>
                    )}
                  </div>
                </td>
                <td>
                  {editId === food._id ? (
                    <input name="category" value={editForm.category} onChange={handleEditChange} className="food-category" />
                  ) : (
                    <span className="food-category">{food.category}</span>
                  )}
                </td>
                <td>
                  {editId === food._id ? (
                    <input name="price" type="number" value={editForm.price} onChange={handleEditChange} className="food-price" />
                  ) : (
                    <span className="food-price">${food.price}</span>
                  )}
                </td>
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
                    {editId === food._id ? (
                      <>
                        <button onClick={() => handleEditSave(food._id)} className="edit-btn">Save</button>
                        <button onClick={() => setEditId(null)} className="edit-btn">Cancel</button>
                      </>
                    ) : (
                      <>
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
                       
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FoodList; 