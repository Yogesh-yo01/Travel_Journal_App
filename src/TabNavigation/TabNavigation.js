/* eslint-disable react/no-unstable-nested-components */
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../HomeScreen/HomeScreen'
import Profile from '../Profile/Profile'
import HomeIcon from '../../assets/icon/homeGrey.svg'
import HomeBlackIcon from '../../assets/icon/homeblack.svg'
import ProfileIcon from '../../assets/icon/profileGreyFill.svg'
import ProfileBlackIcon from '../../assets/icon/profile.svg'
import { Colors, Fonts, Size } from '../Theme/Theme'

const Tab = createBottomTabNavigator()

const TabNavigation = () => {
    const screenOptions = ({ route }) => ({
        tabBarIcon: ({ focused }) => {
            if (route.name === 'Home') {
                return focused ? <HomeBlackIcon /> : <HomeIcon />
            } else if (route.name === 'Profile') {
                return focused ? <ProfileBlackIcon /> : <ProfileIcon />
            }
        },
        tabBarLabel: ({ focused }) => {
            if (route.name === 'Home') {
                return focused ? <Text style={styles.focusedTab}>Home</Text> : <Text style={styles.unfocusedTab}>Home</Text>
            } else if (route.name === 'Profile') {
                return focused ? <Text style={styles.focusedTab}>Profile</Text> : <Text style={styles.unfocusedTab}>Profile</Text>
            }
        },
        tabBarStyle: {
            height: 62,
        },
    })
    return (
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        </Tab.Navigator>
    )
}

export default TabNavigation

const styles = StyleSheet.create({
    focusedTab: {
        color: Colors.Black_000000,
        fontSize: Size.md_16,
        fontFamily: Fonts.medium,

    },
    unfocusedTab: {
        color: Colors.placeHolder_gray,
        fontSize: Size.md_16,
        fontFamily: Fonts.medium,
    },
})