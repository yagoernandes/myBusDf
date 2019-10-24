import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import OptionsScreen from '../screens/OptionsScreen';

const config = Platform.select({
	web: { headerMode: 'screen' },
	default: {},
});

const HomeStack = createStackNavigator(
	{
		Home: HomeScreen,
	},
	config
);

HomeStack.navigationOptions = {
	tabBarLabel: 'Mapa',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={
				Platform.OS === 'ios'
					? `ios-information-circle${focused ? '' : '-outline'}`
					: 'md-information-circle'
			}
		/>
	),
};

HomeStack.path = '';

const OptionsStack = createStackNavigator(
	{
		Links: OptionsScreen,
	},
	config
);

OptionsStack.navigationOptions = {
	tabBarLabel: 'Linhas',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
	),
};

OptionsStack.path = '';

const tabNavigator = createBottomTabNavigator({
	HomeStack,
	OptionsStack,
});

tabNavigator.path = '';

export default tabNavigator;
