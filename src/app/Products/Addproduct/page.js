'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import Navbar from '@/components/Navbar';
import EcommerceFooter from '@/components/EcommerceFooter';
import axios from 'axios';

const AddProduct = () => {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount_percentage: '',
    category: '',
    brand: '',
    stock_quantity: '',
    rating: '',
    tags: '',
    image: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {

      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      

      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setError(''); // Clear any previous errors
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
     
      if (!user?.id) {
        setError('Please login to add products');
        return;
      }

     
      const formDataToSend = new FormData();
      formDataToSend.append('user_id', user.id);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      
    
      if (formData.discount_percentage) {
        formDataToSend.append('discount_percentage', formData.discount_percentage);
      }
      if (formData.category) {
        formDataToSend.append('category', formData.category);
      }
      if (formData.brand) {
        formDataToSend.append('brand', formData.brand);
      }
      if (formData.stock_quantity) {
        formDataToSend.append('stock_quantity', formData.stock_quantity);
      }
      if (formData.rating) {
        formDataToSend.append('rating', formData.rating);
      }
      if (formData.tags) {
        const tagsArray = formData.tags.split(',').map(tag => tag.trim());
        formDataToSend.append('tags', JSON.stringify(tagsArray));
      }
      
     
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      
      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/create-product`, 
        formDataToSend
   
      );

      
      if (response.status === 200 || response.status === 201) {
        setSuccess('Product created successfully!');
     
        setFormData({
          title: '',
          description: '',
          price: '',
          discount_percentage: '',
          category: '',
          brand: '',
          stock_quantity: '',
          rating: '',
          tags: '',
          image: null
        });
       
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        
     
        setTimeout(() => {
          router.push('/Products');
        }, 2000);
      } else {
        setError(response.data?.message || 'Failed to create product');
      }
    } catch (err) {
      console.error('Error creating product:', err);
      
    
      if (err.response) {
     
        setError(err.response.data?.message || `Server error: ${err.response.status}`);
      } else if (err.request) {
        
        setError('Network error: Unable to reach server');
      } else {
      
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
   <>
   <Navbar/>
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Product</h1>
          
         
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
         
          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product title"
                />
              </div>

            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

             
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category"
                />
              </div>

            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter brand"
                />
              </div>

              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Percentage
                </label>
                <input
                  type="number"
                  name="discount_percentage"
                  value={formData.discount_percentage}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  max="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.0"
                />
              </div>

            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"  
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
             
                {formData.image && (
                  <p className="mt-1 text-sm text-gray-600">
                    Selected: {formData.image.name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product description"
              />
            </div>

          
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="tag1, tag2, tag3"
              />
            </div>

           
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Product'}
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/Products')}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <EcommerceFooter/>
   </>
  );
};

export default AddProduct;