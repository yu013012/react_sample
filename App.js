import React, { Component, useState } from 'react';
import {StyleSheet, View, Text, Button, TextInput, SafeAreaView} from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import App2 from './App2';
import axios from "axios";
const baseURL = "https://facebook.github.io/react-native/movies.json";
let this_;
const Stack = createStackNavigator()
let navigation_;

export default class App extends Component<{}> {
  
  constructor(props) {
    super(props);
    this_ = this;
  }  

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
            headerShown: false
          }} initialRouteName="Details">
          <Stack.Screen 
            name="Details" 
            component={DetailsScreen} 
          />
          <Stack.Screen 
            name="Home" 
            component={App2} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  container: {
    alignItems: 'center',
  },
});

function login_action () {
  axios.get(baseURL).then((response) => {
    console.log(response.data);
    navigation_.navigate('Home');
  });
}

function DetailsScreen({ navigation }) {
  navigation_ = navigation;
  return (
    <SafeAreaView>
      <TextInput
        style={styles.input}
        placeholder="ID"
      />
      <TextInput
        style={styles.input}
        placeholder="パスワード"
      />
      <Button
        title="ログイン"
        onPress={
          login_action
        }
      />
    </SafeAreaView>
  )
}