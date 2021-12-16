import React from 'react';
import {Text, View} from 'react-native';
import MusicPlayer from "./src/MusicPlayer";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// View, ScrollView
// FlatList --> Map in JSX // SectionList

import LoadingPage from './src/components/LoadingPage';
import JoinAGame from './src/components/JoinAGame';
import TheGame from './src/components/TheGame';
import ConfigCreateGame from './src/components/ConfigCreateGame';
import configCreateGame from "./src/components/ConfigCreateGame";

const Stack = createNativeStackNavigator();
const Home = () => {
    return (
        <Text>Hello</Text>
    )
}

const App = () => {
  return (
      <NavigationContainer>
          <Stack.Navigator>
              <Stack.Screen name="LoadingPage" component={LoadingPage} />
              <Stack.Screen name="home" component={Home}/>
              <Stack.Screen name="joingame" component={JoinAGame}/>
              <Stack.Screen name="configgame" component={configCreateGame} />
              <Stack.Screen
                  name={"game"}
                  component={TheGame}
                  options={
                    {
                        headerShown : false
                    }
                  }
                  initialParams={{
                      "User" : "Armand",
                      "Bots" : ["bot1","bot2"]
                  }}
              />
          </Stack.Navigator>
      </NavigationContainer>
  )
}
export default App;