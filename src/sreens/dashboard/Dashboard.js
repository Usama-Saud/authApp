import React from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Dashboard = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    navigation.reset({index: 0, routes: [{name: 'Login'}]});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Dashboard</Text>
      <TouchableOpacity
        style={[styles.loginButton, {backgroundColor: '#cbc7fc'}]}
        onPress={handleLogout}>
        <Text style={styles.loginButtonText}>Logout</Text>
      </TouchableOpacity>
      {/* <Button color={'#000'} title="Logout" onPress={handleLogout} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
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
    fontSize: 22,
  },
  title: {fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 20},
});

export default Dashboard;
