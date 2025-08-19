import React, { Component } from 'react';
import 'react-native-url-polyfill/auto';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import EventFormScreen from './src/components/CalendarView';
// import DeleteEventScreen from './src/components/EventList';
import LoginScreen from './src/screen/LoginScreen';
import HomeScreen from './src/screen/HomeScreen';
import SplashScreen from './src/screen/SplashScreen';

const Stack = createStackNavigator();

class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen">
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen
            name="EventForm"
            component={EventFormScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DeleteEvent"
            component={DeleteEventScreen}
            options={{ headerShown: false }}
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
