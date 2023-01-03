import React, { Component, useState, useEffect } from 'react';
import {StyleSheet, View, Text, Button, TextInput, SafeAreaView, AsyncStorage} from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import App2 from './App2';
import axios from "axios";
import Storage from 'react-native-storage';

let this_;
const Stack = createStackNavigator()
let navigation_;
let id, setId, pass, setPass, error, setError;

export default class App extends Component<{}> {
  
  constructor(props) {
    super(props);
    this_ = this;
    setTimeout(() => {
      // データの存在を確認
      this_.loadItem();
    }, 1000);
  }  
  
  // データの存在を確認、存在すればページ遷移
  loadItem = async () => {
    try {
      const todoString = await AsyncStorage.getItem("tno");
      if(todoString) {
        navigation_.navigate('Home');
      }
    } catch (e) {
      console.log(e)
    }
  }

  // データの保存
  saveItem = async(counter, flg) => {
    try {
      if (flg == 0) {
        await AsyncStorage.setItem("tno", counter);
      } else {
        await AsyncStorage.setItem("token", counter);
      }
    } catch (e) {
      console.log(e)
    }
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
  //下記urlにトークンも追加して現在登録されていないか確かめる
  const baseURL = "https://www.it-service.co.jp/cgi-local/gosui/gosui_app.pl?ACT=CHECK_TNO&ID="+id+"&PASS="+pass;
  axios.get(baseURL).then((response) => {
    if (response.data.tno) {
      this_.saveItem(response.data.tno, 0);
      this_.saveItem(token, 1);
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
  [token, setToken] = useState('');
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
      <Text style={styles.text}>
        任意のIDを英数字で入力してください
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={token_ => setToken(token_)}
        placeholder="任意のID"
      />
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