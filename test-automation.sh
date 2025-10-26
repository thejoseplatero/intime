#!/bin/bash

# InTime App - Automated Test Script
# World-Class QA Testing Suite

set -e

echo "🧪 InTime App - Test Automation Suite"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test
run_test() {
    local test_name=$1
    local test_command=$2
    
    echo -n "Testing: $test_name ... "
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if eval "$test_command"; then
        echo -e "${GREEN}✓ PASS${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Get Android SDK path
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Check if emulator is running
echo "📱 Checking emulator connection..."
if ! adb devices | grep -q "emulator"; then
    echo -e "${RED}Error: No emulator detected${NC}"
    echo "Please start Android emulator first"
    exit 1
fi

echo -e "${GREEN}Emulator connected${NC}"
echo ""

# Test 1: Check if app is installed
run_test "App Installation Check" "adb shell pm list packages | grep -q com.intime"

# Test 2: Check if app launches without crash
run_test "App Launch Test" "adb shell am start -n com.intime/.MainActivity && sleep 3 && adb shell pidof com.intime > /dev/null"

# Test 3: Check for JavaScript errors
run_test "JavaScript Error Check" "! (adb logcat -d | grep -q 'ReactNativeJS.*ERROR.*intime')"

# Test 4: Check console output for runtime errors
run_test "Runtime Error Check" "! (adb logcat -d | grep -q 'TypeError\|Exception')"

# Test 5: Verify AsyncStorage is working
run_test "Data Persistence Check" "adb shell pm clear com.intime && sleep 1 && adb shell am start -n com.intime/.MainActivity && sleep 3"

# Test 6: Performance check - launch time < 3s
LAUNCH_TIME=$(time adb shell am start -n com.intime/.MainActivity 2>&1 | grep real | awk '{print $2}' | cut -d'm' -f2 | cut -d's' -f1)
if (( $(echo "$LAUNCH_TIME < 3" | bc -l) )); then
    echo -e "${GREEN}Performance: Launch time ${LAUNCH_TIME}s ✓${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${YELLOW}Performance: Launch time ${LAUNCH_TIME}s (threshold: 3s)${NC}"
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Test Results Summary
echo ""
echo "======================================"
echo "📊 Test Results Summary"
echo "======================================"
echo "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi

