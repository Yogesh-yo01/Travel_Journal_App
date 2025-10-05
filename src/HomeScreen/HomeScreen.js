import { FlatList, Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Colors, Fonts, Size } from '../Theme/Theme'
import moment from 'moment'
import SearchIcon from '../../assets/icon/searchGrey.svg'
import DateIcon from '../../assets/icon/date.svg'
import LocationIcon from '../../assets/icon/location.svg'
import TimeIcon from '../../assets/icon/time.svg'
import BackIcon from '../../assets/icon/backb.svg'
import FilterIcon from '../../assets/icon/filter.svg'
import AddIcon from '../../assets/icon/add.svg'


import Filter from './Filter'

const HomeScreen = ({ navigation }) => {
    const [isSearchVisible, setIsSearchVisible] = useState(false)
    const [isFilterVisible, setIsFilterVisible] = useState(false)
    const [loading, setLoading] = useState(true)
    const [searchText, setSearchText] = useState('')
    const [filteredData, setFilteredData] = useState({
        range: 'All',
        tags: [],
    })
    const DateRange = [
        { range: 'All' },
        { range: 'Today' },
        { range: 'This Week' },
        { range: 'This Month' },
        { range: 'This Year' },
    ]
    const Tags = [
        { tag: 'All' },
        { tag: 'City' },
        { tag: 'Landmarks' },
        { tag: 'History' },
        { tag: 'Beautiful' },
        { tag: 'Big Buildings' },
    ]

    const data = [
        {
            id: 1,
            title: '36 Hours in New York',
            Description: 'A 36-hour journey through the city of New York, exploring its iconic landmarks and hidden gems.',
            Photos: [
                'https://cdn.contexttravel.com/image/upload/w_1500,q_60/v1571947279/blog/36%20Hours%20in%20NYC/NewYorkStreets.jpg',
                'https://a.travel-assets.com/findyours-php/viewfinder/images/res70/506000/506237-times-square.jpg',
            ],
            createdAt: Date.now(),
            location: 'New York',
            tags: ['New York', 'City', 'Landmarks', 'History', 'Beautiful', 'Big Buildings'],
        },
        {
            id: 2,
            title: 'Capital and Largest city of France',
            Description: 'famous for its iconic landmarks like the Eiffel Tower',
            Photos: [
                'https://img.freepik.com/free-photo/beautiful-wide-shot-eiffel-tower-paris-surrounded-by-water-with-ships-colorful-sky_181624-5118.jpg?semt=ais_hybrid&w=740&q=80',
                'https://images.unsplash.com/photo-1583265266785-aab9e443ee68?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGFyaXMlMkMlMjBmcmFuY2V8ZW58MHx8MHx8fDA%3D',
            ],
            createdAt: Date.now(),
            location: 'Paris',
            tags: ['Paris', 'City', 'Landmarks'],
        },

    ]
    const handleBack = () => {
        setIsSearchVisible(false)
        setIsFilterVisible(false);
    }
    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor='transparent' />
            {!isSearchVisible ?
                <View style={styles.Header}>
                    <Text style={styles.HeaderTitle}>My Travel Journals</Text>
                    <TouchableOpacity onPress={() => setIsSearchVisible(true)}>
                        <SearchIcon width={24} height={24} />
                    </TouchableOpacity>
                </View>
                :
                <>

                    <View style={styles.HeaderContainer}>
                        <View style={styles.SearchHeader}>
                            <TouchableOpacity onPress={handleBack}>
                                <BackIcon width={24} height={24} />
                            </TouchableOpacity>
                            <Text style={styles.HeaderTitle}>Search & Filter</Text>
                            <TouchableOpacity onPress={() => setIsFilterVisible(!isFilterVisible)}>
                                <FilterIcon width={24} height={24} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.SearchContainer}>
                            <View style={styles.SearchIcon}>
                                <SearchIcon width={24} height={24} />
                            </View>
                            <TextInput
                                placeholder='Search Journals...'
                                placeholderTextColor={Colors.gray}
                                style={styles.SearchInput}
                                value={searchText}
                                onChangeText={setSearchText}
                            />
                        </View>
                    </View>
                    {isFilterVisible &&
                        <Filter
                            setIsFilterVisible={setIsFilterVisible}
                            DateRange={DateRange}
                            filteredData={filteredData}
                            setFilteredData={setFilteredData}
                            Tags={Tags}
                        />}
                </>
            }
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 16 }}
                renderItem={({ item, index }) => (
                    <View style={styles.card}>
                        <Image source={{ uri: item.Photos[1] }} style={styles.cardImage} />
                        <View style={styles.cardContent}>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.itemDescription}>{item.Description}</Text>
                            <View style={styles.DatesContainer}>
                                <View style={styles.Date}>
                                    <DateIcon />
                                    <Text style={styles.itemDescription}>{moment(item?.createdAt).format('MMM D, YYYY')}</Text>
                                </View>
                                <View style={styles.Date}>
                                    <LocationIcon />
                                    <Text style={styles.itemDescription}>{item.location}</Text>
                                </View>
                            </View>
                            <View style={styles.TagsContainer}>
                                {item.tags.map((tag, index) => (
                                    <TouchableOpacity key={index} style={styles.tag}>
                                        <Text style={styles.tagText}>{tag}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>
                )}
            />
            {/* <View style={styles.AddButtonContainer}>
            </View> */}
            <TouchableOpacity style={styles.AddButton} onPress={() => navigation.navigate('AddNew')}>
                <AddIcon width={18} height={18} />
            </TouchableOpacity>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white_EEF2F6
    },
    Header: {
        width: '100%',
        flexDirection: "row",
        backgroundColor: Colors.white_fffff,
        paddingTop: 42,
        paddingBottom: 20,
        paddingLeft: 16,
        paddingRight: 20,
        alignItems: 'center',
        justifyContent: "space-between",
        borderBottomRightRadius: 12,
        borderBottomLeftRadius: 12,
        elevation: 4
    },
    HeaderContainer: {
        width: '100%',
        paddingTop: 42,
        paddingBottom: 20,
        paddingHorizontal: 16,
        backgroundColor: Colors.white_fffff,
        alignItems: 'center',
        justifyContent: "center",
    },
    SearchHeader: {
        width: '100%',
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "space-between",
    },
    HeaderTitle: {
        color: Colors.primary_text_1B2436,
        fontSize: Size.md_20,
        fontFamily: Fonts.medium,
    },
    SearchContainer: {
        width: "100%",
        paddingHorizontal: 16,
        backgroundColor: Colors.white_F2F8FF,
        height: 48,
        marginTop: 20,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    SearchIcon: {
        position: 'absolute',
        left: 16,
        top: 12,
    },
    SearchInput: {
        width: "100%",
        paddingLeft: 36,
        paddingRight: 16,
        fontSize: Size.md_16,
        fontFamily: Fonts.regular,
        color: Colors.primary_text_1B2436,
    },

    card: {
        width: '100%',
        backgroundColor: Colors.white_fffff,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 4,
    },
    cardImage: {
        width: '100%',
        height: 250,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    cardContent: {
        width: '100%',
        padding: 16,
        gap: 10
    },
    itemTitle: {
        color: Colors.primary_text_1B2436,
        fontSize: Size.md_20,
        fontFamily: Fonts.medium,
    },
    itemDescription: {
        color: Colors.gray,
        fontSize: Size.md_16,
        fontFamily: Fonts.regular,
        lineHeight: 20
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
        backgroundColor: Colors.blue_bg_F2F8FF,
    },
    tagText: {
        color: Colors.primary,
        fontSize: Size.md_16,
        fontFamily: Fonts.regular,
    },
    AddButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 48,
        height: 48,
        borderRadius: 48,
        backgroundColor: Colors.white_fffff,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.1,
        borderColor: Colors.text_color,
    }
})
