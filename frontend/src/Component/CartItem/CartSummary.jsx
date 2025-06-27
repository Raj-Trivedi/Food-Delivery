import React from 'react'
import './CartSummary.css'
import { useState } from 'react';
import { useContext } from 'react';
import coupons from '../../../../assets/frontend_assets/coupons.js';

import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CartSummary = ({ totalItems }) => {
  const [showChangeAddress, setShowChangeAddress] = useState(false);
  const navigate = useNavigate();
  const { TotalCost, CostAfterShipping,
    setCostAfterShipping,
    shippingCharge,
    setShippingCharge,
    isExpress,
    setIsExpress,
    address, setMyorder, cartItems, addToMyOrder, setCartItems

  } = useContext(StoreContext);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [discount, setDiscount] = useState(0);
  // Mock: Assume user is first-time customer
  const isFirstTimeCustomer = true;

  const handleToggleChangeAddress = () => {
    setShowChangeAddress(prev => !prev);
  };

  // Coupon apply handler
  const handleApplyCoupon = () => {
    const code = couponInput.trim();
    const found = coupons.find(c => c.code.toLowerCase() === code.toLowerCase());
    if (!found) {
      setCouponError("Invalid coupon code");
      setAppliedCoupon(null);
      setDiscount(0);
      return;
    }
    if (found.minOrder && TotalCost < found.minOrder) {
      setCouponError(`Minimum order ₹${found.minOrder} required`);
      setAppliedCoupon(null);
      setDiscount(0);
      return;
    }
    if (found.firstTimeOnly && !isFirstTimeCustomer) {
      setCouponError("Only for first-time customers");
      setAppliedCoupon(null);
      setDiscount(0);
      return;
    }
    setAppliedCoupon(found);
    setCouponError("");
    setDiscount(found.discount);
  };

  // ...existing code...
  const handlePlaceOrder = () => {
    if (!address) {
      toast.error('Please add a delivery address before placing your order!', {
        position: 'top-center',
        autoClose: 2500,
      });
      return; // Prevent further execution if no address
    }
    console.log("CartItems:", cartItems);

    // Add items to my order
    Object.keys(cartItems).forEach(itemId => {
      addToMyOrder(itemId);
    });

    // Place order logic here (if any)
    toast.success('Order placed successfully!', {
      position: 'top-center',
      autoClose: 2500,
    });
    setTimeout(() => navigate('/'), 500);
    setCartItems({});
  };
  // ...existing code...


  return (
    <div className="CartSummary-container">
      <h2>
        Order Summary
      </h2>
      <div className='CartSummary-heading'>
        <p>ITEMS : <span> {totalItems} </span></p>
        <p>PRICE : ₹{TotalCost}</p>
      </div>
      <div className="CartSummary-Address">
        <p className="Address-title">DELIVERY ADDRESS</p>

        <div className="Address-box">
          {address ? (
            <span className="Address-placeholder">
              {address.street}, {address.city}, {address.state}
            </span>
          ) : (
            <span className="Address-placeholder">No address found</span>
          )}
          <button className="Address-change" onClick={handleToggleChangeAddress}>
            Change
          </button>
        </div>

        {showChangeAddress && (
          <div className="Change-Address">
            <p onClick={() => navigate("/address")}>  Add address</p>
          </div>
        )}
      </div>


      <div className="CartSummary-Shipping">
        <p>SHIPPING</p>
        <div className="Shipping-box">
          <select
            className="shipping-select"
            value={shippingCharge}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (value === 99.99) {
                setIsExpress(true);
                setShippingCharge(99.99);
              } else {
                setIsExpress(false);
                setShippingCharge(value);
              }
            }}
          >
            <option value={49.99} disabled={TotalCost >= 500}>Standard Delivery - ₹49.99</option>
            <option value={99.99}>Express Delivery (30 - 40 mins) - ₹99.99</option>
            <option value={0} disabled={TotalCost < 500}>Free Delivery (Min order ₹500)</option>
          </select>

        </div>
      </div>
      <div className="CartSummary-CouponCode">
        <p>Discount Coupon</p>
        <div className="Coupon-box">
          <input type="text" className="Coupon-input" placeholder='Enter Coupon code' value={couponInput} onChange={e => setCouponInput(e.target.value)} />
          <button onClick={handleApplyCoupon}>Apply</button>
        </div>
        {couponError && <div style={{ color: 'red', fontSize: '0.9em' }}>{couponError}</div>}
        {appliedCoupon && <div style={{ color: 'green', fontSize: '0.9em' }}>Applied: {appliedCoupon.description}</div>}
      </div>
      <hr className="CartSummary-break-hr" />
      {/* Summary Section */}
      <div className="CartSummary-breakdown">
        <div className="CartSummary-break-row">
          <span className="CartSummary-break-label">Actual Price</span>
          <span className="CartSummary-break-value">₹{TotalCost}</span>
        </div>
        <div className="CartSummary-break-row">
          <span className="CartSummary-break-label">Shipping</span>
          <span className="CartSummary-break-value">₹{shippingCharge}</span>
        </div>
        <div className="CartSummary-break-row">
          <span className="CartSummary-break-label">Discount</span>
          <span className="CartSummary-break-value CartSummary-break-discount">-₹{discount}</span>
        </div>
        <hr className="CartSummary-break-hr" />
        {/* <div className="CartSummary-break-row CartSummary-break-total">
          <span className="CartSummary-break-label">Total Payable</span>
          <span className="CartSummary-break-value">₹{Math.max(CostAfterShipping - discount, 0)}</span>
        </div> */}
      </div>
      <div className="CartSummary-totalCost">
        <div className="totalcost">
          <p>Total cost</p>
          <span className='Subtotal'>₹{Math.max(CostAfterShipping - discount, 0)}</span>
        </div>
        {/* {discount > 0 && (
          <div style={{fontSize:'0.95em', color:'#009688'}}>Discount: -₹{discount}</div>
        )} */}

        <div className="TotalCost-box">

          <button className='Checkout-btn' onClick={() => { handlePlaceOrder() }}>Place Order</button>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default CartSummary