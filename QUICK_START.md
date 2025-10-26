# Quick Start Guide - Preview InTime

## 📱 Preview on iOS (Recommended - Easiest)

Since you have Xcode installed, this is the quickest way to preview:

### Step 1: Install iOS Dependencies
```bash
cd /Users/jj/intime
cd ios
bundle exec pod install
cd ..
```

### Step 2: Start Metro Bundler
```bash
npm start
```
Keep this terminal window open!

### Step 3: Run on iOS Simulator
Open a NEW terminal window and run:
```bash
cd /Users/jj/intime
npm run ios
```

This will:
- Open the iOS Simulator automatically
- Build and install your app
- Launch InTime

---

## 🤖 Preview on Android

If you have Android Studio installed:

### Step 1: Start an Android Emulator
1. Open Android Studio
2. Click "Device Manager"
3. Create a virtual device if you don't have one
4. Start the emulator

### Step 2: Start Metro Bundler
```bash
cd /Users/jj/intime
npm start
```

### Step 3: Run on Android
In a new terminal:
```bash
npm run android
```

---

## 📱 Preview on Physical Device

### iOS (Physical Device)
1. Connect your iPhone via USB
2. Trust the computer on your phone
3. Run: `npm run ios`

### Android (Physical Device)
1. Enable USB Debugging on your Android device
2. Connect via USB
3. Run: `npm run android`

---

## ⚡ Quick Commands

```bash
# Terminal 1: Start Metro
npm start

# Terminal 2: Run iOS
npm run ios

# Terminal 2: Run Android (if Android Studio is installed)
npm run android
```

---

## 🎨 What You'll See

1. **Onboarding Screen**: Welcome message with "Get Started" button
2. **Dashboard**: Empty state with "Add Milestone" button
3. **Add Milestone**: Form with emoji selector, date picker, categories
4. **Milestone Cards**: Beautiful countdown cards with progress rings
5. **Detail View**: Full-screen visualization with motivational text

Try adding a milestone like:
- **Title**: "Trip to Tokyo"
- **Date**: Future date
- **Emoji**: ✈️
- **Category**: Travel

---

## 🐛 Troubleshooting

### iOS pod install fails?
```bash
cd ios
bundle install
bundle exec pod install
```

### Metro bundler won't start?
```bash
npm install
npm start -- --reset-cache
```

### App crashes on launch?
- Make sure all dependencies are installed: `npm install`
- Clear cache: `npm start -- --reset-cache`

---

## 🎯 Try These Features

1. ✅ Add your first milestone
2. ✅ Choose different emojis
3. ✅ Select a category (colors change!)
4. ✅ Add a personal note
5. ✅ Tap a milestone to see the detail view
6. ✅ Edit a milestone
7. ✅ Delete a milestone

Enjoy exploring InTime! ⏱️
