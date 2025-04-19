// ProfileRedirect.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProfileRedirect = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (currentUser?.username) {
      navigate(`/profile/${currentUser.username}`);
    }
  }, [currentUser, navigate]);
  
  return <div>Loading profile...</div>;
};

export default ProfileRedirect;