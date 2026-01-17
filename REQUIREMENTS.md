# Missing Requirements for Real-Time Notifications

This document outlines what you need to set up to enable real-time push notifications for the Plattr app.

## 🔴 Critical Requirements

### 1. Backend Server
You need a backend server to:
- Store and manage device tokens
- Send push notifications via FCM (Android) or APNs (iOS)
- Handle notification delivery and tracking
- Manage user notification preferences

**Recommended Stack:**
- Node.js/Express, Python/Flask, or any backend framework
- Database (PostgreSQL, MongoDB, etc.) to store tokens
- Push notification service integration

### 2. Firebase Cloud Messaging (FCM) - Android

**Steps:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing
3. Add Android app to project
4. Download `google-services.json`
5. Place it in `android/app/` directory
6. Add FCM server key to your backend

**Configuration:**
- Add to `android/app/build.gradle`:
  ```gradle
  apply plugin: 'com.google.gms.google-services'
  ```

- Add to `android/build.gradle`:
  ```gradle
  dependencies {
    classpath 'com.google.gms:google-services:4.3.15'
  }
  ```

### 3. Apple Push Notification Service (APNs) - iOS

**Steps:**
1. Register app in [Apple Developer Portal](https://developer.apple.com/)
2. Create APNs Key or Certificate
3. Download and configure in your backend
4. Enable Push Notifications capability in Xcode

**Xcode Configuration:**
- Open project: `npm run cap:ios`
- Select project → Signing & Capabilities
- Add "Push Notifications" capability
- Add "Background Modes" → Enable "Remote notifications"

### 4. Web Push (VAPID Keys)

**Steps:**
1. Generate VAPID keys:
   ```bash
   npm install -g web-push
   web-push generate-vapid-keys
   ```
2. Add public key to `.env`:
   ```
   REACT_APP_VAPID_PUBLIC_KEY=your_public_key_here
   ```
3. Add private key to your backend
4. Create service worker for web push

### 5. Environment Variables

Create `.env` file in project root:
```env
REACT_APP_BACKEND_URL=https://api.plattr.com
REACT_APP_VAPID_PUBLIC_KEY=your_vapid_public_key
```

### 6. Service Worker (Web)

Create `public/sw.js` for web push notifications:
```javascript
self.addEventListener('push', function(event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: data
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
```

Register in `src/index.tsx`:
```typescript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

## 🟡 Backend API Endpoints Required

Your backend needs these endpoints:

### 1. Register Device Token
```
POST /api/notifications/register
Body: {
  token: string,
  platform: 'ios' | 'android' | 'web',
  appVersion: string
}
```

### 2. Send Notification (Admin)
```
POST /api/notifications/send
Body: {
  userId: string,
  notification: PlattrNotification
}
```

### 3. Update Notification Preferences
```
PUT /api/notifications/preferences
Body: {
  userId: string,
  preferences: NotificationPreferences
}
```

## 🟢 Implementation Checklist

### Backend Setup
- [ ] Set up backend server
- [ ] Create database schema for tokens
- [ ] Implement FCM integration (Android)
- [ ] Implement APNs integration (iOS)
- [ ] Implement Web Push (VAPID)
- [ ] Create API endpoints for token registration
- [ ] Create API endpoints for sending notifications
- [ ] Set up notification queue/worker

### Mobile Setup
- [ ] Configure Firebase project
- [ ] Add `google-services.json` to Android
- [ ] Configure APNs in Apple Developer Portal
- [ ] Enable Push Notifications in Xcode
- [ ] Test on physical devices

### Web Setup
- [ ] Generate VAPID keys
- [ ] Create service worker
- [ ] Register service worker
- [ ] Test web push notifications

### Testing
- [ ] Test push notifications on iOS
- [ ] Test push notifications on Android
- [ ] Test web push notifications
- [ ] Test notification delivery
- [ ] Test notification actions
- [ ] Test notification persistence

## 📝 Backend Code Example (Node.js/Express)

```javascript
// Example using node-pushnotifications
const PushNotifications = require('node-pushnotifications');

const settings = {
  gcm: {
    id: 'YOUR_FCM_SERVER_KEY',
  },
  apn: {
    token: {
      key: './path/to/AuthKey.p8',
      keyId: 'YOUR_KEY_ID',
      teamId: 'YOUR_TEAM_ID',
    },
    production: false, // Set to true for production
  },
};

const push = new PushNotifications(settings);

// Send notification
async function sendNotification(token, platform, notification) {
  const data = {
    title: notification.title,
    body: notification.body,
    custom: notification.data,
  };

  const registrationIds = [token];
  const options = {
    topic: 'com.plattr.app',
    priority: 'high',
  };

  return await push.send(registrationIds, data, options);
}
```

## 🔐 Security Considerations

1. **Token Storage**: Store tokens securely in database
2. **Authentication**: Require user authentication for token registration
3. **Rate Limiting**: Implement rate limiting for notification sending
4. **Validation**: Validate notification data before sending
5. **Privacy**: Respect user notification preferences

## 📚 Additional Resources

- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging)
- [Apple Push Notification Service](https://developer.apple.com/documentation/usernotifications)
- [Web Push Protocol](https://web.dev/push-notifications-overview/)
- [Capacitor Push Notifications Plugin](https://capacitorjs.com/docs/apis/push-notifications)

## 🚀 Quick Start (Development)

For development/testing without full backend:

1. Use local notifications (already implemented)
2. Mock push notifications using the NotificationService
3. Test notification UI and handling
4. Set up backend when ready for production

The app is already set up to handle notifications - you just need to connect it to your backend push notification service!
