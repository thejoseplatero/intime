import React from 'react';
import { View, StyleSheet } from 'react-native';

interface GradientBackgroundProps {
  colors: string[];
  children: React.ReactNode;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  colors,
  children,
}) => {
  // Create a simple gradient effect using a colored view
  // For a true gradient, you'd use react-native-linear-gradient or similar
  const gradientStyle = {
    backgroundColor: colors[0] || '#fff',
  };

  return (
    <View style={[styles.container, gradientStyle]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
