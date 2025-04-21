// src/components/UserCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserCard = ({ userId, username, profileImageUrl, isFollowing, onToggleFollow }) => {
  const navigate = useNavigate();
  
  const defaultImage = "https://img.freepik.com/premium-vector/pixel-art-tree_735839-72.jpg";
  
  const handleUserClick = () => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50">
      <div className="flex items-center cursor-pointer" onClick={handleUserClick}>
        <img
          src={profileImageUrl || defaultImage}
          alt={`${username}'s profile`}
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="ml-4 font-medium">{username}</span>
      </div>
      
      {onToggleFollow && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFollow(userId);
          }}
          className={`px-4 py-1 rounded-full text-sm ${
            isFollowing
              ? 'border border-gray-300 hover:bg-gray-100'
              : 'bg-green-50 border border-green-300 text-green-800 hover:bg-green-100'
          }`}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      )}
    </div>
  );
};

export default UserCard;