"use client";
import React, { useState, useContext, createContext, useEffect } from "react";
import { io } from "socket.io-client";
import { useUser } from './UserContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const { user, token } = useUser();

  useEffect(() => {
    if (user && token) {
      const newSocket = io('http://localhost:3001');
      
      newSocket.on('connect', () => {
        console.log('Connected to chat server');
        setIsConnected(true);
        
        // Register user immediately after connection
        newSocket.emit('register_user', {
          userId: user.id,
          userType: user.role === 'seller' ? 'seller' : 'customer'
        });
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from chat server');
        setIsConnected(false);
      });

      newSocket.on('new_chat_request', (data) => {
        console.log('Received new chat request:', data);
        // This will be handled by SellerChatDashboard
      });

      newSocket.on('receive_message', (messageData) => {
        setMessages(prev => [...prev, messageData]);
      });

      newSocket.on('user_joined', (data) => {
        console.log('User joined:', data);
      });

      newSocket.on('user_left', (data) => {
        console.log('User left:', data);
      });

      newSocket.on('user_typing', (data) => {
        setIsTyping(data.isTyping);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [user, token]);

  const joinChat = (supportUserId) => {
    if (socket && user) {
      const roomData = {
        userId: user.id,
        userType: user.role === 'seller' ? 'seller' : 'customer',
        supportUserId: supportUserId
      };
      socket.emit('join_chat', roomData);
      setCurrentRoom(`chat_${supportUserId}_${user.id}`);
      setMessages([]);
    }
  };

  const sendMessage = (message) => {
    if (socket && message.trim()) {
      socket.emit('send_message', { message: message.trim() });
    }
  };

  const handleTyping = (typing) => {
    if (socket) {
      socket.emit('typing', { isTyping: typing });
    }
  };

  return (
    <ChatContext.Provider value={{
      socket,
      messages,
      isConnected,
      currentRoom,
      isTyping,
      joinChat,
      sendMessage,
      handleTyping,
      setMessages
    }}>
      {children}
    </ChatContext.Provider>
  );
};