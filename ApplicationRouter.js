import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from 'react-navigation';

import Search from './KeywordsView';
import Results from './AcceptView';

export default createBottomTabNavigator(
  {
    Search: {
      screen: Search,
    },
    Results: {
      screen: Results,
    },
  },
  {
    navigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, tintColor}) => {
        const {routeName} = navigation.state;
        let iconName;
        if (routeName === 'Search') {
          iconName = `ios-search${focused ? '' : '-outline'}`
        } else if (routeName === 'Results') {
          iconName = `ios-photos${focused ? '' : '-outline'}`
        }

        return <Ionicons name={iconName} size={25} color={tintColor}/>;
      }
    })
  }
);
