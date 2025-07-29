import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { formatMessageTime, generateAvatarUrl } from '../../utils/helpers';
import { HiOutlineDotsVertical, HiOutlineHeart, HiOutlineReply } from 'react-icons/hi';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';

// Add a context for reply state (to be implemented in ChatContext or parent)
export const ReplyContext = React.createContext({ setReplyTo: () => {}, replyTo: null });

// Component to display replied message
const ReplyMessage = ({ replyTo, isOwn }) => {
  if (!replyTo) return null;

  const getReplyContent = () => {
    if (!replyTo.content && !replyTo.messageType) {
      return 'Message not available';
    }
    
    if (replyTo.messageType === 'text') {
      return replyTo.content || 'Text message';
    } else if (replyTo.messageType === 'image') {
      return '📷 Image';
    } else if (replyTo.messageType === 'file') {
      return '📎 File';
    } else if (replyTo.messageType === 'voice') {
      return '🎤 Voice message';
    }
    return 'Message';
  };

  const getSenderName = () => {
    if (replyTo.sender && replyTo.sender.name) {
      return replyTo.sender.name;
    }
    return 'User';
  };

  return (
    <div className={`mb-2 p-2 rounded-lg border-l-4 ${
      isOwn 
        ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-400' 
        : 'bg-gray-100 dark:bg-gray-700 border-gray-400'
    }`}>
      <div className={`text-xs font-medium mb-1 ${
        isOwn ? 'text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-400'
      }`}>
        {getSenderName()}
      </div>
      <div className={`text-sm truncate ${
        isOwn ? 'text-purple-800 dark:text-purple-200' : 'text-gray-700 dark:text-gray-300'
      }`}>
        {getReplyContent()}
      </div>
    </div>
  );
};

const MessageReactions = ({ reactions, onAddReaction, onRemoveReaction, currentUserId }) => {
  if (!reactions || reactions.length === 0) return null;

  // Group reactions by emoji
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = [];
    }
    acc[reaction.emoji].push(reaction);
    return acc;
  }, {});

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {Object.entries(groupedReactions).map(([emoji, reactionGroup]) => {
        const hasUserReacted = reactionGroup.some(r => r.user._id === currentUserId);
        
        return (
          <button
            key={emoji}
            onClick={() => hasUserReacted ? onRemoveReaction() : onAddReaction(emoji)}
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs transition-colors ${
              hasUserReacted
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <span className="mr-1">{emoji}</span>
            <span>{reactionGroup.length}</span>
          </button>
        );
      })}
    </div>
  );
};

