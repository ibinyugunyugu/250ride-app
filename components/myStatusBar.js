import {SafeAreaView, StatusBar} from 'react-native';
import React from 'react';
import {Colors} from '../constants/styles';

const MyStatusBar = () => {
  return (
    <SafeAreaView style={{backgroundColor: Colors.blackColor}}>
      <StatusBar
        translucent={false}
        backgroundColor={Colors.blackColor}
        barStyle={'light-content'}
      />
    </SafeAreaView>
  );
};

export default MyStatusBar;