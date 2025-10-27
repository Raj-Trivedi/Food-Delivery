import { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [foodList, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [searchItem, setSearchItem] = useState("");
    const [CostAfterShipping, setCostAfterShipping] = useState(0);
    const [shippingCharge, setShippingCharge] = useState(49);
    const [TotalCost, setTotalCost] = useState(0);
    const [liked, setLiked] = useState({});
    const [isExpress, setIsExpress] = useState(false);
    const [address, setAddress] = useState(null);
    const [addressLoading, setAddressLoading] = useState(true);
    const [myorder, setMyorder] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch food list from backend
    useEffect(() => {
        const fetchFoods = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('/api/food/');
                const data = await res.json();
                if (data.success) {
                    // Sort foods by creation date (newest first)
                    const sortedFoods = data.data.sort((a, b) => 
                        new Date(b.createdAt) - new Date(a.createdAt)
                    );
                    setFoodList(sortedFoods);
                } else {
                    setError(data.message || 'Failed to fetch foods');
                }
            } catch (err) {
                setError('Failed to fetch foods');
            } finally {
                setLoading(false);
            }
        };
        fetchFoods();
    }, []);

    // Fetch user-specific data on login/app load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setAddress(null);
            setAddressLoading(false);
            return;
        }
        setAddressLoading(true);
        fetchCart();
        // Fetch address
        fetch('/api/address', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.address) setAddress(data.address);
                else setAddress(null);
            })
            .finally(() => setAddressLoading(false));
        // Fetch orders
        fetch('/api/order/myorder', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                console.log('[useEffect] /api/order/myorder on load:', data);
                if (data.success && data.orders) setMyorder(data.orders);
            });
    }, []);

    // Clear all user data on logout
    const clearUserData = () => {
        setCartItems([]);
        setAddress(null);
        setMyorder([]);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    // Toggle like (frontend only)
    const toggleLike = (id) => {
        setLiked((prev) => ({
            ...prev,
            [id]: prev[id] === 1 ? 0 : 1,
        }));
    };

    // Fetch cart from backend
    const fetchCart = () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        fetch('/api/cart', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success && Array.isArray(data.cart)) {
                    setCartItems(data.cart);
                } else {
                    setCartItems([]);
                }
            });
    };

    // Add to cart
    const addToCart = (foodId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/auth';
            return;
        }
        // Check if the item is already in the cart
        const alreadyInCart = cartItems.some(item => item.food && item.food._id === foodId);
        fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ foodId, quantity: 1 }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.cartItem) {
                    fetchCart();
                    if (!alreadyInCart) {
                        toast.success('Item added to cart', { position: 'top-center', autoClose: 1200, toastId: `add-to-cart-${foodId}` });
                    }
                }
            });
    };

    // Update cart item quantity
    const updateCartItemQuantity = (cartItemId, quantity) => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/auth';
            return;
        }
        fetch('/api/cart/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ cartItemId, quantity }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.cartItem) {
                    fetchCart();
                }
            });
    };

    // Remove from cart
    const removeFromCart = (cartItemId, currentQuantity = 1) => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/auth';
            return;
        }
        if (currentQuantity > 1) {
            updateCartItemQuantity(cartItemId, currentQuantity - 1);
        } else {
            fetch('/api/cart/remove', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ cartItemId }),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        fetchCart();
                    }
                });
        }
    };

    // Calculate total cost when cartItems change
    useEffect(() => {
        let total = 0;
        for (const item of (Array.isArray(cartItems) ? cartItems : [])) {
            if (item.food && typeof item.food.price === 'number') {
                total += item.food.price * item.quantity;
            }
        }
        setTotalCost(total);
    }, [cartItems]);

    // Calculate total cost with shipping charge
    useEffect(() => {
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

    // Place order
    const placeOrder = async (shipping = 0, discount = 0) => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/auth';
            return;
        }
        const items = cartItems.map((item) => ({
            foodId: item.food._id,
            name: item.food.name,
            price: item.food.price,
            quantity: item.quantity,
            image: item.food.image
        }));
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0) + shipping - discount;
        // Compose address string from address object if needed
        let addressString = '';
        if (address) {
            if (typeof address === 'string') addressString = address;
            else addressString = [address.street, address.city, address.state, address.zip, address.country].filter(Boolean).join(', ');
        }
        // Try to get phone from address object or context
        let phone = address && address.phone ? address.phone : '';
        const orderData = { items, total, address: addressString, phone };
        console.log('[placeOrder] Sending orderData:', orderData);
        try {
            const res = await fetch('/api/order/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });
            const result = await res.json();
            console.log('[placeOrder] /api/order/add response:', result);
            if (result.success) {
                await fetch('/api/cart/clear', {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCartItems([]);
                fetch('/api/order/myorder', { headers: { Authorization: `Bearer ${token}` } })
                    .then(res => res.json())
                    .then(data => {
                        console.log('[placeOrder] /api/order/myorder after placing order:', data);
                        if (data.success && data.orders) setMyorder(data.orders);
                        navigate('/myorder');
                    });
            }
        } catch (err) {
            // Optionally handle error
            console.error('[placeOrder] Error:', err);
        }
    };

    // Clear cart
    const clearCart = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/auth';
            return;
        }
        fetch('/api/cart/clear', {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCartItems([]);
                }
            });
    };

    // Set address and save to backend
    const setAddressAndSave = async (addressObj) => {
        setAddress(addressObj);
        setAddressLoading(false);
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            await fetch('/api/address/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(addressObj)
            });
        } catch (err) {
            // Optionally handle error
        }
    };

    const contextValue = {
        food_list: foodList,
        addToCart,
        removeFromCart,
        clearCart,
        cartItems,
        setCartItems,
        toggleLike,
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
        setAddress: setAddressAndSave,
        addressLoading,
        myorder,
        setMyorder,
        placeOrder,
        clearUserData,
        updateCartItemQuantity,
        loading,
        error,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;