import React, { useContext } from 'react'
import CartItem from '../Component/CartItem/CartItem'
import { StoreContext } from '../Context/StoreContext'
import './Cart.css'
import CartSummary from '../Component/CartItem/CartSummary'

const Cart = () => {
  const {cartItems} = useContext(StoreContext)
    const totalItems = Object.values(cartItems).reduce((acc, item) => acc + item, 0);


  
  return (
    <div className='cart-container'>
     
      <CartItem totalItems={totalItems}/>
      <CartSummary totalItems={totalItems}/>
        
    </div>
  )
}

export default Cart