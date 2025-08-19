import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { authorize } from 'react-native-app-auth';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const config = {
  issuer: 'https://accounts.google.com',
  clientId: '997159242404-s8v6kvlq910d1gb8c811kgd96292b7m8.apps.googleusercontent.com',
  redirectUrl: 'com.calenderofevents:/oauth2redirect/google',
  scopes: [
    'openid',
    'profile',
    'email',
    'https://www.googleapis.com/auth/calendar',
  ],
};

class LoginScreen extends Component {
  state = {
    accessToken: null,
    refreshToken: null,
    events: [],
  };

  signIn = async () => {
    try {
      const authState = await authorize(config);
      console.log('Auth State:', authState);

      const { accessToken, refreshToken } = authState;

      this.setState({ accessToken, refreshToken });
      await AsyncStorage.setItem('accessToken', accessToken);

      this.props.navigation?.replace('HomeScreen', { token: accessToken });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  render() {

    return (
      <View style={styles.container}>
        {/* Profile icon */}
        <FontAwesome
          name="user-circle"
          size={150}
          color="#fff"
          style={styles.profileIcon}
        />

        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={this.signIn}
        >
          <Image
            source={require('../assets/images/Google_icon.png')}
            style={styles.googleIcon}
          />
          <Text style={styles.googleText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileIcon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    color: '#e0e0e0',
    marginTop: 8,
    marginBottom: 60,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 35,
    elevation: 5,
    width: '90%',
    justifyContent: 'center',
    marginTop:200
  },
  googleIcon: {
    width: 28,
    height: 28,
    marginRight: 15,
  },
  googleText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
});
