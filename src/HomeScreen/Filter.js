import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors, Fonts, Size } from '../Theme/Theme'
import DateIcon from '../../assets/icon/calendargrey.svg'
import LocationIcon from '../../assets/icon/location.svg'
import ButtonComponent from '../Component/ButtonComponent'

const Filter = ({ DateRange, Tags, filteredData, setFilteredData }) => {


    const handleSelect = (type, item) => {
        if (type === 'tags') {
            if (item.tag === 'All') {
                // If "All" is already selected, remove it; otherwise, select it
                const isAllSelected = filteredData.tags.includes('All');
                setFilteredData({
                    ...filteredData,
                    tags: isAllSelected ? [] : ['All'],
                });
                return;
            }

            const isTagSelected = filteredData.tags.includes(item.tag);
            setFilteredData({
                ...filteredData,
                // Remove 'All' if any other tag is selected
                tags: isTagSelected
                    ? filteredData.tags.filter(tag => tag !== item.tag)
                    : [...filteredData.tags.filter(tag => tag !== 'All'), item.tag],
            });
            return;
        }
        

        // For date range
        setFilteredData({ ...filteredData, [type]: item[type] });
    };

    return (
        <View style={styles.container}>
            <View style={styles.filterDateContainer}>
                <DateIcon width={16} height={16} />
                <Text style={styles.filterLabelText}>Date Range</Text>
            </View>
            <FlatList
                data={DateRange}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
                renderItem={({ item }) => (
                    <TouchableOpacity style={[styles.DateContainer, { backgroundColor: item.range === filteredData.range ? Colors.primary : Colors.white_F2F8FF }]} onPress={() => handleSelect('range', item)}>
                        <Text style={[styles.DateText, { color: item.range === filteredData.range ? Colors.white_fffff : Colors.Black_000000 }]}>{item.range}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            <Text style={[styles.filterLabelText, { marginTop: 10 }]}>Filter by Tags</Text>
            <FlatList
                data={Tags}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10, marginTop: 10 }}
                renderItem={({ item }) => {
                    const isSelected = filteredData?.tags?.includes(item.tag);
                    return (
                        <TouchableOpacity
                            style={[
                                styles.TagContainer,
                                {
                                    backgroundColor: isSelected
                                        ? Colors.primary
                                        : Colors.white_F2F8FF,
                                },
                            ]}
                            onPress={() => handleSelect('tags', item)}
                        >
                            <Text
                                style={[
                                    styles.TagText,
                                    { color: isSelected ? Colors.white_fffff : Colors.Black_000000 },
                                ]}
                            >
                                {item.tag}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
                keyExtractor={(item, index) => index.toString()}
            />
            <View style={styles.Button}>
                <ButtonComponent
                    text="Clear All Filters"
                    onPress={() => setFilteredData({ range: '', tags: [] })}
                    disabled={false}
                    loading={false}
                />
            </View>
        </View>
    )
}

export default Filter

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: Colors.white_fffff,
        paddingHorizontal: 16,
        borderTopWidth: 0.2,
        borderTopColor: Colors.blue_8493B2,
        paddingBottom: 10
    },
    filterDateContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginVertical: 10,
    },
    filterLabelText: {
        color: Colors.Black_000000,
        fontSize: Size.sm_14,
        fontFamily: Fonts.semiBold
    },
    DateContainer: {
        paddingHorizontal: 20,
        paddingVertical: 7,
        borderRadius: 8,
        borderWidth: 0.2,
        borderColor: Colors.blue_8493B2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white_F2F8FF
    },
    DateText: {
        color: Colors.Black_000000,
        fontSize: Size.sm_14,
        fontFamily: Fonts.semiBold
    },
    TagContainer: {
        paddingHorizontal: 20,
        paddingVertical: 7,
        borderRadius: 8,
        borderWidth: 0.2,
        borderColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white_fffff,
    },
    TagText: {
        color: Colors.Black_000000,
        fontSize: Size.sm_14,
        fontFamily: Fonts.semiBold
    },
    Button: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
})
