import React, { Component, useState } from 'react';
import {StyleSheet, View, Text, Button, TextInput, SafeAreaView, AsyncStorage, LogBox, NativeEventEmitter, NativeModules} from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import App2 from './App2';
import axios from "axios";
import BleManager from 'react-native-ble-manager';

// テスト環境
let URL = "https://www.cloudtest2.pw/";

// 本番環境
//let URL = "https://www.it-service.co.jp/";

// 他メソッドで使うためthisとnavigationを下記に格納
let this_, navigation_;
// ページ遷移用
const Stack = createStackNavigator()
// 他メソッドで使うためstateを宣言
let id, setId, pass, setPass, error, setError;
// warning削除
LogBox.ignoreAllLogs();

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default class App extends Component<{}> {
  
  constructor(props) {
    super(props);
    this_ = this;
    
    //render後に処理を行うためタイマーをセット
    setTimeout(() => {
      // データの存在を確認
      this_.loadItem();
    }, 1000);
  }  
  
  // データの存在を確認、存在すればページ遷移
  loadItem = async () => {
    try {
      const tno = await AsyncStorage.getItem("tno");
      if(tno) {
        navigation_.navigate('Home');
      } else {
        // 初回だけblue権限を求めるために下記実行
        BleManager.start({ showAlert: false });
      }
    } catch (e) {
      console.log(e)
    }
  }

  // データの保存
  saveItem = async(tno) => {
    try {
      await AsyncStorage.setItem("tno", tno);
    } catch (e) {
      console.log(e);
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
    width: '90%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 25,
  },
  error: {
    fontSize: 18,
    color: "red",
  },
});

function login_action () {
  const baseURL = URL+"cgi-local/gosui/gosui_app.pl?ACT=CHECK_TNO&ID="+id+"&PASS="+pass;
  axios.get(baseURL).then((response) => {
    if (response.data.tno) {
      this_.saveItem(response.data.tno);
      navigation_.navigate('Home');
    } else {
      //エラー表示
      console.log("エラー表示");
    }
  });
}

function DetailsScreen({ navigation }) {
  navigation_ = navigation;
  [id, setId] = useState('');
  [pass, setPass] = useState('');
  [error, setError] = useState('');
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        { "ログイン画面" }
      </Text>
      <Text style={styles.error}>
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
    </View>
  )
}