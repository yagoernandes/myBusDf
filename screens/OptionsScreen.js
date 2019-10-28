import React, { useState, useEffect } from 'react'
import {
  FlatList,
  StyleSheet,
  Alert,
  View,
  TextInput,
  Text,
  Button,
  Modal,
  ListView,
  TouchableHighlight
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { AsyncStorage } from 'react-native'
import { TriangleColorPicker } from 'react-native-color-picker'

export default function OptionsScreen() {
  ;[text, setText] = useState('')
  ;[modalVisible, setModalVisible] = useState(false)
  ;[modalSelected, setModalSelected] = useState({})
  ;[linhas, setLinhasArray] = useState([])

  useEffect(() => {
    _retrieveData()
  }, [])

  useEffect(() => {
    console.log('LINHAS: ', linhas)
  }, [linhas])

  const _storeData = async data => {
    try {
      await AsyncStorage.setItem(data.code, JSON.stringify(data))
      _retrieveData()
    } catch (error) {
      console.log('[ ERRO - Storing ]: ', error)
    }
  }

  const _retrieveData = async () => {
    try {
      const linhasStored = await AsyncStorage.getAllKeys()
      if (linhasStored !== null) {
        linhasToAdd = []
        for (linha in linhasStored) {
          const temp = await AsyncStorage.getItem(linhasStored[linha])
          linhasToAdd.push(JSON.parse(temp))
          console.log(
            `Linha index [${linha}] valor [${linhasStored[linha]}] adicionada!`
          )
        }
        console.log('Novo array de linhas: ', linhasToAdd)
        setLinhasArray(linhasToAdd)
      }
    } catch (error) {
      console.log('[ ERRO - Retrieving ]: ', error)
    }
  }

  const toggleModal = () => {
    setModalVisible(!modalVisible)
  }

  const _formatText = text => {
    return text.replace(',', '.')
  }

  const addLinha = () => {
    _storeData({
      code: _formatText(text),
      color: '',
      addedAt: Date.now()
    })
    setText('')
  }

  const selectItem = item => () => {
    setModalSelected(item)
    toggleModal()
  }

  const changeColor = (item, color) => {
    const temp = item
    temp.color = color
    _storeData(temp)
  }

  const removeItem = item => () => {
    AsyncStorage.removeItem(item.code)
    _retrieveData()
  }

  return (
    <View style={{ paddingHorizontal: 10 }}>
      <View style={{ flexDirection: 'row', marginVertical: 15 }}>
        <TextInput
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            flex: 1,
            marginRight: 15,
            borderRadius: 5,
            paddingHorizontal: 15
          }}
          onChangeText={t => setText(t)}
          value={text}
        />
        <Button title='Adicionar' onPress={addLinha} />
      </View>
      <FlatList
        data={linhas}
        renderItem={({ item }) => {
          return (
            <View key={item.addedAt} style={styles.listItem}>
              <Text style={{ flex: 1 }}>{item.code}</Text>
              <Ionicons
                name='md-color-palette'
                size={26}
                style={{ marginRight: 30 }}
                color={item.color || '#555'}
                onPress={selectItem(item)}
              />
              <Ionicons
                name='md-close'
                size={22}
                onPress={removeItem(item)}
                style={{ marginRight: 10 }}
                color='#FCC'
              />
            </View>
          )
        }}
        keyExtractor={item => `${item.addedAt}`}
      />
      <Modal
        animationType='slide'
        transparent={false}
        visible={modalVisible}
        presentationStyle='pageSheet'
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
        }}>
        <View style={{ marginTop: 22, flex: 1, padding: 20 }}>
          <View style={{ flex: 1 }}>
            <TriangleColorPicker
              onColorSelected={color => {
                toggleModal()
                changeColor(modalSelected, color)
              }}
              defaultColor={modalSelected.color || '#555'}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

OptionsScreen.navigationOptions = {
  title: 'Linhas favoritas'
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff'
  },
  listItem: {
    height: 60,
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: '#EEE',
    borderBottomWidth: 1,
    alignItems: 'center'
  }
})
