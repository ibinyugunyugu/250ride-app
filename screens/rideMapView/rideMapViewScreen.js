import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity
} from "react-native";
import React from "react";
import { Colors, Fonts, Sizes, screenHeight } from "../../constants/styles";
import MapViewDirections from "react-native-maps-directions";
import { Key } from "../../constants/key";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as Animatable from "react-native-animatable";
import BottomSheet from "react-native-simple-bottom-sheet";
import MyStatusBar from "../../components/myStatusBar";
import Header from "../../components/header";
import DashedLine from "react-native-dashed-line";
import { getRideInfo } from "../../store/rideInfo";
import { useSelector } from "react-redux";
import {Linking} from 'react-native'
import {useTranslation} from 'react-i18next'; 

const RideMapViewScreen = ({ navigation, route }) => {
  const item = useSelector(getRideInfo());
  const {t, i18n} = useTranslation();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={t("map view")} navigation={navigation} />
        {directionInfo()}
        {rideInfoSheet()}
      </View>
    </View>
  );

  function rideInfoSheet() {
    return (
      <BottomSheet
        isOpen={false}
        sliderMinHeight={250}
        lineContainerStyle={{ height: 0.0 }}
        lineStyle={{ height: 0.0 }}
        wrapperStyle={{ ...styles.bottomSheetWrapStyle }}
      >
        {(onScrollEndDrag) => (
          <ScrollView
            onScrollEndDrag={onScrollEndDrag}
            contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0 }}
            showsVerticalScrollIndicator={false}
          >
            <Animatable.View
              animation="slideInUp"
              iterationCount={1}
              duration={1500}
            >
              <View style={{flexDirection:'row',justifyContent:'space-between'}}>

                <Text
                  style={{
                    ...Fonts.blackColor16SemiBold,
                    textAlign: "left",
                    margin: Sizes.fixPadding * 2.0,
                  }}
                  >
                  {t('ride distance')}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    Linking.openURL(`tel:${item?.driver?.user?.fullPhone}`)
                  }}
                  >
                  <View style={styles.callButton}>
                    <Text style={{ ...Fonts.whiteColor14Medium }}>
                      Driver Info
                    </Text>
                    <MaterialIcons
                      name="chevron-right"
                      color={Colors.whiteColor}
                      size={20}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: "row" }}>
                <View>
                  <View style={{ width: 16.0, alignItems: "center" }}>
                    <Image
                      source={require("../../assets/images/icons/car.png")}
                      style={{
                        width: 16.0,
                        height: 16.0,
                        resizeMode: "contain",
                      }}
                    />
                  </View>
                  {verticalDashLine()}
                </View>
                <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
                  <Text
                    numberOfLines={1}
                    style={{ ...Fonts.grayColor14Medium }}
                  >
                    Pick up point({(item?.datetime?.split('T')[1]).split(':')[0]}h{(item?.datetime?.split('T')[1]).split(':')[1]}) on {new Date(item.datetime).toDateString()} 
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      ...Fonts.blackColor14Medium,
                      marginTop: Sizes.fixPadding - 8.0,
                    }}
                  >
                    {item?.pickupAddress}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: "row" }}>
                <View>
                  <View style={{ width: 16.0, alignItems: "center" }}>
                    <Image
                      source={require("../../assets/images/icons/car.png")}
                      style={{
                        width: 16.0,
                        height: 16.0,
                        resizeMode: "contain",
                      }}
                    />
                  </View>
                  {verticalDashLine()}
                </View>
                <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
                  <Text
                    numberOfLines={1}
                    style={{ ...Fonts.grayColor14Medium }}
                  >
                    Drive
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      ...Fonts.blackColor14Medium,
                      marginTop: Sizes.fixPadding - 8.0,
                    }}
                  >
                    {item?.distanceText} in {item?.durationText}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: "row" }}>
                <View style={{ width: 16.0, alignItems: "center" }}>
                  <Image
                    source={require("../../assets/images/icons/car.png")}
                    style={{ width: 16.0, height: 16.0, resizeMode: "contain" }}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
                  <Text
                    numberOfLines={1}
                    style={{ ...Fonts.grayColor14Medium }}
                  >
                    Ride end ({(item?.endtime?.split('T')[1]).split(':')[0]}h{(item?.endtime?.split('T')[1]).split(':')[1]})
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      ...Fonts.blackColor14Medium,
                      marginTop: Sizes.fixPadding - 8.0,
                    }}
                  >
                    {item?.destinationAddress}
                  </Text>
                </View>
              </View>
            </Animatable.View>
          </ScrollView>
        )}
      </BottomSheet>
    );
  }

  function verticalDashLine() {
    return (
      <DashedLine
        axis="vertical"
        dashLength={3}
        dashColor={Colors.lightGrayColor}
        dashThickness={1}
        style={{
          height: 45.0,
          marginLeft: Sizes.fixPadding - 2.0,
        }}
      />
    );
  }

  function directionInfo() {
    const startPoint = {
      latitude: parseFloat(item.pickupLat),
      longitude: parseFloat(item.pickupLng),
    };

    const endPoint = {
      latitude: parseFloat(item.destinationLat),
      longitude: parseFloat(item.destinationLng),
    };

    return (
      <MapView
        region={{
          latitude: parseFloat(item.pickupLat),
          longitude: parseFloat(item.pickupLng),
          latitudeDelta: 0.10,
          longitudeDelta: 0.05,
        }}
        style={{ height: "100%" }}
        provider={PROVIDER_GOOGLE}
      >
        <MapViewDirections
          origin={startPoint}
          destination={endPoint}
          apikey={Key.apiKey}
          strokeColor={Colors.blackColor}
          strokeWidth={3}
        />
        <Marker coordinate={startPoint} title="Origin" description="Origin">
          <Image
            source={require("../../assets/images/icons/pin.png")}
            style={{ width: 35.0, height: 35.0, resizeMode: "contain" }}
          />
        </Marker>
        <Marker coordinate={endPoint} title="Destination" description="Destination">
          <Image
            source={require("../../assets/images/icons/pinDest.png")}
            style={{ width: 35.0, height: 35.0, resizeMode: "contain" }}
          />
        </Marker>
      </MapView>
    );
  }
};

export default RideMapViewScreen;

const styles = StyleSheet.create({
  bottomSheetWrapStyle: {
    borderTopLeftRadius: Sizes.fixPadding * 4.0,
    borderTopRightRadius: Sizes.fixPadding * 4.0,
    backgroundColor: Colors.whiteColor,
  },
  locationIconWrapper: {
    width: 16.0,
    height: 16.0,
    borderRadius: 8.0,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.0,
  },
  markerCircle: {
    width: 32.0,
    height: 32.0,
    borderRadius: 16.0,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.whiteColor,
  },
  callButton: {
    marginTop: Sizes.fixPadding * 2.0,
    marginLeft:0,
    flexDirection:'row',
    borderRadius:Sizes.fixPadding,
    paddingHorizontal:Sizes.fixPadding / 2.0,
    backgroundColor:Colors.secondaryColor
  },
});
