import React, { useState, useEffect } from 'react';
import AddFoodForm from './AddFoodForm';
import FoodList from './FoodList';
import OrderList from './OrderList';
import './AdminPanel.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from "../../../../assets/frontend_assets/Project_imgs/Logo.png";
// import Loader from '../../Component/Login/Loader.jsx';
// import logo from '../../../../assets/frontend_assets/img/logos/logo3.png'


const navItems = [
  { label: 'Add Food Items', icon: '📊', key: 'Add Food Items' },
  { label: 'ItemListing', icon: '📝', key: 'itemlisting' },
  { label: 'Order', icon: '💳', key: 'order' },
];

const AdminPanel = () => {
  const [active, setActive] = useState('Add Food Items');
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  const token = localStorage.getItem('token');

  const fetchFoods = async () => {
    setLoading(true);
    try {
      console.log('Fetching foods...');
      const res = await fetch('/api/food/mine', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      console.log('Foods response:', data);
      if (data.success) {
        // Sort foods by creation date (newest first)
        const sortedFoods = data.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        console.log('Sorted foods:', sortedFoods);
        setFoods(sortedFoods);
      }
    } catch (err) {
      console.error('Error fetching foods:', err);
    }
    setLoading(false);
  };

  const fetchSellerProfile = async () => {
    try {
      const res = await fetch('/api/seller/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSeller(data.seller);
      }
    } catch (err) {
      // handle error
    }
  };

  const handleLogout = () => {
    setShowLoader(true);
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      window.location.href = '/seller-signin';
    }, 1000);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'seller') {
      setShowLoader(true);
      setTimeout(() => {
        toast.error('Access denied: Seller login required!', { position: 'top-center', autoClose: 2000 });
        setShowLoader(false);
        window.location.href = '/';
      }, 1000);
      return;
    }
    fetchFoods();
    fetchSellerProfile();
  }, []);

  // Refresh foods when switching to itemlisting tab
  useEffect(() => {
    if (active === 'itemlisting') {
      fetchFoods();
    }
  }, [active]);

  if (showLoader) return <Loader message="loggin out..." />;

  return (
    <div className="adminpanelnew-layout">
      <ToastContainer />
      <aside className="adminpanelnew-sidebar">
        {seller && (
          <div className="seller-profile-card">
            <div className="seller-profile-avatar">{seller.name?.charAt(0)}</div>
            <div className="seller-profile-info">
              <div className="seller-profile-name">{seller.name}</div>
              <div className="seller-profile-email">{seller.email}</div>
              {seller.restaurantName && <div className="seller-profile-restaurant">{seller.restaurantName}</div>}
            </div>
          </div>
        )}
        <div className="adminpanelnew-brand">
          <img src={logo} alt="Zesto Logo" className="adminpanel-logo" />
          <span className="adminpanelnew-brandname">Zesto</span>
        </div>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li
                key={item.key}
                className={active === item.key ? 'active' : ''}
                onClick={() => setActive(item.key)}
              >
                <span className="adminpanelnew-navicon">{item.icon}</span>
                {item.label}
              </li>
            ))}
          </ul>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>
      <main className="adminpanelnew-main">
        {active === 'Add Food Items' && (
          <>
            <h1>Admin Add Food Items</h1>
            <AddFoodForm refreshFoods={fetchFoods} />
            {/* <FoodList foods={foods} loading={loading} refreshFoods={fetchFoods} /> */}
          </>
        )}
        {active === 'itemlisting' && (
          <>
          
            <FoodList foods={foods} loading={loading} refreshFoods={fetchFoods} />
          </>
        )}
        {active === 'order' && (
          <>
            
            <OrderList />
          </>
        )}
      </main>
    </div>
  );
};

export default AdminPanel; 