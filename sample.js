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
    // state�ɂ͂��ꂪ����
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
      // 荳玖ｨ亙os髯仙ｮ?��
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
                    //縺?��縺?��莨上○繝輔Λ繧?��繧偵が繝ｳ
                    console.log(peripheral+"竊�");
                    state = peripheral+"竊�";
                // 莉ｰ蜷代?�?縺?��譎�(z�??��128~223縲∽?��?��蜷代?�?MIN191縺後�?�繧後ｋ縺梧凾縲?��譚｡莉ｶ荳肴?��弱�?165遲峨′蜿門?��励〒縺阪?��縺?��縺?��128縺?��縺?��隕九ｋ繧医≧縺?��縺励※縺?��繧?��)
                } else if (128 <= monthAry[17] && monthAry[17] <= 223) {
                    // 縺?��縺?��莨上○繝輔Λ繧?��繧偵が繝�
                    console.log(peripheral+"竊�");
                    state = peripheral+"竊�";
                    // 讓ｪ蜷代″縺?��譎�(z�??��224~255 or 0~30)
                } else if (224 <= monthAry[17] && monthAry[17] <= 255 || 0 <= monthAry[17] && monthAry[17] <= 30) {
                    // 蜿?��蜷代″
                    if (224 <= monthAry[17] && monthAry[17] <= 255) {
                        console.log(peripheral+"竊�");
                        state = peripheral+"竊�";
                    // 蟾?��蜷代″
                    } else if (0 <= monthAry[17] && monthAry[17] <= 30) {
                        console.log(peripheral+"竊�");
                        state = peripheral+"竊�";
                    }
                } else {
                    /* 72 ~ 127 : 繧?��繧?��繧?��繧?��蛻?��螳?��??*/
                    console.log(peripheral+"竊�");
                    state = peripheral+"竊�";
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
            this.setState({count: peripheral+"竊�"});
            // Convert bytes array to string
            const data = bytesToString(value);
            let test = String(value);
            let monthAry = test.split(',');

            if (31 <= monthAry[17] && monthAry[17] <= 65) {
              //�������t���O���I��
              console.log(peripheral+"��");
              state = peripheral+"��";
          // �����̎�(z��128~223�A����MIN191���Ƃ�邪���X�����s����165�����擾�ł���̂�128�܂Ō���悤�ɂ��Ă���)
          } else if (128 <= monthAry[17] && monthAry[17] <= 223) {
              // �������t���O���I�t
              console.log(peripheral+"��");
              state = peripheral+"��";
              // �������̎�(z��224~255 or 0~30)
          } else if (224 <= monthAry[17] && monthAry[17] <= 255 || 0 <= monthAry[17] && monthAry[17] <= 30) {
              // �E����
              if (224 <= monthAry[17] && monthAry[17] <= 255) {
                  console.log(peripheral+"��");
                  state = peripheral+"��";
              // ������
              } else if (0 <= monthAry[17] && monthAry[17] <= 30) {
                  console.log(peripheral+"��");
                  state = peripheral+"��";
              }
          } else {
              /* 72 ~ 127 : �V�F�C�N����??*/
              console.log(peripheral+"��");
              state = peripheral+"��";
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
          title="繧?��繧?��繝ｼ繝�"
          color="#000004"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={this.onPressLearnMore3}
          title="謗･邯?��"
          color="#000004"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={this.onPressLearnMore4}
          title="譖ｸ縺崎ｾ?��縺?��"
          color="#000004"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={this.onPressLearnMore5}
          title="騾夂衍髢句?��?��"
          color="#000004"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={this.onPressLearnMore2}
          title="迥?��諷玖｡?��遉ｺ"
          color="#000004"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={this.onPressLearnMore22}
          title="迥?��諷玖｡?��遉ｺ2"
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