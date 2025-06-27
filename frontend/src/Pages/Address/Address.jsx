import React, { useContext, useRef } from 'react';
import './Address.css';
// import locationImg from '../../assets/location.png'; 
import locationImg from "../.../../../../../assets/frontend_assets/location.jpg"
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Address = () => {
  const { setAddress } = useContext(StoreContext);
  const navigate = useNavigate();
  const formRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = formRef.current;
    const addressObj = {
      
      street: form[3].value,
      city: form[4].value,
      state: form[5].value,
     
    };
    setAddress(addressObj);
    toast.success('Address added successfully!', {
      position: 'top-center',
      autoClose: 2000,
    });
    setTimeout(() => navigate('/cart'), 1200);
  };

  return (
    <div className="address-container">
      <div className="form-section">
        <h2>
          Add Shipping <span className="highlighter">Address</span>
        </h2>

        <form className="address-form" ref={formRef} onSubmit={handleSubmit}>
          <div className="double-input">
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
          </div>
          <input type="email" placeholder="Email address" />
          <input type="text" placeholder="Street" />
          <div className="double-input">
            <input type="text" placeholder="City" />
            <input type="text" placeholder="State" />
          </div>
          <div className="double-input">
            <input type="text" placeholder="Zip code" />
            <input type="text" placeholder="Country" />
          </div>
          <input type="text" placeholder="Phone" />

          <button type="submit" className="save-btn">Save Address</button>
        </form>
      </div>

      <div className="image-section">
        <img src={locationImg} alt="map-location" />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Address;
