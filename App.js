import React, { Component, useState } from 'react';
import {StyleSheet, View, Text, Button, TextInput, SafeAreaView} from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import App2 from './App2';
import axios from "axios";
let this_;
const Stack = createStackNavigator()
let navigation_;
let id, setId, pass, setPass, error, setError;
export default class App extends Component<{}> {
  
  constructor(props) {
    super(props);
    this_ = this;
    this.state = {
      text: "dsfs",
    };
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
  const baseURL = "https://www.it-service.co.jp/cgi-local/gosui/gosui_app.pl?ACT=CHECK_TNO&ID="+id+"&PASS="+pass;
  axios.get(baseURL).then((response) => {
    if (response.data.tno) {
      navigation_.navigate('Home');
    } else {
      //エラー表示
      console.log("エラー表示");
      setError("正しい情報を入力してください")
    }
  });
}

function DetailsScreen({ navigation }) {
  navigation_ = navigation;
  [id, setId] = useState('');
  [pass, setPass] = useState('');
  [error, setError] = useState('');
  return (
    <SafeAreaView>
      <Text style={styles.text}>
        { "ログイン画面" }
      </Text>
      <Text style={styles.text}>
        { error }
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={id_ => setId(id_)}
        placeholder="ID"
      />
      <TextInput
        style={styles.input}
        onChangeText={pass_ => setPass(pass_)}
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