import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { useNotifications } from '../context/NotificationContext';
import { NotificationService } from '../services/notificationService';
import {
  createOrderStatusNotification,
  createPromotionNotification,
  createMealReminderNotification,
  createDeliveryNotification,
  createPaymentNotification,
} from '../utils/notificationHelpers';
import './NotificationTester.css';

const NotificationTester: React.FC = () => {
  const [platform, setPlatform] = useState<string>('web');
  const [permissionStatus, setPermissionStatus] = useState<string>('Not requested');
  const [pushToken, setPushToken] = useState<string | null>(null);
  const { addNotification, requestPermissions, registerPush } = useNotifications();
  const notificationService = NotificationService.getInstance();

  useEffect(() => {
    setPlatform(Capacitor.getPlatform());
    const token = notificationService.getPushToken();
    if (token) {
      setPushToken(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRequestPermissions = async () => {
    try {
      const result = await requestPermissions();
      setPermissionStatus(result.granted ? 'Granted' : 'Denied');
    } catch (error) {
      console.error('Permission request error:', error);
      setPermissionStatus('Error');
    }
  };

  const handleRegisterPush = async () => {
    try {
      const token = await registerPush();
      if (token) {
        setPushToken(token);
        alert(`Push notification registered!\nToken: ${token.substring(0, 50)}...`);
      } else {
        alert('Push notification registration failed. Check console for details.');
      }
    } catch (error) {
      console.error('Push registration error:', error);
      alert('Failed to register push notifications. Check console for details.');
    }
  };

  // Real notification examples
  const handleOrderConfirmed = () => {
    const notification = createOrderStatusNotification(
      'ORD-12345',
      'confirmed',
      'ORD-12345',
      30
    );
    addNotification(notification);
    notificationService.sendNotification(notification);
  };

  const handleOrderPreparing = () => {
    const notification = createOrderStatusNotification(
      'ORD-12345',
      'preparing',
      'ORD-12345'
    );
    addNotification(notification);
    notificationService.sendNotification(notification);
  };

  const handleOrderReady = () => {
    const notification = createOrderStatusNotification(
      'ORD-12345',
      'ready',
      'ORD-12345'
    );
    addNotification(notification);
    notificationService.sendNotification(notification);
  };

  const handleOrderOutForDelivery = () => {
    const notification = createOrderStatusNotification(
      'ORD-12345',
      'out_for_delivery',
      'ORD-12345',
      20,
      '123 Main St, Bangalore'
    );
    addNotification(notification);
    notificationService.sendNotification(notification);
  };

  const handleOrderDelivered = () => {
    const notification = createOrderStatusNotification(
      'ORD-12345',
      'delivered',
      'ORD-12345'
    );
    addNotification(notification);
    notificationService.sendNotification(notification);
  };

  const handlePromotion = () => {
    const notification = createPromotionNotification(
      'PROMO-001',
      'Special Offer! 🎉',
      'Get 20% off on all South Indian meals. Use code: PLATTR20',
      20,
      'PLATTR20',
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    );
    addNotification(notification);
    notificationService.sendNotification(notification);
  };

  const handleMealReminder = () => {
    const notification = createMealReminderNotification(
      'Lunch',
      new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
    );
    addNotification(notification);
    notificationService.sendNotification(notification);
  };

  const handleDeliveryUpdate = () => {
    const notification = createDeliveryNotification(
      'ORD-12345',
      'Rajesh Kumar',
      '+91 98765 43210',
      new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
      '/orders/ORD-12345/track'
    );
    addNotification(notification);
    notificationService.sendNotification(notification);
  };

  const handlePaymentSuccess = () => {
    const notification = createPaymentNotification(
      'ORD-12345',
      true,
      450,
      'TXN-123456',
      'UPI'
    );
    addNotification(notification);
    notificationService.sendNotification(notification);
  };

  const handlePaymentFailed = () => {
    const notification = createPaymentNotification(
      'ORD-12345',
      false,
      450,
      undefined,
      'Credit Card'
    );
    addNotification(notification);
    notificationService.sendNotification(notification);
  };

  return (
    <div className="notification-tester">
      <div className="tester-container">
        <h1 className="tester-title">Real-Time Notifications</h1>
        <div className="platform-info">
          <p><strong>Platform:</strong> {platform}</p>
          <p><strong>Permission Status:</strong> {permissionStatus}</p>
          {pushToken && (
            <p className="token-info"><strong>Push Token:</strong> {pushToken.substring(0, 30)}...</p>
          )}
        </div>

        <div className="test-section">
          <h2>Setup</h2>
          <button className="test-btn" onClick={handleRequestPermissions}>
            Request Permissions
          </button>
          <button className="test-btn" onClick={handleRegisterPush}>
            Register for Push Notifications
          </button>
          <p className="info-text">
            Note: Push notifications require backend setup. See REQUIREMENTS.md for details.
          </p>
        </div>

        <div className="test-section">
          <h2>Order Notifications</h2>
          <div className="notification-buttons">
            <button className="test-btn" onClick={handleOrderConfirmed}>
              Order Confirmed
            </button>
            <button className="test-btn" onClick={handleOrderPreparing}>
              Order Preparing
            </button>
            <button className="test-btn" onClick={handleOrderReady}>
              Order Ready
            </button>
            <button className="test-btn" onClick={handleOrderOutForDelivery}>
              Out for Delivery
            </button>
            <button className="test-btn" onClick={handleOrderDelivered}>
              Order Delivered
            </button>
          </div>
        </div>

        <div className="test-section">
          <h2>Other Notifications</h2>
          <div className="notification-buttons">
            <button className="test-btn" onClick={handlePromotion}>
              Promotion
            </button>
            <button className="test-btn" onClick={handleMealReminder}>
              Meal Reminder
            </button>
            <button className="test-btn" onClick={handleDeliveryUpdate}>
              Delivery Update
            </button>
            <button className="test-btn" onClick={handlePaymentSuccess}>
              Payment Success
            </button>
            <button className="test-btn" onClick={handlePaymentFailed}>
              Payment Failed
            </button>
          </div>
        </div>

        <div className="info-section">
          <h3>How It Works</h3>
          <ul>
            <li>Click any button to send a real notification</li>
            <li>Notifications appear in the notification center (bell icon in nav)</li>
            <li>On mobile, notifications will show as system notifications</li>
            <li>For push notifications, you need to set up backend (see REQUIREMENTS.md)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotificationTester;
