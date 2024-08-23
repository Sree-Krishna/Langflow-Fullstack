import React, { useEffect } from 'react';
import './PopupMessage.css';

const PopupMessage = ({ message, onClose, duration = 2000 }) => {
  useEffect(() => {
    // Automatically close the popup after the specified duration
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [onClose, duration]);

  return (
    <div className="popup-message">
      {message}
    </div>
  );
};

export default PopupMessage;
