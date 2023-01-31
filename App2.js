//ios,androidで色の付け方が違う
//android: button color
//ios: view backgroundcolor

//stateにはこれがいる(変更可能にする)
//this.blue_notification = this.blue_notification.bind(this);
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
  AsyncStorage,
  LogBox
} from 'react-native';
import Sound from 'react-native-sound';
import BleManager from 'react-native-ble-manager';
import DeviceInfo from 'react-native-device-info';
import axios from "axios";

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

// テスト環境
let URL = "https://www.cloudtest2.pw/";

// 本番環境
//let URL = "https://www.it-service.co.jp/";

// alertを出すか判断するフラグ
let alert_flg1, alert_flg2, alert_flg3, alert_flg4, alert_flg5, alert_flg6, alert_flg7, alert_flg8, alert_flg9, alert_flg10;
// サーバーのレスポンスからuuid or macaddressを格納
let uuid1, uuid2, uuid3, uuid4, uuid5, uuid6, uuid7, uuid8, uuid9, uuid10;
// サーバーのレスポンスから名前を格納
let name1, name2, name3, name4, name5, name6, name7, name8, name9, name10;
// サーバーのレスポンスからmnoを格納
let mno1, mno2, mno3, mno4, mno5, mno6, mno7, mno8, mno9, mno10;
// サーバーのレスポンスから担当を格納
let tantou1, tantou2, tantou3, tantou4, tantou5, tantou6, tantou7, tantou8, tantou9, tantou10;
// サーバーのレスポンスからカテゴリを格納
let katego1, katego2, katego3, katego4, katego5, katego6, katego7, katego8, katego9, katego10;
// サーバーのレスポンスからuuidを格納(ios用)
let uuid1_ios, uuid2_ios, uuid3_ios, uuid4_ios, uuid5_ios, uuid6_ios, uuid7_ios, uuid8_ios, uuid9_ios, uuid10_ios;
// alertを出すか判断するフラグ
let connected1, connected2, connected3, connected4, connected5, connected6, connected7, connected8, connected9, connected10;
// tno
let tno;
// 午睡開始ボタンを押したかどうか判断するフラグ
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

// 午睡開始ボタンを押したかどうか判断するフラグ
let send_flg1 = 0; 
let send_flg2 = 0;
let send_flg3 = 0;
let send_flg4 = 0;
let send_flg5 = 0;
let send_flg6 = 0;
let send_flg7 = 0;
let send_flg8 = 0;
let send_flg9 = 0;
let send_flg10 = 0;

// 他メソッドでもthisを使えるように下記に格納
let state_this;
// 音源を読み込みできたかどうか判断するフラグ
let sound_flg = 0;
// 端末の固有トークン格納
let token;
// warning削除
LogBox.ignoreAllLogs();

export default class App extends Component<{}> {
  
