import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {authorize} from 'react-native-app-auth'; // OAuth 2.0 library
import {useNavigation} from '@react-navigation/native';
import {Snackbar} from 'react-native-paper';

// Use the client_id from your downloaded JSON file
const config = {
  issuer: 'https://accounts.google.com',
  clientId: Platform.select({
    ios: '725917582924-tlohagtq31v5kq9gk3bgiaop8ppjl53b.apps.googleusercontent.com', // Replace with your iOS Client ID
    android: '725917582924-d0fbco108hn9gtand6b1c3lrb23k1sg9.apps.googleusercontent.com', // Replace with your Android Client ID
  }),
  redirectUrl: Platform.select({
    ios: 'org.authTest-01.MyNewProject:/oauth2redirect/google', // iOS redirect URI (replace with your iOS bundle ID)
    android: 'com.usamaaauthproject:/oauth2redirect/google', // Android redirect URI (your Android package name)
  }),
  scopes: ['openid', 'profile', 'email'], // Scopes for accessing user profile and email
  serviceConfiguration: {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
  },
};

const Login = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const authState = await authorize(config); // OAuth 2.0 login
      console.log('Logged in successfully!', authState);

      // After login, navigate to Dashboard
      navigation.reset({
        index: 0,
        routes: [{name: 'Dashboard'}],
      });
    } catch (e) {
      setError('Login failed. Please try again.');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/maison.png')}
        style={styles.logoImage}
      />
      <View style={styles.formContainer}>
        <Text style={styles.loginText}>Sign in with Google</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#fca311" />
        ) : (
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            {/* <Ionicons name="logo-google" size={20} color="#fff" /> */}
            <Text style={styles.loginButtonText}>Login with Google</Text>
          </TouchableOpacity>
        )}
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}>
          {error}
        </Snackbar>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  logoImage: {width: 100, height: 100, alignSelf: 'center'},
  formContainer: {marginTop: 20},
  loginText: {fontSize: 18, color:'#000', marginBottom: 10, textAlign: 'center'},
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fca311',
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#000',
    marginLeft: 10,
    fontWeight: '700',
    fontSize: 18,
  },
});

export default Login;
