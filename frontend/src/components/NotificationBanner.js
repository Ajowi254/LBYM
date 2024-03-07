//notificationbanner.js
import React, { useContext, useEffect, useState, useRef } from 'react';
import UserContext from '../context/UserContext';
import socketIOClient from "socket.io-client";
import './Nav.css';
import './NotificationBanner.css';

import ExpenseBudApi from '../api/api';
const ENDPOINT = "http://localhost:3001";

function NotificationBanner() {
  const { currentUser, notifications, setNotifications } = useContext(UserContext);
  const [isShown, setIsShown] = useState(false); // Change initial state to false
  const timerRef = useRef(null); // Add a ref to store the timer

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.on('connect', () => {
      console.log('Successfully connected to the server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

    // Listen for 'notification' events instead of 'notifications_updated'
    socket.on("notification", data => {
      console.log('Received notification event with data:', data);
      if (data.userId === currentUser.id) {
        console.log('Updating notifications state with new notification:', data.notification);
        setNotifications(prevNotifications => {
          console.log('Previous notifications:', prevNotifications);
          console.log('New notification:', data.notification);
          return [...prevNotifications, data.notification];
        });
        console.log('Setting isShown to true');
        setIsShown(true);
      }
    });

    return () => socket.disconnect();
  }, []);

  const handleDismissClick = async (notificationId) => {
    console.log('Dismissing notification:', notificationId);

    await ExpenseBudApi.markNotificationAsRead(currentUser.id, notificationId);

    setNotifications(prevNotifications => prevNotifications.filter(notification => notification.id !== notificationId));
    console.log('Setting isShown to false');
    setIsShown(false);
  };
  useEffect(() => {
    if (notifications.length > 0) {
      // Show the banner when there are notifications
      console.log('Notifications exist, setting isShown to true');
      setIsShown(true);
  
      // Clear the previous timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
  
      // Start a new timer
      timerRef.current = setTimeout(() => {
        // Hide the banner after 20 seconds
        console.log('Timer expired, setting isShown to false');
        setIsShown(false);
      }, 20000);
    }
  }, [notifications]); 

  if (!Array.isArray(notifications) || notifications.length === 0) {
    return null;
  }

  const latestNotification = notifications[0];

  console.log('Rendering NotificationBanner with latest notification:', latestNotification);

  return (
    <div className={`notification-banner ${isShown ? 'show' : 'hide'}`}>
      <div className="notification">
        {latestNotification.message}
        <button onClick={() => handleDismissClick(latestNotification.id)}>Dismiss</button>
      </div>
    </div>
  );
  
}

export default NotificationBanner;