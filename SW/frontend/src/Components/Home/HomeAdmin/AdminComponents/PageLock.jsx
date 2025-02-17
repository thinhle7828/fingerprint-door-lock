import React from 'react';
import './AdminDashboard.css'
import { useState } from "react";

const PageLock = () => {
    const [isLocked, setIsLocked] = useState(true);

    const handleToggleLock = () => {
        console.log('Toggle lock status:', isLocked);
        setIsLocked((prev) => !prev);
      };
  return (
    <div className="lock-container">
      <div className="lock-icon">
        {isLocked ? '🔒' : '🔓'} 
      </div>
      <h2 className="lock-status">{isLocked ? 'Locked' : 'Unlocked'}</h2>
      <button className="unlock-button" onClick={handleToggleLock}>
        {isLocked ? 'Unlock' : 'Lock'}
      </button>
    </div>
  );
};

export default PageLock;
