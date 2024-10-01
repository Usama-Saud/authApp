// import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from '../sreens/splash/Splash';
import Login from '../sreens/auth/Login';
import Dashboard from '../sreens/dashboard/Dashboard';




const Stack = createStackNavigator();

const MainNavigation = () => {
  return (
    <NavigationContainer
    //   ref={ref => NavigationService.setTopLevelNavigator(ref)}
    >
      {/* <StatusBar hidden={true}/> */}
      <Stack.Navigator initialRouteName="SplashScreen">
        {/* <StatusBar backgroundColor="transparent" translucent={true} /> */}

        <Stack.Screen
          name="SplashScreen"
          component={Splash}
          options={{
            title: 'Splash',
            headerShown: false,
            headerTitleStyle: {
              fontSize: 18,
            },
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: 'Login',
            headerShown: false,
            headerTitleStyle: {
              fontSize: 18,
            },
          }}
        />
        {/* <Stack.Screen
          name="Register"
          component={Register}
          options={{
            title: 'Registration',
            headerStyle: {
              backgroundColor: '#000', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontSize: 18,
            },
          }}
        /> */}
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            // title: 'Dashboard',
            headerStyle: {
              backgroundColor: '#000', //Set Header color
            },
            headerShown: false,

            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontSize: 18,
            },
          }}
        />
        {/* <Stack.Screen
          name="AllCustomers"
          component={AllCustomers}
          options={{
            title: 'All Customers',
            // headerStyle: {
            //   backgroundColor: '#fff', //Set Header color
            // },
            // headerShown:false,

            // headerTintColor: '#fff', //Set Header text color
            // headerTitleStyle: {
            //   fontSize: 18,
            // },
          }}
        />
        <Stack.Screen
          name="AllItems"
          component={AllItems}
          options={{
            title: 'All Items',
            headerStyle: {
              backgroundColor: '#fff', //Set Header color
            },
            // headerShown:false,

            headerTintColor: '#000', //Set Header text color
            headerTitleStyle: {
              fontSize: 18,
            },
          }}
        />
        <Stack.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{
            title: 'Settings',
            headerStyle: {
              backgroundColor: '#000', //Set Header color
            },
            // headerShown:false,

            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              marginLeft: wp(25),
              fontSize: hp(2.2),
              color: 'white',
              fontFamily: 'Gilroy-Medium',
            },
          }}
        />
        <Stack.Screen
          name="ScanQR"
          component={ScanQR}
          options={{
            title: 'ERPAdmin',
            headerStyle: {
              backgroundColor: '#fff', //Set Header color
            },
            // headerShown:false,

            headerTintColor: '#000', //Set Header text color
            headerTitleStyle: {
              fontSize: 18,
            },
          }}
        />
        <Stack.Screen
          name="CollectEmpty"
          component={CollectEmpty}
          options={{
            // title: 'Collect Empty Items',
            headerStyle: {
              backgroundColor: '#fff', //Set Header color
            },
            // headerShown:false,

            headerTintColor: '#000', //Set Header text color
            headerTitleStyle: {
              fontSize: 18,
            },
          }}
        />
        <Stack.Screen
          name="Signature"
          component={Signature}
          options={{
            // title: 'Collect Empty Items',
            headerStyle: {
              backgroundColor: '#fff', //Set Header color
            },
            // headerShown:false,

            headerTintColor: '#000', //Set Header text color
            headerTitleStyle: {
              fontSize: 18,
            },
          }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;

// const styles = StyleSheet.create({});/
