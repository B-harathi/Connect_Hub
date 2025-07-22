import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineBell, HiOutlineCheckCircle } from 'react-icons/hi';

const NotificationPanel = ({ onClose, isOpen }) => {
  // Placeholder notifications
  const notifications = [
    {
      id: 1,
      type: 'message',
      title: 'New message from Alice',
      description: 'Hey, are you available for a call?',
      time: '2 min ago',
      icon: <HiOutlineBell className="h-5 w-5 text-purple-500" />,
    },
    {
      id: 2,
      type: 'mention',
      title: 'You were mentioned in #general',
      description: 'Bob: @you check this out!',
      time: '10 min ago',
      icon: <HiOutlineCheckCircle className="h-5 w-5 text-green-500" />,
    },
  ];

  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-80 bg-white dark:bg-gray-900 shadow-xl h-full flex flex-col border-l border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="sr-only">Close notifications</span>
          &times;
        </button>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No notifications yet.
          </div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className="flex items-start px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <div className="mr-3 mt-1">{notif.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 dark:text-white">{notif.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{notif.description}</div>
                <div className="text-xs text-gray-400 mt-1">{notif.time}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default NotificationPanel; 