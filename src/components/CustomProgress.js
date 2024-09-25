import React from 'react';
import {View, Modal, ActivityIndicator, Text, StyleSheet} from 'react-native';
import {hp} from '../constants/Size';

const CustomProgress = ({visible, message}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={() => {}}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ActivityIndicator size={'large'} color="#fcc424" />
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    width: '55%',
    justifyContent: 'space-evenly',
  },
  message: {
    fontSize: hp(2.1),
    color: 'black',
    // fontFamily: 'Gilroy-Medium',
  },
});

export default CustomProgress;
