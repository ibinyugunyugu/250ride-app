import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import {
  Colors,
  Fonts,
  Sizes,
  CommonStyles,
  screenHeight,
  screenWidth,
} from "../../constants/styles";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Key from "../../constants/key";
import { Input } from "@rneui/themed";
import MyStatusBar from "../../components/myStatusBar";
import LoadingIndicator from "../../components/loadingIndicator";
import { useDispatch, useSelector } from 'react-redux';
import { setPickUp } from "../../store/pickup";
import { setDestination } from "../../store/destination";
import populizeAddress from "../../functions/populizeAddress";
import { getLocationData } from "../../store/location";
import useAuth from "../../auth/useAuth";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const LATITUDE = -1.9529728;
const LONGITUDE = 30.0941312;
const SPACE = 0.01;
const ASPECT_RATIO = screenWidth / screenHeight;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;



const PickLocationScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const { user } = auth;
  const locations = useSelector(getLocationData());
  const [currentmarker, setCurrentMarker] = useState({
    latitude: locations?.latitude ? locations?.latitude : LATITUDE,
    longitude: locations?.longitude ? locations?.longitude: LONGITUDE,
  });
  const [address, setAddress] = useState("");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState({});
  const [isLoading, setisLoading] = useState(false);
  const [tempAddress, setTempAddress] = useState({
    latitude: locations?.latitude ? locations?.latitude : LATITUDE,
    longitude: locations?.longitude ? locations?.longitude: LONGITUDE,
  });
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();

  const googlePlaceAutoCompleteRef = useRef(null)
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }
      else if (route.params?.addressFor === 'pickup'){
        await getGeocode(currentmarker);
      }
    })();
  }, []);

  const getGeocode = async (location, googleData = {}, isCurrent = false) => {
    if(isCurrent) setCurrentMarker(location);
    let latlng = location?.latitude + '%2C' + location?.longitude;
    let vill = '';
    let cell = '';
    let sect = '';
    let distr = '';
    let prov = '';
    let country = '';
    let name = '';
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${Key.apiKey}`)
      .then(res => res.json())
      .then(data => {
        data.results.forEach(result=>{
          if(result.geometry.location_type === "APPROXIMATE"){
            if(result.types.includes('sublocality_level_1')) {
              vill = result.address_components[0].long_name
            }
            else if(result.types.includes('neighborhood')) {
              cell = result.address_components[0].long_name
            }
            else if(result.types.includes('administrative_area_level_3')) {
              sect = result.address_components[0].long_name
            }
            else if(result.types.includes('administrative_area_level_2')) {
              distr = result.address_components[0].long_name
            }
            else if(result.types.includes('administrative_area_level_1')) {
              prov = result.address_components[0].long_name
            }
            else if(result.types.includes('country')) {
              country = result.address_components[0].long_name
            }
          }
          else{
            if(googleData && googleData?.types?.includes('point_of_interest')){
              name = googleData.structured_formatting.main_text
            }
            else{
              result.address_components.forEach(component=>{
                
                if(component.types.includes('point_of_interest')){
                  name = component.long_name
                }
              })
            }
          }
        });
        let geoData = {
          streetNo: name,
          street: vill,
          district: distr,
          postalCode: cell,
          city: sect,
          region: prov,
          country: country
        }
        let address = populizeAddress(geoData,"Single");
        setAddress(address);
        setLocation({
          ...geoData,
          ...location,
          address
        });
        setisLoading(false);
      })
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        {headerBg()}
        {header()}
        {mapView()}
        <View style={styles.footer}>
          {/* {currentLocation()} */}
          {locationInfo()}
          {pickLocationButton()}
        </View>
        {loadingDialog()}
      </KeyboardAvoidingView>
    </View>
  );

  function headerBg() {
    return <View style={styles.headerBg}></View>;
  }
  function loadingDialog() {
    return (
      <LoadingIndicator visible={isLoading} />
    );
  }
  function currentLocation() {
    return (
      <TouchableOpacity 
        onPress={()=>getGeocode(tempAddress,{},true)}
        style={{
          flexDirection:'row', 
          justifyContent:'flex-start', 
          alignItems:'center',
          position:'absolute',
          alignSelf:'flex-end',
          bottom:190,
          right:Sizes.fixPadding ,
          backgroundColor:Colors.whiteColor,
          padding:Sizes.fixPadding / 2.0,
          borderRadius: 50
        }}>
        <MaterialIcons
          name="my-location"
          color={Colors.blueColor}
          size={35}
        />
      </TouchableOpacity>
    );
  }

  function header() {
    return (
      <View style={styles.header}>
        <MaterialIcons
          name="arrow-back-ios"
          color={Colors.blackColor}
          size={24}
          style={{ marginTop: Sizes.fixPadding }}
          onPress={() => {
            navigation.pop();
          }}
        />
        <View style={{flex:1}}>
          <View style={styles.searchFieldWrapStyle}>
            <Ionicons
              name="search"
              color={Colors.grayColor}
              size={20}
              style={{ marginTop: Sizes.fixPadding - 3.0 }}
            />
            <GooglePlacesAutocomplete
              placeholder={t('search here')}
              enablePoweredByContainer={false}
              fetchDetails={true}
              onPress={(data, details = null) => {
                setTheMarkerAccordingSearch(data,details);
              }}
              styles={{
                textInput: { height: 40, marginRight: -20.0 },
              }}
              query={{
                key: Key.apiKey,
                language: "en",
                components: 'country:rw',
              }}
              textInputProps={{
                InputComp: Input,
                value: search,
                onChangeText: (value) => {
                  setSearch(value);
                },
                inputContainerStyle: { borderBottomWidth: 0.0, height: 40.0 },
                inputStyle: { ...Fonts.blackColor16SemiBold },
                containerStyle: { marginLeft: -Sizes.fixPadding, height: 40.0 },
                selectionColor: Colors.primaryColor,
              }}
              ref={googlePlaceAutoCompleteRef}
              renderRightButton={() => (
                (googlePlaceAutoCompleteRef.current?.getAddressText()
                  ?
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => {
                      setSearch("");
                      googlePlaceAutoCompleteRef.current?.setAddressText('')
                    }} >
                    <MaterialIcons
                      name="close"
                      size={20}
                      color={Colors.grayColor}
                      style={{ marginTop: Sizes.fixPadding - 3.0 }}
                    />
                  </TouchableOpacity>
                  :
                  null))}
            />
          </View>
          <TouchableOpacity 
            onPress={()=>getGeocode(tempAddress,{},true)}
            style={{
              flexDirection:'row', 
              justifyContent:'flex-start', 
              alignItems:'center',
              marginLeft: Sizes.fixPadding,
            }}>
            <MaterialIcons
              name="my-location"
              color={Colors.blueColor}
              size={14}
            />
            <Text style={{color:Colors.blueColor, paddingHorizontal:Sizes.fixPadding/2}}>{t('current location')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function locationInfo() {
    return (
      <View style={{ ...styles.locationInfoWrapStyle }}>
        <MaterialIcons
          name="location-pin"
          color={Colors.blackColor}
          size={20}
        />
        <Text
          numberOfLines={2}
          style={{
            marginLeft: Sizes.fixPadding,
            flex: 1,
            ...Fonts.blackColor14Medium,
          }}
        >
          {address}
        </Text>
      </View>
    );
  }

  function pickLocationButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSubmit}
        style={{
          ...CommonStyles.button,
          marginVertical: Sizes.fixPadding * 2.0,
        }}
      >
        <Text style={{ ...Fonts.whiteColor18Bold }}>{t('pick location')}</Text>
      </TouchableOpacity>
    );
  }

  function setTheMarkerAccordingSearch(data,details = null) {
    let newLoc = {
      latitude:details.geometry.location.lat,
      longitude:details.geometry.location.lng
    };
    setCurrentMarker(newLoc)
    setSearch(data.description)
    setisLoading(true)
    getGeocode(newLoc,data);
  }

  function handleDragged(e){
    let newLoc = e.nativeEvent.coordinate;
    setCurrentMarker(newLoc);
    setisLoading(true);
    getGeocode(newLoc);
  }

  function mapView() {
    return (
      <MapView
        style={{ flex: 1 }}
        region={{
          latitude: currentmarker.latitude,
          longitude: currentmarker.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        provider={PROVIDER_GOOGLE}
      >
        <Marker
          coordinate={currentmarker}
          onDragEnd={handleDragged}
          draggable
        >
          <Image
            source={require("../../assets/images/icons/marker.png")}
            style={{ width: 40.0, height: 40.0, resizeMode: "contain" }}
          />
        </Marker>
      </MapView>
    );
  }

  function handleSubmit() {
    if (route.params?.addressFor === 'pickup') dispatch(setPickUp(location));
    else dispatch(setDestination(location));
    navigation.navigate({
      name: route.params?.screen ? route.params.screen : (user ? "Home" : "HomeGuest"),
      params: { address: address, addressFor: route.params.addressFor },
      merge: true,
    });
  }
};

export default PickLocationScreen;

const styles = StyleSheet.create({
  footer: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: Sizes.fixPadding * 2.0,
    borderTopRightRadius: Sizes.fixPadding * 2.0,
    paddingTop: Sizes.fixPadding * 2.5,
    marginTop: -Sizes.fixPadding * 2.0,
  },
  locationInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding + 5.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    justifyContent: "center",
    ...CommonStyles.rowAlignCenter,
    ...CommonStyles.shadow,
  },
  searchFieldWrapStyle: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    paddingTop: Sizes.fixPadding - 6.0,
    marginLeft: Sizes.fixPadding,
    ...CommonStyles.shadow,
  },
  headerBg: {
    backgroundColor: Colors.whiteColor,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 90.0,
    zIndex: 90,
  },
  header: {
    flexDirection: "row",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 100,
    padding: Sizes.fixPadding * 2.0,
  },
  dialogStyle: {
    width: "80%",
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
