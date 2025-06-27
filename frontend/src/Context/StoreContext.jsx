import { createContext, useEffect, useState } from "react";
import { food_list } from "../../../assets/frontend_assets/assets"
export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const [searchItem, setSearchItem] = useState("");
    const [CostAfterShipping, setCostAfterShipping] = useState(0);
    const [shippingCharge, setShippingCharge] = useState(49);
    const [TotalCost, setTotalCost] = useState(0);
    const [liked, setLiked] = useState({});
    const [isExpress, setIsExpress] = useState(false);
    const [address, setAddress] = useState(null);
    const [myorder, setMyorder] = useState({});


    useEffect(() => {
        console.log(myorder, "myorder")
    }, [myorder])


    const addToCart = (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
    }

    const addToMyOrder = (itemId) => {
        setMyorder((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1,
        }));
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev };
            if (updatedCart[itemId] > 1) {
                updatedCart[itemId] -= 1; setCartItems
            } else {
                delete updatedCart[itemId];
            }
            return updatedCart;
        });
    };

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

    // Calculate total cost with shipping charge
    useEffect(() => {
        // Only auto-set shipping if not express
        if (!isExpress) {
            if (TotalCost < 500) {
                setShippingCharge(49.99);
            } else {
                setShippingCharge(0);
            }
        }
        const totalWithShipping = TotalCost + shippingCharge;
        setCostAfterShipping(totalWithShipping);
    }, [TotalCost, shippingCharge, isExpress]);


    const contextValue = {
        food_list,
        addToCart,
        removeFromCart,
        cartItems,
        setCartItems,
        // toggleLike,
        liked,
        searchItem,
        setSearchItem,
        TotalCost,
        CostAfterShipping,
        setCostAfterShipping,
        shippingCharge,
        setShippingCharge,
        isExpress,
        setIsExpress,
        address,
        setAddress,
        myorder,
        setMyorder,
        addToMyOrder
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;