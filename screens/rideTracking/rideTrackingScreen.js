import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors, Fonts, Sizes, screenHeight,   CommonStyles,
} from "../../constants/styles";
import MapViewDirections from "react-native-maps-directions";
import { Key } from "../../constants/key";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import MyStatusBar from "../../components/myStatusBar";
import Header from "../../components/header";
import { getRideInfo } from "../../store/rideInfo";
import { useSelector } from "react-redux";
import { getLocationData } from "../../store/location";
import useAuth from "../../auth/useAuth";
import ridesApi from "../../api/rides";
function range(start, end) {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
}
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {Linking} from 'react-native'
import * as Animatable from "react-native-animatable";
import BottomSheet from "react-native-simple-bottom-sheet";
import DashedLine from "react-native-dashed-line";
import {useTranslation} from 'react-i18next'; 

const RideTrackingScreen = ({ navigation }) => {
  const item = useSelector(getRideInfo());
  const myLocation = useSelector(getLocationData());
  const [locations, setLocations] = useState([]);
  const [show, setShow] = useState(false);
  const [isDriver, setIsDriver] = useState(false);
  const {t, i18n} = useTranslation();
  const auth = useAuth();
  const { user } = auth;
  

  let regionTimeout;
  const repeater = () => {
    regionTimeout = setTimeout(async() => {
      let allLocations = [];
      let result = await ridesApi.driverLocation(item.id);
      if(Array.isArray(result.data) && result.data[0]){
        result.data.forEach(element => {
          let location = {
            latitude:parseFloat(element.split(',')[0]),
            longitude:parseFloat(element.split(',')[1])
          }
          allLocations.push(location);
        });
      setLocations(allLocations);
      }
      repeater();
    }, 5000);
  }

  useEffect(() => {
    if(!item || !user) return;
    if(user.currentProfile == '2' && user.id == item?.driver?.user?.id && (item.status == "Waiting" || item.status == "In Progress")) setIsDriver(true);
    else setIsDriver(false);
    getDriverLocation();
    return () => { clearTimeout(regionTimeout); };
  }, [item]);

  const getDriverLocation = async () => {
    if(!isDriver && item.bookStatus !== 'Confirmed') return;
    let allLocations = [];
    let result = await ridesApi.driverLocation(item.id);
    if(Array.isArray(result.data) && result.data[0]){
      result.data.forEach(element => {
        let location = {
          latitude:parseFloat(element.split(',')[0]),
          longitude:parseFloat(element.split(',')[1])
        }
        allLocations.push(location);
      });
      setLocations(allLocations);
    }
    repeater();
  }

  const noOfRequest = isDriver ? item.ride_requests.filter(req=>!req.riderDeleted && req.bookStatus === "Confirmed").length : 1;
  const pins = [...range(1, noOfRequest)];
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={item?.status == 'Waiting' ? t("map view") : t(item?.status)} navigation={navigation} />
        {directionInfo()}
        {(user?.currentProfile == '1' && item.bookStatus === 'Confirmed') ?  (show ? tracking() :  rideInfoSheet()) : rideInfoSheet()}
      </View>
    </View>
  );

  function directionInfo() {
    const startPoint = {
      latitude: parseFloat(myLocation.latitude),
      longitude: parseFloat(myLocation.longitude),
    };

    const pickupPoint = {
      latitude: parseFloat(item.pickupLat),
      longitude: parseFloat(item.pickupLng),
    };
    

    const destinationPoint = {
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
          origin={pickupPoint}
          destination={destinationPoint}
          apikey={Key.apiKey}
          strokeColor={Colors.blackColor}
          strokeWidth={3}
        />
        {(user && myLocation.latitude && myLocation.longitude) ? <Marker coordinate={startPoint} description="You are here">
          <Image
            source={user.currentProfile === '1' ? require("../../assets/images/icons/myLocation.png") : require("../../assets/images/icons/pin_car.png")}
            style={{ width: 35.0, height: 35.0, resizeMode: "contain" }}
          />
        </Marker> : null}
        <Marker coordinate={pickupPoint} description="Departure Location">
          <Image
            source={require("../../assets/images/icons/pin.png")}
            style={{ width: 35.0, height: 35.0, resizeMode: "contain" }}
          />
        </Marker>
        <Marker coordinate={destinationPoint} description="Destination Location">
          <Image
            source={require("../../assets/images/icons/pinDest.png")}
            style={{ width: 35.0, height: 35.0, resizeMode: "contain" }}
          />
        </Marker>
        {pins.map((pin, index) => (
          locations[index] ? <Marker coordinate={locations[index]} key={index}>
            <Image
              source={user.currentProfile === '2' ? require("../../assets/images/icons/myLocation.png") : require("../../assets/images/icons/pin_car.png")}
              style={{ width: 35.0, height: 35.0, resizeMode: "contain" }}
            />
          </Marker> : null
        ))}
      </MapView>
    );
  }

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
            
              <View style={{flexDirection:'row',justifyContent:'space-between', paddingBottom:Sizes.fixPadding}}>
                <Text
                  style={{
                    ...Fonts.blackColor16SemiBold,
                    textAlign: "left",
                  }}
                  >
                  {t('driver details')}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setShow(!show)
                  }}
                  >
                  <View style={styles.driverButton}>
                    <Text style={{ ...Fonts.whiteColor14Medium }}>
                      {t('ride distance')}
                    </Text>
                    <MaterialIcons
                      name="chevron-right"
                      color={Colors.whiteColor}
                      size={20}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <View>
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
                    {item?.driver?.user?.name}
                  </Text>
                  
                </View>

                <View style={{marginBottom: Sizes.fixPadding, flexDirection:'row', alignItems:'baseline', flex:1}}>
                  
                  <Ionicons
                    name="phone-portrait"
                    color={Colors.blackColor}
                    size={20}
                  />
                  <Text
                    style={{
                      ...Fonts.blackColor14Medium,
                    }}
                  >
                    {item?.driver?.user?.fullPhone}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    Linking.openURL(`tel:${item?.driver?.user?.fullPhone}`)
                  }}
                  style={{ ...CommonStyles.button, ...styles.callButton }}
                  >
                  
                  <Text style={{ ...Fonts.whiteColor15Medium }}>
                    {t('call now')}
                  </Text>
                  
                </TouchableOpacity>
            </View>
          </View>
          
        </View>
        
      </View>
    );
  }

  function rideInfoSheet() {
    return (
      <BottomSheet
        isOpen={false}
        sliderMinHeight={isDriver ? 320 : 250}
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
              {(user?.currentProfile == '1' && item.bookStatus == 'Confirmed') ? <View style={{flexDirection:'row',justifyContent:'space-between'}}>

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
                    setShow(!show)
                  }}
                  >
                  <View style={[styles.driverButton, {marginTop: Sizes.fixPadding * 2.0}]}>
                    <Text style={{ ...Fonts.whiteColor15SemiBold }}>
                      {t('driver info')}
                    </Text>
                    <MaterialIcons
                      name="chevron-right"
                      color={Colors.whiteColor}
                      size={20}
                    />
                  </View>
                </TouchableOpacity>
              </View> : 
              <Text
                style={{
                  ...Fonts.blackColor16SemiBold,
                  textAlign: "center",
                  margin: Sizes.fixPadding * 2.0,
                }}
                >
                {t('ride distance')}
              </Text>
              }

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
                    {t('pick up point')}({(item?.datetime?.split('T')[1]).split(':')[0]}h{(item?.datetime?.split('T')[1]).split(':')[1]}) on {new Date(item.datetime).toDateString()} 
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
                    {t('ride end')} ({(item?.endtime?.split('T')[1]).split(':')[0]}h{(item?.endtime?.split('T')[1]).split(':')[1]})
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
              {isDriver ? <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  navigation.push("MyRideDetail", { action: item?.status == 'Waiting' ? 'Start' : 'End' });
                }}
                style={{ ...CommonStyles.button, ...styles.dialogButton }}
                >
                <Text style={{ ...Fonts.whiteColor15Medium }}>
                  {t('continue')}
                </Text>
              </TouchableOpacity> : null}
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
};

export default RideTrackingScreen;

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
  },
  callButton: {
    marginTop: Sizes.fixPadding * 2.0,
    marginLeft:0,
    flexDirection:'row'
  },
  driverButton: {
    marginLeft:0,
    flexDirection:'row',
    borderRadius:Sizes.fixPadding,
    paddingHorizontal:Sizes.fixPadding / 2.0,
    backgroundColor:Colors.secondaryColor
  },
});
