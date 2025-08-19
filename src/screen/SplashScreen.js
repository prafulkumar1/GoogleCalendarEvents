import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/SplashScreenStyle';

export default function SplashScreen(props) {
  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('accessToken');

      setTimeout(() => {
        if (token) {
          props?.navigation?.replace("HomeScreen", { token });
        } else {
          props?.navigation?.replace("Login");
        }
      }, 3000); // wait 3s for splash
    };

    checkLogin();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Image
        source={require("../assets/images/logo.png")}
        resizeMode="contain"
      />
    </View>
  );
}
