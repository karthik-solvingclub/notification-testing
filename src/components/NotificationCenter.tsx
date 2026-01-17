import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { PlattrNotification, NotificationType } from '../types/notifications';
import './NotificationCenter.css';

const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<NotificationType | 'all'>('all');

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter((n) => n.type === filter);

  const getNotificationIcon = (type: NotificationType): string => {
    switch (type) {
      case NotificationType.ORDER_CONFIRMED:
      case NotificationType.ORDER_STATUS:
        return '✅';
      case NotificationType.ORDER_PREPARING:
        return '👨‍🍳';
      case NotificationType.ORDER_READY:
        return '🍽️';
      case NotificationType.ORDER_OUT_FOR_DELIVERY:
        return '🚚';
      case NotificationType.ORDER_DELIVERED:
        return '📦';
      case NotificationType.ORDER_CANCELLED:
        return '❌';
      case NotificationType.PROMOTION:
        return '🎉';
      case NotificationType.REMINDER:
      case NotificationType.MEAL_REMINDER:
        return '⏰';
      case NotificationType.DELIVERY_UPDATE:
        return '📍';
      case NotificationType.PAYMENT_SUCCESS:
        return '💳';
      case NotificationType.PAYMENT_FAILED:
        return '⚠️';
      default:
        return '🔔';
    }
  };

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification: PlattrNotification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <>
      <button
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-overlay" onClick={() => setIsOpen(false)}>
          <div className="notification-center" onClick={(e) => e.stopPropagation()}>
            <div className="notification-header">
              <h2>Notifications</h2>
              <div className="notification-actions">
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="action-btn">
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button onClick={clearAll} className="action-btn danger">
                    Clear all
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="close-btn">
                  ✕
                </button>
              </div>
            </div>

            <div className="notification-filters">
              <button
                className={filter === 'all' ? 'active' : ''}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={filter === NotificationType.ORDER_STATUS ? 'active' : ''}
                onClick={() => setFilter(NotificationType.ORDER_STATUS)}
              >
                Orders
              </button>
              <button
                className={filter === NotificationType.PROMOTION ? 'active' : ''}
                onClick={() => setFilter(NotificationType.PROMOTION)}
              >
                Promotions
              </button>
              <button
                className={filter === NotificationType.DELIVERY_UPDATE ? 'active' : ''}
                onClick={() => setFilter(NotificationType.DELIVERY_UPDATE)}
              >
                Delivery
              </button>
            </div>

            <div className="notification-list">
              {filteredNotifications.length === 0 ? (
                <div className="notification-empty">
                  <p>No notifications</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                      <div className="notification-title-row">
                        <h3>{notification.title}</h3>
                        {!notification.read && <span className="unread-dot"></span>}
                      </div>
                      <p>{notification.body}</p>
                      <span className="notification-time">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    <button
                      className="notification-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      aria-label="Remove notification"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationCenter;
