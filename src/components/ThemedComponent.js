import React from 'react';
import { View, Text, Switch, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../utils/ThemeProvider'; // Adjust the path as needed

const ThemedComponent = () => {
  const { theme, toggleTheme, colorTheme } = useTheme();

  return (
    <ScrollView style={[styles.scrollView, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.text, { color: theme.text }]}>
          {colorTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
        </Text>
        <Switch
          trackColor={{ false: 'gray', true: 'green' }}
          ios_backgroundColor={'white'}
          thumbColor={'#fff'}
          onValueChange={toggleTheme}
          value={colorTheme === 'dark'}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default ThemedComponent;
