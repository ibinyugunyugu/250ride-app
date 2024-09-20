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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Header from "../../components/header";

const ProgressScreen = ({ navigation, route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={"RIDE IN  PROGRESS"} navigation={navigation} />
        {map()}
        {inProgress()}
      </View>
    </View>
  );



  function inProgress() {
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
              Ride details
            </Text>
            <View style={{flexDirection:'row',alignItems:'flex-end'}}>
              <View style={{flex:1}}>
                <View style={{flexDirection:'row', alignItems:'baseline'}}>
                  <MaterialIcons
                    name="location-pin"
                    color={Colors.blackColor}
                    size={20}
                  />
                  <Text
                    style={{
                      ...Fonts.blackColor14Medium,
                    }}
                  >
                    From: Nyarugenge, NY345ST,  Kigali, 
                  </Text>
                  
                </View>

                <View style={{flexDirection:'row', alignItems:'baseline'}}>
                  <MaterialIcons
                    name="location-pin"
                    color={Colors.blackColor}
                    size={20}
                  />
                  <Text
                    style={{
                      ...Fonts.blackColor14Medium,
                      paddingLeft: Sizes.fixPadding

                    }}
                  >
                    To: Nyarugenge, NY345ST,  Kigali, 
                  </Text>
                  
                </View>

                <View style={{flexDirection:'row', alignItems:'baseline'}}>
                  <Image
                    source={require("../../assets/images/path-distance.png")}
                    style={{
                      resizeMode:'contain',
                      width:22,
                      height:22
                    }}
                  />
                  <Text
                    style={{
                      ...Fonts.blackColor14Medium,
                      paddingLeft: Sizes.fixPadding

                    }}
                  >
                    Distance covered: 2 Km
                  </Text>
                  
                </View>

                <View style={{flexDirection:'row', alignItems:'baseline'}}>
                  <Image
                    source={require("../../assets/images/path-distance.png")}
                    style={{
                      resizeMode:'contain',
                      width:22,
                      height:22
                    }}
                  />
                  <Text
                    style={{
                      ...Fonts.blackColor14Medium,
                      paddingLeft: Sizes.fixPadding

                    }}
                  >
                    Distance remaining: 6 Km
                  </Text>
                  
                </View>

                <View style={{flexDirection:'row', alignItems:'baseline'}}>
                  <MaterialIcons
                    name="location-pin"
                    color={Colors.blackColor}
                    size={20}
                  />
                  <Text
                    style={{
                      ...Fonts.blackColor14Medium,
                      paddingLeft: Sizes.fixPadding

                    }}
                  >
                    Time elapsed: 15 min
                  </Text>
                  
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  navigation.push("RideDetail", { action: 'End' });
                }}
                style={{ ...CommonStyles.button, flexDirection:'row' }}
                >
                <Text style={{ ...Fonts.whiteColor15Medium }}>
                  Ride
                </Text>
                <MaterialIcons
                  name="arrow-forward"
                  color={Colors.whiteColor}
                  size={20}
                />
              </TouchableOpacity>
            </View>
            
          </View>
          
          
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

export default ProgressScreen;

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
