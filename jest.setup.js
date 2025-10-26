// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return React.forwardRef((props, ref) => (
    React.createElement(View, { testID: 'datetimepicker', ...props }, 
      props.value && React.createElement(Text, null, props.value.toString())
    )
  ));
});