  constructor(props) {
    super(props);
    this.state = {
      // blueから受け取った向き
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
      
      // ボタンのテキスト
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

      // ボタンの背景色
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
      
      // modal表示フラグ
      modalVisible: false,
    };

    // token取得
    DeviceInfo.getUniqueId().then((uniqueId) => {
      token = uniqueId;
    });

    // レンダリング後に処理しないとエラーになる
    setTimeout(() => {
      // センサーデータ読み込み
      this.loadItem();
    }, 1000);

    // 1.5秒ごとにalertを実行
    setInterval(() => {
      // alert
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

    // 30秒ごとにデータ送信を実行
    setInterval(() => {
      // データ送信
      var date = new Date();
      var date_str = String(date.getFullYear())
              + String(('0' + (date.getMonth() + 1)).slice(-2))
              + String(('0' + date.getDate()).slice(-2))
              + String(('0' + date.getHours()).slice(-2))
              + String(('0' + date.getMinutes()).slice(-2))
              + String(('0' + date.getSeconds()).slice(-2));
      var minute = date.getMinutes();
      // 5分おきに送る
      if (minute % 5 == 0) {
        if (start_flg1 == 1 && send_flg1 == 0) {
          send_flg1 = 1;
          send_data(1, date_str);
        }

        if (start_flg2 == 1 && send_flg2 == 0) {
          send_flg2 = 1;
          send_data(2, date_str);
        }

        if (start_flg3 == 1 && send_flg3 == 0) {
          send_flg3 = 1;
          send_data(3, date_str);
        }

        if (start_flg4 == 1 && send_flg4 == 0) {
          send_flg4 = 1;
          send_data(4, date_str);
        }

        if (start_flg5 == 1 && send_flg5 == 0) {
          send_flg5 = 1;
          send_data(5, date_str);
        }

        if (start_flg6 == 1 && send_flg6 == 0) {
          send_flg6 = 1;
          send_data(6, date_str);
        }

        if (start_flg7 == 1 && send_flg7 == 0) {
          send_flg7 = 1;
          send_data(7, date_str);
        }

        if (start_flg8 == 1 && send_flg8 == 0) {
          send_flg8 = 1;
          send_data(8, date_str);
        }

        if (start_flg9 == 1 && send_flg9 == 0) {
          send_flg9 = 1;
          send_data(9, date_str);
        }

        if (start_flg10 == 1 && send_flg10 == 0) {
          send_flg10 = 1;
          send_data(10, date_str);
        }
      
      // 5分じゃない場合はリセット
      } else {
        send_flg1 = 0;
        send_flg2 = 0;
        send_flg3 = 0;
        send_flg4 = 0;
        send_flg5 = 0;
        send_flg6 = 0;
        send_flg7 = 0;
        send_flg8 = 0;
        send_flg9 = 0;
        send_flg10 = 0;
      }
    }, 30000);

    state_this = this;

    // 音源読み込み
    this.alerm = new Sound('alert.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        sound_flg = 1;
      }
    });
    
    // 開始
    BleManager.start({ showAlert: false }).then(() => {
      // 1時間スキャンする
      BleManager.scan([], 18000, true).then(() => {
        // スキャンすると下記イベントが呼ばれる
        setInterval(() => {
          if (uuid1 != undefined && connected1 != 3) {
            blue_connect(uuid1, 1, connected1)
            blue_write(uuid1, uuid1_ios, 1, connected1)
            blue_notification(uuid1, 1, connected1)
          }
          if (uuid2 != undefined && connected2 != 3) {
            blue_connect(uuid2, 2, connected2)
            blue_write(uuid2, uuid2_ios, 2, connected2)
            blue_notification(uuid2, 2, connected2)
          }
          if (uuid3 != undefined && connected3 != 3) {
            blue_connect(uuid3, 3, connected3)
            blue_write(uuid3, uuid3_ios, 3, connected3)
            blue_notification(uuid3, 3, connected3)
          }
          if (uuid4 != undefined && connected4 != 3) {
            blue_connect(uuid4, 4, connected4)
            blue_write(uuid4, uuid4_ios, 4, connected4)
            blue_notification(uuid4, 4, connected4)
          }
          if (uuid5 != undefined && connected5 != 3) {
            blue_connect(uuid5, 5, connected5)
            blue_write(uuid5, uuid5_ios, 5, connected5)
            blue_notification(uuid5, 5, connected5)
          }
          if (uuid6 != undefined && connected6 != 3) {
            blue_connect(uuid6, 6, connected6)
            blue_write(uuid6, uuid6_ios, 6, connected6)
            blue_notification(uuid6, 6, connected6)
          }
          if (uuid7 != undefined && connected7 != 3) {
            blue_connect(uuid7, 7, connected7)
            blue_write(uuid7, uuid7_ios, 7, connected7)
            blue_notification(uuid7, 7, connected7)
          }
          if (uuid8 != undefined && connected8 != 3) {
            blue_connect(uuid8, 8, connected8)
            blue_write(uuid8, uuid8_ios, 8, connected8)
            blue_notification(uuid8, 8, connected8)
          }
          if (uuid9 != undefined && connected9 != 3) {
            blue_connect(uuid9, 9, connected9)
            blue_write(uuid9, uuid9_ios, 9, connected9)
            blue_notification(uuid9, 9, connected9)
          }
          if (uuid10 != undefined && connected10 != 3) {
            blue_connect(uuid10, 10, connected10)
            blue_write(uuid10, uuid10_ios, 10, connected10)
            blue_notification(uuid10, 10, connected10)
          }
        }, 3000);
      }).catch((error) => {
        console.log("error4");
      });

      // 定期的に通知を取得
      bleManagerEmitter.addListener(
      "BleManagerDidUpdateValueForCharacteristic",
      ({ value, peripheral, characteristic, service }) => {
        let data = String(value);
        let dataArray = data.split(',');
        // うつ伏せ
        if (31 <= dataArray[17] && dataArray[17] <= 65) {
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

        // 仰向け
        } else if (128 <= dataArray[17] && dataArray[17] <= 223) {
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

        // 横向きの時
        } else if (224 <= dataArray[17] && dataArray[17] <= 255 || 0 <= dataArray[17] && dataArray[17] <= 30) {
          // 右向き
          if (190 <= dataArray[15] && dataArray[15] <= 255) {
            if (peripheral == uuid1) {
              alert_flg1 = 0;
              state_this.setState({
                direction1: "→"
              })
            } else if (peripheral == uuid2) {
              alert_flg2 = 0;
              state_this.setState({
                direction2: "→"
              })
            } else if (peripheral == uuid3) {
              alert_flg3 = 0;
              state_this.setState({
                direction3: "→"
              })
            } else if (peripheral == uuid4) {
              alert_flg4 = 0;
              state_this.setState({
                direction4: "→"
              })
            } else if (peripheral == uuid5) {
              alert_flg5 = 0;
              state_this.setState({
                direction5: "→"
              })
            } else if (peripheral == uuid6) {
              alert_flg6 = 0;
              state_this.setState({
                direction6: "→"
              })
            } else if (peripheral == uuid7) {
              alert_flg7 = 0;
              state_this.setState({
                direction7: "→"
              })
            } else if (peripheral == uuid8) {
              alert_flg8 = 0;
              state_this.setState({
                direction8: "→"
              })
            } else if (peripheral == uuid9) {
              alert_flg9 = 0;
              state_this.setState({
                direction9: "→"
              })
            } else {
              alert_flg10 = 0;
              state_this.setState({
                direction10: "→"
              })
            }
          
          // 左向き
          } else if (0 <= dataArray[15] && dataArray[15] <= 65) {
            if (peripheral == uuid1) {
              alert_flg1 = 0;
              state_this.setState({
                direction1: "←"
              })
            } else if (peripheral == uuid2) {
              alert_flg2 = 0;
              state_this.setState({
                direction2: "←"
              })
            } else if (peripheral == uuid3) {
              alert_flg3 = 0;
              state_this.setState({
                direction3: "←"
              })
            } else if (peripheral == uuid4) {
              alert_flg4 = 0;
              state_this.setState({
                direction4: "←"
              })
            } else if (peripheral == uuid5) {
              alert_flg5 = 0;
              state_this.setState({
                direction5: "←"
              })
            } else if (peripheral == uuid6) {
              alert_flg6 = 0;
              state_this.setState({
                direction6: "←"
              })
            } else if (peripheral == uuid7) {
              alert_flg7 = 0;
              state_this.setState({
                direction7: "←"
              })
            } else if (peripheral == uuid8) {
              alert_flg8 = 0;
              state_this.setState({
                direction8: "←"
              })
            } else if (peripheral == uuid9) {
              alert_flg9 = 0;
              state_this.setState({
                direction9: "←"
              })
            } else {
              alert_flg1 = 0;
              state_this.setState({
                direction10: "←"
              })
            }
          } else {
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
        } else {
          /* 72 ~ 127 : シェイク判定*/
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

  // start1~start10 午睡開始ボタンを押したときに呼ばれる
  start1() {
    // start1~start10 データが登録されていなかった時、対策
    if (state_this.state.direction1 && name1 && katego1 && mno1) {
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
  }

  start2() {
    if (state_this.state.direction2 && name2 && katego2 && mno2) {
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
  }

  start3() {
    if (state_this.state.direction3 && name3 && katego3 && mno3) {
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
  }

  start4() {
    if (state_this.state.direction4 && name4 && katego4 && mno4) {
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
  }

  start5() {
    if (state_this.state.direction5 && name5 && katego5 && mno5) {
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
  }

  start6() {
    if (state_this.state.direction6 && name6 && katego6 && mno6) {
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
  }

  start7() {
    if (state_this.state.direction7 && name7 && katego7 && mno7) {
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
  }

  start8() {
    if (state_this.state.direction8 && name8 && katego8 && mno8) {
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
  }

  start9() {
    if (state_this.state.direction9 && name9 && katego9 && mno9) {
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
  }

  start10() {
    if (state_this.state.direction10 && name10 && katego10 && mno10) {
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
                color="this.state.b_color1"
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
                color="this.state.b_color2"
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
                color="this.state.b_color3"
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
                color="this.state.b_color4"
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
                color="this.state.b_color5"
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
                color="this.state.b_color6"
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
                color="this.state.b_color7"
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
                color="this.state.b_color8"
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
                color="this.state.b_color9"
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
                color="this.state.b_color10"
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
      const tno_data = await AsyncStorage.getItem("tno");
      tno = tno_data;
      if(tno) {
        const baseURL = URL+"cgi-local/gosui/gosui_app.pl?ACT=GET_DATA&TNO="+tno+"&token="+token;
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

            tantou1 = response.data.tantou1;
            tantou2 = response.data.tantou2;
            tantou3 = response.data.tantou3;
            tantou4 = response.data.tantou4;
            tantou5 = response.data.tantou5;
            tantou6 = response.data.tantou6;
            tantou7 = response.data.tantou7;
            tantou8 = response.data.tantou8;
            tantou9 = response.data.tantou9;
            tantou10 = response.data.tantou10;

            katego1 = response.data.katego1;
            katego2 = response.data.katego2;
            katego3 = response.data.katego3;
            katego4 = response.data.katego4;
            katego5 = response.data.katego5;
            katego6 = response.data.katego6;
            katego7 = response.data.katego7;
            katego8 = response.data.katego8;
            katego9 = response.data.katego9;
            katego10 = response.data.katego10;

            mno1 = response.data.mno1;
            mno2 = response.data.mno2;
            mno3 = response.data.mno3;
            mno4 = response.data.mno4;
            mno5 = response.data.mno5;
            mno6 = response.data.mno6;
            mno7 = response.data.mno7;
            mno8 = response.data.mno8;
            mno9 = response.data.mno9;
            mno10 = response.data.mno10;
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

function blue_connect(uuid, num, connected) {
  if (connected == undefined) {
    // 接続
    BleManager.connect(uuid).then(() => {
      if (num == 1) {
        connected1 = 1;
      } else if (num == 2) {
        connected2 = 1;
      } else if (num == 3) {
        connected3 = 1;
      } else if (num == 4) {
        connected4 = 1;
      } else if (num == 5) {
        connected5 = 1;
      } else if (num == 6) {
        connected6 = 1;
      } else if (num == 7) {
        connected7 = 1;
      } else if (num == 8) {
        connected8 = 1;
      } else if (num == 9) {
        connected9 = 1;
      } else if (num == 10) {
        connected10 = 1;
      }
    })
    .catch((error) => {
      console.log("error1");
    });
  }
}

function blue_write(uuid, ios_uuid, num, connected) {
  if (connected == 1) {
    // 書き込みに必要、iosは通知にも必要
    BleManager.retrieveServices(ios_uuid);
    BleManager.writeWithoutResponse(
      uuid,
        "0000c62e-9910-0bac-5241-d8bda6932a2f",
        "00000d2e-1c03-aca1-ab48-a9b908bae79e",
        [0x28, 0x43, 0x44, 0x02, 0x03, 0x29]
    )
    .then((data) => {
      if (num == 1) {
        connected1 = 2;
      } else if (num == 2) {
        connected2 = 2;
      } else if (num == 3) {
        connected3 = 2;
      } else if (num == 4) {
        connected4 = 2;
      } else if (num == 5) {
        connected5 = 2;
      } else if (num == 6) {
        connected6 = 2;
      } else if (num == 7) {
        connected7 = 2;
      } else if (num == 8) {
        connected8 = 2;
      } else if (num == 9) {
        connected9 = 2;
      } else if (num == 10) {
        connected10 = 2;
      }
    })
    .catch((error) => {
      console.log("error2");
    });
  }
}

function blue_notification(uuid, num, data) {
  if (data == 2) {
    BleManager.startNotification(
      uuid,
      "0000C62E-9910-0BAC-5241-D8BDA6932A2F",
      "00005991-B131-3396-014C-664C9867B917"
    )
    .then(() => {
      if (num == 1) {
        connected1 = 3;
      } else if (num == 2) {
        connected2 = 3;
      } else if (num == 3) {
        connected3 = 3;
      } else if (num == 4) {
        connected4 = 3;
      } else if (num == 5) {
        connected5 = 3;
      } else if (num == 6) {
        connected6 = 3;
      } else if (num == 7) {
        connected7 = 3;
      } else if (num == 8) {
        connected8 = 3;
      } else if (num == 9) {
        connected9 = 3;
      } else if (num == 10) {
        connected10 = 3;
      }
    })
    .catch((error) => {
      console.log("error3");
    });
  }
}

function send_data (num, data) {
  let mno, katego, tantou, direction;
  if (num == 1) {
    mno = mno1;
    katego = katego1;
    tantou = tantou1;
    if (state_this.state.direction1 == "↑") {
      direction = "u";
    } else if (state_this.state.direction1 == "↓") {
      direction = "d";
    } else if (state_this.state.direction1 == "←") {
      direction = "l";
    } else if (state_this.state.direction1 == "→") {
      direction = "r";
    }
  } else if (num == 2) {
    mno = mno2;
    katego = katego2;
    tantou = tantou2;
    if (state_this.state.direction2 == "↑") {
      direction = "u";
    } else if (state_this.state.direction2 == "↓") {
      direction = "d";
    } else if (state_this.state.direction2 == "←") {
      direction = "l";
    } else if (state_this.state.direction2 == "→") {
      direction = "r";
    }
  } else if (num == 3) {
    mno = mno3;
    katego = katego3;
    tantou = tantou3;
    if (state_this.state.direction3 == "↑") {
      direction = "u";
    } else if (state_this.state.direction3 == "↓") {
      direction = "d";
    } else if (state_this.state.direction3 == "←") {
      direction = "l";
    } else if (state_this.state.direction3 == "→") {
      direction = "r";
    }
  } else if (num == 4) {
    mno = mno4;
    katego = katego4;
    tantou = tantou4;
    if (state_this.state.direction4 == "↑") {
      direction = "u";
    } else if (state_this.state.direction4 == "↓") {
      direction = "d";
    } else if (state_this.state.direction4 == "←") {
      direction = "l";
    } else if (state_this.state.direction4 == "→") {
      direction = "r";
    }
  } else if (num == 5) {
    mno = mno5;
    katego = katego5;
    tantou = tantou5;
    if (state_this.state.direction5 == "↑") {
      direction = "u";
    } else if (state_this.state.direction5 == "↓") {
      direction = "d";
    } else if (state_this.state.direction5 == "←") {
      direction = "l";
    } else if (state_this.state.direction5 == "→") {
      direction = "r";
    }
  } else if (num == 6) {
    mno = mno6;
    katego = katego6;
    tantou = tantou6;
    if (state_this.state.direction6 == "↑") {
      direction = "u";
    } else if (state_this.state.direction6 == "↓") {
      direction = "d";
    } else if (state_this.state.direction6 == "←") {
      direction = "l";
    } else if (state_this.state.direction6 == "→") {
      direction = "r";
    }
  } else if (num == 7) {
    mno = mno7;
    katego = katego7;
    tantou = tantou7;
    if (state_this.state.direction7 == "↑") {
      direction = "u";
    } else if (state_this.state.direction7 == "↓") {
      direction = "d";
    } else if (state_this.state.direction7 == "←") {
      direction = "l";
    } else if (state_this.state.direction7 == "→") {
      direction = "r";
    }
  } else if (num == 8) {
    mno = mno8;
    katego = katego8;
    tantou = tantou8;
    if (state_this.state.direction8 == "↑") {
      direction = "u";
    } else if (state_this.state.direction8 == "↓") {
      direction = "d";
    } else if (state_this.state.direction8 == "←") {
      direction = "l";
    } else if (state_this.state.direction8 == "→") {
      direction = "r";
    }
  } else if (num == 9) {
    mno = mno9;
    katego = katego9;
    tantou = tantou9;
    if (state_this.state.direction9 == "↑") {
      direction = "u";
    } else if (state_this.state.direction9 == "↓") {
      direction = "d";
    } else if (state_this.state.direction9 == "←") {
      direction = "l";
    } else if (state_this.state.direction9 == "→") {
      direction = "r";
    }
  } else if (num == 10) {
    mno = mno10;
    katego = katego10;
    tantou = tantou10;
    if (state_this.state.direction10 == "↑") {
      direction = "u";
    } else if (state_this.state.direction10 == "↓") {
      direction = "d";
    } else if (state_this.state.direction10 == "←") {
      direction = "l";
    } else if (state_this.state.direction10 == "→") {
      direction = "r";
    }
  }
  const baseURL = URL+"cgi-local/gosui/gosui_app.pl?ACT=UPDATE_RECORD_REACT&TNO="+tno+"&MNO="+mno+"&record_direction="+direction+"&record_date="+data+"&category_react="+katego+"&tantou_react="+tantou;
  axios.get(baseURL).then((response) => {
    console.log(num + "を送りました");
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