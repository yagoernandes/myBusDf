import React, { useState, useEffect } from 'react';
import { Platform, Text, StyleSheet, View, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import axios from 'axios'

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
			_getLocationAsync();
		}
	}, [])

	const getBusLocation = async ()=>{
		const response = await axios.get('https://www.sistemas.dftrans.df.gov.br/gps/linha/932.1/geo/recent')
		setState(s=>({...s, bus: response.data.features}))
		// state.bus.map(bus=>console.log(`Latitude: ${bus.geometry[1]} | Longitude: ${bus.geometry[0]}`))
		state.bus.map(bus=>console.log(`Location: ${JSON.stringify(bus.geometry)}`))
	}

	useEffect(()=>{
		setInterval(() => { getBusLocation() }, 1000)
	},[])

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
				{
					state.bus && state.bus.map(bus=><MapView.Marker pinColor={'#F00'} coordinate={{latitude: bus.geometry.coordinates[1], longitude: bus.geometry.coordinates[0]}} />)
				}
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
