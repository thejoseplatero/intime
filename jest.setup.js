import '@testing-library/jest-native/extend-expect';

// Mock React Native modules
jest.mock('react-native-reanimated', () => {
  const RNReanimated = {
    default: {
      spring: () => ({ start: jest.fn() }),
      timing: () => ({ start: jest.fn() }),
    },
    useSharedValue: (val: any) => ({ value: val }),
    useAnimatedStyle: (callback: any) => ({ value: callback() }),
    withSpring: (val: any) => val,
    withTiming: (val: any) => val,
    interpolate: () => 0,
    Extrapolation: { CLAMP: 'clamp' },
  };
  return RNReanimated;
});

jest.mock('react-native-worklets', () => ({ runOnJS: (fn: any) => fn }));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  return React.forwardRef((props: any, ref: any) => (
    <div data-testid="datetimepicker" {...props}>
      {props.value && props.value.toString()}
    </div>
  ));
});

