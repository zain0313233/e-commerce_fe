"use client";
import React, { useState, useEffect } from 'react';
import { MessageCircle, Users, X } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { useUser } from '@/context/UserContext';
import ChatWindow from './ChatWindow';

const SellerChatDashboard = () => {
  const [chatRequests, setChatRequests] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const { socket, isConnected } = useChat();
  const { user } = useUser();

  useEffect(() => {
    if (socket && user && user.role === 'seller' && isConnected) {
      console.log('Setting up seller chat listeners for user:', user.id);
      
      const handleNewChatRequest = (data) => {
        console.log('Seller received new chat request:', data);
        console.log('Current user ID:', user.id);
        console.log('Data supportUserId:', data.supportUserId);
        
        // Check if this notification is for the current seller
        if (data.supportUserId === user.id) {
          setChatRequests(prev => {
            const exists = prev.find(req => req.customerId === data.customerId);
            if (!exists) {
              const newRequest = {
                customerId: data.customerId,
                roomId: data.roomId,
                timestamp: new Date().toISOString(),
                unread: true
              };
              console.log('✅ Adding new chat request:', newRequest);
              return [...prev, newRequest];
            } else {
              // Update existing request to unread
              console.log('✅ Updating existing chat request to unread');
              return prev.map(req => 
                req.customerId === data.customerId 
                  ? { ...req, unread: true, timestamp: new Date().toISOString() }
                  : req
              );
            }
          });
        } else {
          console.log('❌ Chat request not for this seller - ignoring');
        }
      };

      // Remove any existing listeners first
      socket.off('new_chat_request');
      // Add the listener
      socket.on('new_chat_request', handleNewChatRequest);

      // Clean up listener on unmount or when dependencies change
      return () => {
        console.log('Cleaning up seller chat listeners');
        socket.off('new_chat_request', handleNewChatRequest);
      };
    }
  }, [socket, user, isConnected]); // Added isConnected to dependencies

  const handleChatRequest = (customerId) => {
    console.log('Handling chat request for customer:', customerId);
    if (socket && user && isConnected) {
      socket.emit('join_chat', {
        userId: user.id,
        userType: 'seller',
        supportUserId: customerId
      });
      
      setActiveChat(customerId);
      setChatRequests(prev => 
        prev.map(req => 
          req.customerId === customerId 
            ? { ...req, unread: false }
            : req
        )
      );
    }
  };

  const unreadCount = chatRequests.filter(req => req.unread).length;

  // Debug logging
  useEffect(() => {
    console.log('=== SellerChatDashboard Debug Info ===');
    console.log('User:', user);
    console.log('User ID:', user?.id);
    console.log('User Role:', user?.role);
    console.log('Socket exists:', !!socket);
    console.log('Is Connected:', isConnected);
    console.log('Chat Requests:', chatRequests);
    console.log('Unread Count:', unreadCount);
    console.log('=====================================');
  }, [user, isConnected, chatRequests, socket, unreadCount]);

  // Only show for sellers
  if (!user || user.role !== 'seller') {
    console.log('Not showing dashboard - user role:', user?.role);
    return null;
  }

  return (
    <>
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setShowDashboard(!showDashboard)}
          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <MessageCircle size={24} />
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {showDashboard && (
        <div className="fixed bottom-20 left-4 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Users size={20} />
              <span className="font-semibold">Chat Requests</span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {unreadCount}
                </span>
              )}
            </div>
            <button 
              onClick={() => setShowDashboard(false)}
              className="hover:bg-green-800 p-1 rounded"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Debug info - remove in production */}
            <div className="text-xs text-gray-500 mb-2 p-2 bg-gray-100 rounded">
              Connected: {isConnected ? 'Yes' : 'No'} | 
              User ID: {user?.id} | 
              Requests: {chatRequests.length}
            </div>
            
            {chatRequests.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle size={48} className="mx-auto mb-2 text-gray-300" />
                <p>No chat requests yet</p>
                <p className="text-xs mt-2">
                  {isConnected ? 'Waiting for customers...' : 'Connecting...'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {chatRequests.map((request) => (
                  <div
                    key={request.customerId}
                    onClick={() => handleChatRequest(request.customerId)}
                    className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                      request.unread ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">
                          Customer {request.customerId}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(request.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {request.unread && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeChat && (
        <SellerChatWindow
          customerId={activeChat}
          onClose={() => setActiveChat(null)}
        />
      )}
    </>
  );
};

const SellerChatWindow = ({ customerId, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageCircle size={20} />
          <span className="font-semibold">Customer {customerId}</span>
        </div>
        <button 
          onClick={onClose}
          className="hover:bg-green-800 p-1 rounded"
        >
          <X size={18} />
        </button>
      </div>
      
      {/* Remove the nested ChatWindow structure */}
      <div className="flex-1 p-4">
        <p className="text-center text-gray-500">
          Chat with Customer {customerId}
        </p>
        {/* You can integrate the actual ChatWindow component here */}
      </div>
    </div>
  );
};

export default SellerChatDashboard;