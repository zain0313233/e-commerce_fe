'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';

const EditProduct = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [product, setProduct] = useState(null);
  
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

  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        const result = await response.json();
        
        if (response.ok) {
          const productData = result.product;
          setProduct(productData);
          setFormData({
            title: productData.title || '',
            description: productData.description || '',
            price: productData.price || '',
            discount_percentage: productData.discount_percentage || '',
            category: productData.category || '',
            brand: productData.brand || '',
            stock_quantity: productData.stock_quantity || '',
            rating: productData.rating || '',
            tags: productData.tags ? productData.tags.join(', ') : '',
            image: null
          });
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to fetch product');
        console.error('Error:', err);
      } finally {
        setFetchLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

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
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!user?.id) {
        setError('Please login to edit products');
        return;
      }

      if (product.user_id !== user.id) {
        setError('You can only edit your own products');
        return;
      }

      const formDataToSend = new FormData();
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

      const response = await fetch(`/api/products/update/${params.id}`, {
        method: 'PUT',
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Product updated successfully!');
        setTimeout(() => {
          router.push('/Products');
        }, 2000);
      } else {
        setError(result.message || 'Failed to update product');
      }
    } catch (err) {
      setError('An error occurred while updating the product');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/delete/${params.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Product deleted successfully!');
        router.push('/Products');
      } else {
        const result = await response.json();
        setError(result.message || 'Failed to delete product');
      }
    } catch (err) {
      setError('An error occurred while deleting the product');
      console.error('Error:', err);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete Product
            </button>
          </div>
          
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

          {product.image_url && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Image
              </label>
              <img 
                src={product.image_url} 
                alt={product.title}
                className="w-32 h-32 object-cover rounded-lg border"
              />
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
                  New Product Image
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                {loading ? 'Updating...' : 'Update Product'}
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
  );
};

export default EditProduct;