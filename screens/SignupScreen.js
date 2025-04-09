// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Switch,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   Image,
//   ActivityIndicator
// } from 'react-native';

// import { styles, colors } from '../constants/styles';

// export default function SignupScreen({ navigation }) {
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [rememberMe, setRememberMe] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const handleSignup = () => {
//     if (!firstName || !lastName || !email || !phone || !password) {
//       setErrorMessage("All fields are required");
//       return;
//     }
//     if (!isValidEmail(email)) {
//       setErrorMessage("Invalid email format");
//       return;
//     }
//     setErrorMessage('');
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       Alert.alert("Success", `Signed up as ${firstName} ${lastName}`);
//       navigation.navigate('LoginScreen');
//     }, 2000);
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//     >
//       <Image
//         source={require('../assets/logo.png')}
//         style={{ width: 120, height: 120, alignSelf: 'center', marginBottom: 24 }}
//       />

//       <Text style={styles.title}>Sign Up</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="First Name"
//         value={firstName}
//         onChangeText={text => setFirstName(text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Last Name"
//         value={lastName}
//         onChangeText={text => setLastName(text)}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={text => setEmail(text)}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Phone Number"
//         value={phone}
//         onChangeText={text => setPhone(text)}
//         keyboardType="phone-pad"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={text => setPassword(text)}
//         secureTextEntry={!showPassword}
//       />

//       <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
//         <Text style={styles.linkText}>
//           {showPassword ? "Hide Password" : "Show Password"}
//         </Text>
//       </TouchableOpacity>

//       {errorMessage !== '' && (
//         <Text style={styles.errorText}>{errorMessage}</Text>
//       )}

//       <View style={styles.rememberMeContainer}>
//         <Text style={styles.rememberMeText}>Remember Me</Text>
//         <Switch
//           value={rememberMe}
//           onValueChange={value => setRememberMe(value)}
//         />
//       </View>

//       {loading ? (
//         <ActivityIndicator size="large" color={colors.primary} />
//       ) : (
//         <TouchableOpacity style={styles.button} onPress={handleSignup}>
//           <Text style={styles.buttonText}>Sign Up</Text>
//         </TouchableOpacity>
//       )}

//       <TouchableOpacity onPress={() => Alert.alert("Google Signup", "Google Sign-Up Placeholder")}>
//         <Text style={styles.linkText}>Sign up with Google</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
//         <Text style={styles.linkText}>Already have an account? Login</Text>
//       </TouchableOpacity>
//     </KeyboardAvoidingView>
//   );
// }
