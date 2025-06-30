"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import axios from "axios";
import Navbar from "@/components/Navbar";
import EcommerceFooter from "@/components/EcommerceFooter";

import { ShoppingCart, Plus, Minus, Trash2, Star, Package, CreditCard, ArrowRight, XCircle } from 'lucide-react'

const CartPage = () => {
    const router = useRouter()
    const { user, token } = useUser()
    const [cartItems, setCartItems] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [selectedProductId, setSelectedProductId] = useState(null)
    const [selectedCartQuantity,setselectedCartQuantity]=useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
   
    const [updatingItems, setUpdatingItems] = useState({})

    const fetchCartWithProducts = async () => {
        try {
            setLoading(true)
            setError(null)

            if (!user?.id || !token) {
                router.push('/login')
                return
            }

            const cartResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/cart/get-all-cart/${user.id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (cartResponse.status === 200) {
                const cartData = cartResponse.data.cartitems || []
                console.log('cartitems',cartData)
                
                const cartWithProducts = await Promise.all(
                    cartData.map(async (cartItem) => {
                        try {
                            const productResponse = await axios.get(
                                `${process.env.NEXT_PUBLIC_API_URL}/api/product/product-by-id?id=${cartItem.product_id}`,
                                {
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${token}`
                                    }
                                }
                            )
                            
                            if (productResponse.status === 200) {
                                const product = productResponse.data.data || productResponse.data
                                return {
                                    ...cartItem,
                                    product: {
                                        title: product.title,
                                        image_url: product.image_url,
                                        category: product.category,
                                        price: product.price,
                                        brand: product.brand,
                                        stock_quantity: product.stock_quantity,
                                        rating: product.rating,
                                        discount_percentage: product.discount_percentage,
                                        description:product.description,
                                        stock_quantity:product.stock_quantity
                                    }
                                }
                            }
                        } catch (err) {
                            console.error(`Error fetching product ${cartItem.product_id}:`, err)
                            return {
                                ...cartItem,
                                product: {
                                    title: "Product not found",
                                    image_url: "",
                                    category: "Unknown",
                                    price: 0,
                                    brand: "",
                                    stock_quantity: 0,
                                    rating: 0,
                                    discount_percentage: 0
                                }
                            }
                        }
                        return cartItem
                    })
                )

                setCartItems(cartWithProducts)
            }
        } catch (err) {
            console.error("Error fetching cart:", err)
            setError("Failed to load cart items. Please try again.")
            if (err.response?.status === 401) {
                router.push('/login')
            }
        } finally {
            setLoading(false)
        }
    }
    const selectProductForPurchase = (cartItemId) => {
        const selectedItem = cartItems.find(item => item.id === cartItemId)
        if (selectedItem) {
            setSelectedProduct(selectedItem.product)
            setSelectedProductId(selectedItem.product_id)
        }

      
    }
 
    const buyProduct = async (productid) => {
        try {
            setLoading(true);
            
            await selectProductForPurchase(productid);

            const orderData = {
                user_id: user.id, 
                customer_email: "aown02322@gmail.com",
                product_name: selectedProduct.title,
                product_image: selectedProduct.image_url,
                product_description: selectedProduct.description,
                product_id: selectedProductId,
                total_price: parseFloat(selectedProduct.price),
                status: "pending",
                quantity: selectedCartQuantity,
                shipping_address: "123 Main St, City, Country",
                payment_method: "credit_card"
            };

            console.log("Sending order data:", orderData);

            const orderResponse = await axios.post(
                `http://localhost:3001/api/order/create-order`,
                orderData,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Order response:", orderResponse);

            if (orderResponse.status === 201 && orderResponse.data.url) {
                console.log("Order created successfully:", orderResponse.data);
                window.location.href = orderResponse.data.url;
            } else {
                console.error("Unexpected response:", orderResponse);
                alert("Failed to create order. Please try again.");
            }
            
        } catch (error) {
            console.error("Error buying product:", error);
            
            if (error.response) {
                console.error("Server error:", error.response.data);
                alert(`Order failed: ${error.response.data.message || 'Server error'}`);
            } else if (error.request) {
                console.error("Network error:", error.request);
                alert("Network error. Please check your connection.");
            } else {
                console.error("Error:", error.message);
                alert("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return

        setUpdatingItems(prev => ({ ...prev, [itemId]: true }))
        
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/cart/update-quantity`,
                {
                    cart_id: itemId,
                    quantity: newQuantity
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (response.status === 200) {
                setCartItems(prev => 
                    prev.map(item => 
                        item.id === itemId ? { ...item, quantity: newQuantity } : item
                    )
                )
               setselectedCartQuantity(newQuantity)
            }
        } catch (err) {
            console.error("Error updating quantity:", err)
        } finally {
            setUpdatingItems(prev => ({ ...prev, [itemId]: false }))
        }
    }

    const removeFromCart = async (itemId) => {
        setUpdatingItems(prev => ({ ...prev, [itemId]: true }))
        
        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/cart/remove-item/${itemId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (response.status === 200) {
                setCartItems(prev => prev.filter(item => item.id !== itemId))
            }
        } catch (err) {
            console.error("Error removing item:", err)
        } finally {
            setUpdatingItems(prev => ({ ...prev, [itemId]: false }))
        }
    }

    useEffect(() => {
        fetchCartWithProducts()
    }, [user, token])

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price)
    }

    const calculateDiscountedPrice = (price, discountPercentage) => {
        if (!discountPercentage) return price
        return price - (price * discountPercentage / 100)
    }

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            const discountedPrice = calculateDiscountedPrice(item.product.price, item.product.discount_percentage)
            return total + (discountedPrice * item.quantity)
        }, 0)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your cart...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-800 text-lg mb-2">Oops! Something went wrong</p>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={fetchCartWithProducts}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <>
        <Navbar/>
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
               
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
                    <p className="text-gray-600">Review your items and proceed to checkout</p>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                        <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                        <p className="text-gray-600 mb-6">Add some products to get started!</p>
                        <button 
                            onClick={() => router.push('/products')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Cart Items ({cartItems.length})
                                    </h2>
                                </div>
                                
                                <div className="divide-y divide-gray-200">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="p-6">
                                            <div className="flex items-start space-x-4">
                                               
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={item.product?.image_url || '/api/placeholder/100/100'}
                                                        alt={item.product?.title || 'Product'}
                                                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                                        onError={(e) => {
                                                            e.target.src = '/api/placeholder/100/100'
                                                        }}
                                                    />
                                                </div>

                                               
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between">
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                                                {item.product?.title || 'Unknown Product'}
                                                            </h3>
                                                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                                                <span>Brand: {item.product?.brand || 'N/A'}</span>
                                                                <span>Category: {item.product?.category || 'N/A'}</span>
                                                            </div>
                                                            
                                                            
                                                            {item.product?.rating > 0 && (
                                                                <div className="flex items-center mb-2">
                                                                    <div className="flex items-center">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <Star
                                                                                key={i}
                                                                                className={`w-4 h-4 ${
                                                                                    i < Math.floor(item.product.rating)
                                                                                        ? 'text-yellow-400 fill-current'
                                                                                        : 'text-gray-300'
                                                                                }`}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                    <span className="ml-2 text-sm text-gray-600">
                                                                        {item.product.rating}
                                                                    </span>
                                                                </div>
                                                            )}

                                                          
                                                            <div className="flex items-center space-x-2">
                                                                {item.product?.discount_percentage > 0 ? (
                                                                    <>
                                                                        <span className="text-lg font-bold text-green-600">
                                                                            {formatPrice(calculateDiscountedPrice(item.product.price, item.product.discount_percentage))}
                                                                        </span>
                                                                        <span className="text-sm text-gray-500 line-through">
                                                                            {formatPrice(item.product.price)}
                                                                        </span>
                                                                        <span className="text-sm text-green-600 font-medium">
                                                                            {item.product.discount_percentage}% off
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-lg font-bold text-gray-900">
                                                                        {formatPrice(item.product?.price || 0)}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            
                                                            <div className="mt-2">
                                                                {item.product?.stock_quantity > 0 ? (
                                                                    <span className="text-sm text-green-600">
                                                                        In Stock ({item.product.stock_quantity} available)
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-sm text-red-600">Out of Stock</span>
                                                                )}
                                                            </div>

                                                          
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Added on {formatDate(item.added_at)}
                                                            </p>

                                                            
                                                        </div>

                                                       
                                                        <div className="flex flex-col items-end space-y-2">
                                                         
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                    disabled={item.quantity <= 1 || updatingItems[item.id]}
                                                                    className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    <Minus className="w-4 h-4" />
                                                                </button>
                                                                <span className="w-12 text-center font-medium">
                                                                    {updatingItems[item.id] ? '...' : item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    disabled={updatingItems[item.id] || item.quantity >= item.product?.stock_quantity}
                                                                    className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    <Plus className="w-4 h-4" />
                                                                </button>
                                                            </div>

                                                            <button
                                                                onClick={() => removeFromCart(item.id)}
                                                                disabled={updatingItems[item.id]}
                                                                className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                <span>Remove</span>
                                                            </button>
                                                            <button  
                                                            onClick={() => {buyProduct(item.id),setselectedCartQuantity(item.quantity)}}
                                                            className="flex-1 mt-16 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors duration-200">
                                                              Buy Now
                                                            </button> 
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                       
                        <div className="lg:col-span-4 mt-8 lg:mt-0">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                                
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                        <span>{formatPrice(calculateSubtotal())}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Tax</span>
                                        <span>Calculated at checkout</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex justify-between font-medium text-lg">
                                            <span>Total</span>
                                            <span>{formatPrice(calculateSubtotal())}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => router.push('/checkout')}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                                >
                                    <CreditCard className="w-5 h-5" />
                                    <span>Proceed to Checkout</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>

                                <button
                                    onClick={() => router.push('/products')}
                                    className="w-full mt-3 bg-gray-100 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        <EcommerceFooter/>
        </>
    )
}

export default CartPage