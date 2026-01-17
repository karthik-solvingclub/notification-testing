# Setup Guide for Plattr Notification System

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Capacitor Setup

### Initial Setup

After first build, initialize Capacitor:

```bash
npx cap init
```

Or manually sync:

```bash
npm run cap:sync
```

### iOS Setup

1. **Add iOS Platform**
   ```bash
   npx cap add ios
   ```

2. **Open in Xcode**
   ```bash
   npm run cap:ios
   ```

3. **Configure Push Notifications in Xcode:**
   - Select your project in Xcode
   - Go to "Signing & Capabilities"
   - Click "+ Capability"
   - Add "Push Notifications"
   - Add "Background Modes" and enable "Remote notifications"

4. **Configure APNs:**
   - Register your app in Apple Developer Portal
   - Create APNs certificate or key
   - Configure your backend to use APNs

### Android Setup

1. **Add Android Platform**
   ```bash
   npx cap add android
   ```

2. **Open in Android Studio**
   ```bash
   npm run cap:android
   ```

3. **Configure Firebase Cloud Messaging:**
   - Create a Firebase project at https://console.firebase.google.com
   - Add Android app to Firebase project
   - Download `google-services.json`
   - Place it in `android/app/` directory
   - Sync Capacitor: `npm run cap:sync`

4. **Update AndroidManifest.xml:**
   - Add internet permission (usually already present)
   - Configure notification channels in your code

## Notification Types Supported

### ✅ Local Notifications
- Works on: iOS, Android, Web
- No backend required
- Immediate and scheduled notifications

### ✅ Push Notifications
- Works on: iOS (APNs), Android (FCM), Web (Web Push)
- Requires backend setup
- Real-time notifications from server

### ✅ Haptic Feedback
- Works on: iOS, Android (physical devices)
- No permissions required
- Light, Medium, Heavy styles

### ✅ Sound Notifications
- Works on: iOS, Android, Web
- Platform-specific sounds
- Custom sounds supported

### ✅ Badge Count
- Works on: iOS, Android
- Shows unread count on app icon
- Platform-specific implementation

## Testing Checklist

- [ ] Request permissions on each platform
- [ ] Test local notifications (immediate)
- [ ] Test scheduled notifications
- [ ] Test push notification registration
- [ ] Test haptic feedback (on device)
- [ ] Test notification sounds
- [ ] Test badge count updates

## Platform-Specific Notes

### Web
- Notifications require user permission
- Service Worker needed for background notifications
- Web Push requires VAPID keys for production

### iOS
- Requires APNs for push notifications
- Badge updates work automatically
- Haptics work on physical devices only

### Android
- Requires FCM for push notifications
- Notification channels required (Android 8.0+)
- Badge support varies by manufacturer

## Troubleshooting

### Permissions Denied
- Check platform-specific permission settings
- For iOS: Check Info.plist
- For Android: Check AndroidManifest.xml

### Push Notifications Not Working
- Verify backend configuration (FCM/APNs)
- Check device token registration
- Verify certificates/keys are valid

### Haptics Not Working
- Only works on physical devices (not simulators)
- Check device capabilities
- Verify plugin is properly installed

## Next Steps

1. Set up your backend for push notifications
2. Configure FCM (Android) or APNs (iOS)
3. Implement notification handling logic
4. Test on physical devices
5. Configure production certificates/keys
