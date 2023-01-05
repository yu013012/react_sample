import React, { Component, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Alert,
  Text,
  Button,
  View,
  NativeModules,
  NativeEventEmitter,
  Modal,
  ScrollView,
  AsyncStorage
} from 'react-native';
import Sound from 'react-native-sound';
import BleManager from 'react-native-ble-manager';
import DeviceInfo from 'react-native-device-info';
import axios from "axios";

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
//下記更新URL
///cgi-local/gosui/gosui_app.pl?ACT=UPDATE_RECORD&TNO=$inputTno&MNO=$mno&record_direction=$recordDirection&record_date=$recordDate&record_finish_date=$recordFinishDate&body_temperature=$lastBodyTemperature"
let alert_flg1, alert_flg2, alert_flg3, alert_flg4, alert_flg5, alert_flg6, alert_flg7, alert_flg8, alert_flg9, alert_flg10;
let uuid1, uuid2, uuid3, uuid4, uuid5, uuid6, uuid7, uuid8, uuid9, uuid10;
let name1, name2, name3, name4, name5, name6, name7, name8, name9, name10;
let uuid1_ios, uuid2_ios, uuid3_ios, uuid4_ios, uuid5_ios, uuid6_ios, uuid7_ios, uuid8_ios, uuid9_ios, uuid10_ios;
let start_flg1 = 0; 
let start_flg2 = 0;
let start_flg3 = 0;
let start_flg4 = 0;
let start_flg5 = 0;
let start_flg6 = 0;
let start_flg7 = 0;
let start_flg8 = 0;
let start_flg9 = 0;
let start_flg10 = 0;
let state_this;
let sound_flg = 0;
let token;
export default class App extends Component<{}> {
  
