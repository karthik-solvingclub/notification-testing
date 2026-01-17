# Real-Time Notification System Guide

## Overview

The Plattr app now has a complete real-time notification system that supports multiple notification types across iOS, Android, and Web platforms.

## Features Implemented

### ✅ Notification Types
1. **Order Status Notifications**
   - Order Confirmed
   - Order Preparing
   - Order Ready
   - Out for Delivery
   - Order Delivered
   - Order Cancelled

2. **Promotion Notifications**
   - Special offers
   - Discount codes
   - Limited-time deals

3. **Reminder Notifications**
   - Meal reminders
   - Order reminders
   - Custom reminders

4. **Delivery Notifications**
   - Delivery updates
   - Delivery person info
   - Estimated arrival times

5. **Payment Notifications**
   - Payment success
   - Payment failed

### ✅ Components Created

1. **NotificationService** (`src/services/notificationService.ts`)
   - Handles all notification operations
   - Manages push notification registration
   - Processes incoming notifications
   - Platform-specific implementations

2. **NotificationContext** (`src/context/NotificationContext.tsx`)
   - React context for notification state
   - Manages notification list
   - Handles read/unread status
   - Persists notifications to localStorage

3. **NotificationCenter** (`src/components/NotificationCenter.tsx`)
   - UI component for viewing notifications
   - Filter by notification type
   - Mark as read/unread
   - Remove notifications

4. **Notification Helpers** (`src/utils/notificationHelpers.ts`)
   - Helper functions to create different notification types
   - Type-safe notification creation

## How to Use

### 1. Send a Notification

```typescript
import { useNotifications } from '../context/NotificationContext';
import { createOrderStatusNotification } from '../utils/notificationHelpers';
import { NotificationService } from '../services/notificationService';

const { addNotification } = useNotifications();
const notificationService = NotificationService.getInstance();

// Create and send notification
const notification = createOrderStatusNotification(
  'ORD-12345',
  'confirmed',
  'ORD-12345',
  30
);

addNotification(notification);
notificationService.sendNotification(notification);
```

### 2. Listen to Notifications

The NotificationContext automatically handles incoming notifications. Just use the hook:

```typescript
import { useNotifications } from '../context/NotificationContext';

const { notifications, unreadCount } = useNotifications();
```

### 3. Display Notification Center

The NotificationCenter component is already integrated in the App. It appears as a bell icon in the navigation bar.

### 4. Request Permissions

```typescript
const { requestPermissions } = useNotifications();
await requestPermissions();
```

### 5. Register for Push Notifications

```typescript
const { registerPush } = useNotifications();
const token = await registerPush();
// Send token to your backend
```

## Notification Flow

1. **Backend sends push notification** → FCM/APNs/Web Push
2. **Capacitor receives notification** → NotificationService handles it
3. **Notification parsed** → Converted to PlattrNotification type
4. **Notification displayed** → System notification + in-app notification
5. **Notification stored** → Added to NotificationContext
6. **User sees notification** → In NotificationCenter UI

## Testing

1. Go to `/notifications` route
2. Click "Request Permissions"
3. Click "Register for Push Notifications"
4. Test different notification types using the buttons
5. Check the notification center (bell icon) to see all notifications

## Backend Integration

To enable real push notifications, you need to:

1. Set up backend server (see REQUIREMENTS.md)
2. Configure FCM for Android
3. Configure APNs for iOS
4. Set up Web Push with VAPID keys
5. Implement API endpoints for token registration
6. Send notifications from backend to devices

## Current Status

✅ **Implemented:**
- All notification types
- Notification UI components
- Local notifications (work immediately)
- Notification state management
- Service worker for web
- Platform detection

⏳ **Requires Backend:**
- Push notification delivery (FCM/APNs/Web Push)
- Token storage and management
- Real-time notification sending

## Next Steps

1. Set up backend server
2. Configure FCM/APNs
3. Implement token registration API
4. Test on physical devices
5. Deploy to production

See `REQUIREMENTS.md` for detailed setup instructions.
