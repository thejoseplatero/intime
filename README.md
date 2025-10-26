# InTime

A mindful countdown app that shows how much time you have left — until birthdays, anniversaries, goals, and life milestones.

## Features

- ✨ Simple three-screen onboarding
- 📅 Birthday milestone automatically created from your birthday
- ⏱️ Live countdown timers (years, days, hours, minutes, seconds)
- 📝 Create and track multiple milestones
- 🎯 Beautiful, calm UI inspired by Headspace
- 💾 Local storage with AsyncStorage

## Getting Started

### Prerequisites

- Node.js >= 20
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

```bash
# Install dependencies
npm install

# For iOS (requires CocoaPods)
cd ios && pod install && cd ..

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Project Structure

```
intime/
├── src/
│   ├── components/      # Reusable components
│   │   ├── LiveCountdown.tsx
│   │   ├── ProgressRing.tsx
│   │   └── GradientBackground.tsx
│   ├── screens/         # Screen components
│   │   ├── OnboardingScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── MilestoneDetailScreen.tsx
│   │   ├── AddMilestoneScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── utils/           # Utilities
│   │   ├── storage.ts
│   │   └── dateHelpers.ts
│   └── types/           # TypeScript types
│       └── index.ts
├── android/            # Android native code
├── ios/                # iOS native code
└── App.tsx            # Main app entry point
```

## Features in Detail

### Onboarding
- Birthday selection with calendar picker
- Stores birthday for automatic milestone creation
- One-time experience

### Dashboard
- Shows all milestones sorted by proximity
- Birthday milestone with special "You will be X age in" display
- Live countdown timers updating every second
- Empty state for first-time users
- Pull-to-refresh support

### Countdown Timers
- Displays: years, days, hours, minutes, seconds
- Automatically omits zero values
- Updates in real-time
- Special celebration view when milestone is reached

### Add Milestone
- Title input
- Date selection with calendar picker
- Automatic milestone creation and persistence

## Tech Stack

- **React Native** 0.82.1
- **TypeScript**
- **AsyncStorage** for local persistence
- **@react-native-community/datetimepicker** for date selection
- **react-native-safe-area-context** for safe areas
- **react-native-screens** for navigation
- **react-native-svg** for graphics

## Development

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Clear cache and rebuild
npm start -- --reset-cache
```

## License

MIT
