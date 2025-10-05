import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './src/SplashScreen/SplashScreen';
import Login from './src/LoginScreen/Login';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabNavigation from './src/TabNavigation/TabNavigation';
import AddNew from './src/HomeScreen/AddNew';

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
    checkLoginStatus();
  }, []);
  const checkLoginStatus = async () => {
    try {
      const AlreadyLogIn = await AsyncStorage.getItem('logedin');
      setIsLoggedIn(AlreadyLogIn == null ? false : true);

      // const Profilesetup = await AsyncStorage.getItem('setup');
      // setProfilesetup(Profilesetup == null ? false : true);

      const accessToken = await AsyncStorage.getItem('accessToken');
      // console.log('====================================');
      console.log('>==[ AccessToken In App.js]==>:', accessToken);
      // console.log('====================================');
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };
  if (splashVisible) {
    return (
      <SplashScreen />
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <NavigationContainer >
        <Stack.Navigator initialRouteName={isLoggedIn ? 'TabNavigation' : 'Login'}>

          <Stack.Screen name="Login" component={Login} options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="TabNavigation" component={TabNavigation} options={{ headerShown: false, animation: 'fade' }} />

          <Stack.Screen name="AddNew" component={AddNew} options={{ headerShown: false, animation: 'fade' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create({})