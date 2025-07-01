import React, { useContext } from 'react'
import CartItem from '../Component/CartItem/CartItem'
import { StoreContext } from '../Context/StoreContext'
import './Cart.css'
import CartSummary from '../Component/CartItem/CartSummary'
import { FaShoppingCart } from 'react-icons/fa'

const Cart = () => {
  const {cartItems} = useContext(StoreContext)
    const totalItems = Object.values(cartItems).reduce((acc, item) => acc + item, 0);


  
  return (
    <div className='cart-container'>
     {totalItems === 0 ? (
        <div className='empty-cart-msg'>
          <FaShoppingCart size={60} style={{ color: '#ccc', marginBottom: '16px' }} />
          <div style={{ fontSize: '1.3em', color: '#888' }}>Your cart is empty!</div>
        </div>
      ) : (
        <>
          <CartItem totalItems={totalItems}/>
          <CartSummary totalItems={totalItems}/>
        </>
      )}
    </div>
  )
}

export default Cart