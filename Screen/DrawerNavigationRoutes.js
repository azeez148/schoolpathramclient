// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React
import React, {useState, useEffect} from 'react';

// Import Navigators from React Navigation
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

// Import Screens
import HomeScreen from './DrawerScreens/HomeScreen';
import ProfileScreen from './DrawerScreens/ProfileScreen';
import NewsFeedScreen from './DrawerScreens/NewsFeedScreen';

import SettingsScreen from './DrawerScreens/SettingsScreen';
import ListUsersScreen from './DrawerScreens/ListUsersScreen';

import CustomSidebarMenu from './Components/CustomSidebarMenu';
import NavigationDrawerHeader from './Components/NavigationDrawerHeader';

import AsyncStorage from '@react-native-community/async-storage';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const newsFeedScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="NewsFeedScreen">
      <Stack.Screen
        name="NewsFeedScreen"
        component={NewsFeedScreen}
        options={{
          title: 'News Feed', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#307ecc', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};

const profileScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="ProfileScreen">
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: 'Profile', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#307ecc', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};
const homeScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: 'Home', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#307ecc', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};

const settingScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator
      initialRouteName="SettingsScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#307ecc', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          title: 'Settings', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const listUsersScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator
      initialRouteName="ListUsersScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#307ecc', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="ListUsersScreen"
        component={ListUsersScreen}
        options={{
          title: 'List Users', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const DrawerNavigatorRoutes = props => {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(async () => {
    const userData = await AsyncStorage.getItem('@u_info');
    userInfo = JSON.parse(userData);
    setIsAdmin(userInfo.isAdmin);
  }, []);

  if (isAdmin) {
    return (
      <Drawer.Navigator
        drawerContentOptions={{
          activeTintColor: '#7b69a5',
          color: '#7b69a5',
          itemStyle: {marginVertical: 5, color: 'white'},
          labelStyle: {
            color: 'white',
          },
        }}
        screenOptions={{headerShown: false}}
        drawerContent={CustomSidebarMenu}>
        <Drawer.Screen
          name="newsFeedScreenStack"
          options={{drawerLabel: 'News Feed'}}
          component={newsFeedScreenStack}
        />
        <Drawer.Screen
          name="listUsersScreenStack"
          options={{drawerLabel: 'Users'}}
          component={listUsersScreenStack}
        />
        <Drawer.Screen
          name="profileScreenStack"
          options={{drawerLabel: 'Profile'}}
          component={profileScreenStack}
        />
        {/* <Drawer.Screen
        name="homeScreenStack"
        options={{drawerLabel: 'Home'}}
        component={homeScreenStack}
      /> */}
        {/* <Drawer.Screen
        name="linupScreenStack"
        options={{drawerLabel: 'Linups'}}
        component={linupScreenStack}
      /> */}
        <Drawer.Screen
          name="settingScreenStack"
          options={{drawerLabel: 'Setting'}}
          component={settingScreenStack}
        />
      </Drawer.Navigator>
    );
  } else {
    return (
      <Drawer.Navigator
        drawerContentOptions={{
          activeTintColor: '#7b69a5',
          color: '#7b69a5',
          itemStyle: {marginVertical: 5, color: 'white'},
          labelStyle: {
            color: 'white',
          },
        }}
        screenOptions={{headerShown: false}}
        drawerContent={CustomSidebarMenu}>
        <Drawer.Screen
          name="newsFeedScreenStack"
          options={{drawerLabel: 'News Feed'}}
          component={newsFeedScreenStack}
        />
        <Drawer.Screen
          name="profileScreenStack"
          options={{drawerLabel: 'Profile'}}
          component={profileScreenStack}
        />
        {/* <Drawer.Screen
            name="homeScreenStack"
            options={{drawerLabel: 'Home'}}
            component={homeScreenStack}
          /> */}
        {/* <Drawer.Screen
            name="linupScreenStack"
            options={{drawerLabel: 'Linups'}}
            component={linupScreenStack}
          /> */}
        <Drawer.Screen
          name="settingScreenStack"
          options={{drawerLabel: 'Setting'}}
          component={settingScreenStack}
        />
      </Drawer.Navigator>
    );
  }
};

export default DrawerNavigatorRoutes;
