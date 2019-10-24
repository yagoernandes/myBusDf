import React, { useState, useEffect } from 'react';
import { Platform, Text, StyleSheet, View, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export default function HomeScreen() {

	[state, setState] = useState({
		location: null,
		errorMessage: null,
	})

	useEffect(() => {
		if (Platform.OS === 'android' && !Constants.isDevice) {
			setState(s => ({
				...s,
				errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
			}));
		} else {
			this._getLocationAsync();
		}
	}, [])

	_getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			setState(s => ({
				...s,
				errorMessage: 'Permission to access location was denied',
			}));
		}

		let location = await Location.getCurrentPositionAsync({});
		setState(s => ({ ...s, location }));
	};


	return (
		<View style={styles.container}>
			<MapView style={styles.mapStyle}>
				<MapView.Marker coordinate={{latitude: -14.25219935, longitude: -47.30287048}} />
			</MapView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	mapStyle: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
	},
});
