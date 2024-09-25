import {StyleSheet, View, Image, Text} from 'react-native';
import {useEffect} from 'react';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

const Splash = ({navigation}) => {

  useEffect(() => {
    // Redirect to login after splash screen
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }, 2000);
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.logoCon}>
        <Image style={styles.splashImage} source={require('../../assets/maison.png')} />
        <View style={styles.textCon}>
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
