import React, { useState, useEffect } from 'react'
import {
  AsyncStorage,
  Platform,
  Text,
  StyleSheet,
  View,
  Dimensions
} from 'react-native'
import MapView from 'expo'
// import MapView from 'react-native-maps'
import Constants from 'expo-constants'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import axios from 'axios'
import { Ionicons } from '@expo/vector-icons'

export default function HomeScreen() {
  ;[state, setState] = useState({
    location: null,
    errorMessage: null
  })
  ;[linhas, setLinhas] = useState({})
  ;[buses, setBuses] = useState({})
  ;[allBuses, setAllBuses] = useState([])

  useEffect(() => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      setState(s => ({
        ...s,
        errorMessage:
          'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
      }))
    } else {
      _getLocationAsync()
    }
  }, [])

  useEffect(() => {
    _retrieveData()
    const id = setInterval(_retrieveData, 10000)
    return () => {
      clearInterval(id)
    }
  }, [])

  const _retrieveData = async () => {
    console.log('----------------------------------------------------')
    try {
      const linhasStored = await AsyncStorage.getAllKeys()
      if (linhasStored !== null) {
        linhasToAdd = {}
        for (linha in linhasStored) {
          const temp = await AsyncStorage.getItem(linhasStored[linha])
          linhasToAdd[linhasStored[linha]] = JSON.parse(temp)
        }
        setLinhas(linhasToAdd)
      }
    } catch (error) {
      console.log('[ ERRO - Retrieving ]: ', error)
    }
    getAllBusLocations()
  }

  const getBusesLocation = async linhaCode => {
    console.log(`Consultando a url para ${linhaCode}`)
    const response = await axios.get(url(linhaCode))
    setBuses(old => ({ ...old, [linhaCode]: response.data.features }))
    makeBusesList()
  }

  const url = linha =>
    `https://www.sistemas.dftrans.df.gov.br/gps/linha/${linha}/geo/recent`

  const getAllBusLocations = () => {
    const keysIndexes = Object.keys(linhas)
    for (linha in Object.keys(linhas)) {
      console.log('get: ', keysIndexes[linha])
      console.log('Linha to get: ', linhas[keysIndexes[linha]].code)
      getBusesLocation(linhas[keysIndexes[linha]].code)
    }
    makeBusesList()
  }

  const makeBusesList = () => {
    const tempList = []
    Object.keys(buses).forEach(linhaCode => {
      buses[linhaCode].forEach((bus, index) => {
        tempColor =
          (linhas && linhas[linhaCode] && linhas[linhaCode].color) || '#555555'
        bus.color = tempColor
        tempList.push(bus)
        console.log(
          `${index + 1} - Onibus em circulação: ${
            bus.properties.numero
          } - Cor: ${bus.color}`
        )
      })
    })
    setAllBuses(tempList)
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status !== 'granted') {
      setState(s => ({
        ...s,
        errorMessage: 'Permission to access location was denied'
      }))
    }

    let location = await Location.getCurrentPositionAsync({})
    setState(s => ({ ...s, location }))
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapStyle}
        initialRegion={{
          latitude: -15.7509644,
          longitude: -47.9596552,
          latitudeDelta: 0.4,
          longitudeDelta: 0.4
        }}>
        {allBuses.map(bus => {
          return (
            <MapView.Marker
              key={bus.properties.numero}
              anchor={{ x: 0.5, y: 0.75 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              coordinate={{
                latitude: bus.geometry.coordinates[1],
                longitude: bus.geometry.coordinates[0]
              }}>
              <Text>{bus.properties.linha}</Text>
              <Ionicons
                name='md-bus'
                size={22}
                style={{ marginRight: 10 }}
                color={bus.color || '#555'}
              />
            </MapView.Marker>
          )
        })}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
})
