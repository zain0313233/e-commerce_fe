"use client";
import React, { useState, useEffect } from "react";
import {
  Mail,
  User,
  ShoppingBag,
  MapPin,
  Phone,
  UserCheck,
  ShoppingCart,
  ShoppingBasket
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Navbar from "@/components/Navbar";
import EcommerceFooter from "@/components/EcommerceFooter";
import axios from "axios";

const Profile = () => {
    const { user, token } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
   
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "customer",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        address_line_1: "",
        address_line_2: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const fetchProfile = async () => {
        if (!user?.id || !token) return;
        
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile/${user.id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success && response.data.user) {
                const userData = response.data.user;
                setFormData({
                    name: userData.name || "",
                    email: userData.email || "",
                    phone: userData.phone || "",
                    role: userData.role || "customer",
                    city: userData.city || "",
                    state: userData.state || "",
                    postal_code: userData.postal_code || "",
                    country: userData.country || "",
                    address_line_1: userData.address_line_1 || "",
                    address_line_2: userData.address_line_2 || ""
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
           
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.id || !token) return;

        setLoading(true);
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile/${user.id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                
                console.log("Profile updated successfully");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
       
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && token) {
            fetchProfile();
        }
    }, [user, token]);

    if (loading && !formData.name) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <>
        <Navbar/>
        <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8">
            <div className="max-w-4xl w-full space-y-8 px-4">
                <div className="text-center transform transition-all duration-500 hover:scale-105">
                    <div className="flex justify-center items-center space-x-2 mb-4">
                        <div className="bg-black rounded-lg p-2 transform transition-transform hover:rotate-3">
                            <ShoppingBag className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">ShopHub</h1>
                    </div>
                    <p className="text-gray-600 text-sm">
                        Your premium e-commerce destination
                    </p>
                </div>

                <div className="w-full max-w-4xl mx-auto shadow-lg bg-white p-8 md:p-12 rounded-lg">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            My Profile
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Update your profile information if you want.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="transform transition-all duration-300 hover:scale-105">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-black" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="transform transition-all duration-300 hover:scale-105">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-black" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400"
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>
                        </div>

                        <div className="transform transition-all duration-300 hover:scale-105">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <div className="relative group">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-black" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400"
                                    placeholder="Enter your phone number"
                                    required
                                />
                            </div>
                        </div>

                        <div className="transform transition-all duration-300 hover:scale-105">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Role
                            </label>
                            <div className="relative group">
                                <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-black" />
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400 appearance-none"
                                    required
                                >
                                    <option value="customer">Customer</option>
                                    <option value="seller">Seller</option>
                                    <option value="admin">Admin</option>
                                    <option value="moderator">Moderator</option>
                                    <option value="support">Support</option>
                                </select>
                            </div>
                        </div>

                        <div className="transform transition-all duration-300 hover:scale-105">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                City
                            </label>
                            <div className="relative group">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-black" />
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400"
                                    placeholder="Enter your city"
                                    required
                                />
                            </div>
                        </div>

                        <div className="transform transition-all duration-300 hover:scale-105">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                State
                            </label>
                            <div className="relative group">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-black" />
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400"
                                    placeholder="Enter your state"
                                    required
                                />
                            </div>
                        </div>

                        <div className="transform transition-all duration-300 hover:scale-105">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Postal Code
                            </label>
                            <div className="relative group">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-black" />
                                <input
                                    type="text"
                                    name="postal_code"
                                    value={formData.postal_code}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400"
                                    placeholder="Enter postal code"
                                    required
                                />
                            </div>
                        </div>

                        <div className="transform transition-all duration-300 hover:scale-105">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Country
                            </label>
                            <div className="relative group">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-black" />
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400"
                                    placeholder="Enter your country"
                                    required
                                />
                            </div>
                        </div>

                        <div className="transform transition-all duration-300 hover:scale-105 col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address Line 1
                            </label>
                            <div className="relative group">
                                <MapPin className="absolute left-3 top-4 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-black" />
                                <textarea
                                    name="address_line_1"
                                    value={formData.address_line_1}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400 resize-none"
                                    placeholder="Street address"
                                    required
                                    rows="2"
                                />
                            </div>
                        </div>

                        <div className="transform transition-all duration-300 hover:scale-105 col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address Line 2
                            </label>
                            <div className="relative group">
                                <MapPin className="absolute left-3 top-4 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-black" />
                                <textarea
                                    name="address_line_2"
                                    value={formData.address_line_2}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400 resize-none"
                                    placeholder="Apartment, suite, etc. (optional)"
                                    rows="3"
                                />
                            </div>
                        </div>

                        <div className="col-span-1 ">
                            <button
                            onClick={()=>{router.push('/Profile/orders')}}
                                
                                disabled={loading}
                                className="w-full bg-green-500 gap-3 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                            ><ShoppingBasket />
                                MY Orders
                            </button>
                          
                        </div>
                        <div className="col-span-1 ">
                           
                              <button
                                onClick={()=>{router.push('/Profile/cart')}}
                                
                                disabled={loading}
                                className="w-full bg-red-500 text-white gap-3 py-3 px-4 rounded-lg font-medium hover:bg-red-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                            > <ShoppingCart />
                                MY Cart
                            </button>
                        </div>


                        
                        <div className="col-span-1 md:col-span-2">
                            <button
                               onClick={handleSubmit}
                                disabled={loading}
                                className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Updating..." : "Update Profile"}
                            </button>
                        </div>
                    </div>
               </div>
            </div>
        </div>
        <EcommerceFooter/>
        </>
    );
};

export default Profile;