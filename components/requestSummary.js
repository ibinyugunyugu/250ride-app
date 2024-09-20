import { 
  Text, 
  View, 
  StyleSheet,
  TouchableOpacity
} from "react-native";
import React, { useState } from "react";
import { CommonStyles, Fonts, Sizes, Colors } from "../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import populizeAddress from "../functions/populizeAddress";
import { useDispatch } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import ShareButton from "./shareButton";
import { setPickUp } from "../store/pickup";
import { setDestination } from "../store/destination";
import useAuth from "../auth/useAuth";
import LoginSignUpDialog from "./loginSignUpDialog";
import AlertMessage from "./alertMessage";
import LoadingIndicator from "./loadingIndicator";
import { setData, setSearched } from "../store/home";
import { Overlay } from "@rneui/themed";
import userApi from "../api/users";
import saveToStore from "../hooks/saveToStore";
import '../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const RequestSummary = ({ item, navigation }) => {
  const [showDialog, setshowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modeDialog, setModeDialog] = useState(false);
  const [pickAlert, setpickAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const auth = useAuth();
  const { user } = auth;
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();

  const getDate = (datetime) => {
    let newDate = datetime.split('T')[0];
    let hours = (datetime.split('T')[1]).split(':')[0];
    let minutes = (datetime.split('T')[1]).split(':')[1];
    let amPm = hours > 11 ? 'PM' : 'AM';
    hours -= hours > 12 ? 12 : 0;
    hours = hours == 0 ? 12 : hours;
    return newDate+' '+hours+':'+minutes+' '+amPm;
  }

  const handleOffer = () => {
    let pickUpData = {
      streetNo:item.pickupStreetNo,
      street:item.pickupStreet,
      district:item.pickupDistrict,
      postalCode:item.pickupPostalCode,
      city:item.pickupCity,
      region:item.pickupRegion,
      country:item.pickupCountry,
      latitude:item.pickupLat,
      longitude:item.pickupLng,
      address:item.pickupAddress,
    }
    let destinationData = {
      streetNo:item.destinationStreetNo,
      street:item.destinationStreet,
      district:item.destinationDistrict,
      postalCode:item.destinationPostalCode,
      city:item.destinationCity,
      region:item.destinationRegion,
      country:item.destinationCountry,
      latitude:item.destinationLat,
      longitude:item.destinationLng,
      address:item.destinationAddress,
    }
    let selectedDateAndTime = getDate(item.date);
    let data = {
      selectedTabIndex:2,
      pickupAddress:item.pickupAddress,
      destinationAddress:item.destinationAddress,
      selectedSeat:item.seats,
      selectedDateAndTime
    }
    if(!user || !user?.isDriver) return setshowDialog(true);
    else if(user?.currentProfile === '1' && user?.isDriver) return setModeDialog(true);
    dispatch(setSearched());
    dispatch(setPickUp(pickUpData));
    dispatch(setDestination(destinationData));
    dispatch(setData(data)); 
    navigation.push("OfferRide");
  }

  function switchProfileDialog() {
    return (
      <Overlay
        isVisible={modeDialog}
        onBackdropPress={() => setModeDialog(false)}
        overlayStyle={styles.dialogStyle}
      >
        <View
          style={{
            marginVertical: Sizes.fixPadding * 2.5,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          <Text style={{ ...Fonts.blackColor16Medium, textAlign: "center" }}>
            { 
              user?.currentProfile === '2' 
              ? 
              t('your account is in driver mode would you like to switch to rider mode')
              :
              t('your account is in rider mode would you like to switch to driver mode')
            }
          </Text>
        </View>
        <View style={{ ...CommonStyles.rowAlignCenter, ...styles.btnContainer }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setModeDialog(false);
            }}
            style={{
              ...styles.dialogBtn,
              paddingHorizontal: Sizes.fixPadding * 3.0 
            }}
          >
            <Text style={{ ...Fonts.blackColor16SemiBold }}>{t('cancel')}</Text>
          </TouchableOpacity>
          <View style={{ backgroundColor: Colors.whiteColor, width: 2.0 }} />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSwitch}
            style={{...styles.dialogBtn, backgroundColor: Colors.secondaryColor}}
          >
            <Text style={{ ...Fonts.whiteColor16SemiBold }}>{t('continue')}</Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    );
  }

  async function handleSwitch(){
    setModeDialog(false);
    setpickAlert(false);
    setLoading(true);
    const result = await userApi.switchAccount();
    setLoading(false) 
    if (!result.ok) {
      setpickAlert(true);
      return setErrorMessage(result.data.error ? t(result.data.error) : t('switching account failed try again'))
    }
    auth.logIn(result.data);  
  }

  return (
    <View style={styles.requestWrapper}>
        <View style={styles.requestDetailWrapper}>
          <View style={{flex:1}}>
            <View style={{flexDirection:'row'}}>
              <View style={{flex:1}}>
                <View style={styles.infoRow}>
                  <MaterialIcons
                    name="location-pin"
                    color={Colors.blackColor}
                    size={15}
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      ...Fonts.blackColor14SemiBold,
                      marginLeft: Sizes.fixPadding-5.0,
                    }}
                  >
                    {t('from')}:
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      flex: 1,
                      ...Fonts.blackColor14Medium,
                      marginLeft: Sizes.fixPadding-3.0,
                    }}
                  >
                    {populizeAddress(item,true)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <MaterialIcons
                    name="location-pin"
                    color={Colors.blackColor}
                    size={15}
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      ...Fonts.blackColor14SemiBold,
                      marginLeft: Sizes.fixPadding-5.0,
                    }}
                  >
                    {t('to')}:
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      flex: 1,
                      ...Fonts.blackColor14Medium,
                      marginLeft: Sizes.fixPadding-3.0,
                    }}
                  >
                    {populizeAddress(item)}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons
                    name="calendar-outline"
                    color={Colors.blackColor}
                    size={15}
                  />
                  
                  <Text
                    numberOfLines={1}
                    style={{
                      maxWidth: "50%",
                      ...Fonts.blackColor14Medium,
                      marginLeft: Sizes.fixPadding - 5.0,
                    }}
                  >
                    {new Date(item.date.split('T')[0]).toDateString()}
                  </Text>
                  <View style={styles.dateTimeDivider}></View>
                  <Ionicons name="time-outline" color={Colors.blackColor} size={15} />
                  <Text
                    numberOfLines={1}
                    style={{
                      flex: 1,
                      ...Fonts.blackColor14Medium,
                      marginLeft: Sizes.fixPadding - 5.0,
                    }}
                  >
                    {(item.date.split('T')[1]).split(':')[0]}:{(item.date.split('T')[1]).split(':')[1]}
                  </Text>
                </View>
              </View>
              <ShareButton/>
            </View>

            <View style={{...styles.infoRow, justifyContent:'space-between'}}>
              <View style={{flexDirection:'row'}}>
                <MaterialIcons
                  name="event-seat"
                  color={Colors.blackColor}
                  size={15}
                />
                <Text
                  numberOfLines={1}
                  style={{
                    ...Fonts.blackColor14SemiBold,
                    marginLeft: Sizes.fixPadding-5.0,
                  }}
                >
                  {t('seats')}:
                </Text>
                <Text
                  style={{
                    ...Fonts.blackColor14Medium,
                    marginLeft: Sizes.fixPadding-3.0,
                  }}
                >
                  {item.seats}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleOffer} 
                style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={{ ...Fonts.secondaryColor14SemiBold }}>{t('offer a ride')}</Text>
                <Ionicons
                  name="arrow-forward"
                  color={Colors.blackColor}
                  size={25}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {loginSignUpDialog()}
        {loadingIndicator()}
        {alertMessage()}
        {switchProfileDialog()}
      </View>
  );

  function loginSignUpDialog() {
    return (
      <LoginSignUpDialog 
        navigation={navigation}
        showDialog={showDialog}
        setshowDialog={setshowDialog} 
        selectedTabIndex={2}
      />
    )
  }

  function loadingIndicator(){
    return <LoadingIndicator visible={loading}/>
  }

  function alertMessage() {
    return <AlertMessage 
      visible={pickAlert} 
      setVisible={setpickAlert} 
      errorMessage={errorMessage}
    /> 
  }
};

