import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginView from './LoginView';
import RegisterView from './RegisterView';
import KeywordsView from './KeywordsView';
import AcceptView from './AcceptView';
import ApplicationTabs from './ApplicationRouter';
import AuthenticationStack from './AuthenticationRouter';
import Expo from 'expo';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import { createBottomTabNavigator, bottomTabBar } from 'react-navigation-tabs';

const {manifest} = Expo.Constants;
const api = (typeof manifest.packagerOpts === 'object') && manifest.packagerOpts.dev
  ? manifest.debuggerhost
  : 'production value'

class AuthenticationLoadScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Get authentication data.</Text>
      </View>
    );
  }
}

const AuthenticationSwitch = createSwitchNavigator(
  {
    Auth: AuthenticationStack,
    App: ApplicationTabs,
    Load: AuthenticationLoadScreen,
  },
  {
    initialRouteName: 'Load'
  }
)

export default class App extends Component {
  render() {
    return <ApplicationTabs/>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
