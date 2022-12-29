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
    // state‚É‚Í‚±‚ê‚ª‚¢‚é
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
      // è³çŽ–ï½¨äº™osé«¯ä»™ï½®?¿½
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
                    //ç¸º?¿½ç¸º?½¤èŽ¨ä¸Šâ—‹ç¹è¼”Î›ç¹§?½°ç¹§åµãŒç¹ï½³
                    console.log(peripheral+"ç«Šï¿½");
                    state = peripheral+"ç«Šï¿½";
                // èŽ‰ï½°èœ·ä»£?¿?ç¸º?½®è­Žï¿½(zéœ??½¸128~223ç¸²âˆ½?½»?½°èœ·ä»£?¿?MIN191ç¸ºå¾Œâ?’ç¹§å¾Œï½‹ç¸ºæ¢§å‡¾ç¸²?¿½è­šï½¡èŽ‰ï½¶è³è‚´?¿½å¼±ã€?165é²å³¨â€²èœ¿é–€?½¾åŠ±ã€’ç¸ºé˜ª?½‹ç¸º?½®ç¸º?½§128ç¸º?½¾ç¸º?½§éš•ä¹ï½‹ç¹§åŒ»â‰§ç¸º?½«ç¸ºåŠ±â€»ç¸º?¿½ç¹§?¿½)
                } else if (128 <= monthAry[17] && monthAry[17] <= 223) {
                    // ç¸º?¿½ç¸º?½¤èŽ¨ä¸Šâ—‹ç¹è¼”Î›ç¹§?½°ç¹§åµãŒç¹ï¿½
                    console.log(peripheral+"ç«Šï¿½");
                    state = peripheral+"ç«Šï¿½";
                    // è®“ï½ªèœ·ä»£â€³ç¸º?½®è­Žï¿½(zéœ??½¸224~255 or 0~30)
                } else if (224 <= monthAry[17] && monthAry[17] <= 255 || 0 <= monthAry[17] && monthAry[17] <= 30) {
                    // èœ¿?½³èœ·ä»£â€³
                    if (224 <= monthAry[17] && monthAry[17] <= 255) {
                        console.log(peripheral+"ç«Šï¿½");
                        state = peripheral+"ç«Šï¿½";
                    // èŸ¾?½¦èœ·ä»£â€³
                    } else if (0 <= monthAry[17] && monthAry[17] <= 30) {
                        console.log(peripheral+"ç«Šï¿½");
                        state = peripheral+"ç«Šï¿½";
                    }
                } else {
                    /* 72 ~ 127 : ç¹§?½·ç¹§?½§ç¹§?½¤ç¹§?½¯è›»?½¤èž³?¿½??*/
                    console.log(peripheral+"ç«Šï¿½");
                    state = peripheral+"ç«Šï¿½";
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
            this.setState({count: peripheral+"ç«Šï¿½"});
            // Convert bytes array to string
            const data = bytesToString(value);
            let test = String(value);
            let monthAry = test.split(',');

            if (31 <= monthAry[17] && monthAry[17] <= 65) {
              //‚¤‚Â•š‚¹ƒtƒ‰ƒO‚ðƒIƒ“
              console.log(peripheral+"«");
              state = peripheral+"«";
          // ‹ÂŒü‚¯‚ÌŽž(zŽ²128~223A‹ÂŒü‚¯MIN191‚ª‚Æ‚ê‚é‚ªŽžXðŒ•s–¾‚Å165“™‚ªŽæ“¾‚Å‚«‚é‚Ì‚Å128‚Ü‚ÅŒ©‚é‚æ‚¤‚É‚µ‚Ä‚¢‚é)
          } else if (128 <= monthAry[17] && monthAry[17] <= 223) {
              // ‚¤‚Â•š‚¹ƒtƒ‰ƒO‚ðƒIƒt
              console.log(peripheral+"ª");
              state = peripheral+"ª";
              // ‰¡Œü‚«‚ÌŽž(zŽ²224~255 or 0~30)
          } else if (224 <= monthAry[17] && monthAry[17] <= 255 || 0 <= monthAry[17] && monthAry[17] <= 30) {
              // ‰EŒü‚«
              if (224 <= monthAry[17] && monthAry[17] <= 255) {
                  console.log(peripheral+"¨");
                  state = peripheral+"¨";
              // ¶Œü‚«
              } else if (0 <= monthAry[17] && monthAry[17] <= 30) {
                  console.log(peripheral+"©");
                  state = peripheral+"©";
              }
          } else {
              /* 72 ~ 127 : ƒVƒFƒCƒN”»’è??*/
              console.log(peripheral+"ª");
              state = peripheral+"ª";
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
          title="ç¹§?½¹ç¹§?½¿ç¹ï½¼ç¹ï¿½"
          color="#000004"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={this.onPressLearnMore3}
          title="è¬—ï½¥é‚¯?¿½"
          color="#000004"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={this.onPressLearnMore4}
          title="è­–ï½¸ç¸ºå´Žï½¾?½¼ç¸º?½¿"
          color="#000004"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={this.onPressLearnMore5}
          title="é¨¾å¤‚è¡é«¢å¥?½§?¿½"
          color="#000004"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={this.onPressLearnMore2}
          title="è¿¥?½¶è«·çŽ–ï½¡?½¨é‰ï½º"
          color="#000004"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={this.onPressLearnMore22}
          title="è¿¥?½¶è«·çŽ–ï½¡?½¨é‰ï½º2"
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