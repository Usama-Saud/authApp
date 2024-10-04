import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {authorize} from 'react-native-app-auth'; // OAuth 2.0 library for Google
import {useNavigation} from '@react-navigation/native';
import {Snackbar} from 'react-native-paper';
import OAuth from 'oauth-1.0a';
import CryptoJS from 'crypto-js'; // Required for generating the request token for Twitter

// Google OAuth Config
const googleConfig = {
  issuer: 'https://accounts.google.com',
  clientId: Platform.select({
    ios: '725917582924-tlohagtq31v5kq9gk3bgiaop8ppjl53b.apps.googleusercontent.com', // Replace with your iOS Client ID
    android:
      '725917582924-d0fbco108hn9gtand6b1c3lrb23k1sg9.apps.googleusercontent.com', // Replace with your Android Client ID
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

// Twitter OAuth 1.0a Config
const twitterRequestTokenURL = 'https://api.twitter.com/oauth/request_token';
const twitterAuthorizeURL = 'https://api.twitter.com/oauth/authorize';
const twitterAccessTokenURL = 'https://api.twitter.com/oauth/access_token';

// Your Twitter API credentials
const twitterConfig = {
  apiKey: 'uJGhojVcXrehYFJg0jZ5J2gc5',
  apiSecretKey: 'MTgHxymqdxI7ulzOqKc0uDqCmdV2cgYZJOP68rgxjKqpOfp2bJ',
  callbackUrl: Platform.select({
    ios: 'org.authTest-01.MyNewProject:/oauth2redirect/twitter', // iOS redirect URI
    android: 'com.usamaaauthproject:/oauth2redirect/twitter', // Android redirect URI
  }),
};

const Login = () => {
  const navigation = useNavigation();
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingTwitter, setLoadingTwitter] = useState(false);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // Function for Google Login
  const handleGoogleLogin = async () => {
    if (!loadingTwitter) { // Ensure no other loader is active
      setLoadingGoogle(true);
      try {
        const authState = await authorize(googleConfig); // OAuth 2.0 login for Google
        console.log('Logged in successfully with Google!', authState);

        // After login, navigate to Dashboard
        navigation.reset({
          index: 0,
          routes: [{name: 'Dashboard'}],
        });
      } catch (e) {
        setError('Google Login failed. Please try again.');
        setSnackbarVisible(true);
      } finally {
        setLoadingGoogle(false);
      }
    }
  };

  // Function for Twitter Login using OAuth 1.0a
  const handleTwitterLogin = async () => {
    setLoadingTwitter(true); // Start loader for Twitter
    try {
      const oauth = OAuth({
        consumer: {
          key: twitterConfig.apiKey,
          secret: twitterConfig.apiSecretKey,
        },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
          return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
        },
      });
  
      // Request Token
      console.log('Requesting Twitter OAuth request token...');
      const requestTokenResponse = await fetch(twitterRequestTokenURL, {
        method: 'POST',
        headers: oauth.toHeader(
          oauth.authorize({ url: twitterRequestTokenURL, method: 'POST' })
        ),
      });
  
      if (!requestTokenResponse.ok) {
        throw new Error(`Failed to get request token: ${requestTokenResponse.statusText}`);
      }
  
      const requestTokenData = await requestTokenResponse.text();
      console.log('Request token response:', requestTokenData);
  
      // Extract oauth_token from response
      const oauthToken = new URLSearchParams(requestTokenData).get('oauth_token');
      if (!oauthToken) {
        throw new Error('OAuth token not found in response.');
      }
  
      // Redirect to Twitter authorization page
      const twitterAuthURL = `${twitterAuthorizeURL}?oauth_token=${oauthToken}`;
      console.log('Redirecting to Twitter for authentication:', twitterAuthURL);
  
      // Navigate to WebView for Twitter authentication
      navigation.navigate('WebViewScreen', { url: twitterAuthURL });
    } catch (e) {
      console.error('Error in Twitter OAuth flow:', e.message);
      setError('Twitter Login failed. Please try again.');
      setSnackbarVisible(true);
    } finally {
      setLoadingTwitter(false); // Stop loader
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
        {loadingGoogle ? (
          <ActivityIndicator size="large" color="#fca311" />
        ) : (
          <TouchableOpacity
            style={[styles.loginButton, {backgroundColor: '#4285F4'}]}
            onPress={handleGoogleLogin}>
            <Text style={styles.loginButtonText}>Login with Google</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.loginText}>Sign in with Twitter</Text>
        {loadingTwitter ? (
          <ActivityIndicator size="large" color="#1DA1F2" />
        ) : (
          <TouchableOpacity
            style={[styles.loginButton, {backgroundColor: '#1DA1F2'}]}
            onPress={handleTwitterLogin}>
            <Text style={styles.loginButtonText}>Login with Twitter</Text>
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
  loginText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
});

export default Login;