const FilePreview = ({ file }) => {
  const isImage = file.mimeType?.startsWith('image/');
  
  if (isImage) {
    return (
      <div className="relative max-w-sm">
        <img
          src={file.url}
          alt={file.originalName}
          className="rounded-lg max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => window.open(file.url, '_blank')}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg max-w-sm">
      <div className="flex-shrink-0">
        <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
          <span className="text-lg">📄</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {file.originalName}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {(file.size / 1024 / 1024).toFixed(1)} MB
        </p>
      </div>
      <button
        onClick={() => window.open(file.url, '_blank')}
        className="flex-shrink-0 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </button>
    </div>
  );
};

const MessageContent = ({ message, isOwn }) => {
  const renderContent = () => {
    switch (message.messageType) {
      case 'text':
        return (
          <div className="break-words">
            {message.content}
            {message.isEdited && (
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(edited)</span>
            )}
          </div>
        );
      
      case 'image':
      case 'file':
        return <FilePreview file={message.file} />;
      
      case 'voice':
        return (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg max-w-sm">
            <button className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="flex-1">
              <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                <div className="h-2 bg-purple-500 rounded-full w-1/3"></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">0:15</p>
            </div>
          </div>
        );
      
      default:
        return <div className="text-gray-500 dark:text-gray-400 italic">Unsupported message type</div>;
    }
  };

  return (
    <div>
      {message.replyTo && <ReplyMessage replyTo={message.replyTo} isOwn={isOwn} />}
      {renderContent()}
      {message.replyTo && (
        <div className={`text-xs mt-1 ${isOwn ? 'text-purple-200' : 'text-gray-500 dark:text-gray-400'}`}>
          ↳ Reply
        </div>
      )}
    </div>
  );
};

const MessageItem = ({ 
  message, 
  isOwn, 
  showAvatar = true, 
  showSender = false,
  isFirstInGroup = false,
  isLastInGroup = false 
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const { user } = useAuth();
  const { sendMessage, currentChat } = useChat();
  const { messagesAPI } = require('../../services/api');
  const { loadMessages } = useChat();
  const { setReplyTo } = useContext(ReplyContext);

  // Add reaction
  const handleReaction = async (emoji) => {
    setShowReactionPicker(false);
    try {
      await messagesAPI.addReaction(message._id, emoji);
      // Optionally reload messages or rely on socket event
      // await loadMessages(currentChat._id);
    } catch (err) {
      // Optionally show error
    }
  };

  // Remove reaction
  const handleRemoveReaction = async () => {
    setShowReactionPicker(false);
    try {
      await messagesAPI.removeReaction(message._id);
      // Optionally reload messages or rely on socket event
      // await loadMessages(currentChat._id);
    } catch (err) {
      // Optionally show error
    }
  };

  const messageTime = formatMessageTime(message.createdAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      // Drag to reply (mobile-like)
      onTouchStart={e => {
        e.target._touchStartX = e.touches[0].clientX;
      }}
      onTouchEnd={e => {
        const startX = e.target._touchStartX;
        const endX = e.changedTouches[0].clientX;
        if (startX !== undefined && Math.abs(endX - startX) > 60 && !isOwn) {
          setReplyTo(message);
        }
      }}
    >
      <div className={`flex max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {!isOwn && (
          <div className="flex-shrink-0 mr-3">
            {showAvatar ? (
              <img
                src={message.sender.avatar || generateAvatarUrl(message.sender.name)}
                alt={message.sender.name}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="h-8 w-8" />
            )}
          </div>
        )}

        {/* Message content */}
        <div className={`relative ${isOwn ? 'mr-3' : ''}`}>
          {/* Sender name for group chats */}
          {showSender && !isOwn && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 ml-1">
              {message.sender.name}
            </p>
          )}

          {/* Message bubble */}
          <div
            className={`relative px-4 py-2 rounded-2xl ${
              isOwn
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
            } ${
              isFirstInGroup && isLastInGroup
                ? 'rounded-2xl'
                : isFirstInGroup
                ? isOwn
                  ? 'rounded-br-md'
                  : 'rounded-bl-md'
                : isLastInGroup
                ? isOwn
                  ? 'rounded-tr-md'
                  : 'rounded-tl-md'
                : isOwn
                ? 'rounded-r-md'
                : 'rounded-l-md'
            }`}
          >
            <MessageContent message={message} isOwn={isOwn} />
            
            {/* Message time */}
            <div className={`text-xs mt-1 ${isOwn ? 'text-purple-200' : 'text-gray-500 dark:text-gray-400'}`}>
              {messageTime}
              {isOwn && (
                <span className="ml-1">
                  {message.readBy?.length > 0 ? '\u2713\u2713' : '\u2713'}
                </span>
              )}
            </div>
          </div>

          {/* Reactions */}
          <MessageReactions
            reactions={message.reactions}
            onAddReaction={handleReaction}
            onRemoveReaction={handleRemoveReaction}
            currentUserId={user?._id}
          />

          {/* Action buttons */}
          {showActions && (
            <div className={`absolute top-0 ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-2 py-1`}>
              <button
                onClick={() => setShowReactionPicker(!showReactionPicker)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <HiOutlineHeart className="h-4 w-4" />
              </button>
              <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => setReplyTo(message)}
              >
                <HiOutlineReply className="h-4 w-4" />
              </button>
              <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <HiOutlineDotsVertical className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Reaction picker */}
          {showReactionPicker && (
            <div className={`absolute top-0 ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex space-x-1 mt-8`}>
              {['\u2764\ufe0f', '\ud83d\ude02', '\ud83d\ude2e', '\ud83d\ude22', '\ud83d\ude21', '\ud83d\udc4d'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageItem;