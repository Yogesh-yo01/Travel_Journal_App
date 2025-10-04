import { Image, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors, Fonts, Size } from '../Theme/Theme'
import AppLogo from '../../assets/AppLogo/AppLogo.png'
const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor='transparent' />
            <Image source={AppLogo} style={{ width: 200, height: 200 }} />
            <Text style={{ fontSize: 20, color: Colors.primary_007bff }}>Travel Journal</Text>
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white_fffff,
    },
    title: {
        fontSize: Size.md_20,
        color: Colors.primary_007bff,
        fontFamily: Fonts.bold,
    }
})