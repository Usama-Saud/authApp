import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import {Snackbar} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {getToken} from '../../API/getToken';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {setEmail, setPassword} from '../../redux/authSlice';
import { BASE_URL } from '@env';

const Login = () => {
  const navigation = useNavigation();

  useEffect(() => {
    console.log('Login Screen Loaded successfully')
  },[])
  const {email, password} = useSelector(state => state.auth);
  // console.log("User email ===========", email);
  const [loginPress, setLoginPress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('Please Enter Email *');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const dispatch = useDispatch();
  const handleEmailChange = text => {
    dispatch(setEmail(text)); // Dispatch setEmail action to update email in Redux store
  };

  const handlePasswordChange = text => {
    dispatch(setPassword(text)); // Dispatch setPassword action to update password in Redux store
  };
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible); // Toggle password visibility
  };
  const fetchWithTimeout = async (resource, options, timeout = 10000) => {
    const controller = new AbortController(); //if request takes longer than timeout then abort
    const id = setTimeout(() => controller.abort(), timeout); //aborted after timeout 10 seconds

    return fetch(resource, {
      ...options, // Additional options to pass to the fetch function, such as method, headers, and body.
      signal: controller.signal,
    })
      .then(response => {
        clearTimeout(id);
        return response;
      })
      .catch(error => {
        clearTimeout(id);
        throw error;
      });
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    if (!email || !password) {
      setLoading(false);
      setError('Email and password are required');
      setSnackbarMessage('Email and password are required');
      setSnackbarVisible(true);
      return;
    }
    if (!validateEmail(email)) {
      setLoading(false);
      setError('Invalid email format');
      setSnackbarMessage('Invalid email format');
      setSnackbarVisible(true);
      return;
    }

    try {
      const tokenResponse = await getToken();
      console.log("token Response Login Screen ==============", tokenResponse)
      if (!tokenResponse.success) {
        throw new Error(tokenResponse.error);
      }

      const data = JSON.stringify({
        userEmail: email,
        UserPassword: password,
        firebaseId: 0,
      });

      const response = await fetchWithTimeout(`${BASE_URL}/Authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenResponse.token}`,
        },
        body: data,
      });

      const jsonData = await response.json();
      console.log('Login User Details from API ==========', jsonData);
      if (response.ok && jsonData.status === 1) {
        await AsyncStorage.setItem('access_token', tokenResponse.token);
        await AsyncStorage.setItem('user_data',  JSON.stringify({
          firstName: jsonData.firstname,
          lastName: jsonData.lastname,
        }),);

        const {firstname, lastname} = jsonData; // Extract firstname and lastname
        console.log('Login User Details =========: ', firstname, lastname); // Log firstname and lastname

        console.log('Login successful');
        setSnackbarMessage('Login successful!');
        setSnackbarVisible(true);

        // dispatch(setEmail(email));
        // dispatch(setPassword(password));

        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{name: 'Dashboard', params: {firstname, lastname}}],
          });
        }, 2000);
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
      setSnackbarMessage(error.message);
      setSnackbarVisible(true);
    }
  };

  const validateEmail = email => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // Simple regex for email validation
    return regex.test(email);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}
        <View style={styles.innerContainer}>
          <Animatable.Text
            style={styles.titleText}
            animation="fadeInUp"
            delay={100}>
            Driver App
          </Animatable.Text>
          {/* <View style={styles.imageContainer}> */}
          <Image
            source={require('../../assets/maison.png')}
            style={styles.logoImage}
          />
          {/* </View> */}
          <View style={styles.formContainer}>
            <Text style={styles.loginText}>Enter Your Email & Password</Text>
            <View style={styles.inputView}>
              <Ionicons name={'person'} color={'#fca311'} size={20} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                placeholderTextColor="gray"
                onChangeText={handleEmailChange}
              />
            </View>
            {loginPress && !validateEmail(email) && (
              <Text style={styles.errorText}>{emailError}</Text>
            )}
            <View style={styles.inputView}>
              <Ionicons name={'lock-closed'} color={'#fca311'} size={20} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={!isPasswordVisible}
                onChangeText={handlePasswordChange}
                placeholderTextColor="gray"
              />
               <TouchableOpacity onPress={togglePasswordVisibility}>
                <Ionicons
                  name={isPasswordVisible ? 'eye-off' : 'eye'}
                  size={hp(3)}
                  color={'#000'}
                />
              </TouchableOpacity>

            </View>
            {loginPress && password === '' && (
              <Text style={styles.errorText}>Please Enter Password *</Text>
            )}

            {loading ? (
              <ActivityIndicator size="large" color="#fca311" />
            ) : (
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
            )}

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={3000} // how long to show the snackbar
            action={{
              label: 'Undo',
              onPress: () => {
                handleLogin();
                // Do something if needed when snackbar is dismissed by action
              },
            }}>
            {snackbarMessage}
          </Snackbar>
        </View>
        {/* </ScrollView> */}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fcf',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    // backgroundColor:'#cfa',
    // height:hp(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    height: hp(12),
    width: wp(36),
    position: 'absolute',
    top: hp(8),
    resizeMode:'contain'
    // bottom: hp(5),
  },
  titleText: {
    position: 'absolute',
    top: hp(2),
    // alignSelf: 'center',
    // top:hp(20),
    textAlign: 'center',
    color: '#000',
    fontSize: hp(3),
    fontFamily: 'HelveticaNowMicro-Bold',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  formContainer: {
    position: 'absolute',
    top: hp(30),
    // bottom:0,
    width: wp(85),
    height: hp(30),
    // backgroundColor:'red'
  },
  loginText: {
    marginLeft: wp(1),
    fontSize: hp(1.8),
    color: '#000',
    fontWeight: '600',
    // fontFamily: 'HelveticaNowMicro-ExtBdIta'
    // marginBottom: 10,
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#f1f3f6',
    marginTop: 10,
    borderColor: '#d3d3d3',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    // backgroundColor:'#c2f',
    height: hp(5),
    fontSize: hp(1.8),
    color: '#333',
    marginLeft: wp(1),
  },
  loginButton: {
    backgroundColor: '#fca311',
    paddingVertical: hp(1),
    borderRadius: 8,
    marginTop: hp(3),
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#444',
    fontSize: hp(2.2),
    fontWeight: 'bold',
    fontFamily: 'HelveticaNowMicro-Bold',
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: 16,
    color: '#000',
  },
  registerLink: {
    color: '#fca311',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});

export default Login;
