import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors, Fonts, Size } from '../Theme/Theme'
import GoogleLogo from '../../assets/login/google.png'
import AppleLogo from '../../assets/login/apple.png'
import AsyncStorage from '@react-native-async-storage/async-storage'
const Login = ({ navigation }) => {

  const handleLogin = async () => {
    console.log('Login pressed')
    await AsyncStorage.setItem('logedin', 'true');
    navigation.navigate('TabNavigation')
  }
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor='transparent' />
      <View style={styles.LogoContainer}>
        {/* Title */}
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.tagline}>Capture your adventures and memories</Text>
        {/* Login Buttons */}
        <View style={styles.LoginContainer}>
          <TouchableOpacity style={styles.GoogleButton} onPress={handleLogin}>
            <Image source={GoogleLogo} style={styles.GoogleLogo} />
            <Text style={styles.GoogleText}>Continue with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.AppleButton} onPress={handleLogin}>
            <Image source={AppleLogo} style={styles.AppleLogo} />
            <Text style={styles.AppleText}>Continue with Apple</Text>
          </TouchableOpacity>
          
          <Text style={styles.footerNote}>
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
        </View>
      </View>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white_F2F8FF
  },
  LogoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: Size.lg_24,
    color: Colors.Black_000000,
    fontFamily: Fonts.bold,
  },
  tagline: {
    fontSize: Size.md_16,
    color: Colors.gray,
    fontFamily: Fonts.mediumAS,
  },
  LoginContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Size.lg_26,
    marginTop: Size.lg_24,
    backgroundColor: Colors.white_fffff,
    borderRadius: Size.sm_12,
    shadowColor: Colors.placeHolder_gray, //secondary text color
    elevation: 6,
    gap: 20,
  },
  GoogleButton: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    padding: Size.md_16,
    borderRadius: Size.sm_12,
    backgroundColor: Colors.white_fffff,
    borderWidth: 0.5,
    borderColor: Colors.placeHolder_gray,
  },
  GoogleLogo: {
    width: 24,
    height: 24,
  },
  GoogleText: {
    fontSize: Size.md_16,
    color: Colors.gray,
    fontFamily: Fonts.mediumAS,
  },
  AppleButton: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    padding: Size.md_16,
    borderRadius: Size.sm_12,
    backgroundColor: Colors.Black_000000,
    borderWidth: 0.5,
    borderColor: Colors.placeHolder_gray,
  },
  AppleLogo: {
    width: 24,
    height: 24,
  },
  AppleText: {
    fontSize: Size.md_16,
    color: Colors.white_fffff,
    fontFamily: Fonts.mediumAS,
  },
  footerNote: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: Size.md_16,
    color: Colors.gray,
    fontFamily: Fonts.mediumAS,
  },
})