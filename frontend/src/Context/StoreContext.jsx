import { createContext, useEffect, useState } from "react";
import {food_list} from "../../../assets/frontend_assets/assets"
export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const [searchItem, setSearchItem] = useState("");
    const [CostAfterShipping, setCostAfterShipping] = useState(0);
    const [shippingCharge, setShippingCharge] = useState(49);
    const [TotalCost, setTotalCost] = useState(0);

    const addToCart = (itemId) => {
        if(!cartItems[itemId]) {
            setCartItems((prev) => ({...prev, [itemId]:1 }))
        }
        else{
            setCartItems((prev) => ({...prev,[itemId]:prev[itemId]+1}))
        }
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({...prev, [itemId]: prev[itemId]-1}))
    }

    useEffect(() => {
        console.log(cartItems);
    }, [cartItems])
    
    useEffect(() => {
        let total = 0;
        for (const itemId in cartItems) {
            const quantity = cartItems[itemId];
            const item = food_list.find((item) => item._id === itemId);
            if (item) {
                total += item.price * quantity;
            }
        }
        setTotalCost(total);
    }, [cartItems]);
        // Calculate total cost with shipping charge

    useEffect(() => {
    const finalCost = TotalCost + parseFloat(shippingCharge || 0);
    setCostAfterShipping(finalCost);
    }, [TotalCost, shippingCharge]);


    const contextValue ={
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        searchItem,
        setSearchItem,
        CostAfterShipping, 
        setCostAfterShipping,
        shippingCharge, 
        setShippingCharge,
        TotalCost
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;