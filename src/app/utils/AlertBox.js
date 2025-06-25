import React, { useState,useEffect } from 'react'
import { X, CheckCircle, AlertCircle } from "lucide-react"


const AlertBox = ({ success, error, msg, onClose, autoClose = false, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

 useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [autoClose, duration])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      if (onClose) onClose()
    }, 300)
  }

  const isSuccess = success && !error
  const isError = error && !success

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      <div 
        className={`relative bg-white rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className={`h-1 w-full rounded-t-lg ${
          isSuccess ? 'bg-green-500' : isError ? 'bg-red-500' : 'bg-blue-500'
        }`} />
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {isSuccess && (
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              )}
              {isError && (
                <div className="flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
              )}
              <h2 className={`text-lg font-semibold ${
                isSuccess ? 'text-green-800' : isError ? 'text-red-800' : 'text-gray-800'
              }`}>
                {isSuccess ? "Success" : isError ? "Error" : "Alert"}
              </h2>
            </div>
            <button 
              onClick={handleClose}
              className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors duration-150"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
          
          <div className={`text-sm leading-relaxed ${
            isSuccess ? 'text-green-700' : isError ? 'text-red-700' : 'text-gray-700'
          }`}>
            {msg}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleClose}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                isSuccess 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : isError 
                  ? 'bg-red-100 text-red-800 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {isSuccess ? 'Continue' : 'Dismiss'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlertBox;