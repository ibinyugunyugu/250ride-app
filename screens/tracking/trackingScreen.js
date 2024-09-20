import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import React, { useState } from "react";
import {
  Colors,
  Sizes,
  Fonts,
  CommonStyles,
} from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Header from "../../components/header";

import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const TrackingScreen = ({ navigation, route }) => {
  const {t, i18n} = useTranslation();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={"Tracking"} navigation={navigation} />
        {map()}
        {tracking()}
      </View>
    </View>
  );



  function tracking() {
    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View
            style={{
              marginHorizontal: Sizes.fixPadding * 2.0,
              marginTop: Sizes.fixPadding,
            }}
          >
            
            <Text
              style={{
                ...Fonts.blackColor20SemiBold,
                textAlign: "center",
                paddingBottom:Sizes.fixPadding,
              }}
            >
              Ride distance details
            </Text>
            <View style={{marginBottom: Sizes.fixPadding, flexDirection:'row', alignItems:'baseline'}}>
              <Ionicons
                name="man-sharp"
                color={Colors.blackColor}
                size={20}
              />
              <Text
                style={{
                  ...Fonts.blackColor14Medium,
                }}
              >
                Nyarugenge, NY345ST,  Kigali, 
              </Text>
              
            </View>

            <View style={{marginBottom: Sizes.fixPadding, flexDirection:'row', alignItems:'baseline'}}>
              <FontAwesome5
                name="car-side"
                color={Colors.blackColor}
                size={20}
              />
              <Text
                style={{
                  ...Fonts.blackColor14Medium,
                  paddingLeft: Sizes.fixPadding

                }}
              >
                Nyarugenge, NY345ST,  Kigali, 
              </Text>
              
            </View>

            <View style={{flexDirection:'row', alignItems:'baseline'}}>
              <Image
                source={require("../../assets/images/path-distance.png")}
                style={{
                  resizeMode:'contain',
                  width:25,
                  height:25
                }}
              />
              <Text
                style={{
                  ...Fonts.blackColor14Medium,
                  paddingLeft: Sizes.fixPadding

                }}
              >
                2 Km
              </Text>
              
            </View>
          </View>
          
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.push("RideDetail", { action: 'Start' });
            }}
            style={{ ...CommonStyles.button, ...styles.dialogButton }}
            >
            <Text style={{ ...Fonts.whiteColor15Medium }}>
              Continue
            </Text>
          </TouchableOpacity>
          
        </View>
        
      </View>
    );
  }

  function map() {
    return (
      <MapView
        region={{
          latitude: -1.9713606,
          longitude: 30.0771208,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        }}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
      />
    );
  }
};

export default TrackingScreen;

const styles = StyleSheet.create({

  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom:0,
    justifyContent:'center',
  },
  wrapper: {
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.shadow,
    borderRadius: Sizes.fixPadding,
    borderWidth: 0,
    paddingBottom:Sizes.fixPadding * 2.0
  },
  dialogButton: {
    marginTop: Sizes.fixPadding * 2.0,
    marginHorizontal: Sizes.fixPadding * 6.0,
  },
  alertTextStyle: {
    ...Fonts.whiteColor14Medium,
    backgroundColor: Colors.blackColor,
    position: "absolute",
    bottom: 0.0,
    alignSelf: "center",
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding - 5.0,
    borderRadius: Sizes.fixPadding - 5.0,
    overflow: "hidden",
    zIndex: 100.0,
  },
  btnContainer:{
    flexDirection:'row',
    justifyContent:'space-evenly'
  }
});
