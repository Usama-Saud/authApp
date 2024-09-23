import {StyleSheet, View, Image, Text} from 'react-native';
import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getToken} from '../../API/getToken';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const Splash = ({navigation}) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    authenticateAndNavigate();
    // console.log('ENV resource loaded on Splash Screen ', resource);
  }, [navigation]);

  const authenticateAndNavigate = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      // console.log('Token ===========:', token);

      if (!token) {
        const tokenResponse = await getToken(); // Fetch the token if not already stored
        if (tokenResponse.success) {
          token = tokenResponse.token;
        } else {
          throw new Error(tokenResponse.error);
        }
      }
      const userData = await AsyncStorage.getItem('user_data');
      const user = userData ? JSON.parse(userData) : null;
      console.log('User Login Details =========:', user);
      if (token && user && user.userID) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Dashboard'}],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      setError('Failed to authenticate. Please try again later.');
    }
  };

  if (error) {
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.logoCon}>
        <Image
          style={styles.splashImage}
          source={require('../../assets/maison.png')}></Image>
        <View style={styles.textCon}>
          {/* <Text style={styles.D365Text}>D365</Text> */}
          <Text style={styles.smartAppText}>Auth App</Text>
        </View>

        <Text style={styles.bottomText}>Powered by: Usama</Text>
      </View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  splashImage: {
    height: hp(15),
    width: wp(45),
    resizeMode: 'contain',
  },
  errorText: {
    fontSize: hp(2),
    color: 'red',
  },
  textCon: {
    flexDirection: 'row',
  },
  logoCon: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  D365Text: {
    color: '#ca5f28',
    fontSize: hp(3),
    fontFamily: 'HelveticaNowMicro-Bold',
    paddingHorizontal: wp(3),
  },
  smartAppText: {
    color: '#000',
    fontSize: hp(2.7),
    marginTop: hp(0.25),
    fontFamily: 'HelveticaNowMicro-Medium',
  },
  bottomText: {
    color: '#666',
    fontFamily: 'HelveticaNowMicro-Medium',
    fontSize: hp(1.7),
    margin: hp(0.5),
  },
});
