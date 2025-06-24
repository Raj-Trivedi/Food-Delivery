import React from 'react'
import './CartSummary.css'

const CartSummary = ({totalItems}) => {
  return (
   <div className="CartSummary-container">
     <h2>
        Order Summary
      </h2>
      <div className='CartSummary-heading'>
        <p>ITEMS : <span> {totalItems} </span></p>
        <p>price</p>
      </div>

   </div>
  )
}

export default CartSummary