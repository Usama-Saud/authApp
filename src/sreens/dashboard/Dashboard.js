import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Dashboard = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    navigation.reset({index: 0, routes: [{name: 'Login'}]});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Dashboard</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  title: {fontSize: 24, marginBottom: 20},
});

export default Dashboard;
