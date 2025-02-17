import React from 'react';
import { useState } from "react";
import "./PageLock.css";
import { useSelector } from 'react-redux';
const PageLock = () => {
    const [isLocked, setIsLocked] = useState(true);
    const user = useSelector((state) => state.auth.login?.currentUser);

    const handleToggleLock = () => {
      
      console.log('Toggle lock status:', isLocked);

      if (user?.can_open) {
          setIsLocked((prev) => !prev); 
      } else {
          console.log('User does not have permission to unlock.');
      }
  };
  return (
    <div className="lock-container">
      <div className="lock-icon">
        {isLocked ? '🔒' : '🔓'} 
      </div>
      <h2 className="lock-status">{isLocked ? 'Locked' : 'UnLocked'}</h2>
      <button className="unlock-button" onClick={handleToggleLock}>
        {isLocked ? 'Unlock' : 'Lock'}
      </button>
      {!user?.can_open && (
                <p className="permission-message">You do not have permission to unlock.</p>
            )}
    </div>
  );
};

export default PageLock;
