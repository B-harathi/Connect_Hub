import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useChat } from './ChatContext';
import { useSocket } from './SocketContext';
import { formatMessageTime } from '../utils/helpers';
import { MESSAGE_TYPES } from '../utils/constants';

// Initial state
const initialState = {
  notifications: [],
  unreadMessages: [],
  loading: false,
  error: null,
};

// Action types
const NOTIFICATION_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  SET_UNREAD_MESSAGES: 'SET_UNREAD_MESSAGES',
  MARK_MESSAGE_READ: 'MARK_MESSAGE_READ',
  MARK_CHAT_READ: 'MARK_CHAT_READ',
};

// Reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: null,
      };

    case NOTIFICATION_ACTIONS.SET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 50), // Keep only last 50
      };

    case NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };

    case NOTIFICATION_ACTIONS.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };

    case NOTIFICATION_ACTIONS.SET_UNREAD_MESSAGES:
      return {
        ...state,
        unreadMessages: action.payload,
      };

    case NOTIFICATION_ACTIONS.MARK_MESSAGE_READ:
      return {
        ...state,
        unreadMessages: state.unreadMessages.filter(msg => msg._id !== action.payload),
        notifications: state.notifications.filter(n => n.messageId !== action.payload),
      };

    case NOTIFICATION_ACTIONS.MARK_CHAT_READ:
      return {
        ...state,
        unreadMessages: state.unreadMessages.filter(msg => msg.chat !== action.payload),
        notifications: state.notifications.filter(n => n.chatId !== action.payload),
      };

    default:
      return state;
  }
};

// Create context
const NotificationContext = createContext();

// Notification Provider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { user } = useAuth();
  const { currentChat, unreadCounts } = useChat();
  const { socket, isConnected } = useSocket();
  const [lastNotificationTime, setLastNotificationTime] = useState(null);

  // Create notification from message
  const createNotificationFromMessage = (message, chat) => {
    const chatName = chat?.chatType === 'group' 
      ? chat.chatName || 'Group Chat'
      : chat?.participants?.find(p => p._id !== user._id)?.name || 'Unknown User';

    const messagePreview = message.messageType === 'text' 
      ? message.content 
      : message.messageType === 'image' 
        ? '📷 Image' 
        : message.messageType === 'file' 
          ? '📎 File' 
          : message.messageType === 'voice' 
            ? '🎤 Voice message' 
            : 'Message';

    return {
      id: `msg_${message._id}_${Date.now()}`,
      type: 'message',
      title: `New message from ${chatName}`,
      description: messagePreview,
      time: formatMessageTime(message.createdAt),
      messageId: message._id,
      chatId: message.chat,
      sender: message.sender,
      messageType: message.messageType,
      createdAt: message.createdAt,
      isRead: false,
    };
  };

  // Add notification for new message
  const addMessageNotification = (message, chat) => {
    // Don't show notification if user is in the same chat
    if (currentChat?._id === message.chat) {
      return;
    }

    // Don't show notification for own messages
    if (message.sender._id === user._id) {
      return;
    }

    // Rate limiting: don't show too many notifications too quickly
    const now = Date.now();
    if (lastNotificationTime && (now - lastNotificationTime) < 2000) {
      return;
    }

    const notification = createNotificationFromMessage(message, chat);
    dispatch({ type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION, payload: notification });
    setLastNotificationTime(now);

    // Show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.description,
        icon: '/favicon.ico',
        tag: `message_${message.chat}`,
      });
    }
  };

  // Mark message as read
  const markMessageAsRead = (messageId) => {
    dispatch({ type: NOTIFICATION_ACTIONS.MARK_MESSAGE_READ, payload: messageId });
  };

  // Mark all messages in chat as read
  const markChatAsRead = (chatId) => {
    dispatch({ type: NOTIFICATION_ACTIONS.MARK_CHAT_READ, payload: chatId });
  };

  // Clear all notifications
  const clearNotifications = () => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_NOTIFICATIONS });
  };

  // Remove specific notification
  const removeNotification = (notificationId) => {
    dispatch({ type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION, payload: notificationId });
  };

  // Socket event handlers for new messages
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (data) => {
      const { message, chat } = data;
      addMessageNotification(message, chat);
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, isConnected, currentChat, user, lastNotificationTime]);

  // Mark notifications as read when entering a chat
  useEffect(() => {
    if (currentChat) {
      markChatAsRead(currentChat._id);
    }
  }, [currentChat?._id]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Context value
  const value = {
    // State
    notifications: state.notifications,
    unreadMessages: state.unreadMessages,
    loading: state.loading,
    error: state.error,
    
    // Actions
    addMessageNotification,
    markMessageAsRead,
    markChatAsRead,
    clearNotifications,
    removeNotification,
    
    // Computed values
    hasNotifications: state.notifications.length > 0,
    notificationCount: state.notifications.length,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  
  return context;
};

export default NotificationContext; 