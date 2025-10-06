/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import { FlatList, Image, RefreshControl, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Colors, Fonts, Size } from '../Theme/Theme'
import moment from 'moment'
import SearchIcon from '../../assets/icon/searchGrey.svg'
import DateIcon from '../../assets/icon/date.svg'
import LocationIcon from '../../assets/icon/location.svg'
import TimeIcon from '../../assets/icon/time.svg'
import BackIcon from '../../assets/icon/backb.svg'
import FilterIcon from '../../assets/icon/filter.svg'
import AddIcon from '../../assets/icon/add.svg'
import EmptyIcon from '../../assets/icon/empty.svg'


import NetInfo from '@react-native-community/netinfo';
import Filter from './Filter'
import { getOfflineJournals, getOfflineJournalsByUser, updateJournalSync } from '../DB/database'
import { supabase } from '../DB/supabaseClient'
import { syncJournals } from '../DB/sync'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'

const HomeScreen = ({ navigation }) => {
    const [allJournals, setAllJournals] = useState([]); // full data from DB
    const [displayedJournals, setDisplayedJournals] = useState([]); // filtered view
    const [isSearchVisible, setIsSearchVisible] = useState(false)
    const [isFilterVisible, setIsFilterVisible] = useState(false)
    const [loading, setLoading] = useState(true)
    const [searchText, setSearchText] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    const [filteredData, setFilteredData] = useState({
        range: 'All',
        tags: [],
    })
    const [journals, setJournals] = useState([])

    const DateRange = [
        { range: 'All' },
        { range: 'Today' },
        { range: 'This Week' },
        { range: 'This Month' },
        { range: 'This Year' },
    ]
    // Extract all tags dynamically if you already have journals stored
    const allJournalTags = journals.reduce((acc, journal) => {
        journal.tags.forEach(tag => {
            if (!acc.includes(tag)) acc.push(tag);
        });
        return acc;
    }, []);

    // Prepare the Tags array for the filter
    const Tags = [
        { tag: 'All' },
        ...allJournalTags.map(tag => ({ tag })),
    ];

    const applyFilters = () => {
        let filtered = [...journals]; // start from your stored journals

        // Filter by search text (title & description)
        if (searchText.trim() !== '') {
            const lowerText = searchText.toLowerCase();
            filtered = filtered.filter(journal =>
                journal.title.toLowerCase().includes(lowerText) ||
                journal.description.toLowerCase().includes(lowerText)
            );
        }

        // Filter by tags
        if (filteredData.tags && filteredData.tags.length > 0 && !filteredData.tags.includes('All')) {
            filtered = filtered.filter(journal =>
                journal.tags.some(tag => filteredData.tags.includes(tag))
            );
        }

        // Filter by date range
        if (filteredData.range && filteredData.range !== 'All') {
            const now = new Date();
            filtered = filtered.filter(journal => {
                const journalDate = new Date(Number(journal.date)); // convert timestamp
                if (filteredData.range === 'Today') {
                    return journalDate.toDateString() === now.toDateString();
                } else if (filteredData.range === 'Yesterday') {
                    const yesterday = new Date();
                    yesterday.setDate(now.getDate() - 1);
                    return journalDate.toDateString() === yesterday.toDateString();
                } else if (filteredData.range === 'Last 7 Days') {
                    const weekAgo = new Date();
                    weekAgo.setDate(now.getDate() - 7);
                    return journalDate >= weekAgo && journalDate <= now;
                }
                return true;
            });
        }

        setDisplayedJournals(filtered);
    };
    useEffect(() => {
        applyFilters();
    }, [searchText, filteredData, journals]);

    const GetJournalData = async () => {
        try {
            const user = JSON.parse(await AsyncStorage.getItem('user'));
            const user_id = user?.uid;

            const journals = await getOfflineJournalsByUser(user_id);
            console.log('User journals:', journals);
            setJournals(journals);
        } catch (error) {
            console.error('Error fetching journals:', error);
        }
    };
    useFocusEffect(useCallback(() => {
        GetJournalData();
    }, []))

    const handleBack = () => {
        setIsSearchVisible(false)
        setIsFilterVisible(false);
    }
    const handleRefreshToSync = async () => {
        const state = await NetInfo.fetch();
        // Check if online
        if (state.isConnected) {
            // Sync with Supabase
            const user = JSON.parse(await AsyncStorage.getItem('user'));
            const user_id = user?.uid;

            await syncJournals(user_id);
            Toast.show('Journals synced with Supabase.');
        } else {
            // Handle offline case
            Toast.show('No internet connection. Journal saved locally.');
            console.log('No internet connection. Journal saved locally.');
        }
    };
    const handleJournalDetails = (journal) => {
        navigation.navigate('JournalDetails', { journal });
    };
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
                data={displayedJournals}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 16 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefreshToSync}
                    />
                }
                renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => handleJournalDetails(item)} style={styles.card}>
                        <Image source={{ uri: item?.photos[0] }} style={styles.cardImage} />
                        <View style={styles.cardContent}>
                            <Text style={styles.itemTitle}>{item?.title || 'No Title'}</Text>
                            <Text style={styles.itemDescription}>{item?.description || 'No Description'}</Text>
                            <View style={styles.DatesContainer}>
                                <View style={styles.Date}>
                                    <DateIcon />
                                    <Text style={styles.itemDescription}>{moment(Number(item?.date)).format('MMM D, YYYY')}</Text>
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
                    </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                    <View style={styles.EmptyContainer}>
                        <EmptyIcon width={100} height={100} />
                        <Text style={styles.EmptyText}>No journals found.</Text>
                        <Text style={styles.EmptySubtitle}>
                            You haven’t created any journals yet. Start by adding a new journal.
                        </Text>
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
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.1,
        borderColor: Colors.text_color,
    },
    EmptyContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: "10%"
    },
    EmptyText: {
        color: Colors.gray,
        fontSize: Size.md_16,
        fontFamily: Fonts.regular,
    },
    EmptySubtitle: {
        color: Colors.gray,
        fontSize: Size.sm_14,
        fontFamily: Fonts.regular,
        lineHeight: 20,
        textAlign: 'center',
    }
})
