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
      count: "",
      count2: "",
      count3: "",
      count4: "",
      count5: "",
      count6: "",
      count7: "",
      count8: "",
      count9: "",
      count10: "",
    };
    // stateにはこれがいる(変更可能にする)
    //this.information = this.information.bind(this);

    // 開始
    BleManager.start({ showAlert: false }).then(() => {
      // スキャン
      BleManager.scan([], 1000, true).then(() => {
        var uuid = "4C:02:2E:7E:56:A8";
        if (Platform.OS == 'ios') {
          uuid = "93B61CDF-30D0-F7F0-9D3A-300977E28648";
        }
        // 接続
        BleManager.connect(uuid).then(() => {
          var uuid = "4C:02:2E:7E:56:A8";
          if (Platform.OS == 'ios') {
            uuid = "93B61CDF-30D0-F7F0-9D3A-300977E28648";
          }
          BleManager.retrieveServices("D94920AE-A124-D354-33A8-74C416FDCF7E");
          // 書き込み
          console.log("Connected");
          
          BleManager.writeWithoutResponse(
            uuid,
            "0000c62e-9910-0bac-5241-d8bda6932a2f",
            "00000d2e-1c03-aca1-ab48-a9b908bae79e",
            [0x28, 0x43, 0x44, 0x02, 0x03, 0x29]
          )
          .then((data) => {
            console.log("ok");
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
                  bleManagerEmitter.addListener(
                  "BleManagerDidUpdateValueForCharacteristic",
                  ({ value, peripheral, characteristic, service }) => {
                    // Convert bytes array to string
                    let test = String(value);
                    let monthAry = test.split(',');

                    if (31 <= monthAry[17] && monthAry[17] <= 65) {
                      //うつ伏せフラグをオン
                      this.setState({
                        count: peripheral+"↓"
                      })
                    // 仰向けの時(z軸128~223、仰向けMIN191がとれるが時々条件不明で165等が取得できるので128まで見るようにしている)
                    } else if (128 <= monthAry[17] && monthAry[17] <= 223) {
                      // ↑
                      this.setState({
                        count: peripheral+"↑"
                      })
                      // 横向きの時(z軸224~255 or 0~30)
                    } else if (224 <= monthAry[17] && monthAry[17] <= 255 || 0 <= monthAry[17] && monthAry[17] <= 30) {
                      // 右向き
                      if (224 <= monthAry[17] && monthAry[17] <= 255) {
                        this.setState({
                          count: peripheral+"→"
                        })
                      // 左向き
                      } else if (0 <= monthAry[17] && monthAry[17] <= 30) {
                        this.setState({
                          count: peripheral+"←"
                        })
                      }
                    } else {
                      /* 72 ~ 127 : シェイク判定??*/
                      this.setState({
                        count: peripheral+"↑"
                      })
                    }
                  });
                })
                .catch((error) => {
                  console.log("通知エラー");
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
              bleManagerEmitter.addListener(
              "BleManagerDidUpdateValueForCharacteristic",
              ({ value, peripheral, characteristic, service }) => {
                let test = String(value);
                let monthAry = test.split(',');

                if (31 <= monthAry[17] && monthAry[17] <= 65) {
                  //うつ伏せフラグをオン
                  if (peripheral == "4C:02:2E:7E:4F:12") {
                    this.setState({
                      count2: "↓"
                    })
                  } else {
                    this.setState({
                      count: "↓"
                    })
                  }
                // 仰向けの時(z軸128~223、仰向けMIN191がとれるが時々条件不明で165等が取得できるので128まで見るようにしている)
                } else if (128 <= monthAry[17] && monthAry[17] <= 223) {
                  // ↑
                  if (peripheral == "4C:02:2E:7E:4F:12") {
                    this.setState({
                      count2: "↑"
                    })
                  } else {
                    this.setState({
                      count: "↑"
                    })
                  }
                  // 横向きの時(z軸224~255 or 0~30)
                } else if (224 <= monthAry[17] && monthAry[17] <= 255 || 0 <= monthAry[17] && monthAry[17] <= 30) {
                    // 右向き
                    if (224 <= monthAry[17] && monthAry[17] <= 255) {
                      if (peripheral == "4C:02:2E:7E:4F:12") {
                        this.setState({
                          count2: "→"
                        })
                      } else {
                        this.setState({
                          count: "→"
                        })
                      }
                     
                    // 左向き
                    } else if (0 <= monthAry[17] && monthAry[17] <= 30) {
                      if (peripheral == "4C:02:2E:7E:4F:12") {
                        this.setState({
                          count2: "←"
                        })
                      } else {
                        this.setState({
                          count: "←"
                        })
                      }
                    }
                  } else {
                    /* 72 ~ 127 : シェイク判定??*/
                    if (peripheral == "4C:02:2E:7E:4F:12") {
                      this.setState({
                        count2: "↑"
                      })
                    } else {
                      this.setState({
                        count: "↑"
                      })
                    }
                  }
                });
              })
              .catch((error) => {
                console.log("通知エラー");
              });
            }
          })
          .catch((error) => {
            console.log("書き込みエラー");
          });
        })
        .catch((error) => {
          console.log("書き込みエラー");
        });

        // 接続d
        var uuid = "4C:02:2E:7E:4F:12";
        if (Platform.OS == 'ios') {
          uuid = "93B61CDF-30D0-F7F0-9D3A-300977E28648";
        }
        BleManager.connect(uuid).then(() => {
          var uuid = "4C:02:2E:7E:4F:12";
          if (Platform.OS == 'ios') {
            uuid = "93B61CDF-30D0-F7F0-9D3A-300977E28648";
          }
          BleManager.retrieveServices("ED2E8A6E-E9B2-6C15-8BE9-1193AA4CECAD");
          // 書き込み
          console.log("Connected");
          
          BleManager.writeWithoutResponse(
            uuid,
            "0000c62e-9910-0bac-5241-d8bda6932a2f",
            "00000d2e-1c03-aca1-ab48-a9b908bae79e",
            [0x28, 0x43, 0x44, 0x02, 0x03, 0x29]
          )
          .then((data) => {
            console.log("ok");
            var uuid = "4C:02:2E:7E:4F:12";
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
                 
                })
                .catch((error) => {
                  console.log("通知エラー");
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
              
            })
            .catch((error) => {
              console.log("通知エラー");
            });
            }
          })
          .catch((error) => {
            console.log("書き込みエラー");
          });
        })
        .catch((error) => {
          console.log("書き込みエラー");
        });
 
      }).catch((error) => {
        console.log("接続エラー");
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          NO.1 山田 { this.state.count }
        </Text>
        <Text style={styles.text}>
          NO.2 佐藤 { this.state.count2 }
        </Text>
        <Text style={styles.text}>
          NO.3 丹羽 { this.state.count3 }
        </Text>
        <Text style={styles.text}>
          NO.4 高橋 { this.state.count4 }
        </Text>
        <Text style={styles.text}>
          NO.5 坂本 { this.state.count5 }
        </Text>
        <Text style={styles.text}>
          NO.6 鈴木 { this.state.count6 }
        </Text>
        <Text style={styles.text}>
          NO.7 花子 { this.state.count7 }
        </Text>
        <Text style={styles.text}>
          NO.8 太郎 { this.state.count8 }
        </Text>
        <Text style={styles.text}>
          NO.9 三郎 { this.state.count9 }
        </Text>
        <Text style={styles.text}>
          NO.10 史郎 { this.state.count10 }
        </Text>
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

  text: {
    fontSize: 25,
  },
});