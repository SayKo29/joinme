import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import colors from '@/styles/colors';
import { useNavigation } from '@react-navigation/native';
import useTabStore from 'store/TabStore';

const CustomBottomTab = () => {
    const navigation = useNavigation()
    const tabIndex = useTabStore((state) => state.tab)
    const tabs = [
        {
            name: 'Eventos',
            iconName: 'map',
            iconInactiveName: 'map-outline',
            navigation: 'Events'
        },
        {
            name: 'Chats',
            iconName: 'chatbox-ellipses',
            iconInactiveName: 'chatbox-ellipses-outline',
            navigation: 'ChatRoom'
        },
        {
            name: 'Crear',
            iconName: 'add-circle',
            iconInactiveName: 'add-circle-outline',
            navigation: 'CreateEvent'
        },
        {
            name: 'Perfil',
            iconName: 'person',
            iconInactiveName: 'person-outline',
            navigation: 'Profile'
        }
    ]

    const handleTabChange = (tab, ind) => {
        useTabStore.setState({ tab: ind });
        navigation.navigate(tab);
    }
    return (
        <View style={styles.tabContainer}>
            {tabs.map((tab, index) => (
                <TouchableOpacity
                    key={index}
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
        paddingTop: 10
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 12,
        marginTop: 5,
        color: colors.gray,
    },
    activeTab: {
    },
    activeText: {
        color: colors.white,
    },
});

export default CustomBottomTab;
