import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import {authorize} from 'react-native-app-auth'; // OAuth 2.0 library for Google
import {useNavigation} from '@react-navigation/native';
import {Snackbar} from 'react-native-paper';
import OAuth from 'oauth-1.0a';
import CryptoJS from 'crypto-js'; 

// Google OAuth Config
const googleConfig = {
  issuer: 'https://accounts.google.com',
  clientId: Platform.select({
    ios: '725917582924-tlohagtq31v5kq9gk3bgiaop8ppjl53b.apps.googleusercontent.com', 
    android:
      '725917582924-d0fbco108hn9gtand6b1c3lrb23k1sg9.apps.googleusercontent.com', 
  }),
  redirectUrl: Platform.select({
    ios: 'org.authTest-01.MyNewProject:/oauth2redirect/google', 
    android: 'com.usamaaauthproject:/oauth2redirect/google', 
  }),
  scopes: ['openid', 'profile', 'email'], 
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
  };

  // Helper function to parse query string
  const parseQueryString = queryString => {
    const params = {};
    const queries = queryString.split('&');
    queries.forEach(query => {
      const [key, value] = query.split('=');
      params[key] = decodeURIComponent(value);
    });
    return params;
  };

  // Function for Twitter Login using OAuth 1.0a
  const handleTwitterLogin = async () => {
    setLoadingTwitter(true);
    try {
      const oauth = OAuth({
        consumer: {
          key: twitterConfig.apiKey,
          secret: twitterConfig.apiSecretKey,
        },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
          return CryptoJS.HmacSHA1(base_string, key).toString(
            CryptoJS.enc.Base64,
          );
        },
      });

      // Request Token
      console.log('Requesting Twitter OAuth request token...');
      const requestTokenResponse = await fetch(twitterRequestTokenURL, {
        method: 'POST',
        headers: oauth.toHeader(
          oauth.authorize({url: twitterRequestTokenURL, method: 'POST'}),
        ),
      });

      const requestTokenData = await requestTokenResponse.text();
      console.log('Request token response:', requestTokenData);

      // Manually parse the query string
      const requestTokenParams = parseQueryString(requestTokenData);
      const oauthToken = requestTokenParams['oauth_token'];

      if (!oauthToken) {
        throw new Error('Failed to retrieve OAuth token');
      }

      // Redirect to Twitter authorization page in the browser
      const twitterAuthURL = `${twitterAuthorizeURL}?oauth_token=${oauthToken}`;
      console.log('Redirecting to Twitter for authentication:', twitterAuthURL);

      // Open Twitter's authorization page in the browser
      await Linking.openURL(twitterAuthURL); // This will open the URL in the default browser or Twitter app
    } catch (e) {
      console.error('Error in Twitter OAuth flow:', e.message);
      setError('Twitter Login failed. Please try again.');
      setSnackbarVisible(true);
    } finally {
      setLoadingTwitter(false);
    }
  };

  // Function for Twitter Login using OAuth 1.0a
  // const handleTwitterLogin = async () => {
  //   setLoadingTwitter(true);
  //   try {
  //     const oauth = OAuth({
  //       consumer: {
  //         key: twitterConfig.apiKey,
  //         secret: twitterConfig.apiSecretKey,
  //       },
  //       signature_method: 'HMAC-SHA1',
  //       hash_function(base_string, key) {
  //         return CryptoJS.HmacSHA1(base_string, key).toString(
  //           CryptoJS.enc.Base64,
  //         );
  //       },
  //     });

  //     // Request Token
  //     console.log('Requesting Twitter OAuth request token...');
  //     const requestTokenResponse = await fetch(twitterRequestTokenURL, {
  //       method: 'POST',
  //       headers: oauth.toHeader(
  //         oauth.authorize({ url: twitterRequestTokenURL, method: 'POST' }),
  //       ),
  //     });

  //     const requestTokenData = await requestTokenResponse.text();
  //     console.log('Request token response:', requestTokenData);

  //     // Manually parse the query string (instead of using URLSearchParams)
  //     const requestTokenParams = parseQueryString(requestTokenData);
  //     const oauthToken = requestTokenParams['oauth_token'];

  //     if (!oauthToken) {
  //       throw new Error('Failed to retrieve OAuth token');
  //     }

  //     // Redirect to Twitter authorization page
  //     const twitterAuthURL = `${twitterAuthorizeURL}?oauth_token=${oauthToken}`;
  //     console.log('Redirecting to Twitter for authentication:', twitterAuthURL);

  //     // Navigate to WebView for authentication
  //     navigation.navigate('Dashboard', { url: twitterAuthURL });
  //   } catch (e) {
  //     console.error('Error in Twitter OAuth flow:', e.message);
  //     setError('Twitter Login failed. Please try again.');
  //     setSnackbarVisible(true);
  //   } finally {
  //     setLoadingTwitter(false);
  //   }
  // };

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
            style={[styles.loginButton, {backgroundColor: '#fccf79'}]}
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
    color: '#000',
    fontWeight: '700',
    fontSize: 18,
  },
});

export default Login;
