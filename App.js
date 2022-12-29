import React from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import App2 from './App2';
const Stack = createStackNavigator()
const App = ({navigation}) => {
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


function DetailsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>IDを入力させる</Text>
      <Text>PASSWORDを入力させる</Text>
      <Button
        title="ログイン"
        onPress={() => {
          navigation.navigate('Home');
        }}
      />
    </View>
  )
}

export default App;