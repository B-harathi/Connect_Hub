import React, { useState, useEffect } from 'react';
import { 
  HiOutlineX, 
  HiOutlinePlus, 
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineUsers,
  HiOutlineChat,
  HiOutlineUserGroup
} from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  formatChatTime, 
  getChatDisplayName, 
  getChatDisplayAvatar, 
  getLastMessagePreview,
  generateAvatarUrl,
  truncateText
} from '../../utils/helpers';
import { isMobile } from '../../utils/helpers';

const ChatItem = ({ chat, isActive, onClick, unreadCount }) => {
  const { user } = useAuth();
  
  const displayName = getChatDisplayName(chat, user);
  const displayAvatar = getChatDisplayAvatar(chat, user);
  const lastMessagePreview = getLastMessagePreview(chat.lastMessage);
  const lastMessageTime = formatChatTime(chat.lastActivity);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
      onClick={onClick}
      className={`flex items-center p-3 cursor-pointer transition-all duration-200 border-l-3 ${
        isActive
          ? 'bg-purple-50 dark:bg-purple-900/20 border-l-purple-500 shadow-sm'
          : 'border-l-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50'
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={displayAvatar || generateAvatarUrl(displayName)}
          alt={displayName}
          className="h-12 w-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
        />
        {/* Online indicator for private chats */}
        {chat.chatType === 'private' && (
          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full ring-2 ring-white dark:ring-gray-800"></div>
        )}
        {/* Group chat indicator */}
        {chat.chatType === 'group' && (
          <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-purple-500 rounded-full flex items-center justify-center">
            <HiOutlineUserGroup className="h-3 w-3 text-white" />
          </div>
        )}
      </div>

      {/* Chat info */}
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-semibold truncate ${
            isActive ? 'text-purple-900 dark:text-purple-100' : 'text-gray-900 dark:text-white'
          }`}>
            {displayName}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
            {lastMessageTime}
          </span>
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
            {lastMessagePreview}
          </p>
          
          {/* Unread count */}
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-purple-500 rounded-full">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Sidebar = ({ onClose, isOpen }) => {
  const { chats, loadChats, selectChat, currentChat, isLoading, unreadCounts } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, private, groups
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  const filteredChats = chats.filter(chat => {
    const matchesSearch = getChatDisplayName(chat, {}).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || 
      (filter === 'private' && chat.chatType === 'private') ||
      (filter === 'groups' && chat.chatType === 'group');
    
    return matchesSearch && matchesFilter;
  });

  const handleChatSelect = (chat) => {
    selectChat(chat);
    if (isMobile()) {
      onClose();
    }
  };

  const totalUnreadCount = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-gradient">Chat ONN</h1>
            {totalUnreadCount > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </span>
            )}
          </div>
          
          {isMobile() && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <HiOutlineX className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Search bar */}
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HiOutlineSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('private')}
            className={`flex-1 px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              filter === 'private'
                ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Direct
          </button>
          <button
            onClick={() => setFilter('groups')}
            className={`flex-1 px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              filter === 'groups'
                ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Groups
          </button>
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <HiOutlineChat className="h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-center">
              {searchQuery ? 'No chats found' : 'No chats yet'}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center mt-1">
              {searchQuery ? 'Try a different search term' : 'Start a conversation to get started'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredChats.map((chat) => (
              <ChatItem
                key={chat._id}
                chat={chat}
                isActive={currentChat?._id === chat._id}
                onClick={() => handleChatSelect(chat)}
                unreadCount={unreadCounts[chat._id] || 0}
              />
            ))}
          </div>
        )}
      </div>

      {/* New chat button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setShowNewChatModal(true)}
          className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <HiOutlinePlus className="h-5 w-5 mr-2" />
          New Chat
        </button>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Start New Chat
                </h2>
                <button
                  onClick={() => setShowNewChatModal(false)}
                  className="p-1 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
                >
                  <HiOutlineX className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                <button className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-3">
                    <HiOutlineUsers className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">Start Direct Chat</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Chat with a specific person</p>
                  </div>
                </button>
                
                <button className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                    <HiOutlineUserGroup className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">Create Group</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Start a group conversation</p>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;