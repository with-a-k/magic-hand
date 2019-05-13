import React from 'react';
import { createStackNavigator } from 'react-navigation';

import LoginScreen from './LoginView';
import RegisterScreen from './RegisterView';
import ReminderScreen from './ReminderView';

export default createStackNavigator(
  {
    Login: {
      screen: LoginScreen,
    },
    Results: {
      screen: RegisterScreen,
    },
    Reminder: {
      screen: ReminderScreen,
    },
  }
);
