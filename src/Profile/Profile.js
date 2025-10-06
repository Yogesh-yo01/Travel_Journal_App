import { Image, Linking, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, Fonts, Size } from '../Theme/Theme'
import BackIcon from '../../assets/icon/backb.svg'
import ProfileIcon from '../../assets/login/profile.png'

import ProfileAccIcon from '../../assets/icon/acc.svg'
import PrivacyIcon from '../../assets/icon/privacy.svg'
import HelpIcon from '../../assets/icon/help.svg'
import OpenIcon from '../../assets/icon/open.svg'
import LogoutIcon from '../../assets/icon/logout.svg'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import auth, { signOut } from "@react-native-firebase/auth";
import Toast from 'react-native-simple-toast'
import { getAuth, signOut } from "@react-native-firebase/auth";
const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const details = [
    {
      id: 1,
      title: "Privacy Control",
      icon: OpenIcon,
    },
    // {
    //   id: 2,
    //   title: "Account Settings",
    //   icon: OpenIcon,
    // },
    {
      id: 3,
      title: "Help & Support",
      icon: OpenIcon,
    },
    {
      id: 4,
      title: "Terms & Conditions",
      icon: OpenIcon,
    },
    {
      id: 5,
      title: "Privacy Policy",
      icon: OpenIcon,
    },
  ]
  const handleOpen = (item) => {
    switch (item.id) {
      case 1:
        Linking.openURL('https://en.wikipedia.org/wiki/Privacy_policy')
        break;
      case 2:
        Linking.openURL('https://www.privacypolicies.com/account-settings/')
        break;
      case 3:
        Linking.openURL('https://google.com')
        break;
      case 4:
        Linking.openURL('https://google.com')
        break;
      case 5:
        Linking.openURL('https://google.com')
        break;
      default:
        break;
    }
  }
  const getUser = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    console.log("Getting user Details In Profile:", user);
    setUser(user);
  }

  const handleGoogleLogout = async () => {
    try {
      console.log("Starting logout process...");

      const auth = getAuth();

      // Check if a user is signed in
      if (!auth.currentUser) {
        console.warn("No user currently signed in.");
        await AsyncStorage.removeItem("logedin");
        navigation.replace('Login');
        Toast.show("No user is signed in.");
        return;
      }

      // Firebase sign out
      await signOut(auth);
      console.log("Firebase sign out successful");
      // Revoke Google access
      await GoogleSignin.revokeAccess();
      console.log("Google access revoked");

      // Google sign out
      await GoogleSignin.signOut();
      console.log("Google sign out successful");


      // Show logout success message
      Toast.show("Logged out successfully");
      console.log("Toast displayed");

      // Remove login state from AsyncStorage
      await AsyncStorage.removeItem("logedin");
      console.log("AsyncStorage key removed");

      // Navigate to Login screen
      navigation.replace('Login');
      console.log("Navigation to Login successful");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  useEffect(() => {
    getUser();
  }, [])
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor='transparent' />
      <View style={styles.HeaderContainer}>
        <TouchableOpacity style={styles.HeaderBackButton} onPress={() => navigation.goBack()}>
          <BackIcon />
        </TouchableOpacity>
        <View style={styles.HeaderTitleContainer}>
          <Text style={styles.HeaderText}>My Profile</Text>
        </View>
      </View>
      <View style={styles.Body}>
        {/* Profile Container */}
        <View style={styles.ProfileContainer}>
          <View style={styles.Profile}>
            <Image source={{ uri: user?.photo } || ProfileIcon} resizeMode='contain' style={styles.ProfileImage} />
            <View style={styles.ProfileInfoContainer}>
              <Text style={styles.ProfileName}>{user?.name}</Text>
              <Text style={styles.ProfileEmail}>{user?.email}</Text>
            </View>
          </View>
        </View>
        {/* Profile Container */}
        <View style={styles.DetailsContainer}>
          {
            details.map((item, index) => (
              <TouchableOpacity key={item.id} onPress={() => handleOpen(item)} style={[styles.DetailItem, { borderBottomWidth: index === details.length - 1 ? 0 : 0.3, borderBottomColor: Colors.placeHolder_gray }]}>
                <Text style={styles.DetailText}>{item.title}</Text>
                <item.icon />
              </TouchableOpacity>
            ))
          }
        </View>
        <View style={styles.DetailsContainer}>
          <TouchableOpacity style={styles.DetailItem} onPress={handleGoogleLogout}>
            <Text style={styles.DetailText}>Logout</Text>
            <LogoutIcon />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white_F2F8FF
  },
  HeaderContainer: {
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.white_fffff,
    paddingTop: 42,
    paddingBottom: 20,
    elevation: 4,
  },
  HeaderBackButton: {
    flexGrow: 1,
  },
  HeaderTitleContainer: {
    flexGrow: 1.5,
  },
  HeaderText: {
    fontSize: Size.md_16,
    color: Colors.Black_000000,
    fontFamily: Fonts.semiBold,
  },
  Body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  ProfileContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white_fffff,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 10,
    elevation: 4,
  },
  Profile: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  ProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 80,
    borderWidth: 0.5,
    borderColor: Colors.gray,
  },
  ProfileInfoContainer: {

  },
  ProfileName: {
    fontSize: Size.md_16,
    color: Colors.Black_000000,
    fontFamily: Fonts.semiBold,
  },
  ProfileEmail: {
    fontSize: Size.md_16,
    color: Colors.gray,
    fontFamily: Fonts.mediumAS,
  },
  DetailsContainer: {
    width: "100%",
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: Colors.white_fffff,

    borderRadius: 10,
    elevation: 4,
    marginTop: 20,
  },
  DetailItem: {
    width: "100%",
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  DetailText: {
    fontSize: Size.md_16,
    color: Colors.Black_000000,
    fontFamily: Fonts.mediumAS,
  }
})