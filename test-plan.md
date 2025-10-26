# InTime App Test Plan

## Current Status
✅ DashboardScreen errors resolved by removing reanimated dependency
✅ App builds and installs successfully
✅ No "DashboardScreen is undefined" errors

## Test Checklist

### Test 1: Onboarding Flow
- [ ] App launches on fresh install
- [ ] Birthday picker displays
- [ ] Can select birthday date
- [ ] Can complete onboarding
- [ ] Onboarding completion persists after app restart

### Test 2: Dashboard Screen
- [ ] Dashboard displays after onboarding
- [ ] Birthday milestone is automatically created
- [ ] Countdown timer displays correctly (days, hours, minutes, seconds)
- [ ] Empty state shows when no custom milestones
- [ ] Pull-to-refresh works
- [ ] Settings button (⚙️) is clickable

### Test 3: Add Milestone
- [ ] + button (FAB) appears on dashboard
- [ ] Clicking FAB opens Add Milestone screen
- [ ] Can enter milestone title
- [ ] Can select date with calendar picker
- [ ] Can save new milestone
- [ ] New milestone appears on dashboard after save

### Test 4: Live Countdown
- [ ] Countdown timer updates every second
- [ ] Birthday milestone shows correct age calculation
- [ ] Days, hours, minutes, seconds decrease correctly
- [ ] Zero values are omitted from display
- [ ] Celebration screen shows when milestone is reached

### Test 5: Milestone Detail View
- [ ] Can tap milestone card to open detail view
- [ ] Detail view shows full countdown
- [ ] Back navigation works to return to dashboard

### Test 6: Data Persistence
- [ ] Milestones persist after app restart
- [ ] Birthday persists after app restart
- [ ] Onboarding status persists after app restart

## Running Manual Tests

Run these commands to test the app:

```bash
# Reset app to test onboarding
adb shell pm clear com.intime

# Rebuild and install
cd /Users/jj/intime && npx react-native run-android

# Watch logs for errors
adb logcat | grep "ReactNativeJS"
```