export default RequestSummary;

const styles = StyleSheet.create({
  dateTimeDivider: {
    marginHorizontal: Sizes.fixPadding - 5.0,
    width: 1.0,
    backgroundColor: Colors.blackColor,
    height: "100%",
  },
  requestDetailWrapper: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection:'row'
  },
  requestWrapper: {
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.rowAlignCenter,
    ...CommonStyles.shadow,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  'In Progress':{
    backgroundColor:'#000000'
  },
  Canceled:{
    backgroundColor:'#9C0000'
  },
  Waiting:{
    backgroundColor:'#027500'
  },
  Served:{
    backgroundColor:'#0052B4'
  },
  infoRow:{
    ...CommonStyles.rowAlignCenter, 
    paddingTop: Sizes.fixPadding - 8.0
  },
  statusBtn:{
    borderRadius: Sizes.fixPadding - 2.0,
    paddingVertical: Sizes.fixPadding - 5.0,
    width:80
  },
  dialogBtn: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius:Sizes.fixPadding,
    paddingVertical:Sizes.fixPadding/2.0,
    width:120
  },
  dialogStyle: {
    width: "80%",
    borderRadius: Sizes.fixPadding,
    padding: 0,
    overflow: "hidden",
  },
  btnContainer:{
    flexDirection:'row',
    justifyContent:'center',
    paddingBottom:Sizes.fixPadding*2.0
  },
});