import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native';

import { styles, colors } from '../constants/styles';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please fill in both email and password");
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMessage("Invalid email format");
      return;
    }

    setErrorMessage('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", `Logged in as ${email}`);
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Image
        source={require('../assets/logo.png')}
        style={{ width: 120, height: 120, alignSelf: 'center', marginBottom: 24 }}
      />

      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry={!showPassword}
      />

      <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
        <Text style={styles.linkText}>
          {showPassword ? "Hide Password" : "Show Password"}
        </Text>
      </TouchableOpacity>

      {errorMessage !== '' && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      <View style={styles.rememberMeContainer}>
        <Text style={styles.rememberMeText}>Remember Me</Text>
        <Switch
          value={rememberMe}
          onValueChange={value => setRememberMe(value)}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <TouchableOpacity
          style={[
            styles.button,
            (!email || !password) && { backgroundColor: colors.gray }
          ]}
          onPress={handleLogin}
          disabled={!email || !password}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => Alert.alert("Reset Password", "Redirect to password recovery flow")}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => Alert.alert("Google Login", "Google Sign-In Placeholder")}>
        <Text style={styles.linkText}>Sign in with Google</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
