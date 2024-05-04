import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import colors from '@/styles/colors';
import { useNavigation } from '@react-navigation/native';
import useTabStore from 'store/TabStore';
import useHeaderEventStore from 'store/HeaderEventStore';
import { BOTTOM_TABS } from 'Constants';

const TabItem = React.memo(({ tab, tabIndex, index, handleTabChange }) => (
    <TouchableOpacity
        style={[styles.tabItem, tabIndex === index && styles.tabIndex]}
        onPress={() => handleTabChange(tab.navigation, index)}>
        <Icon
            name={tabIndex === index ? tab.iconName : tab.iconInactiveName}
            type='ionicon'
            size={24}
            color={tabIndex === index ? colors.white : colors.gray}
        />
        <Text style={[styles.tabText, tabIndex === index && styles.activeText]}>{tab.name}</Text>
    </TouchableOpacity>
));


const CustomBottomTab = () => {
    const navigation = useNavigation();
    const tabIndex = useTabStore((state) => state.tab);


    const handleTabChange = (tab, ind) => {
        if (tab === 'EventMap') {
            useHeaderEventStore.setState({ tab: tab });
        }
        if (tabIndex !== ind) {
            useTabStore.setState({ tab: ind });
        }
        navigation.navigate(tab);
    };

    return (
        <View style={styles.tabContainer}>
            {BOTTOM_TABS.map((tab, index) => (
                <TabItem
                    key={index}
                    tab={tab}
                    tabIndex={tabIndex}
                    index={index}
                    handleTabChange={handleTabChange}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingBottom: 20,
        paddingTop: 10,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 12,
        marginTop: 5,
        color: colors.gray,
        fontFamily: 'SignikaRegular',
    },
    activeTab: {
    },
    activeText: {
        color: colors.white,
    },
});

export default CustomBottomTab;
