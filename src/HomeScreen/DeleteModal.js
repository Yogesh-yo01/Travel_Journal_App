import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal'
import { Colors, Fonts, Size } from '../Theme/Theme'

const DeleteModal = ({ isVisible, setIsVisible, onPress }) => {
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={() => setIsVisible(false)}
        >
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Delete Journal</Text>
                <Text style={styles.modalText}>Are you sure you want to delete this journal?</Text>
                <View style={styles.modalButtons}>
                    <TouchableOpacity style={styles.modalButton} onPress={() => setIsVisible(false)}>
                        <Text style={styles.modalButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={onPress}>
                        <Text style={styles.modalDeleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default DeleteModal

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: Colors.white_fffff,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: Size.md_20,
        fontFamily: Fonts.bold,
        marginBottom: 20,
        color: Colors.Black_000000,
    },
    modalText: {
        fontSize: Size.md_16,
        fontFamily: Fonts.regular,
        marginBottom: 20,
        textAlign: 'center',
        color: Colors.blue_090040,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
    },
    modalButton: {
        padding: 10,
        borderRadius: 5,
    },
    modalButtonText: {
        fontSize: Size.md_16,
        fontFamily: Fonts.bold,
        color: Colors.Black_000000,
    },
    modalDeleteButtonText: {
        fontSize: Size.md_16,
        fontFamily: Fonts.bold,
        color: Colors.red_FF0202,
    },
})