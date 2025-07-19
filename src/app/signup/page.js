"use client";
import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ShoppingBag,
  ArrowRight,
  MapPin,
  Phone,
  UserCheck
} from "lucide-react";
const axios = require("axios");
import { useRouter } from "next/navigation";
import { validator } from "@/validations/validator";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    phone: "",
    role: "customer"
  });
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validation = validator(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
        formData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = response.data;

      if (response.status === 201) {
        router.push("/login");
      }
      console.log("Success:", data);
      alert("Account created successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating your account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
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

        <div className="bg-white w-full border border-gray-200 rounded-xl shadow-lg p-8 transform transition-all duration-500 hover:shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Create Account
              </h2>
              <p className="text-gray-600 text-sm">
                Join us and start your shopping journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
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
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
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
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400 ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
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
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400 ${
                      errors.role ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="customer">Customer</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                    <option value="support">Support</option>
                  </select>
                </div>
                {errors.role && (
                  <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                )}
              </div>

              <div className="transform transition-all duration-300 hover:scale-105">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-black" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="transform transition-all duration-300 hover:scale-105">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-black" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400 ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-colors duration-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
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
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400 ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your city"
                    required
                  />
                </div>
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
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
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400 ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your state"
                    required
                  />
                </div>
                {errors.state && (
                  <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                )}
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
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400 ${
                      errors.postal_code ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter postal code"
                    required
                  />
                </div>
                {errors.postal_code && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.postal_code}
                  </p>
                )}
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
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400 ${
                      errors.country ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your country"
                    required
                  />
                </div>
                {errors.country && (
                  <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                )}
              </div>
              <div className="transform transition-all col-span-2 duration-300 hover:scale-105">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1
                </label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-black" />
                  <textarea
                    name="address_line_1"
                    value={formData.address_line_1}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400"
                    placeholder="Street address"
                    required
                    rows="2"
                  />
                </div>
                {errors.address_line_1 && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address_line_1}
                  </p>
                )}
              </div>

              <div className="transform transition-all col-span-2 duration-300 hover:scale-105">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2
                </label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-black" />
                  <textarea
                    name="address_line_2"
                    value={formData.address_line_2}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400"
                    placeholder="Apartment, suite, etc. (optional)"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            <div className="transform transition-all md:col-span-2 col-span-1 duration-300 ">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full  bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </span>
                {!isSubmitting && (
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </button>
            </div>

            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-600">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Google
                </span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
              >
                <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Facebook
                </span>
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-black hover:underline font-medium transition-colors duration-200"
              >
                Sign in here
              </a>
            </div>
          </form>
        </div>

        <div className="text-center text-xs text-gray-500">
          By continuing, you agree to our{" "}
          <a
            href="#"
            className="hover:text-black transition-colors duration-200 hover:underline"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="hover:text-black transition-colors duration-200 hover:underline"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
