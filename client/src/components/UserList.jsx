// Example: UserList.jsx
// ...existing code...
import { useChat } from '../contexts/ChatContext';
import { useNavigate } from 'react-router-dom';

const UserList = ({ users }) => {
  const { createChat, selectChat } = useChat();
  const navigate = useNavigate();

  const handleStartDirectChat = async (otherUserId) => {
    const result = await createChat({
      chatType: 'private',
      participants: [otherUserId],
    });
    if (result.success) {
      selectChat(result.chat);
      navigate(`/chat/${result.chat._id}`);
    } else {
      alert(result.error || 'Could not start chat');
    }
  };

  return (
    <div>
      {users.map(user => (
        <div key={user._id}>
          <span>{user.name}</span>
          <button onClick={() => handleStartDirectChat(user._id)}>
            Start direct Chat
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserList;
// filepath: client/src/components/UserList.jsx