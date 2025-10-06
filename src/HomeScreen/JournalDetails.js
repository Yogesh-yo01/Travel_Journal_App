import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Colors, Fonts, Size } from '../Theme/Theme';

import DateIcon from '../../assets/icon/date.svg'
import LocationIcon from '../../assets/icon/location.svg'
import TimeIcon from '../../assets/icon/time.svg'
import BackArrowWhiteIcon from '../../assets/icon/backArrowWhite.svg'
import EditIcon from '../../assets/icon/editg.svg'
import DeleteIcon from '../../assets/icon/delete.svg'

import moment from 'moment';
import ImageViewing from 'react-native-image-viewing';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DeleteModal from './DeleteModal';
import { deleteJournal } from '../DB/database';
import Toast from 'react-native-simple-toast'

const JournalDetails = ({ navigation, route }) => {
    const { journal } = route.params || {};
    const [visible, setIsVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    const handleImagePress = (index) => {
        setImageIndex(index);
        setIsVisible(true);
    };
    const handleDelete = async () => {
        try {
            await deleteJournal(journal.id);
            Toast.show("Journal deleted successfully");
            setDeleteVisible(false);
            navigation.goBack();
        } catch (error) {
            console.error('Error deleting journal:', error);
        }
    };
    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView>
                <StatusBar translucent backgroundColor='transparent' />
                <View style={styles.HeaderContainer}>
                    <View style={styles.IconsContainer}>
                        <TouchableOpacity style={styles.HeaderBackButton} onPress={() => navigation.goBack()}>
                            <BackArrowWhiteIcon />
                        </TouchableOpacity>
                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <TouchableOpacity style={styles.EditIcon} onPress={() => navigation.navigate('AddNew', { journal })}>
                                <EditIcon />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.EditIcon} onPress={() => setDeleteVisible(true)}>
                                <DeleteIcon width={22} height={22} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Image source={{ uri: journal.photos[0] }} resizeMode='stretch' style={styles.image} />
                </View>
                <View style={styles.BodyContainer}>
                    <Text style={styles.title}>{journal.title}</Text>
                    <View style={styles.DatesContainer}>
                        <View style={styles.Date}>
                            <DateIcon />
                            <Text style={styles.itemDescription}>{moment(Number(journal?.date)).format('MMM D, YYYY')}</Text>
                        </View>
                        <View style={styles.Date}>
                            <TimeIcon />
                            <Text style={styles.itemDescription}>{moment(Number(journal?.date)).format('h:mm A')}</Text>
                        </View>
                    </View>
                    <View style={styles.Date}>
                        <LocationIcon />
                        <Text style={styles.itemDescription}>{journal.location || 'N/A'}</Text>
                    </View>
                    <View style={styles.TagsContainer}>
                        {journal.tags.map((tag, index) => (
                            <View key={index} style={styles.tag}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                    <Text style={[styles.itemDescription, { color: Colors.Black_000000 }]}>{journal?.description || 'No Description'}</Text>
                    <View style={styles.PhotoContainer}>
                        <Text style={styles.PhotoLabelText}>Photos</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, justifyContent: "flex-start" }}>
                            {journal.photos.map((image, i) => (
                                <TouchableOpacity style={{ marginTop: 20 }} key={i} onPress={() => handleImagePress(i)}>
                                    <Image source={{ uri: image }} style={styles.AllImage} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <ImageViewing
                            images={journal.photos.map(uri => ({ uri }))}
                            imageIndex={imageIndex}
                            visible={visible}
                            onRequestClose={() => setIsVisible(false)}
                        />
                    </View>
                </View>
            </KeyboardAwareScrollView>
            <DeleteModal
                isVisible={deleteVisible}
                setIsVisible={setDeleteVisible}
                onPress={handleDelete}
            />
        </View>
    )
}

export default JournalDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white_F2F8FF
    },
    HeaderContainer: {
        width: '100%',
        maxHeight: 300,
    },
    IconsContainer: {
        position: "absolute",
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        top: 50,
        paddingHorizontal: 20,
    },
    HeaderBackButton: {
        width: 40,
        height: 40,
        zIndex: 10,
    },
    EditIcon: {
        width: 40,
        height: 40,
        zIndex: 10,
        backgroundColor: '#E7ECE6',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    BodyContainer: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        gap: 20
    },
    title: {
        fontSize: Size.md_16,
        color: Colors.Black_000000,
        fontFamily: Fonts.semiBold,
    },
    DatesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 20,
    },
    Date: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 5,
    },
    itemDescription: {
        color: Colors.gray,
        fontSize: Size.sm_14,
        fontFamily: Fonts.regular,
        lineHeight: 20
    },
    TagsContainer: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
        flexWrap: 'wrap',
    },
    tag: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        backgroundColor: Colors.blue_E0E9FB,
        // marginTop: 20,
    },
    tagText: {
        color: Colors.primary,
        fontSize: Size.md_16,
        fontFamily: Fonts.regular,
    },
    PhotoContainer: {
        width: "100%",
    },
    PhotoLabelText: {
        color: Colors.Black_000000,
        fontSize: Size.md_16,
        fontFamily: Fonts.medium,
    },
    AllImage: {
        width: 180,
        height: 180,
        borderRadius: 12,
    }
})