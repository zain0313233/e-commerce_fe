"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { CheckCircle, Package, Home } from "lucide-react";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (sessionId) {
      fetchSessionData(sessionId);
    } else {
      setError("No session ID found");
      setLoading(false);
    }
  }, [searchParams]);

  const fetchSessionData = async (sessionId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/order/session/${sessionId}`
      );

      setSessionData(response.data);
      console.log("Session data:", response.data);
    } catch (error) {
      console.error("Error fetching session data:", error);
      setError("Failed to verify payment");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">
            Verifying your payment...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Verification Failed
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 text-center">
          <CheckCircle size={64} className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-green-100">Thank you for your purchase</p>
        </div>

        {/* Order Details */}
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="mr-2" size={20} />
              Order Details
            </h2>

            {sessionData && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-semibold truncate max-w-full overflow-hidden text-ellipsis">
                        {sessionData.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount Paid</p>
                      <p className="font-semibold">
                        ${(sessionData.amount_total / 100).toFixed(2)}{" "}
                        {sessionData.currency?.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {sessionData.payment_status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Customer Email</p>
                      <p className="font-semibold">
                        {sessionData.customer_email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                {sessionData.line_items && sessionData.line_items.data && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Items Purchased
                    </h3>
                    <div className="space-y-2">
                      {sessionData.line_items.data.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{item.description}</p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold">
                            ${(item.amount_total / 100).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              What's Next?
            </h3>
            <div className="space-y-3 text-gray-600 mb-6">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>You'll receive an email confirmation shortly</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Your order will be processed within 1-2 business days</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>You can track your order status in your account</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => (window.location.href = "/orders")}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-center"
              >
                View My Orders
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <Home className="mr-2" size={18} />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
