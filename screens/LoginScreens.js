import { setParams } from "expo-router/build/global-state/routing";
import React, {useState} from "react";

import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';

export default function LoginScreen() {
  const  [email, setEmail] = useState('');
  const  [password, setPassword] = useState('');
const handleLogin = () => {
  //empty field - edge case 
  if (email === '' || password === ''){
    Alert.alert('Error', 'Please Enter User name and password');
}
  else {
    Alert.alert('Success', 'Logged in as ${email}');
  }
}
}

return (
  <View style={StyleSheet.container}>
    {/*Screen title*/}
    <Text style={}>
    Login
    </Text>
    {/*Email input field */}
    <TextInput
    style={styles.input}
    placeholder="Email"
    value={email}
    onChangeText={text => setEmail(text)}
    keyboardType = "email-address"
    autoCapitalize="none"
  /> 
  {/*Pssword input field */}
  <TextInput
  style={styles.input} 
  placeholder="Password"
  value="password"
  onChange={text = setPassword(text)} 
  secureTextEntry={true} // hide passowrd within field
 ></TextInput>
 </View>
)
