import React, { useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import Splash4 from '../../assets/images/splash4.svg';
import Splash5 from '../../assets/images/splash5.svg';
import Splash6 from '../../assets/images/splash6.svg';
import Splash7 from '../../assets/images/splash7.svg';
import Splash8 from '../../assets/images/splash8.svg';
import Splash9 from '../../assets/images/splash9.svg';
import Splash10 from '../../assets/images/splash10.svg';
import Splash11 from '../../assets/images/splash11.svg';
import Splash12 from '../../assets/images/splash12.svg';
import Splash13 from '../../assets/images/splash13.svg';
import Splash14 from '../../assets/images/splash14.svg';
import Splash15 from '../../assets/images/splash15.svg';
import Splash16 from '../../assets/images/splash16.svg';

const SplashScreen = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { width, height } = Dimensions.get('window');

  const imageList = [
    <Splash4 width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />,
    <Splash5 width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />,
    <Splash6 width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />,
    <Splash7 width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />,
    <Splash8 width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />,
    <Splash9 width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />,
    <Splash10 width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />,
    <Splash11 width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />,
    <Splash12 width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />,
    <Splash13 width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />,
    <Splash14 width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />,
    <Splash15 width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />,
    <Splash16 width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < imageList.length - 1 ? prevIndex + 1 : prevIndex
      );
    }, 50); 

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {imageList[currentImageIndex]}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

export default SplashScreen;
