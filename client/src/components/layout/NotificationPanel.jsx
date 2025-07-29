import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineBell, HiOutlineChat, HiOutlineX, HiOutlineTrash } from 'react-icons/hi';
import { useNotifications } from '../../contexts/NotificationContext';
import { useChat } from '../../contexts/ChatContext';

const NotificationPanel = ({ onClose, isOpen }) => {
  const { notifications, removeNotification, clearNotifications, notificationCount } = useNotifications();
  const { selectChat, chats } = useChat();

  const handleNotificationClick = (notification) => {
    if (notification.chatId) {
      // Find the chat in the chats list
      const chat = chats.find(c => c._id === notification.chatId);
      if (chat) {
        selectChat(chat);
        onClose();
      }
    }
  };

  const handleRemoveNotification = (e, notificationId) => {
    e.stopPropagation();
    removeNotification(notificationId);
  };

  const getNotificationIcon = (notification) => {
    switch (notification.messageType) {
      case 'image':
        return '📷';
      case 'file':
        return '📎';
      case 'voice':
        return '🎤';
      default:
        return <HiOutlineChat className="h-5 w-5 text-purple-500" />;
    }
  };

  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-80 bg-white dark:bg-gray-900 shadow-xl h-full flex flex-col border-l border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
          {notificationCount > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-purple-500 rounded-full">
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {notificationCount > 0 && (
            <button
              onClick={clearNotifications}
              className="p-1 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              title="Clear all notifications"
            >
              <HiOutlineTrash className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <HiOutlineBell className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-sm">No notifications yet.</p>
            <p className="text-xs mt-1">New messages will appear here when you're not in the chat.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              className="flex items-start px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
              onClick={() => handleNotificationClick(notif)}
            >
              <div className="mr-3 mt-1 text-lg">
                {getNotificationIcon(notif)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 dark:text-white text-sm">
                  {notif.title}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {notif.description}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {notif.time}
                </div>
              </div>
              <button
                onClick={(e) => handleRemoveNotification(e, notif.id)}
                className="ml-2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-all"
                title="Remove notification"
              >
                <HiOutlineX className="h-3 w-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default NotificationPanel; 