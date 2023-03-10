import React, { Component, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Alert,
  Text,
  Button,
  View,
  NativeModules,
  NativeEventEmitter
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import { stringToBytes,bytesToString } from "convert-string";

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
let state = "test";

export default class App extends Component<{}> {
  
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
    // stateにはこれがいる
    this.onPressLearnMore5 = this.onPressLearnMore5.bind(this);

    BleManager.start({ showAlert: false }).then(() => {
      // Success code
      console.log("Module initialized");
      Alert.alert("Module initialized")
      BleManager.scan([], 60, true).then(() => {
        // Success code
        console.log("Scan started");
        Alert.alert("Scan started")
      });
    });
  }
  
  onPressLearnMore2 = () => {
    this.setState({
      count: this.state.count + 1
    })
    //Alert.alert(state)
  }

  onPressLearnMore22() {
    this.setState({
      count: this.state.count + 1
    })
  }
  
  onPressLearnMore4() {
    //const data = stringToBytes("284344020329");
    //const data = stringToBytes("[B@8d3f92b");
    const buffer = new ArrayBuffer(6);
    buffer[0] = 40;
    buffer[1] = 67;
    buffer[2] = 68;
    buffer[3] = 2;
    buffer[4] = 3;
    buffer[5] = 41;
    var arr = [40,67,68,2,3,41];
    let dataView = new Int8Array(arr);
    console.log(dataView);
    var string = new TextDecoder().decode(dataView);
    //const data = stringToBytes('(CD^B)');
    console.log(new TextDecoder().decode(dataView));
    const data = stringToBytes(new TextDecoder().decode(dataView));
    var uuid = "4C:02:2E:7E:56:A8";
    if (Platform.OS == 'ios') {
      uuid = "93B61CDF-30D0-F7F0-9D3A-300977E28648";
    }
    BleManager.retrieveServices("D94920AE-A124-D354-33A8-74C416FDCF7E");
    BleManager.writeWithoutResponse(
      uuid,
      "0000c62e-9910-0bac-5241-d8bda6932a2f",
      "00000d2e-1c03-aca1-ab48-a9b908bae79e",
      [0x28, 0x43, 0x44, 0x02, 0x03, 0x29]
    )
    .then(() => {
      // Success code
      Alert.alert("Write: " + data);
    })
    .catch((error) => {
      // Failure code
      Alert.alert(error);
    });
  }

  onPressLearnMore5() {
    
    // ios retrieveServices needs
    var uuid = "4C:02:2E:7E:56:A8";
    if (Platform.OS == 'ios') {
      uuid = "93B61CDF-30D0-F7F0-9D3A-300977E28648";
    }

    if (Platform.OS == 'ios') {
      // 闕ｳ邇厄ｽｨ莠冩s鬮ｯ莉呻ｽｮ?ｿｽ
      BleManager.retrieveServices(uuid).then(
        (peripheralInfo) => {
          // Success code
          Alert.alert("Peripheral info:", peripheralInfo);
          BleManager.startNotification(
            uuid,
            "0000C62E-9910-0BAC-5241-D8BDA6932A2F",
            "00005991-B131-3396-014C-664C9867B917"
          )
          .then(() => {
            // Success code
            Alert.alert("Notification started");
            bleManagerEmitter.addListener(
              "BleManagerDidUpdateValueForCharacteristic",
              ({ value, peripheral, characteristic, service }) => {
                // Convert bytes array to string
                const data = bytesToString(value);
                let test = String(value);
                let monthAry = test.split(',');

                if (31 <= monthAry[17] && monthAry[17] <= 65) {
                    //邵ｺ?ｿｽ邵ｺ?ｽ､闔ｨ荳岩雷郢晁ｼ釆帷ｹｧ?ｽｰ郢ｧ蛛ｵ縺檎ｹ晢ｽｳ
                    console.log(peripheral+"遶奇ｿｽ");
                    state = peripheral+"遶奇ｿｽ";
                // 闔会ｽｰ陷ｷ莉｣?ｿ?邵ｺ?ｽｮ隴趣ｿｽ(z髴??ｽｸ128~223邵ｲ竏ｽ?ｽｻ?ｽｰ陷ｷ莉｣?ｿ?MIN191邵ｺ蠕娯?堤ｹｧ蠕鯉ｽ狗ｸｺ譴ｧ蜃ｾ邵ｲ?ｿｽ隴夲ｽ｡闔会ｽｶ闕ｳ閧ｴ?ｿｽ蠑ｱ縲?165驕ｲ蟲ｨ窶ｲ陷ｿ髢??ｽｾ蜉ｱ縲堤ｸｺ髦ｪ?ｽ狗ｸｺ?ｽｮ邵ｺ?ｽｧ128邵ｺ?ｽｾ邵ｺ?ｽｧ髫穂ｹ晢ｽ狗ｹｧ蛹ｻ竕ｧ邵ｺ?ｽｫ邵ｺ蜉ｱ窶ｻ邵ｺ?ｿｽ郢ｧ?ｿｽ)
                } else if (128 <= monthAry[17] && monthAry[17] <= 223) {
                    // 邵ｺ?ｿｽ邵ｺ?ｽ､闔ｨ荳岩雷郢晁ｼ釆帷ｹｧ?ｽｰ郢ｧ蛛ｵ縺檎ｹ晢ｿｽ
                    console.log(peripheral+"遶奇ｿｽ");
                    state = peripheral+"遶奇ｿｽ";
                    // 隶難ｽｪ陷ｷ莉｣窶ｳ邵ｺ?ｽｮ隴趣ｿｽ(z髴??ｽｸ224~255 or 0~30)
                } else if (224 <= monthAry[17] && monthAry[17] <= 255 || 0 <= monthAry[17] && monthAry[17] <= 30) {
                    // 陷ｿ?ｽｳ陷ｷ莉｣窶ｳ
                    if (224 <= monthAry[17] && monthAry[17] <= 255) {
                        console.log(peripheral+"遶奇ｿｽ");
                        state = peripheral+"遶奇ｿｽ";
                    // 陝ｾ?ｽｦ陷ｷ莉｣窶ｳ
                    } else if (0 <= monthAry[17] && monthAry[17] <= 30) {
                        console.log(peripheral+"遶奇ｿｽ");
                        state = peripheral+"遶奇ｿｽ";
                    }
                } else {
                    /* 72 ~ 127 : 郢ｧ?ｽｷ郢ｧ?ｽｧ郢ｧ?ｽ､郢ｧ?ｽｯ陋ｻ?ｽ､陞ｳ?ｿｽ??*/
                    console.log(peripheral+"遶奇ｿｽ");
                    state = peripheral+"遶奇ｿｽ";
                }
              }
            );
          })
          .catch((error) => {
            Alert.alert(error);
            console.log(error);
          });
        }
      );
    } else {
      BleManager.startNotification(
        uuid,
        "0000C62E-9910-0BAC-5241-D8BDA6932A2F",
        "00005991-B131-3396-014C-664C9867B917"
      )
      .then(() => {
        // Success code
        Alert.alert("Notification started");
        bleManagerEmitter.addListener(
          "BleManagerDidUpdateValueForCharacteristic",
          
          ({ value, peripheral, characteristic, service }) => {
            this.setState({count: peripheral+"遶奇ｿｽ"});
            // Convert bytes array to string
            const data = bytesToString(value);
            let test = String(value);
            let monthAry = test.split(',');

            if (31 <= monthAry[17] && monthAry[17] <= 65) {
              //うつ伏せフラグをオン
              console.log(peripheral+"↓");
              state = peripheral+"↓";
          // 仰向けの時(z軸128~223、仰向けMIN191がとれるが時々条件不明で165等が取得できるので128まで見るようにしている)
          } else if (128 <= monthAry[17] && monthAry[17] <= 223) {
              // うつ伏せフラグをオフ
              console.log(peripheral+"↑");
              state = peripheral+"↑";
              // 横向きの時(z軸224~255 or 0~30)
          } else if (224 <= monthAry[17] && monthAry[17] <= 255 || 0 <= monthAry[17] && monthAry[17] <= 30) {
              // 右向き
              if (224 <= monthAry[17] && monthAry[17] <= 255) {
                  console.log(peripheral+"→");
                  state = peripheral+"→";
              // 左向き
              } else if (0 <= monthAry[17] && monthAry[17] <= 30) {
                  console.log(peripheral+"←");
                  state = peripheral+"←";
              }
          } else {
              /* 72 ~ 127 : シェイク判定??*/
              console.log(peripheral+"↑");
              state = peripheral+"↑";
          }
          }
        );
      })
      .catch((error) => {
        Alert.alert(error);
        console.log(error);
      });
    }
    
  }

  onPressLearnMore3() {
    var uuid = "4C:02:2E:7E:56:A8";
    if (Platform.OS == 'ios') {
      uuid = "93B61CDF-30D0-F7F0-9D3A-300977E28648";
    }
    BleManager.connect(uuid).then(() => {
      Alert.alert("connected")                    
      // Success code
      console.log("Connected");
      
    }).catch((error) => {
      Alert.alert(error) 
      console.log(error);
    });
  }
  
  onPressLearnMore1() {
    BleManager.start({ showAlert: false }).then(() => {
      // Success code
      console.log("Module initialized");
      Alert.alert("Module initialized")
      BleManager.scan([], 60, true).then(() => {
        // Success code
        console.log("Scan started");
        Alert.alert("Scan started")
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>

        <Button
          onPress={this.onPressLearnMore1}
          title="郢ｧ?ｽｹ郢ｧ?ｽｿ郢晢ｽｼ郢晢ｿｽ"
          color="#000004"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={this.onPressLearnMore3}
          title="隰暦ｽ･驍ｯ?ｿｽ"
          color="#000004"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={this.onPressLearnMore4}
          title="隴厄ｽｸ邵ｺ蟠趣ｽｾ?ｽｼ邵ｺ?ｽｿ"
          color="#000004"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={this.onPressLearnMore5}
          title="鬨ｾ螟り｡埼ｫ｢蜿･?ｽｧ?ｿｽ"
          color="#000004"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={this.onPressLearnMore2}
          title="霑･?ｽｶ隲ｷ邇厄ｽ｡?ｽｨ驕会ｽｺ"
          color="#000004"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={this.onPressLearnMore22}
          title="霑･?ｽｶ隲ｷ邇厄ｽ｡?ｽｨ驕会ｽｺ2"
          color="#000004"
          accessibilityLabel="Learn more about this purple button"
        />
        <View>
          <Text>
            You clicked { this.state.count } times
          </Text>
        </View>
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});