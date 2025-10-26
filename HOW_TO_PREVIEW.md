# How to Preview InTime 🚀

## Method 1: iOS Simulator (Recommended)

### Prerequisites
You need Xcode installed on your Mac.

### Steps:

1. **Install iOS Dependencies** (first time only):
   ```bash
   cd /Users/jj/intime/ios
   pod install
   cd ..
   ```

2. **Start Metro Bundler**:
   Open a terminal and run:
   ```bash
   cd /Users/jj/intime
   npm start
   ```
   Keep this terminal running!

3. **Launch the App**:
   Open a **new terminal** and run:
   ```bash
   cd /Users/jj/intime
   npm run ios
   ```

The iOS Simulator will open automatically and launch InTime.

---

## Method 2: Android Emulator

### Prerequisites
- Android Studio installed
- Android Emulator running

### Steps:

1. **Start your Android Emulator**:
   - Open Android Studio
   - Device Manager → Create/Start an emulator

2. **Start Metro Bundler**:
   ```bash
   cd /Users/jj/intime
   npm start
   ```

3. **Launch the App**:
   Open a **new terminal** and run:
   ```bash
   cd /Users/jj/intime
   npm run android
   ```

---

## Method 3: Physical Device

### iOS Device:
1. Connect your iPhone via USB
2. Trust the computer on your phone
3. Run: `npm run ios`

### Android Device:
1. Enable USB Debugging on your phone
2. Connect via USB
3. Run: `npm run android`

---

## Quick Test Commands

Once the app is running, try:

```bash
# See current Node version
node --version  # Should show v22.21.0

# Check if Metro is running
# Visit: http://localhost:8081/status
```

---

## What You'll See

1. **Onboarding Screen** (first time): Welcome message
2. **Empty Dashboard**: "Add Milestone" button
3. **Add Milestone Screen**: Form with date picker and emoji selector
4. **Milestone Cards**: Beautiful countdown cards with progress rings
5. **Detail View**: Full-screen visualization when you tap a card

---

## Troubleshooting

### iOS: "xcodebuild requires Xcode"
```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

### Port already in use?
```bash
npm start -- --reset-cache --port 8082
```

### Clear everything and start fresh?
```bash
cd /Users/jj/intime
rm -rf node_modules
npm install
npm start -- --reset-cache
```

---

## Quick Start Command

All-in-one for iOS:
```bash
cd /Users/jj/intime && (npm start & npm run ios)
```

Happy previewing! ⏱️