  constructor(props) {
    super(props);
    this.state = {
      direction1: "",
      direction2: "",
      direction3: "",
      direction4: "",
      direction5: "",
      direction6: "",
      direction7: "",
      direction8: "",
      direction9: "",
      direction10: "",

      button1: "午睡チェック開始",
      button2: "午睡チェック開始",
      button3: "午睡チェック開始",
      button4: "午睡チェック開始",
      button5: "午睡チェック開始",
      button6: "午睡チェック開始",
      button7: "午睡チェック開始",
      button8: "午睡チェック開始",
      button9: "午睡チェック開始",
      button10: "午睡チェック開始",

      b_color1: "green",
      b_color2: "green",
      b_color3: "green",
      b_color4: "green",
      b_color5: "green",
      b_color6: "green",
      b_color7: "green",
      b_color8: "green",
      b_color9: "green",
      b_color10: "green",
      modalVisible: false,
    };

    // token取得
    DeviceInfo.getUniqueId().then((uniqueId) => {
      token = uniqueId;
    });

    // センサーデータ読み込み
    setTimeout(() => {
      this.loadItem();
    }, 1000);

    // 1.5秒ごとにalert実行
    setInterval(() => {
      if (alert_flg1 == 1 || alert_flg2 == 1 || alert_flg3 == 1 || alert_flg4 == 1 || alert_flg5 == 1 || alert_flg6 == 1 || alert_flg7 == 1 || alert_flg8 == 1 || alert_flg9 == 1 || alert_flg10 == 1) {
        //うつ伏せモーダル表示
        this.setState({modalVisible:true});
        // うつ伏せアラーム
        if (sound_flg == 0) {
          this.alerm.play();
        }
      } else {
        this.setState({modalVisible:false});
      }
    }, 1500);

    state_this = this;
    this.alerm = new Sound('alert.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        sound_flg = 1;
      }
    });
    // stateにはこれがいる(変更可能にする)
    //this.blue_notification = this.blue_notification.bind(this);
    // 開始
    BleManager.start({ showAlert: false }).then(() => {
      // 1時間スキャンする
      BleManager.scan([], 18000, true).then(() => {
        // スキャンがうまくできれば
        bleManagerEmitter.addListener(
          'BleManagerDiscoverPeripheral',
          (args) => {
            if (args.id == uuid1) {
              blue_connect(uuid1)
              blue_write(uuid1, uuid1_ios)
              blue_notification(uuid1)
            }
            
            if (args.id == uuid2) {
              blue_connect(uuid2)
              blue_write(uuid2, uuid2_ios)
              blue_notification(uuid2)
            }
            if (args.id == uuid3) {
              blue_connect(uuid3)
              blue_write(uuid3, uuid3_ios)
              blue_notification(uuid3)
            }
            if (args.id == uuid4) {
              blue_connect(uuid4)
              blue_write(uuid4, uuid4_ios)
              blue_notification(uuid4)
            }
            if (args.id == uuid5) {
              blue_connect(uuid5)
              blue_write(uuid5, uuid5_ios)
              blue_notification(uuid5)
            }
            if (args.id == uuid6) {
              blue_connect(uuid6)
              blue_write(uuid6, uuid6_ios)
              blue_notification(uuid6)
            }
            if (args.id == uuid7) {
              blue_connect(uuid7)
              blue_write(uuid7, uuid7_ios)
              blue_notification(uuid7)
            }
            if (args.id == uuid8) {
              blue_connect(uuid8)
              blue_write(uuid8, uuid8_ios)
              blue_notification(uuid8)
            }
            if (args.id == uuid9) {
              blue_connect(uuid9)
              blue_write(uuid9, uuid9_ios)
              blue_notification(uuid9)
            }
            if (args.id == uuid10) {
              blue_connect(uuid10)
              blue_write(uuid10, uuid10_ios)
              blue_notification(uuid10)
            }
          }
        );
      }).catch((error) => {
        console.log();
      });
      // 通知取得
      bleManagerEmitter.addListener(
      "BleManagerDidUpdateValueForCharacteristic",
      ({ value, peripheral, characteristic, service }) => {
        let test = String(value);
        let monthAry = test.split(',');
        if (31 <= monthAry[17] && monthAry[17] <= 65) {
          if (peripheral == uuid1) {
            alert_flg1 = 1;
            state_this.setState({
              direction1: "↓"
            })
          } else if (peripheral == uuid2) {
            alert_flg2 = 1;
            state_this.setState({
              direction2: "↓"
            })
          } else if (peripheral == uuid3) {
            alert_flg3 = 1;
            state_this.setState({
              direction3: "↓"
            })
          } else if (peripheral == uuid4) {
            alert_flg4 = 1;
            state_this.setState({
              direction4: "↓"
            })
          } else if (peripheral == uuid5) {
            alert_flg5 = 1;
            state_this.setState({
              direction5: "↓"
            })
          } else if (peripheral == uuid6) {
            alert_flg6 = 1;
            state_this.setState({
              direction6: "↓"
            })
          } else if (peripheral == uuid7) {
            alert_flg7 = 1;
            state_this.setState({
              direction7: "↓"
            })
          } else if (peripheral == uuid8) {
            alert_flg8 = 1;
            state_this.setState({
              direction8: "↓"
            })
          } else if (peripheral == uuid9) {
            alert_flg9 = 1;
            state_this.setState({
              direction9: "↓"
            })
          } else {
            alert_flg10 = 1;
            state_this.setState({
              direction10: "↓"
            })
          }
        // 仰向けの時(z軸128~223、仰向けMIN191がとれるが時々条件不明で165等が取得できるので128まで見るようにしている)
        } else if (128 <= monthAry[17] && monthAry[17] <= 223) {
          // ↑
          if (peripheral == uuid1) {
            alert_flg1 = 0;
            state_this.setState({
              direction1: "↑"
            })
          } else if (peripheral == uuid2) {
            alert_flg2 = 0;
            state_this.setState({
              direction2: "↑"
            })
          } else if (peripheral == uuid3) {
            alert_flg3 = 0;
            state_this.setState({
              direction3: "↑"
            })
          } else if (peripheral == uuid4) {
            alert_flg4 = 0;
            state_this.setState({
              direction4: "↑"
            })
          } else if (peripheral == uuid5) {
            alert_flg5 = 0;
            state_this.setState({
              direction5: "↑"
            })
          } else if (peripheral == uuid6) {
            alert_flg6 = 0;
            state_this.setState({
              direction6: "↑"
            })
          } else if (peripheral == uuid7) {
            alert_flg7 = 0;
            state_this.setState({
              direction7: "↑"
            })
          } else if (peripheral == uuid8) {
            alert_flg8 = 0;
            state_this.setState({
              direction8: "↑"
            })
          } else if (peripheral == uuid9) {
            alert_flg9 = 0;
            state_this.setState({
              direction9: "↑"
            })
          } else {
            alert_flg10 = 0;
            state_this.setState({
              direction10: "↑"
            })
          }
          // 横向きの時(z軸224~255 or 0~30)
        } else if (224 <= monthAry[17] && monthAry[17] <= 255 || 0 <= monthAry[17] && monthAry[17] <= 30) {
          // 右向き
          if (224 <= monthAry[17] && monthAry[17] <= 255) {
            if (peripheral == uuid1) {
              alert_flg1 = 0;
              state_this.setState({
                direction1: "⇨"
              })
            } else if (peripheral == uuid2) {
              alert_flg2 = 0;
              state_this.setState({
                direction2: "⇨"
              })
            } else if (peripheral == uuid3) {
              alert_flg3 = 0;
              state_this.setState({
                direction3: "⇨"
              })
            } else if (peripheral == uuid4) {
              alert_flg4 = 0;
              state_this.setState({
                direction4: "⇨"
              })
            } else if (peripheral == uuid5) {
              alert_flg5 = 0;
              state_this.setState({
                direction5: "⇨"
              })
            } else if (peripheral == uuid6) {
              alert_flg6 = 0;
              state_this.setState({
                direction6: "⇨"
              })
            } else if (peripheral == uuid7) {
              alert_flg7 = 0;
              state_this.setState({
                direction7: "⇨"
              })
            } else if (peripheral == uuid8) {
              alert_flg8 = 0;
              state_this.setState({
                direction8: "⇨"
              })
            } else if (peripheral == uuid9) {
              alert_flg9 = 0;
              state_this.setState({
                direction9: "⇨"
              })
            } else {
              alert_flg10 = 0;
              state_this.setState({
                direction10: "⇨"
              })
            }
          // 左向き
          } else if (0 <= monthAry[17] && monthAry[17] <= 30) {
            if (peripheral == uuid1) {
              alert_flg1 = 0;
              state_this.setState({
                direction1: "⇦"
              })
            } else if (peripheral == uuid2) {
              alert_flg2 = 0;
              state_this.setState({
                direction2: "⇦"
              })
            } else if (peripheral == uuid3) {
              alert_flg3 = 0;
              state_this.setState({
                direction3: "⇦"
              })
            } else if (peripheral == uuid4) {
              alert_flg4 = 0;
              state_this.setState({
                direction4: "⇦"
              })
            } else if (peripheral == uuid5) {
              alert_flg5 = 0;
              state_this.setState({
                direction5: "⇦"
              })
            } else if (peripheral == uuid6) {
              alert_flg6 = 0;
              state_this.setState({
                direction6: "⇦"
              })
            } else if (peripheral == uuid7) {
              alert_flg7 = 0;
              state_this.setState({
                direction7: "⇦"
              })
            } else if (peripheral == uuid8) {
              alert_flg8 = 0;
              state_this.setState({
                direction8: "⇦"
              })
            } else if (peripheral == uuid9) {
              alert_flg9 = 0;
              state_this.setState({
                direction9: "⇦"
              })
            } else {
              alert_flg1 = 0;
              state_this.setState({
                direction10: "⇦"
              })
            }
          }
        } else {
          
          /* 72 ~ 127 : シェイク判定??*/
          if (peripheral == uuid1) {
            alert_flg1 = 0;
            state_this.setState({
              direction1: "↑"
            })
          } else if (peripheral == uuid2) {
            alert_flg2 = 0;
            state_this.setState({
              direction2: "↑"
            })
          } else if (peripheral == uuid3) {
            alert_flg3 = 0;
            state_this.setState({
              direction3: "↑"
            })
          } else if (peripheral == uuid4) {
            alert_flg4 = 0;
            state_this.setState({
              direction4: "↑"
            })
          } else if (peripheral == uuid5) {
            alert_flg5 = 0;
            state_this.setState({
              direction5: "↑"
            })
          } else if (peripheral == uuid6) {
            alert_flg6 = 0;
            state_this.setState({
              direction6: "↑"
            })
          } else if (peripheral == uuid7) {
            alert_flg7 = 0;
            state_this.setState({
              direction7: "↑"
            })
          } else if (peripheral == uuid8) {
            alert_flg8 = 0;
            state_this.setState({
              direction8: "↑"
            })
          } else if (peripheral == uuid9) {
            alert_flg9 = 0;
            state_this.setState({
              direction9: "↑"
            })
          } else {
            alert_flg10 = 0;
            state_this.setState({
              direction10: "↑"
            })
          }
        }
      });
    });
  }

  start1() {
    if (start_flg1 == 1) {
      start_flg1 = 0;
      state_this.setState({
        button1: "午睡チェック開始",
        b_color1: "green"
      })
    } else {
      start_flg1 = 1
      state_this.setState({
        button1: "午睡チェック終了",
        b_color1: "red"
      })
    }
  }

  start2() {
    if (start_flg2 == 1) {
      start_flg2 = 0;
      state_this.setState({
        button2: "午睡チェック開始",
        b_color2: "green"
      })
    } else {
      start_flg2 = 1
      state_this.setState({
        button2: "午睡チェック終了",
        b_color2: "red"
      })
    }
  }

  start3() {
    if (start_flg3 == 1) {
      start_flg3 = 0;
      state_this.setState({
        button3: "午睡チェック開始",
        b_color3: "green"
      })
    } else {
      start_flg3 = 1
      state_this.setState({
        button3: "午睡チェック終了",
        b_color3: "red"
      })
    }
  }

  start4() {
    if (start_flg4 == 1) {
      start_flg4 = 0;
      state_this.setState({
        button4: "午睡チェック開始",
        b_color4: "green"
      })
    } else {
      start_flg4 = 1
      state_this.setState({
        button4: "午睡チェック終了",
        b_color4: "red"
      })
    }
  }

  start5() {
    if (start_flg5 == 1) {
      start_flg5 = 0;
      state_this.setState({
        button5: "午睡チェック開始",
        b_color5: "green"
      })
    } else {
      start_flg5 = 1
      state_this.setState({
        button5: "午睡チェック終了",
        b_color5: "red"
      })
    }
  }

  start6() {
    if (start_flg6 == 1) {
      start_flg6 = 0;
      state_this.setState({
        button6: "午睡チェック開始",
        b_color6: "green"
      })
    } else {
      start_flg6 = 1
      state_this.setState({
        button6: "午睡チェック終了",
        b_color6: "red"
      })
    }
  }

  start7() {
    if (start_flg7 == 1) {
      start_flg7 = 0;
      state_this.setState({
        button7: "午睡チェック開始",
        b_color7: "green"
      })
    } else {
      start_flg7 = 1
      state_this.setState({
        button7: "午睡チェック終了",
        b_color7: "red"
      })
    }
  }

  start8() {
    if (start_flg8 == 1) {
      start_flg8 = 0;
      state_this.setState({
        button8: "午睡チェック開始",
        b_color8: "green"
      })
    } else {
      start_flg8 = 1
      state_this.setState({
        button8: "午睡チェック終了",
        b_color8: "red"
      })
    }
  }

  start9() {
    if (start_flg9 == 1) {
      start_flg9 = 0;
      state_this.setState({
        button9: "午睡チェック開始",
        b_color9: "green"
      })
    } else {
      start_flg9 = 1
      state_this.setState({
        button9: "午睡チェック終了",
        b_color9: "red"
      })
    }
  }

  start10() {
    if (start_flg10 == 1) {
      start_flg10 = 0;
      state_this.setState({
        button10: "午睡チェック開始",
        b_color10: "green"
      })
    } else {
      start_flg10 = 1
      state_this.setState({
        button10: "午睡チェック終了",
        b_color10: "red"
      })
    }
  }

  render() {
    return (
        <View style={styles.container}>
          <ScrollView style={styles.sview}>
            <Text style={styles.text}>
              トークン
              {"\n"}
              { token }
              {"\n"}
            </Text>
            <View style={{backgroundColor: this.state.b_color1}}>
              <Button
                onPress={this.start1}
                title={ this.state.button1 }
                color="#000004"
              />
            </View>
            <Text style={styles.text}>
              NO.1： { this.state.direction1 }  { name1 }
              {"\n"}
            </Text>
            <View style={{backgroundColor: this.state.b_color2}}>
              <Button
                onPress={this.start2}
                title={ this.state.button2 }
                color="#000004"
              />
            </View>
            <Text style={styles.text}>
              NO.2： { this.state.direction2 }  { name2 }
              {"\n"}
            </Text>
            <View style={{backgroundColor: this.state.b_color3}}>
              <Button
                onPress={this.start3}
                title={ this.state.button3 }
                color="#000004"
              />
            </View>
            <Text style={styles.text}>
              NO.3： { this.state.direction3 }  { name3 }
              {"\n"}
            </Text>
            <View style={{backgroundColor: this.state.b_color4}}>
              <Button
                onPress={this.start4}
                title={ this.state.button4 }
                color="#000004"
              />
            </View>
            <Text style={styles.text}>
              NO.4： { this.state.direction4 }  { name4 }
              {"\n"}
            </Text>
            <View style={{backgroundColor: this.state.b_color5}}>
              <Button
                onPress={this.start5}
                title={ this.state.button5 }
                color="#000004"
              />
            </View>
            <Text style={styles.text}>
              NO.5： { this.state.direction5 }  { name5 }
              {"\n"}
            </Text>
            <View style={{backgroundColor: this.state.b_color6}}>
              <Button
                onPress={this.start6}
                title={ this.state.button6 }
                color="#000004"
              />
            </View>
            <Text style={styles.text}>
              NO.6： { this.state.direction6 }  { name6 }
              {"\n"}
            </Text>
            <View style={{backgroundColor: this.state.b_color7}}>
              <Button
                onPress={this.start7}
                title={ this.state.button7 }
                color="#000004"
              />
            </View>
            <Text style={styles.text}>
              NO.7： { this.state.direction7 }  { name7 }
              {"\n"}
            </Text>
            <View style={{backgroundColor: this.state.b_color8}}>
              <Button
                onPress={this.start8}
                title={ this.state.button8 }
                color="#000004"
              />
            </View>
            <Text style={styles.text}>
              NO.8： { this.state.direction8 }  { name8 }
              {"\n"}
            </Text>
            <View style={{backgroundColor: this.state.b_color9}}>
              <Button
                onPress={this.start9}
                title={ this.state.button9 }
                color="#000004"
              />
            </View>
            <Text style={styles.text}>
              NO.9： { this.state.direction9 }  { name9 }
              {"\n"}
            </Text>
            <View style={{backgroundColor: this.state.b_color10}}>
              <Button
                onPress={this.start10}
                title={ this.state.button10 }
                color="#000004"
              />
            </View>
            <Text style={styles.text}>
              NO.10： { this.state.direction10 }  { name10 }
              {"\n"}
            </Text>
          </ScrollView>
          <Modal visible={this.state.modalVisible}>
            <View style={styles.container}>
              <Text style={styles.text}>
                うつ伏せになっています
              </Text>
            </View>
          </Modal>
        </View>
    );
  }

  // データの存在を確認後blue開始
  loadItem = async () => {
    try {
      const tno = await AsyncStorage.getItem("tno");
      if(tno) {
        const baseURL = "https://www.cloudtest2.pw/cgi-local/gosui/gosui_app.pl?ACT=GET_DATA&TNO="+tno+"&token="+token;
        axios.get(baseURL).then((response) => {
          if (response) {
            if (Platform.OS == 'ios') {
              uuid1 = response.data.uuid1;
              uuid2 = response.data.uuid2;
              uuid3 = response.data.uuid3;
              uuid4 = response.data.uuid4;
              uuid5 = response.data.uuid5;
              uuid6 = response.data.uuid6;
              uuid7 = response.data.uuid7;
              uuid8 = response.data.uuid8;
              uuid9 = response.data.uuid9;
              uuid10 = response.data.uuid10;
            } else {
              uuid1 = response.data.mac1;
              uuid2 = response.data.mac2;
              uuid3 = response.data.mac3;
              uuid4 = response.data.mac4;
              uuid5 = response.data.mac5;
              uuid6 = response.data.mac6;
              uuid7 = response.data.mac7;
              uuid8 = response.data.mac8;
              uuid9 = response.data.mac9;
              uuid10 = response.data.mac10;
            }
            uuid1_ios = response.data.uuid1;
            uuid2_ios = response.data.uuid2;
            uuid3_ios = response.data.uuid3;
            uuid4_ios = response.data.uuid4;
            uuid5_ios = response.data.uuid5;
            uuid6_ios = response.data.uuid6;
            uuid7_ios = response.data.uuid7;
            uuid8_ios = response.data.uuid8;
            uuid9_ios = response.data.uuid9;
            uuid10_ios = response.data.uuid10;

            name1 = response.data.name1;
            name2 = response.data.name2;
            name3 = response.data.name3;
            name4 = response.data.name4;
            name5 = response.data.name5;
            name6 = response.data.name6;
            name7 = response.data.name7;
            name8 = response.data.name8;
            name9 = response.data.name9;
            name10 = response.data.name10;
          } else {
            //エラー表示
            console.log("エラー表示");
          }
        });
      }
    } catch (e) {
      console.log(e)
    }
  }
}

function blue_connect(uuid) {
  // 接続
  BleManager.connect(uuid).then(() => {
  })
  .catch((error) => {
    blue_connect(uuid)
  });
}

function blue_write(uuid, ios_uuid) {
  // 書き込みに必要、iosは通知にも必要
  BleManager.retrieveServices(ios_uuid);
  BleManager.writeWithoutResponse(
    uuid,
      "0000c62e-9910-0bac-5241-d8bda6932a2f",
      "00000d2e-1c03-aca1-ab48-a9b908bae79e",
      [0x28, 0x43, 0x44, 0x02, 0x03, 0x29]
  )
  .then((data) => {
  })
  .catch((error) => {
    blue_write(uuid, ios_uuid)
  });
}

function blue_notification(uuid) {
  BleManager.startNotification(
    uuid,
    "0000C62E-9910-0BAC-5241-D8BDA6932A2F",
    "00005991-B131-3396-014C-664C9867B917"
  )
  .then(() => {
  })
  .catch((error) => {
    blue_notification(uuid)
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 50,
  },
  text: {
    fontSize: 25,
  },
  sview: {
    width: "90%",
  },
});