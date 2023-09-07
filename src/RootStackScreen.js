import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './Login';
import SignUp from './SignUp';

const RootStack = createNativeStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator headerMode='none'>
        <RootStack.Screen name="LoginScreen" component={Login} options={{headerShown: false}}/>
        <RootStack.Screen name="SignUpScreen" component={SignUp} options={{headerShown: false}}/>
    </RootStack.Navigator>
);

export default RootStackScreen;