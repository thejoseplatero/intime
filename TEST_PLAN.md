# InTime App - Comprehensive Test Plan

## Test Overview
**Date:** October 25, 2024  
**Tester:** QA Team  
**App Version:** 0.0.1  
**Platform:** Android  

---

## Test Scope

### Test Objective
Verify that InTime app functions correctly across all user journeys, from first launch to daily milestone management.

### Test Strategy
- **Functional Testing:** All user features
- **Integration Testing:** Data persistence, navigation flows
- **Regression Testing:** After each fix
- **User Acceptance Testing:** Real-world scenarios

---

## Pre-Test Setup

### Prerequisites
```bash
# Clean install
adb shell pm clear com.intime

# Rebuild app
cd /Users/jj/intime && npx react-native run-android

# Monitor logs
adb logcat | grep "ReactNativeJS"
```

### Test Data
- Test Birthday: January 1, 1990
- Test Milestones:
  - "Annual Health Check" - 6 months from today
  - "Summer Vacation" - 90 days from today
  - "Project Deadline" - 30 days from today

---

## Test Cases

### TC-001: First Launch & Onboarding
**Priority:** P0 (Critical)  
**Type:** Functional  

**Steps:**
1. Install app fresh (clear app data)
2. Launch app
3. Verify onboarding screen appears
4. Verify birthday picker is visible
5. Select date: January 1, 1990
6. Tap "Continue"
7. Verify onboarding completes

**Expected Result:**
- App shows onboarding screen
- Date picker opens and accepts input
- Onboarding completes successfully
- Dashboard appears after onboarding

**Pass Criteria:** ✅ No errors, smooth transition to dashboard

---

### TC-002: Birthday Milestone Creation
**Priority:** P0 (Critical)  
**Type:** Functional  

**Steps:**
1. Complete onboarding with birthday
2. View dashboard
3. Verify birthday milestone exists
4. Verify countdown shows "You will be X age in"

**Expected Result:**
- Birthday milestone appears automatically
- Shows correct age calculation
- Countdown timer displays correctly

**Pass Criteria:** ✅ Birthday milestone created, age calculated correctly

---

### TC-003: Add Milestone - Basic Flow
**Priority:** P0 (Critical)  
**Type:** Functional  

**Steps:**
1. Tap "+" FAB button on dashboard
2. Enter title: "Trip to Japan"
3. Select date 180 days from today
4. Tap "Save"
5. Return to dashboard

**Expected Result:**
- Add screen opens
- Title input works
- Date picker works
- Milestone saves successfully
- Appears on dashboard

**Pass Criteria:** ✅ Milestone created and appears on dashboard

---

### TC-004: Add Milestone - Cancel
**Priority:** P1 (High)  
**Type:** Functional  

**Steps:**
1. Tap "+" FAB button
2. Enter partial title
3. Tap "Cancel"
4. Verify returns to dashboard

**Expected Result:**
- Cancel button works
- No errors
- Returns to dashboard
- No new milestone created

**Pass Criteria:** ✅ No errors, returns to dashboard cleanly

---

### TC-005: Add Milestone - Validation
**Priority:** P1 (High)  
**Type:** Functional  

**Steps:**
1. Tap "+" FAB button
2. Leave title blank
3. Tap "Save"

**Expected Result:**
- Save button disabled or grayed out
- Milestone not saved
- User must enter title

**Pass Criteria:** ✅ Validation works, no empty milestone created

---

### TC-006: Live Countdown - Real-time Updates
**Priority:** P0 (Critical)  
**Type:** Functional  

**Steps:**
1. Create milestone 1 day from now
2. Watch countdown timer
3. Wait 60 seconds
4. Verify timer updates

**Expected Result:**
- Timer shows days, hours, minutes, seconds
- Updates every second
- Counts down correctly
- Omits zero values

**Pass Criteria:** ✅ Timer updates in real-time, no lag

---

### TC-007: Birthday Countdown Display
**Priority:** P0 (Critical)  
**Type:** Functional  

**Steps:**
1. View dashboard
2. Find birthday milestone
3. Verify text shows "You will be X age in"
4. Verify countdown format

**Expected Result:**
- Special birthday display format
- Shows correct age
- Countdown works correctly

**Pass Criteria:** ✅ Birthday displays with age, countdown accurate

---

### TC-008: Milestone Sorting
**Priority:** P1 (High)  
**Type:** Functional  

**Steps:**
1. Create milestone 30 days away
2. Create milestone 90 days away  
3. Create milestone 365 days away
4. View dashboard

**Expected Result:**
- Milestones sorted by proximity
- Nearest milestone appears first
- Birthday milestone appears first if it's soonest

**Pass Criteria:** ✅ Milestones sorted correctly by date

---

### TC-009: Pull to Refresh
**Priority:** P1 (High)  
**Type:** Functional  

**Steps:**
1. View dashboard
2. Pull down to refresh
3. Verify refresh completes
4. Verify data reloads

**Expected Result:**
- Pull-to-refresh works
- No errors
- Data refreshes

**Pass Criteria:** ✅ Refresh works, no errors

---

### TC-010: Data Persistence
**Priority:** P0 (Critical)  
**Type:** Integration  

**Steps:**
1. Create 3 milestones
2. Close app completely
3. Reopen app
4. Verify milestones still exist

**Expected Result:**
- All milestones persist
- No data loss
- Milestones appear correctly

**Pass Criteria:** ✅ Data persists across app restarts

---

### TC-011: Empty State
**Priority:** P1 (High)  
**Type:** Functional  

**Steps:**
1. Complete onboarding
2. View dashboard (should have only birthday)
3. If no milestones, verify empty state shows
4. Verify "+ Add Milestone" button visible

