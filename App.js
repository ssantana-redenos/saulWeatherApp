import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';


import Cities from './src/screens/Cities';
import WeatherCity from './src/screens/WeatherCity';

const RootStack = createStackNavigator();

const App = () => (
  <NavigationContainer>
    <RootStack.Navigator headerMode="none">
      <RootStack.Screen name="Cities" component={Cities} />
      <RootStack.Screen name="WeatherCity" component={WeatherCity} />
    </RootStack.Navigator>
  </NavigationContainer>
);

export default App;
