import { ActivityIndicator, PermissionsAndroid, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Modal from 'react-native-modal';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

import TakeIcon from '../../assets/icon/take.svg';
import ChooseIcon from '../../assets/icon/choose.svg';
import { Colors, Fonts, Size } from '../Theme/Theme';


const ChooseModal = ({ showModal, setShowModal, setImageUri }) => {
    const [cameraLoading, setCameraLoading] = useState(false);
    const [galleryLoading, setGalleryLoading] = useState(false);

    const pickImage = async () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                const uri = response.assets[0].uri;
                setImageUri(uri); // Assuming setImageUri is a function to set the selected image URI

            }
            setShowModal(false);
        });
    };

    const handleUpload = async () => {
        setGalleryLoading(true);
        try {
            let permission;
            if (Platform.OS === 'ios') {
                permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
            } else if (Platform.OS === 'android') {
                permission = Platform.Version >= 33
                    ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                    : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
            }
            const permissionStatus = await check(permission);
            // console.log(permissionStatus)
            if (permissionStatus === 'granted') {
                pickImage(); // Proceed with image picker if permission is granted
            } else {
                // Request permission if not granted
                const result = await request(permission);
                if (result === 'granted') {
                    pickImage();
                } else {
                    console.log('Gallery permission denied');
                }
            }
        } catch (error) {
            console.error('Error checking or requesting gallery permission:', error);
        }
        finally {
            setGalleryLoading(false);
        }
    };


    const pickImageFromCamera = async () => {
        const options = {
            mediaType: 'photo', // Specify media type as photo
            quality: 1,         // Set quality to 1 for highest quality
        };

        launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.errorMessage) {
                console.log('Camera Error: ', response.errorMessage);
            } else {
                const uri = response?.assets[0]?.uri;
                if (uri) {
                    setImageUri(uri); // Assuming setImageUri is a function to set the selected image URI
                }
            }
            setShowModal(false);
        });
    };

    const handleTakePhoto = async () => {
        try {
            let permission;

            if (Platform.OS === 'ios') {
                permission = PERMISSIONS.IOS.CAMERA; // Use CAMERA permission for iOS
            } else if (Platform.OS === 'android') {
                permission = PermissionsAndroid.PERMISSIONS.CAMERA; // Use CAMERA permission for Android
            }

            const permissionStatus = await check(permission);

            if (permissionStatus === RESULTS.GRANTED) {
                pickImageFromCamera(); // Proceed with image picker if permission is granted
            } else {
                // Request camera permission if not granted
                const result = await request(permission);
                if (result === RESULTS.GRANTED) {
                    pickImageFromCamera(); // Proceed with image picker if permission is granted after request
                } else {
                    console.log('Camera permission denied');
                }
            }
        } catch (error) {
            console.error('Error checking or requesting camera permission:', error);
        } finally {
            setCameraLoading(false);
        }
    };

    return (
        <Modal
            style={styles.ModalContainer}
            animationIn="bounceInUp"
            animationOut="slideOutDown"
            animationInTiming={1000}
            animationOutTiming={1000}
            isVisible={showModal}
            onBackdropPress={() => setShowModal(false)}
        >
            <View style={styles.Container}>
                <TouchableOpacity style={styles.TextContainer} onPress={handleTakePhoto}>
                    {cameraLoading ?
                        <ActivityIndicator color={Colors.Black_000000} size={25} />
                        :
                        <TakeIcon />
                    }
                    <Text style={styles.Text}>Take photo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.TextContainer} onPress={pickImage}>
                    {galleryLoading ?
                        <ActivityIndicator color={Colors.Black_000000} size={25} />
                        :
                        <ChooseIcon />
                    }
                    <Text style={styles.Text}>Choose from gallery</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default ChooseModal

const styles = StyleSheet.create({
    ModalContainer: {
        flex: 1,
        padding: 0,
        margin: 0,
        paddingHorizontal: 20,
    },
    Container: {
        width: '100%',
        height: 132,
        backgroundColor: Colors.white_fffff,
        borderRadius: 10,
        paddingHorizontal: 32,
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 5
    },
    TextContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: "center",
        gap: 10,
        height: 50,
    },
    Text: {
        fontFamily: Fonts.regular,
        fontSize: Size.md_16,
        color: Colors.Black_000000,
        letterSpacing: 1,
        lineHeight: 20
    }
})