**Expected Result:**
- Empty state displays correctly
- Message: "Time to begin"
- Add Milestone button visible

**Pass Criteria:** ✅ Empty state displays, button works

---

### TC-012: Navigation - Dashboard to Add
**Priority:** P0 (Critical)  
**Type:** Functional  

**Steps:**
1. From dashboard, tap "+" FAB
2. Verify Add Milestone screen opens
3. Verify header shows "Add Milestone"

**Expected Result:**
- Navigation works
- Screen transitions smoothly
- No errors

**Pass Criteria:** ✅ Navigates successfully, no errors

---

### TC-013: Navigation - Cancel to Dashboard
**Priority:** P1 (High)  
**Type:** Functional  

**Steps:**
1. Navigate to Add Milestone screen
2. Tap "Cancel"
3. Verify returns to dashboard

**Expected Result:**
- Returns to dashboard
- No errors
- No navigation stack issues

**Pass Criteria:** ✅ Cancel works, returns to dashboard

---

### TC-014: Milestone Reached Celebration
**Priority:** P2 (Medium)  
**Type:** Functional  

**Steps:**
1. Create milestone with date in past
2. View milestone
3. Verify celebration screen shows

**Expected Result:**
- Celebration emojis appear
- "You made it!" message shows
- No errors

**Pass Criteria:** ✅ Celebration displays when milestone reached

---

### TC-015: Date Picker - iOS
**Priority:** P1 (High)  
**Type:** Platform Specific  

**Steps:**
1. Run on iOS
2. Tap date picker
3. Select date
4. Tap "Done"
5. Verify picker closes

**Expected Result:**
- Date picker works on iOS
- "Done" button closes picker
- No errors

**Pass Criteria:** ✅ iOS date picker works correctly

---

### TC-016: Date Picker - Android
**Priority:** P1 (High)  
**Type:** Platform Specific  

**Steps:**
1. Tap date picker
2. Select date
3. Verify picker closes automatically
4. Date displays correctly

**Expected Result:**
- Android date picker works
- Closes automatically
- No errors

**Pass Criteria:** ✅ Android date picker works correctly

---

### TC-017: Long Title Handling
**Priority:** P2 (Medium)  
**Type:** Edge Case  

**Steps:**
1. Add milestone with 50 character title
2. Verify title displays fully
3. Check on detail view

**Expected Result:**
- Long titles display correctly
- No truncation in cards
- Scrollable in detail view if needed

**Pass Criteria:** ✅ Handles long titles gracefully

---

### TC-018: Multiple Milestones
**Priority:** P1 (High)  
**Type:** Functional  

**Steps:**
1. Create 10 milestones
2. View dashboard
3. Verify all display
4. Verify sorting works
5. Test scroll performance

**Expected Result:**
- All milestones display
- No performance issues
- Smooth scrolling

**Pass Criteria:** ✅ Handles multiple milestones, good performance

---

### TC-019: Settings Button
**Priority:** P2 (Medium)  
**Type:** Functional  

**Steps:**
1. Tap ⚙️ button on dashboard
2. Verify settings screen opens (if implemented)
3. Or verify no crash

**Expected Result:**
- Settings button visible
- No crash if not implemented
- Future: Edit birthday

**Pass Criteria:** ✅ No errors when tapping settings

---

### TC-020: App Restart - Onboarding Persistence
**Priority:** P0 (Critical)  
**Type:** Integration  

**Steps:**
1. Complete onboarding
2. Close app
3. Reopen app
4. Verify not asked for onboarding again

**Expected Result:**
- Onboarding status persists
- Goes straight to dashboard
- No re-onboarding

**Pass Criteria:** ✅ Onboarding shown only once

---

## Edge Cases & Error Scenarios

### EC-001: Network Disconnection
- App works offline (local storage)
- No network-related errors

### EC-002: Low Memory
- App handles low memory gracefully
- No crashes

### EC-003: Date in Far Future
- Handles dates 50+ years away
- Countdown still works

### EC-004: Rapid Navigation
- Quick open/close of Add Milestone
- No race conditions
- No crashes

### EC-005: Date Selection Edge Cases
- Leap year dates
- February 29
- Year 2100+

---

## Performance Tests

### PT-001: App Launch Time
**Expected:** < 2 seconds  
**Status:** ⏳ Pending

### PT-002: Countdown Timer Performance
**Expected:** Smooth 60fps  
**Status:** ⏳ Pending

### PT-003: Scroll Performance
**Expected:** Smooth scrolling with 20+ milestones  
**Status:** ⏳ Pending

---

## Regression Tests (After Each Fix)

1. ✅ Onboarding completes
2. ✅ Dashboard loads
3. ✅ Add milestone works
4. ✅ Cancel works
5. ✅ Countdown updates
6. ✅ Data persists

---

## Test Results Summary

### Pass Rate Target: 100%
### Current Status: ⏳ Testing in Progress

---

## Known Issues

1. ~~Navigation goBack() error~~ - FIXED
2. ~~ProgressRing WorkletsError~~ - FIXED  
3. ~~useEffect cleanup error~~ - FIXED

---

## Test Execution Log

**Date:** October 25, 2024  
**Testers:** QA Team  
**Build:** 7b8da80  

| Test ID | Status | Notes |
|---------|--------|-------|
| TC-001 | ⏳ Pending | |
| TC-002 | ⏳ Pending | |
| TC-003 | ⏳ Pending | |
| ... | ... | ... |

---

## Sign-off

**Tested By:** _______________  
**Date:** _______________  
**Status:** Approved / Rejected  
**Notes:** _______________

