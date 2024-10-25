import {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import {authorize} from 'react-native-app-auth'; // OAuth 2.0 library for Google
import {useNavigation} from '@react-navigation/native';
import {Snackbar} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import * as Linking from 'expo-linking';
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

// // Twitter OAuth 1.0a Config
// const twitterRequestTokenURL = 'https://api.twitter.com/oauth/request_token';
// const twitterAuthorizeURL = 'https://api.twitter.com/oauth/authorize';
// const twitterAccessTokenURL = 'https://api.twitter.com/oauth/access_token';

const twitterConfig = {
  clientId: 'QVlQUHBkMENPck9HcE16NmdnTzU6MTpjaQ', // Your Client ID (OAuth2.0)
  clientSecret: 'OEweCEwgojdKuYxBf2HnNAIxMcZka3zuRqgB_EpISHeAiEsr4G', // Your Client Secret (OAuth2.0)
  redirectUrl: 'com.usamaaauthproject://oauth2redirect/twitter', // Your app's redirect URL
  serviceConfiguration: {
    authorizationEndpoint: 'https://twitter.com/i/oauth2/authorize',
    tokenEndpoint: 'https://api.twitter.com/oauth2/token',
    revocationEndpoint: 'https://api.twitter.com/oauth2/revoke',
  },
  scopes: ['tweet.read', 'users.read', 'offline.access'], // Add appropriate scopes here
};

const Login = () => {
  const navigation = useNavigation();
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingTwitter, setLoadingTwitter] = useState(false);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // Function for Google Login
  // const handleGoogleLogin = async () => {
  //   setLoadingGoogle(true);
  //   try {
  //     const authState = await authorize(googleConfig); // OAuth 2.0 login for Google
  //     console.log('Logged in successfully with Google!', authState);

  //     // After login, navigate to Dashboard
  //     if (accessTokenParams.oauth_token && accessTokenParams.oauth_token_secret) {
  //       navigation.reset({
  //         index: 0,
  //         routes: [{ name: 'Dashboard' }],
  //       });
  //     } else {
  //       console.error('Failed to obtain access token.');
  //       setError('Twitter Login failed. Please try again.');
  //       setSnackbarVisible(true);
  //     }
  //   } catch (e) {
  //     setError('Google Login failed. Please try again.');
  //     setSnackbarVisible(true);
  //   } finally {
  //     setLoadingGoogle(false);
  //   }
  // };

  //   its working
  //   const handleGoogleLogin = async () => {
  //     try {
  //       const applicationType = Platform.OS === 'ios' ? 'IOS' : 'ANDROID';
  //       const url = `https://29e3-197-135-138-84.ngrok-free.app/oauth/google_login?application=${applicationType}`;

  //       // Open the Google login page
  //       Linking.openURL(url);
  //     } catch (error) {
  //       console.error('Google login initiation error:', error);
  //     }
  //   };

  //   useEffect(() => {
  //     const handleDeepLink = (event) => {
  //       const { url } = event;
  //       console.log('Received Deep Link URL:', url);

  //       if (url.includes('oauthredirect/google')) {
  //         console.log('Matched Google OAuth Deep Link');
  //         const queryParams = new URLSearchParams(url.split('?')[1]);
  //         const accessToken = queryParams.get('access_token');
  //         const refreshToken = queryParams.get('refresh_token');

  //         if (accessToken && refreshToken) {
  //           console.log('Access Token ======:', accessToken);
  //           console.log('Refresh Token ========:', refreshToken);

  //           // Optionally store tokens securely (e.g., AsyncStorage)
  //           // storeTokensSecurely(accessToken, refreshToken);

  //           // Navigate to another screen (e.g., main app screen)
  //           navigation.replace('Dashboard');

  //           Alert.alert('Login Successful', 'You are now logged in!');
  //         } else {
  //           console.error('Error: Tokens not found in deep link.');
  //         }
  //       } else {
  //         console.error('URL does not match the expected deep link.');
  //       }
  //     };

  //     const linkingSubscription = Linking.addListener('url', handleDeepLink);

  //     // Check if the app was opened with a deep link initially
  //     Linking.getInitialURL().then((url) => {
  //       if (url) {
  //         handleDeepLink({ url });
  //       }
  //     });

  //     // Clean up the listener on unmount
  //     return () => {
  //       linkingSubscription.remove(); // Remove the listener
  //     };
  //   }, []);



  // working till here
  
  
  const handleGoogleLogin = async () => {
    try {
      const applicationType = Platform.OS === 'ios' ? 'IOS' : 'ANDROID';
      const url = `https://auth.gigawrks.com/oauth/google_login?application=${applicationType}`;

      // Open the Google login page
      setLoadingGoogle(true); // Show loader while opening the URL
      Linking.openURL(url);
    } catch (error) {
      setLoadingGoogle(false); // Hide loader if there's an error
      console.error('Google login initiation error:', error);
    }
  };

  useEffect(() => {
    const handleDeepLink = async event => {
      const {url} = event;
      console.log('Received Deep Link URL:', url);

      if (url.includes('oauthredirect/google')) {
        console.log('Matched Google OAuth Deep Link');

        // Extract the token from the deep link
        const queryParams = new URLSearchParams(url.split('?')[1]);
        const token = queryParams.get('token');

        if (token) {
          console.log('Received Token:', token);

          try {
            // Call the backend with the token
            const response = await fetch(
              'https://auth.gigawrks.com/oauth/google/auth_token/',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({code: token}), // Send token in request body
              },
            );

            const data = await response.json();
            console.log('Auth Response:', data);

            if (response.ok && data.access_token) {
              // Optionally store tokens securely (e.g., AsyncStorage)
              await AsyncStorage.setItem('authToken', data.access_token);
              await AsyncStorage.setItem('refreshToken', data.refresh_token);

              // Navigate to the Dashboard screen
              navigation.replace('Dashboard');
              Alert.alert('Login Successful', 'You are now logged in!');
            } else {
              console.error(
                'Authentication failed:',
                data.message || 'Unknown error',
              );
              Alert.alert('Authentication Error', 'Failed to authenticate.');
            }
          } catch (error) {
            console.error('Error during authentication:', error);
            Alert.alert('Authentication Error', 'Failed to authenticate.');
          } finally {
            setLoadingGoogle(false); // Stop loader after completing the request
          }
        } else {
          setLoadingGoogle(false); // Stop loader if no token found
          console.error('Error: Token not found in deep link.');
        }
      } else {
        setLoadingGoogle(false); // Stop loader if URL doesn't match
        console.error('URL does not match the expected deep link.');
      }
    };

    const linkingSubscription = Linking.addEventListener('url', handleDeepLink);

    // Check if the app was opened with a deep link initially
    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink({url});
      }
    });

    // Clean up the listener on unmount
    return () => {
      linkingSubscription.remove(); // Remove the listener
    };
  }, [navigation]);
  // const parseQueryString = queryString => {
  //   const params = {};
  //   const queries = queryString.split('&');
  //   queries.forEach(query => {
  //     const [key, value] = query.split('=');
  //     params[key] = decodeURIComponent(value);
  //   });
  //   return params;
  // };

  // const handleTwitterLogin = async () => {
  //   setLoadingTwitter(true);
  //   try {
  //     const authState = await authorize(twitterConfig); // OAuth 2.0 login for Twitter
  //     console.log('Logged in successfully with Twitter!', authState);

  //     // After login, navigate to Dashboard
  //     if (authState.accessToken) {
  //       navigation.reset({
  //         index: 0,
  //         routes: [{name: 'Dashboard'}],
  //       });
  //     } else {
  //       console.error('Failed to obtain access token.');
  //       setError('Twitter Login failed. Please try again.');
  //       setSnackbarVisible(true);
  //     }
  //   } catch (e) {
  //     setError('Twitter Login failed. Please try again.');
  //     setSnackbarVisible(true);
  //   } finally {
  //     setLoadingTwitter(false);
  //   }
  // };

  // // Function to exchange authorization code for access token
  // const exchangeAuthorizationCodeForAccessToken = async code => {
  //   const tokenUrl = twitterConfig.serviceConfiguration.tokenEndpoint;
  //   const bodyParams = new URLSearchParams({
  //     client_id: twitterConfig.clientId,
  //     client_secret: twitterConfig.clientSecret,
  //     code: code,
  //     redirect_uri: twitterConfig.redirectUrl,
  //     grant_type: 'authorization_code',
  //   }).toString();

  //   try {
  //     const response = await fetch(tokenUrl, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //       body: bodyParams,
  //     });
  //     const data = await response.json();
  //     console.log('Access Token Response:', data);

  //     if (data.access_token) {
  //       // Store the access token and navigate to Dashboard
  //       navigation.reset({
  //         index: 0,
  //         routes: [{name: 'Dashboard'}],
  //       });
  //     } else {
  //       console.error('Failed to obtain access token.');
  //       setError('Failed to obtain access token.');
  //       setSnackbarVisible(true);
  //     }
  //   } catch (error) {
  //     console.error('Error during token exchange:', error);
  //     setError('Error during token exchange. Please try again.');
  //     setSnackbarVisible(true);
  //   }
  // };

  // // Event listener for OAuth callback
  // const handleOpenURL = async ({url}) => {
  //   console.log('Received redirect URL:', url);

  //   if (url.startsWith('com.usamaaauthproject://oauth2redirect/twitter')) {
  //     const queryString = url.split('?')[1];
  //     const params = new URLSearchParams(queryString);
  //     // const oauthToken = params.get('oauth_token');
  //     // const oauthVerifier = params.get('oauth_verifier');
  //     const authCode = params.get('code'); // Look for the authorization code

  //     if (authCode) {
  //       console.log('Authorization code:', authCode);

  //       // Exchange the authorization code for an access token
  //       await exchangeAuthorizationCodeForAccessToken(authCode);
  //     } else {
  //       console.error('OAuth callback did not return the expected parameters.');
  //       setError('Twitter Login failed. Please try again.');
  //       setSnackbarVisible(true);
  //     }
  //   } else {
  //     console.error('Callback URL did not match expected pattern.');
  //   }
  // };

  // useEffect(() => {
  //   const linkingSubscription = Linking.addEventListener('url', handleOpenURL);

  //   return () => {
  //     linkingSubscription.remove();
  //   };
  // }, []);

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
        {/* <Text style={styles.loginText}>Sign in with Twitter</Text>
        {loadingTwitter ? (
          <ActivityIndicator size="large" color="#1DA1F2" />
        ) : (
          <TouchableOpacity
            style={[styles.loginButton, {backgroundColor: '#1DA1F2'}]}
            onPress={handleTwitterLogin}>
            <Text style={styles.loginButtonText}>Login with Twitter</Text>
          </TouchableOpacity>
        )} */}
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
