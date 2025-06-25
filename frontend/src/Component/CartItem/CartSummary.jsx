import React from 'react'
import './CartSummary.css'
import { useState } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
const CartSummary = ({totalItems}) => {
   const [showChangeAddress, setShowChangeAddress] = useState(false);
  const navigate = useNavigate();
  const {TotalCost,     CostAfterShipping,
    setCostAfterShipping,
    shippingCharge,
    setShippingCharge,
 } = useContext(StoreContext);

  const handleToggleChangeAddress = () => {
    setShowChangeAddress(prev => !prev);
  };
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
        <span className="Address-placeholder">No address found</span>
        <button className="Address-change" onClick={handleToggleChangeAddress}>
          Change
        </button>
      </div>

      {showChangeAddress && (
        <div className="Change-Address">
        <p onClick={()=>navigate("/address")}>  Add address</p> 
        </div>
      )}
    </div>


      <div className="CartSummary-Shipping">
        <p>SHIPPING</p>
        <div className="Shipping-box">
          <select
            className="shipping-select"
            onChange={(e) => setShippingCharge(parseFloat(e.target.value))}
          >
            <option value="49">Standard Delivery - ₹49.00</option>
            <option value="99.99">Express Delivery (30 mins) - ₹99.99</option>
            <option value="0">Free Delivery (Min order ₹500)</option>
          </select>

        </div>
      </div>
      <div className="CartSummary-CouponCode">
        <p>Discount Coupon</p>
        <div className="Coupon-box">
            <input type="text"  className="Coupon-input" placeholder='Enter Coupon code' />
            <button>Apply</button>
        </div>
      </div>
      <hr />
      <div className="CartSummary-totalCost">
        <div className="totalcost">
            <p>Total cost</p>
            <span className='Subtotal'>₹{CostAfterShipping}</span>
        </div>
       
        <div className="TotalCost-box">
            
            <button className='Checkout-btn'>Place Order</button>
        </div>
      </div>

   </div>
  )
}

export default CartSummary