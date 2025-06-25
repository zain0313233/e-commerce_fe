"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ShoppingBag, ArrowRight } from "lucide-react";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import AlertBox from "../utils/AlertBox";
import { resolve } from "styled-jsx/css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const { login } = useUser();
  const router = useRouter();
  const validator = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const delay=({timeperiod})=>{
    return new Promise ((resolve,reject)=>{
      setTimeout(() => {
        resolve();
      }, timeperiod);
    })

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validator()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const loginresponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`,
        formData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (loginresponse.status === 200) {
        const { user, access_token } = loginresponse.data;
        login(user, access_token);
        setAlert({
          success: true,
          error: false,
          msg: "Login successful! Redirecting..."
        });
        delay({timeperiod: 2000});
        router.push('/');
      } else {
        throw new Error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setIsSubmitting(false);
      setAlert({
        success: false,
        error: true,
        msg: error.response?.data?.message || "Login failed. Please try again."
      });
      console.error("Login failed:", error);
    }
  };
  const closeAlert = () => {
    setAlert(null);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center transform transition-all duration-500 hover:scale-105">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="bg-black rounded-lg p-2 transform transition-transform hover:rotate-3">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">StorePro</h1>
          </div>
          <p className="text-gray-600 text-sm">
            Your premium e-commerce destination
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 transform transition-all duration-500 hover:shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600 text-sm">
                Sign in to your account to continue shopping
              </p>
            </div>

            <div className="space-y-5">
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400"
                    placeholder="Enter your email"
                    required
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1 font-medium ">
                      {errors.email}
                    </p>
                  )}
                </div>
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
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 hover:border-gray-400"
                    placeholder="Enter your password"
                    required
                  />
                  {errors.password && (
                    <p className="text-red-600 text-xs mt-1 font-medium">
                      {errors.password}
                    </p>
                  )}
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
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-gray-600 hover:text-black transition-colors duration-200 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 group"
              >
                {isSubmitting ? (
                  <>
                    <span className="sr-only">Signing In...</span>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-600">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
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
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-black hover:underline font-medium transition-colors duration-200"
              >
                Sign up here
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
      {alert && (
        <AlertBox
          success={alert.success}
          error={alert.error}
          msg={alert.msg}
          onClose={closeAlert}
          autoClose={true}
          duration={3000}
        />
      )}
    </div>
  );
}
