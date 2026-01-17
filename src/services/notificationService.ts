import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { PlattrNotification, NotificationType, NotificationPriority } from '../types/notifications';

export class NotificationService {
  private static instance: NotificationService;
  private pushToken: string | null = null;
  private notificationListeners: Map<string, (notification: PlattrNotification) => void> = new Map();
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Initialize notification service
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    const platform = Capacitor.getPlatform();
    
    if (platform !== 'web') {
      await this.setupPushNotificationListeners();
    }

    this.isInitialized = true;
  }

  // Request permissions for all platforms
  async requestPermissions(): Promise<{ granted: boolean; platform: string }> {
    const platform = Capacitor.getPlatform();
    
    if (platform === 'web') {
      return this.requestWebPermissions();
    } else {
      return this.requestNativePermissions();
    }
  }

  private async requestWebPermissions(): Promise<{ granted: boolean; platform: string }> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return { granted: permission === 'granted', platform: 'web' };
    }
    return { granted: false, platform: 'web' };
  }

  private async requestNativePermissions(): Promise<{ granted: boolean; platform: string }> {
    const platform = Capacitor.getPlatform();
    
    try {
      const localPerms = await LocalNotifications.requestPermissions();
      const pushPerms = await PushNotifications.requestPermissions();
      
      const granted = localPerms.display === 'granted' && pushPerms.receive === 'granted';
      
      if (granted) {
        await this.registerPushNotifications();
      }
      
      return { granted, platform };
    } catch (error) {
      console.error('Permission request failed:', error);
      return { granted: false, platform };
    }
  }

  // Register for push notifications
  async registerPushNotifications(): Promise<string | null> {
    const platform = Capacitor.getPlatform();
    
    if (platform === 'web') {
      return this.registerWebPush();
    } else {
      return this.registerNativePush();
    }
  }

  private async registerWebPush(): Promise<string | null> {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY || 'YOUR_VAPID_PUBLIC_KEY'),
        });
        return JSON.stringify(subscription);
      } catch (error) {
        console.error('Web push registration failed:', error);
        return null;
      }
    }
    return null;
  }

  private async registerNativePush(): Promise<string | null> {
    try {
      await PushNotifications.register();
      
      return new Promise((resolve) => {
        PushNotifications.addListener('registration', (token) => {
          this.pushToken = token.value;
          console.log('Push registration token:', token.value);
          // Send token to your backend
          this.sendTokenToBackend(token.value);
          resolve(token.value);
        });
        
        PushNotifications.addListener('registrationError', (error) => {
          console.error('Registration error:', error);
          resolve(null);
        });
      });
    } catch (error) {
      console.error('Native push registration failed:', error);
      return null;
    }
  }

  // Setup push notification listeners
  private async setupPushNotificationListeners(): Promise<void> {
    // Handle notification received while app is in foreground
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push notification received:', notification);
      this.handlePushNotification(notification);
    });

    // Handle notification action (when user taps notification)
    PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
      console.log('Push notification action performed:', action);
      this.handleNotificationAction(action);
    });
  }

  // Handle incoming push notification
  private handlePushNotification(notification: PushNotificationSchema): void {
    const plattrNotification = this.parsePushNotification(notification);
    if (plattrNotification) {
      // Show local notification
      this.showNotification(plattrNotification);
      
      // Trigger haptic feedback
      this.triggerHaptic(ImpactStyle.Medium);
      
      // Notify listeners
      this.notifyListeners(plattrNotification);
    }
  }

  // Parse push notification to PlattrNotification
  private parsePushNotification(notification: PushNotificationSchema): PlattrNotification | null {
    try {
      const data = notification.data || {};
      const type = data.type as NotificationType || NotificationType.ORDER_STATUS;
      
      return {
        id: notification.id || Date.now().toString(),
        type,
        title: notification.title || 'Plattr',
        body: notification.body || '',
        priority: (data.priority as NotificationPriority) || NotificationPriority.MEDIUM,
        timestamp: new Date(),
        read: false,
        data: data,
        imageUrl: data.imageUrl,
        actionUrl: data.actionUrl,
      } as PlattrNotification;
    } catch (error) {
      console.error('Error parsing push notification:', error);
      return null;
    }
  }

  // Handle notification action
  private handleNotificationAction(action: ActionPerformed): void {
    const notification = this.parsePushNotification(action.notification);
    if (notification && notification.actionUrl) {
      // Navigate to action URL
      window.location.href = notification.actionUrl;
    }
  }

  // Show notification (local)
  async showNotification(notification: PlattrNotification): Promise<void> {
    try {
      const platform = Capacitor.getPlatform();
      
      if (platform === 'web') {
        this.showWebNotification(notification);
      } else {
        await LocalNotifications.schedule({
          notifications: [
            {
              title: notification.title,
              body: notification.body,
              id: parseInt(notification.id) || Date.now(),
              schedule: { at: new Date() },
              sound: 'beep.wav',
              extra: notification.data,
              attachments: notification.imageUrl ? [{ id: '1', url: notification.imageUrl }] : undefined,
            },
          ],
        });
      }

      // Update badge count
      await this.updateBadgeCount();
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  // Show web notification
  private showWebNotification(notification: PlattrNotification): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const options: NotificationOptions = {
        body: notification.body,
        icon: notification.imageUrl || '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        data: notification.data,
        requireInteraction: notification.priority === NotificationPriority.URGENT,
      };

      const webNotification = new Notification(notification.title, options);
      
      webNotification.onclick = () => {
        if (notification.actionUrl) {
          window.focus();
          window.location.href = notification.actionUrl;
        }
        webNotification.close();
      };
    }
  }

  // Send notification (for testing or manual triggers)
  async sendNotification(notification: PlattrNotification): Promise<void> {
    await this.showNotification(notification);
    this.notifyListeners(notification);
  }

  // Subscribe to notifications
  subscribe(listenerId: string, callback: (notification: PlattrNotification) => void): void {
    this.notificationListeners.set(listenerId, callback);
  }

  // Unsubscribe from notifications
  unsubscribe(listenerId: string): void {
    this.notificationListeners.delete(listenerId);
  }

  // Notify all listeners
  private notifyListeners(notification: PlattrNotification): void {
    this.notificationListeners.forEach((callback) => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });
  }

  // Send token to backend
  private async sendTokenToBackend(token: string): Promise<void> {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://api.plattr.com';
    
    try {
      // Replace with your actual API endpoint
      await fetch(`${backendUrl}/api/notifications/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          platform: Capacitor.getPlatform(),
          appVersion: '1.0.0',
        }),
      });
    } catch (error) {
      console.error('Failed to send token to backend:', error);
    }
  }

  // Haptic Feedback
  async triggerHaptic(style: ImpactStyle = ImpactStyle.Medium): Promise<void> {
    try {
      await Haptics.impact({ style });
    } catch (error) {
      console.error('Haptic feedback failed:', error);
    }
  }

  // Update badge count
  async updateBadgeCount(): Promise<void> {
    try {
      if (Capacitor.getPlatform() !== 'web') {
        await LocalNotifications.getPending();
        // Badge count is typically handled by the platform automatically
        // You may need to use a badge plugin for more control
      }
    } catch (error) {
      console.error('Badge update failed:', error);
    }
  }

  // Schedule local notification (for compatibility)
  async scheduleLocalNotification(title: string, body: string, schedule?: { at: Date }): Promise<void> {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: Date.now(),
            schedule: schedule || { at: new Date(Date.now() + 1000) },
            sound: 'beep.wav',
            attachments: undefined,
            actionTypeId: '',
            extra: { data: 'Local notification' },
          },
        ],
      });
    } catch (error) {
      console.error('Local notification failed:', error);
    }
  }

  // Play notification sound
  async playNotificationSound(): Promise<void> {
    // On native platforms, sound is handled by the notification itself
    // On web, you can use Web Audio API
    if (Capacitor.getPlatform() === 'web') {
      try {
        const audio = new Audio('/notification-sound.mp3');
        audio.play().catch(console.error);
      } catch (error) {
        console.error('Sound playback failed:', error);
      }
    }
  }

  // Set badge count
  async setBadge(count: number): Promise<void> {
    try {
      if (Capacitor.getPlatform() !== 'web') {
        // Badge is typically handled by the platform automatically
        // You may need to use a badge plugin for more control
        console.log('Badge count would be set to:', count);
      }
    } catch (error) {
      console.error('Badge update failed:', error);
    }
  }

  // Get push token
  getPushToken(): string | null {
    return this.pushToken;
  }

  // Helper function for web push
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}
