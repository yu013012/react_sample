import React from 'react';
import {StyleSheet, View, Text, Button, TextInput, SafeAreaView} from 'react-native';
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


function DetailsScreen({ navigation }) {
  return (
    <SafeAreaView>
      <TextInput
        style={styles.input}
        placeholder="ID"
      />
      <TextInput
        style={styles.input}
        placeholder="パスワード"
      />
      <Button
        title="ログイン"
        onPress={() => {
          navigation.navigate('Home');
        }}
      />
    </SafeAreaView>
  )
}

export default App;