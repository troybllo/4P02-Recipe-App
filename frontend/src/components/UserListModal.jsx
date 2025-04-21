import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Simple user card that only shows profile info with no follow/unfollow button
const UserCard = ({ userId, username, profileImageUrl }) => {
  const navigate = useNavigate();
  const defaultImage = "https://img.freepik.com/premium-vector/pixel-art-tree_735839-72.jpg";
  
  const handleUserClick = () => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer" onClick={handleUserClick}>
      <img
        src={profileImageUrl || defaultImage}
        alt={`${username}'s profile`}
        className="w-12 h-12 rounded-full object-cover"
      />
      <span className="ml-4 font-medium">{username}</span>
    </div>
  );
};

const UserListModal = ({ isOpen, onClose, type, userId, username, userIds }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const title = type === 'followers' ? 'Followers' : 'Following';

  useEffect(() => {
    if (isOpen && userId && userIds && userIds.length > 0) {
      fetchUserInfo();
    }
  }, [isOpen, userId, userIds]);

  const fetchUserInfo = async () => {
    setLoading(true);
    
    try {
      // Get individual user info for each ID
      const usersData = await Promise.all(
        userIds.map(async (id) => {
          try {
            const response = await fetch(`http://127.0.0.1:5000/api/profile/username?userId=${id}`);
            if (response.ok) {
              const data = await response.json();
              return {
                userId: id,
                username: data.username,
                profileImageUrl: data.profileImageUrl
              };
            }
            return null;
          } catch (err) {
            return null;
          }
        })
      );
      
      setUsers(usersData.filter(Boolean));
    } catch (error) {
      console.error('Error fetching user info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">{title} - {username}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p>Loading...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {type === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
            </div>
          ) : (
            users.map(user => (
              <UserCard
                key={user.userId}
                userId={user.userId}
                username={user.username}
                profileImageUrl={user.profileImageUrl}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListModal;