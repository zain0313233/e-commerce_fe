"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import Navbar from "@/components/Navbar";
import EcommerceFooter from "@/components/EcommerceFooter";
import axios from "axios";
import { Package, Calendar, MapPin, CreditCard, Truck, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'

const OrderPage = () => {
    const router = useRouter()
    const { user, token } = useUser()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-500" />
            case 'processing':
                return <AlertCircle className="w-5 h-5 text-blue-500" />
            case 'shipped':
                return <Truck className="w-5 h-5 text-purple-500" />
            case 'delivered':
                return <CheckCircle className="w-5 h-5 text-green-500" />
            case 'cancelled':
                return <XCircle className="w-5 h-5 text-red-500" />
            default:
                return <Clock className="w-5 h-5 text-gray-500" />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'processing':
                return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'shipped':
                return 'bg-purple-100 text-purple-800 border-purple-200'
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const fetchOrdersWithProducts = async () => {
        try {
            setLoading(true)
            setError(null)

            if (!user?.id || !token) {
                router.push('/login')
                return
            }

            
            const ordersResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/order/get-orders/${user.id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (ordersResponse.status === 200) {
                const ordersData = ordersResponse.data.orders || []
                
                
                const ordersWithProducts = await Promise.all(
                    ordersData.map(async (order) => {
                        try {
                            const productResponse = await axios.get(
                                `${process.env.NEXT_PUBLIC_API_URL}/api/product/product-by-id?id=${order.product_id}`,
                                {
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${token}`
                                    }
                                }
                            )
                            
                            if (productResponse.status === 200) {
                                const product = productResponse.data                               
                                return {
                                    ...order,
                                    product: {
                                        title: product.data.title,
                                        image_url:product.data.image_url,
                                        category: product.data.category
                                    }
                                }
                            }
                        } catch (err) {
                            console.error(`Error fetching product ${order.product_id}:`, err)
                            return {
                                ...order,
                                product: {
                                    title: "Product not found",
                                    image_url: "",
                                    category: "Unknown"
                                }
                            }
                        }
                        return order
                    })
                )

                setOrders(ordersWithProducts)
            }
        } catch (err) {
            console.error("Error fetching orders:", err)
            setError("Failed to load orders. Please try again.")
            if (err.response?.status === 401) {
                router.push('/login')
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrdersWithProducts()
    }, [user, token])

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your orders...</p>
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
                        onClick={fetchOrdersWithProducts}
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
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
                    <p className="text-gray-600">Track and manage your order history</p>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                        <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
                        <button 
                            onClick={() => router.push('/products')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                                            <Package className="w-5 h-5 text-gray-500" />
                                            <span className="font-medium text-gray-900">Order #{order.id}</span>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm text-gray-600">
                                                    {formatDate(order.ordered_at)}
                                                </span>
                                            </div>
                                            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                <span className="capitalize">{order.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
                                    
                                        <div className="flex-shrink-0 mb-4 lg:mb-0">
                                            <img
                                                src={order.product?.image_url}
                                                alt={order.product?.title || 'Product'}
                                                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                                onError={(e) => {
                                                    e.target.src = '/api/placeholder/120/120'
                                                }}
                                            />
                                        </div>

                                      
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                                {order.product?.title || 'Unknown Product'}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">
                                                Category: {order.product?.category || 'N/A'}
                                            </p>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Quantity: {order.quantity}
                                            </p>

                                           
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                                <div className="flex items-start space-x-2">
                                                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">Shipping Address</p>
                                                        <p className="text-gray-600">{order.shipping_address}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-2">
                                                    <CreditCard className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">Payment Method</p>
                                                        <p className="text-gray-600 capitalize">
                                                            {order.payment_method.replace('_', ' ')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-2">
                                                    <Package className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">Total Price</p>
                                                        <p className="text-lg font-bold text-green-600">
                                                            {formatPrice(order.total_price)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                
                                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                        <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                                            Order placed on {formatDate(order.ordered_at)}
                                        </div>
                                        <div className="flex space-x-3">
                                            {order.status === 'delivered' && (
                                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                                    Write Review
                                                </button>
                                            )}
                                            {(order.status === 'pending' || order.status === 'processing') && (
                                                <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                                                    Cancel Order
                                                </button>
                                            )}
                                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
        <EcommerceFooter/>
       </>
    )
}

export default OrderPage