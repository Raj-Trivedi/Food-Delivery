import React from 'react'
import { StoreContext } from '../../Context/StoreContext'
import { useContext } from 'react'
import './Myorder.css'

const Myorder = () => {
    const { myorder,food_list,cartItems } = useContext(StoreContext);
    console.log(myorder);

  return (
    <div className="order-container">
       <h3> Order Details </h3> 
        <div className="order-header">
            <p className='order-id'>Order Item</p>
            {/* <p className='order-date'>Order Id</p> */}
            <p>Order Name</p>
            <p>Quantity Orderd</p>
            <p className='order-status'>Price</p>
            <p className='order-total'>Total Price</p>
        </div>
        <hr />

       <div className="Order-List">
        {food_list.map((item, index) => {
            if (myorder[item._id] > 0) {
                return (
                    <div key={index} className='order-item'>
                        <div className="orderItem-Img">
                            <img src={item.image} alt="" />
                        </div>
                        <div className="orderItem-desc">
                            {/* <p className='order-id'>{item._id}</p> */}
                            <p>{item.name}</p>
                            <p className='order-quantity'>{myorder[item._id].quantity}</p>
                            <p className='order-total'>${item.price}</p>
                            <p>₹{(item.price * cartItems[item._id]).toFixed(2)}</p>

                        </div>

                      
                    </div>
                )
            }
            return null;
        })}
       </div>
    </div>
  )
}

export default Myorder