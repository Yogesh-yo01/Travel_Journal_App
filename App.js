import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './src/SplashScreen/SplashScreen';

const Stack = createStackNavigator();
const App = () => {
  const [splashVisible, setSplashVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [profileSetup, setProfilesetup] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setSplashVisible(false);
    }, 2050);
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value === null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true); //For First Time Show Onboarding Screen
      } else {
        setIsFirstLaunch(false);
      }
    });
    // getFCMToken();
    // checkLoginStatus();
  }, []);
  if (splashVisible) {
    return (
      <SplashScreen/>
    );
  }
  return (
    <View>
      <Text>App.js</Text>
    </View>
  )
}

export default App

const styles = StyleSheet.create({})