import { ActivityIndicator, Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Colors, Fonts, Size } from '../Theme/Theme'

import BackIcon from '../../assets/icon/backb.svg'
import UploadIcon from '../../assets/icon/upload.svg'
import RemoveIcon from '../../assets/icon/x.svg'
import DateIcon from '../../assets/icon/date.svg'
import AiIcon from '../../assets/login/ai.png'
import LocationIcon from '../../assets/icon/location.svg'


import ChooseModal from '../Component/ChooseModal'
import { APP_ID, API_KEY, USER_ID } from '../API/Endpoint'

import moment from 'moment'
import RNFS from "react-native-fs";
import { GOOGLE_MAPS_API_KEY } from '@env';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const AddNew = ({ navigation }) => {
    const [newJournalData, setNewJournalData] = useState({
        title: '',
        description: '',
        photos: [],
        date: new Date(),
        location: '',
        tags: [],
    });
    const [showModal, setShowModal] = useState(false);
    const [aiTags, setAiTags] = useState([]);
    const [aiTagsLoading, setAiTagsLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // from Clarifai portal
    const MODEL_ID = "general-image-recognition";
    const MODEL_VERSION_ID = "aa7f35c01e0642fda5cf400f543e7c40"; // stable version
    // const PAT = "your-personal-access-token"; // from Clarifai -> Secrets -> Personal Access Token
    const getClarifaiTags = async (uri) => {
        try {
            const base64 = await RNFS.readFile(uri, "base64");

            const response = await fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`, {
                method: "POST",
                headers: {
                    "Authorization": `Key ${API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_app_id: {
                        user_id: USER_ID,
                        app_id: APP_ID,
                    },
                    inputs: [
                        { data: { image: { base64 } } }
                    ],
                }),
            });

            const data = await response.json();
            console.log("data:", JSON.stringify(data, null, 2));

            if (!data.outputs || data.outputs.length === 0) return [];

            const tags = data.outputs[0].data.concepts
                .slice(0, 5)
                .map(c => c.name);

            return tags;
        } catch (error) {
            console.error("Clarifai tagging error:", error);
            return [];
        }
    };

    const searchLocations = (query) => {
        // Use the Google Places API to search for locations
        fetch(
            `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${GOOGLE_MAPS_API_KEY}&type=establishment&type=transit_station&type=bus_station&type=train_station&type=subway_station&type=airport&type=park&components=country:in`
        )
            .then(response => response.json())
            .then(data => {
                if (data.status === 'OK') {
                    // Transform the results to a simpler format
                    const formattedResults = data.predictions.map(prediction => ({
                        placeId: prediction.place_id,
                        description: prediction.description,
                        // We'll need to get the actual coordinates in a separate call
                        location: { lat: 0, lng: 0 }
                    }));

                    // For each result, get the coordinates
                    const detailPromises = formattedResults.map(result => {
                        return fetch(
                            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${result.placeId}&fields=geometry&key=${GOOGLE_MAPS_API_KEY}`
                        )
                            .then(response => response.json())
                            .then(detailData => {
                                if (detailData.status === 'OK') {
                                    result.location = detailData.result.geometry.location;
                                }
                                return result;
                            });
                    });

                    // Wait for all detail requests to complete
                    Promise.all(detailPromises).then(completedResults => {
                        console.log("completedResults:", completedResults);

                        setSearchResults(completedResults);
                    });
                } else {
                    console.error('Place Autocomplete API error:', data.status);
                    setSearchResults([]);
                }
            })
            .catch(error => {
                console.error('Error searching for locations:', error);
                setSearchResults([]);
            });
    };

    const handleAddNewJournal = (key, value) => {
        setNewJournalData({ ...newJournalData, [key]: value });
    }
    const handleSelectTags = (tag) => {
        setNewJournalData({
            ...newJournalData,
            tags: newJournalData.tags.includes(tag)
                ? newJournalData.tags.filter(t => t !== tag)
                : [...newJournalData.tags, tag],
        });
    }

    return (
        <View style={styles.container}>

            <StatusBar translucent backgroundColor='transparent' />
            <View style={styles.HeaderContainer}>
                <TouchableOpacity style={styles.HeaderBackButton} onPress={() => navigation.goBack()}>
                    <BackIcon />
                </TouchableOpacity>
                <View style={styles.HeaderTitleContainer}>
                    <Text style={styles.HeaderText}>New Journal Entry</Text>
                </View>
            </View>
            <KeyboardAwareScrollView>
                <View style={styles.ContentInputContainer}>
                    <Text style={styles.InputLabel}>Title</Text>
                    <TextInput
                        style={styles.InputField}
                        numberOfLines={1}
                        value={newJournalData.title}
                        placeholder='Enter Title...'
                        placeholderTextColor={Colors.placeholder}
                        onChangeText={(text) => handleAddNewJournal('title', text)}
                    />
                    <Text style={styles.InputLabel}>Description</Text>
                    <TextInput
                        style={[styles.InputField, { height: 60, textAlignVertical: 'top' }]}
                        numberOfLines={3}
                        multiline
                        placeholder='Write about your experience...'
                        placeholderTextColor={Colors.placeholder}
                        value={newJournalData.description}
                        onChangeText={(text) => handleAddNewJournal('description', text)}
                    />
                    <Text style={styles.InputLabel}>Photos (max 5)</Text>
                    <View style={styles.AddPhotosContainer}>
                        {newJournalData.photos.map((photo, index) => (
                            <View key={index} style={styles.ImageContainer}>
                                <TouchableOpacity style={styles.DeleteButton} onPress={() => setNewJournalData({ ...newJournalData, photos: newJournalData.photos.filter((_, i) => i !== index) })}>
                                    <RemoveIcon width={12} height={12} />
                                </TouchableOpacity>
                                <Image source={{ uri: photo }} resizeMode="stretch" style={styles.Image} />
                            </View>

                        ))}
                        {newJournalData.photos.length < 5 &&
                            <TouchableOpacity style={styles.AddPhotos} onPress={() => setShowModal(true)}>
                                <UploadIcon />
                                <Text style={styles.AddPhotosText}>Add Photo</Text>
                            </TouchableOpacity>}
                    </View>
                    <View style={styles.DateContainer}>
                        <DateIcon />
                        <View>
                            <Text style={styles.DateLabel}>Date & Time (Auto-filled)</Text>
                            <Text style={styles.DateText}>{moment(newJournalData.date).format('LL')}</Text>
                            <Text style={styles.TimeText}>{moment(newJournalData?.date).format('LT')}</Text>
                        </View>
                    </View>
                    <Text style={styles.InputLabel}>Location</Text>
                    <View style={styles.LocationContainer}>
                        <View style={styles.LocationIconContainer}>
                            <LocationIcon />
                        </View>
                        <TextInput
                            style={styles.LocationInput}
                            placeholder='Add Location...'
                            placeholderTextColor={Colors.placeholder}
                            onChangeText={(text) => {
                                // Store the search text in state
                                if (!searchText) {
                                    setSearchText(text);
                                } else {
                                    setSearchText(text);
                                    // Only search if text is 3 or more characters
                                    if (text.length >= 2) {
                                        searchLocations(text);
                                    } else {
                                        setSearchResults([]);
                                    }
                                }
                            }}
                            value={searchText}
                        />
                    </View>
                    {newJournalData.photos.length > 0 && <View style={styles.TagsLabelContainer}>
                        <Text style={[styles.InputLabel,]}>Ai-Generated Tags</Text>
                        <Image source={AiIcon} resizeMode="stretch" style={styles.AiIcon} />
                    </View>}
                    {newJournalData.photos.length > 0 &&
                        <View style={styles.TagsContainer}>
                            {aiTagsLoading ?
                                <ActivityIndicator size={24} color={Colors.primary} />
                                :
                                aiTags?.map((tag, index) => (
                                    <TouchableOpacity key={index} style={[styles.TagButton, newJournalData.tags.includes(tag) ? styles.selectedTagButton : {}]} onPress={() => handleSelectTags(tag)}>
                                        <Text style={[styles.TagText, newJournalData.tags.includes(tag) ? styles.selectedTagText : {}]}>{tag}</Text>
                                    </TouchableOpacity>
                                ))
                            }
                        </View>}

                </View>
            </KeyboardAwareScrollView>
            <ChooseModal
                showModal={showModal}
                setShowModal={setShowModal}
                // setImageUri={(uri) => setNewJournalData({ ...newJournalData, photos: [...newJournalData.photos, uri] })}
                setImageUri={async (uri) => {
                    setAiTagsLoading(true);
                    const updatedPhotos = [...newJournalData.photos, uri];
                    setNewJournalData({
                        ...newJournalData,
                        photos: updatedPhotos,

                    });
                    // Call AI to generate tags for this photo
                    console.log("uri>>>>>>>>>>> :", uri);
                    const NewAiTags = await getClarifaiTags(uri);//sending uri to Generate Tags
                    console.log("NewAiTags>>>>>>>>>>> :", NewAiTags);
                    setAiTagsLoading(false);
                    const updatedAiTags = [...new Set([...aiTags, ...NewAiTags])]

                    setAiTags(updatedAiTags); // AI suggestions
                }}
            />
        </View>
    )
}

export default AddNew

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white_EEF2F6
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
        fontFamily: Fonts.bold,
    },
    ContentInputContainer: {
        width: "100%",
        paddingHorizontal: 16,
    },
    InputLabel: {
        fontSize: Size.sm_14,
        color: Colors.Black_000000,
        fontFamily: Fonts.medium,
        marginTop: 20,
    },
    InputField: {
        width: "100%",
        height: 40,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: Size.md_16,
        color: Colors.Black_000000,
        fontFamily: Fonts.medium,
        backgroundColor: Colors.blue_bg_F2F8FF,
        marginTop: 10,
    },
    AddPhotosContainer: {
        width: "100%",
        marginTop: 10,
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10
    },
    AddPhotos: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: Colors.placeholder,
        justifyContent: "center",
        alignItems: "center",

    },
    AddPhotosText: {
        fontSize: Size.sm_14,
        color: Colors.grey_656565,
        fontFamily: Fonts.mediumAS,
    },
    ImageContainer: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    Image: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
    },
    DeleteButton: {
        position: "absolute",
        top: 2,
        right: 2,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.red_FF0202,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,

    },
    DateContainer: {
        width: "100%",
        borderRadius: 10,
        padding: 12,
        paddingVertical: 20,
        backgroundColor: Colors.blue_bg_F2F8FF,
        marginTop: 10,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        gap: 10,
    },
    DateLabel: {
        fontSize: Size.sm_14,
        color: Colors.grey_656565,
        fontFamily: Fonts.mediumAS,
    },
    DateText: {
        fontSize: Size.sm_14,
        color: Colors.Black_000000,
        fontFamily: Fonts.medium,
    },
    TimeText: {
        fontSize: Size.sm_14,
        color: Colors.grey_656565,
        fontFamily: Fonts.mediumAS,
    },
    TagsLabelContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "flex-start",
        gap: 10,
    },
    AiIcon: {
        width: 25,
        height: 25,
    },
    TagsContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        marginTop: 10,
        gap: 10,
    },
    TagButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.blue_8493B2,
        justifyContent: "center",
        alignItems: "center",
    },
    TagText: {
        fontSize: Size.sm_12,
        color: Colors.Black_000000,
        fontFamily: Fonts.medium,
        textTransform: "capitalize",
    },
    selectedTagButton: {
        backgroundColor: Colors.blue_8493B2,
    },
    selectedTagText: {
        color: Colors.white_fffff,
    },
    LocationContainer: {
        width: "100%",
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
        // borderRadius: 10,
        // padding: 12,
        // paddingVertical: 20,
        // backgroundColor: Colors.blue_bg_F2F8FF,
    },
    LocationIconContainer: {
        position: "absolute",
        left: 12,
        // top: 10,
        zIndex: 10,
    },
    LocationInput: {
        width: "100%",
        // height: 40,
        borderRadius: 8,
        paddingRight: 12,
        paddingLeft: 40,
        paddingVertical: 20,
        fontSize: Size.md_16,
        color: Colors.Black_000000,
        fontFamily: Fonts.medium,
        backgroundColor: Colors.blue_bg_F2F8FF,

    }
})