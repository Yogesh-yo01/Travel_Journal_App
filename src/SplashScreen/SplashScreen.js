import { Image, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors, Fonts, Size } from '../Theme/Theme'
import AppLogo from '../../assets/AppLogo/AppLogo.png'
const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor='transparent' />
            <View style={styles.body}>
                <Image source={AppLogo} style={{ width: 200, height: 200 }} />
                <Text style={styles.title}>Travel Journal</Text>
            </View>
            <Text style={styles.tagline}>Capture your journeys, even offline</Text>

        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.blue_E0E9FB,
    },
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: Size.lg_30,
        color: Colors.Black_000000,
        fontFamily: Fonts.bold,
    },
    tagline: {
        fontSize: Size.md_16,
        color: Colors.gray,
        fontFamily: Fonts.regularAS,
        bottom:20
    }
})