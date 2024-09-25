import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, Fonts} from '../utils';
import {heightPercentageToDP as hp} from './Pixel';

const getRandomColor = () => {
  const colors = ['#8fce00', '#edbb23', '#f055b0', '#e34949'];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const ProfilePhoto = ({username}) => {
  // Extract the first two characters of the username and convert them to uppercase
  const initials = username ? username.substring(0, 2).toUpperCase() : '';
  const backgroundColor = getRandomColor();
  return (
    <View style={styles.container}>
      <View style={[styles.circle, {backgroundColor}]}>
        <Text style={styles.text}>{initials}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 7,
  },
  circle: {
    width: 35, // Adjust size as needed
    height: 35, // Adjust size as needed
    borderRadius: 35, // Half of the width and height to make it a circle
    backgroundColor: '#3498db', // Change to any color or use a function to generate a color
    alignItems: 'center', // Center the text horizontally
    justifyContent: 'center', // Center the text vertically
  },
  text: {
    color: COLORS.white, // Text color
    fontSize: hp(2), // Adjust font size for two characters
    fontWeight: Fonts.FONTS.PoppinsBold, // Make text bold
  },
});

export default ProfilePhoto;
