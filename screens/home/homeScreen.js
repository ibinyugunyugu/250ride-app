import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  Colors,
  Sizes,
  Fonts,
  CommonStyles,
  screenHeight,
} from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import RadioGroup from 'react-native-radio-buttons-group';
import LoginSignUpDialog from "../../components/loginSignUpDialog";
import DateTimePicker from "../../components/dateTimePicker";
import NoOfSeatSheet from "../../components/noOfSeatSheet";
import AlertMessage from "../../components/alertMessage";
import useAuth from "../../auth/useAuth";
import userApi from "../../api/users";
import { useSelector, useDispatch } from 'react-redux';
import { getUserData, setData, setSearched } from "../../store/home";
import LoadingIndicator from "../../components/loadingIndicator";
import { Overlay } from "@rneui/themed";
import { useFocusEffect } from "@react-navigation/native";
import Constants from "expo-constants";
import saveToStore from "../../hooks/saveToStore";
import { getNotifications, setNotifications } from "../../store/notifications";
import useApi from "../../hooks/useApi";
import notificationsApi from "../../api/notifications";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const HomeScreen = ({ navigation, route }) => {
  const auth = useAuth();
  const { user } = auth;
  const {t, i18n} = useTranslation();
  let msg = t('provide all details');
  const dispatch = useDispatch();
  const homeData = useSelector(getUserData());
  const notifications = useSelector(getNotifications());
  const nondelivered = Array.isArray(notifications) ? notifications.filter(item=>!item.delivered) : [];
  const getNotificationsApi = useApi(notificationsApi.getNotifications);
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [pickAlert, setpickAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState(msg);
  const [selectedTabIndex, setselectedTabIndex] = useState(user?.currentProfile ? parseInt(user?.currentProfile) : 1);
  const [selectedDateAndTime, setselectedDateAndTime] = useState("");
  const [selectedDate, setselectedDate] = useState("");
  const [showDateTimeSheet, setshowDateTimeSheet] = useState(false);
  const [showNoOfSeatSheet, setshowNoOfSeatSheet] = useState(false);
  const [modeDialog, setModeDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noticeOnSwitch, setNoticeOnSwitch] = useState(true);
  const [selectedSeat, setselectedSeat] = useState();
  const radioButtons = useMemo(() => ([
    {
        id: '1', 
        label: t('one time'),
        value: '1'
    },
    {
        id: '2',
        label: t('recurring'),
        value: '2'
    }
]), []);

useFocusEffect(
  useCallback(() => {
    getNotificationsApi.request();
  }, [])
);

useFocusEffect(
  useCallback(() => {
    let array = getNotificationsApi.data;
    if(!Array.isArray(array)) return;
    let newArray = array.map((object, i) => ({ ...object, key: parseInt(i + 1)+"" }));
    dispatch(setNotifications({notifications:newArray}));
  }, [getNotificationsApi.data])
);

useEffect(() => {
  if(homeData.searched){
    if(homeData.selectedTabIndex == 1){
      if(user?.currentProfile === '2') return handleSwitch();
      else if(user?.currentProfile === '1') return navigation.navigate({name:"Search",merge:true})
    }
    else if(homeData.selectedTabIndex == 2){
      setselectedTabIndex(2)
      if(user?.currentProfile === '1' && user?.isDriver)return handleSwitch();
      else if(user?.currentProfile === '1' && !user?.isDriver){
        return setshowDialog(true);
      }
      //navigation.push('OfferRide');
    }
  }
  else{
    setPickupAddress();
    setDestinationAddress();
    setselectedDateAndTime();
    setselectedSeat();
  }
}, [homeData])

useEffect(() => {
  if (route.params?.address) {
    if (route.params.addressFor === "pickup") {
      setPickupAddress(route.params.address);
    } else {
      setDestinationAddress(route.params.address);
    }
  }
}, [route.params?.address]);

useEffect(() => {
  if(!noticeOnSwitch) return;
  if(user && parseInt(user?.currentProfile) !== selectedTabIndex && ((user?.isDriver || parseInt(user?.isDriver)) && (user?.isRider || parseInt(user?.isRider)))) return setModeDialog(true);
}, [selectedTabIndex]);

const [selectedId, setSelectedId] = useState('1');
const [days, setDays] = useState(['Mon','Tue','Wed','Thu','Fri','Sat','Sun']);
const [title, setTitle] =  useState('');
const [selected, setSelected] = useState([]);
const [visible, setVisible] = useState(false);
const [showDialog, setshowDialog] = useState(false);
const handleOnPress = (value) => {
  setVisible(value==='2');
  setSelectedId(value);
}


const applyChanges = (arr) => {
  setTitle('Every ' + arr.join(', '));
  setSelected(arr);
}

const handleRemove = (value) => {
    let arr = [...selected];
    const index = arr.indexOf(value);
    if (index > -1) { 
      arr.splice(index, 1)
      applyChanges(arr);
    }
}

const handleAdd = (value) => {
  let arr = [...selected];
  const index = arr.indexOf(value);
  if (index === -1) { 
    arr.push(value);
    applyChanges(arr);
  }
}

const handleSelect = (value) => () =>{
  let arr = [...selected];
  if(arr.includes(value)) return handleRemove(value);
  return handleAdd(value);
}

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {map()}
        {findAndOfferRideInfo()}
      </View>
      {dateTimePicker()}
      {noOfSeatSheet()}
      {pickAddressMessage()}
      {loginSignUpDialog()}
      {switchProfileDialog()}
      {loadingIndicator()}
      {loginButton()}
      {notificationButton()}
    </View>
  );

  function loadingIndicator(){
    return <LoadingIndicator visible={loading}/>
  }

  function pickAddressMessage() {
    return <AlertMessage 
      visible={pickAlert} 
      setVisible={setpickAlert} 
      errorMessage={errorMessage}
    /> 
  }

  function loginSignUpDialog() {
    return (
      <LoginSignUpDialog 
        navigation={navigation}
        showDialog={showDialog}
        setshowDialog={setshowDialog} 
        selectedTabIndex={selectedTabIndex}
      />
    )
  }


  function noOfSeatSheet() {
    return (
      <NoOfSeatSheet
        showNoOfSeatSheet ={showNoOfSeatSheet}
        setshowNoOfSeatSheet ={setshowNoOfSeatSheet}
        setselectedSeat ={setselectedSeat}
        selectedSeat={selectedSeat}
      />
    );
  }

  function dateTimePicker() {
    return (
      <DateTimePicker
        showDateTimeSheet={showDateTimeSheet}
        setshowDateTimeSheet={setshowDateTimeSheet}
        setselectedDateAndTime={setselectedDateAndTime}
        setselectedDate={setselectedDate}
        selectedDate={selectedDate}
        withHours={true}
        limit={true}
      />
    );
  }

  function loginButton() {
    return (
      !user ? <TouchableOpacity 
        onPress={()=>setshowDialog(true)}
        style={{
          flexDirection:'row', 
          justifyContent:'flex-start', 
          alignItems:'center',
          position:'absolute',
          alignSelf:'flex-end',
          top:Constants.statusBarHeight + Sizes.fixPadding,
          right:Sizes.fixPadding ,
          backgroundColor:Colors.whiteColor,
          padding:Sizes.fixPadding / 2.0,
          borderRadius: 50,
          borderColor:Colors.secondaryColor,
          borderWidth:1
        }}>
        <MaterialIcons
          name="account-circle"
          color={Colors.blackColor}
          size={40}
        />
      </TouchableOpacity> : null
    );
  }

  function notificationButton() {
    return (
      user ? <View style={{ position: "absolute", right: 30, top: 20 }}>
        <MaterialIcons
          name="notifications"
          color={Colors.blackColor}
          size={30}
          onPress={() => {
            notificationsApi.clearNotifications();
            navigation.push("Notifications");
          }}
        />
        {nondelivered.length ? <View style={styles.headerAccountBedge}><Text style={styles.count}>{nondelivered.length > 9 ? '9+' : nondelivered.length}</Text></View> : null}
      </View> 
      :
      null
    );
  }


  function findAndOfferRideInfo() {
    return (
      <View style={styles.container}>
        <View>
        <ScrollView style={styles.findAndOfferRideInfoWrapper}>
          <View
            style={{
              marginHorizontal: Sizes.fixPadding * 2.0,
              marginTop: Sizes.fixPadding * 3.0,
            }}
          >
            <View style={styles.findAndOfferRideButtonWrapper}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setselectedTabIndex(1)}
                style={{
                  ...styles.findAndOfferRideButton,
                  ...styles.findRideButton,
                  backgroundColor:
                    selectedTabIndex == 1 ? Colors.secondaryColor : "transparent",
                }}
              >
                <Text
                  style={
                    selectedTabIndex == 1
                      ? { ...Fonts.whiteColor15SemiBold }
                      : { ...Fonts.blackColor15SemiBold }
                  }
                >
                  {t('find a ride')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setselectedTabIndex(2)}
                style={{
                  ...styles.findAndOfferRideButton,
                  ...styles.offerRideButton,
                  backgroundColor:
                    selectedTabIndex == 2 ? Colors.secondaryColor : "transparent",
                }}
              >
                <Text
                  style={
                    selectedTabIndex == 2
                      ? { ...Fonts.whiteColor15SemiBold }
                      : { ...Fonts.blackColor15SemiBold }
                  }
                >
                  {t('offer a ride')}
                </Text>
              </TouchableOpacity>
            </View>


            {(selectedTabIndex == 2 && user?.currentProfile !== "2") ? 
            <View style={{
              marginVertical: Sizes.fixPadding * 2.0,
            }}>
              <Text style={{ ...Fonts.blackColor18SemiBold, textAlign: "center" }}>
                {t('hello there')}
              </Text>

              <Text style={{ 
                  ...Fonts.blackColor15Medium, 
                  marginTop:Sizes.fixPadding * 3.0,
                  textAlign: "center" 
                }}>
                  {t('register message')}
              </Text>
            </View>
            : null}

            {(selectedTabIndex == 2 && user?.currentProfile !== "2") ? null :
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.push("PickLocation", { addressFor: "pickup" });
              }}
              style={{
                marginVertical: Sizes.fixPadding * 2.0,
                ...styles.locationBox,
              }}
            >
              <View
                style={{
                  borderColor: Colors.greenColor,
                  ...styles.locationIconWrapper,
                }}
              >
                <MaterialIcons
                  name="location-pin"
                  color={Colors.blackColor}
                  size={20.0}
                />
              </View>
              <View style={{ flex: 1, marginLeft: Sizes.fixPadding  }}>
                <Text numberOfLines={1} style={{ ...Fonts.blackColor15SemiBold }}>
                {t('leaving from')}
                </Text>
                {pickupAddress ? (
                  <Text
                    numberOfLines={2}
                    style={{
                      ...Fonts.blueColor14Medium,
                      marginTop: Sizes.fixPadding - 5.0,
                    }}
                  >
                    {pickupAddress}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>}
            {(selectedTabIndex == 2 && user?.currentProfile !== "2") ? null :
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.push("PickLocation", { addressFor: "destination" });
              }}
              style={{ ...styles.locationBox }}
            >
              <View
                style={{
                  borderColor: Colors.redColor,
                  ...styles.locationIconWrapper,
                }}
              >
                <MaterialIcons
                  name="location-pin"
                  color={Colors.blackColor}
                  size={20.0}
                />
              </View>
              <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
                <Text numberOfLines={1} style={{ ...Fonts.blackColor15SemiBold }}>
                {t('going to')}
                </Text>
                {destinationAddress ? (
                  <Text
                    numberOfLines={2}
                    style={{
                      ...Fonts.blueColor14Medium,
                      marginTop: Sizes.fixPadding - 5.0,
                    }}
                  >
                    {destinationAddress}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>}
            {(selectedTabIndex == 2 && user?.currentProfile !== "2") ? null :
            <View
              style={{
                flexDirection: "row",
                marginTop: Sizes.fixPadding * 2.0,
                
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setshowDateTimeSheet(true);
                }}
                style={{
                  ...styles.dateAndTimeAndSeatWrapper,
                  marginRight: selectedTabIndex == 1 ? Sizes.fixPadding : 0,
                }}
              >
                <Ionicons
                  name="calendar-outline"
                  color={Colors.blackColor}
                  size={18}
                />
                <Text
                  numberOfLines={2}
                  style={{
                    ...(selectedDateAndTime
                      ? { ...Fonts.blueColor14Medium }
                      : { ...Fonts.blackColor15SemiBold }),
                    flex: 1,
                    marginLeft: Sizes.fixPadding,
                  }}
                >
                  {selectedDateAndTime ? selectedDateAndTime : (selectedTabIndex == 1 ? t('date') : t('pick date and time'))}
                </Text>
              </TouchableOpacity>
              {selectedTabIndex == 1 ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setshowNoOfSeatSheet(true);
                  }}
                  style={{
                    ...styles.dateAndTimeAndSeatWrapper,
                    marginLeft: Sizes.fixPadding,
                  }}
                >
                  <MaterialIcons
                    name="event-seat"
                    color={Colors.blackColor}
                    size={20}
                  />
                  <Text
                    numberOfLines={2}
                    style={{
                      ...(selectedSeat
                        ? { ...Fonts.blueColor16SemiBold }
                        : { ...Fonts.blackColor15SemiBold }),
                      flex: 1,
                      marginLeft: Sizes.fixPadding,
                    }}
                  >
                    {selectedSeat ? (i18n.language !== 'kiny' ? selectedSeat+' '+t(selectedSeat > 1 ? 'seats' : 'seat') : t(selectedSeat > 1 ? 'seats' : 'seat')+' '+selectedSeat) : t('seats') }
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>}
            {selectedTabIndex == 1 ? <View style={styles.repentionWrapper}>
              <View style={styles.repention}>
                <Image
                  source={require("../../assets/images/icons/recurring-event.png")}
                  style={{ width: 20.0, height: 20.0, resizeMode: "contain" }}
                />
                <Text
                  numberOfLines={2}
                  style={{
                    ...(selectedDateAndTime
                      ? { ...Fonts.blackColor16SemiBold }
                      : { ...Fonts.blackColor15SemiBold }),
                    flex: 1,
                    marginLeft: Sizes.fixPadding,
                  }}
                >
                  {t('repetition')}
                </Text>
              </View>
              <View style={styles.dayView}>
                <RadioGroup 
                    radioButtons={radioButtons} 
                    onPress={handleOnPress}
                    selectedId={selectedId}
                    layout='row'
                    containerStyle={styles.days}            
                />
                {visible ? <View style={styles.daySelect}>
                  {days.map((day,index)=>(
                    <TouchableOpacity onPress={handleSelect(index)} style={selected.includes(index) ? styles.day : styles.dayOff} key={index}>
                      <Text>{day.charAt(0)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                : 
                null
                }
              </View>  
            </View> : null}
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSubmit}
            style={{ ...CommonStyles.button, ...styles.dialogButton }}
          >
            <Text style={{ ...Fonts.whiteColor18Bold }}>
              {selectedTabIndex == 1 ? t('Find a ride (bottom button)') : t('continue')}
            </Text>
          </TouchableOpacity>

          {selectedTabIndex == 1 ?
            <Text
              onPress={() => {
                    navigation.push("AvailableRides");
                  }}
                  style={styles.viewAvailable}
                >
                  {t('view available rides')}
            </Text>
          :
            <Text
              onPress={() => {
                    navigation.push("AvailableRequests");
                  }}
                  style={styles.viewAvailable}
                >
                  {t('view available requests')}
            </Text>
          }

        </ScrollView>
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

  function showAlert()
  {
    setpickAlert(true);
      setTimeout(() => {
        setpickAlert(false);
      }, 2000);
  }

  function handleSubmit(){
    let data = {
      selectedTabIndex,
      pickupAddress,
      destinationAddress,
      selectedSeat,
      selectedDateAndTime,
      selected,
      selectedId,
    }
    if(selectedTabIndex == 1){ 
      if(!pickupAddress || !destinationAddress || !selectedSeat || !selectedDateAndTime) 
      {
        setErrorMessage(msg); 
        return showAlert()
      }
      dispatch(setData(data))
      if(user) {
        if(user.currentProfile === '2') return setModeDialog(true);
        navigation.push('BottomTabBar')
        return dispatch(setSearched());
      }
      else{
        dispatch(setSearched());
        return setshowDialog(true);
      }
    }
    else if(selectedTabIndex == 2){
      if(!user) return setshowDialog(true);
      else if(user.currentProfile === '1' && parseInt(user.isDriver)) return setModeDialog(true);
      else if(user.currentProfile === '1' && !parseInt(user.isDriver)) return setshowDialog(true);
      else if(!pickupAddress || !destinationAddress || !selectedDateAndTime) {setErrorMessage(msg); return showAlert()}
      dispatch(setData(data))
      dispatch(setSearched())
      return navigation.push('OfferRide');
    }
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
              paddingHorizontal: Sizes.fixPadding * 2.0 
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
    setpickAlert(true);
    setLoading(false) 
    if (!result.ok) {
      return setErrorMessage(result.data.error ? t(result.data.error) : t('switching account failed try again'))
    }
    auth.logIn(result.data);
    let currentP = user?.currentProfile === '2' ? t('rider mode') :  t('driver mode');
    setErrorMessage(t('account switched to') + currentP);
    
  }
};

export default HomeScreen;

const styles = StyleSheet.create({
  alertTextStyle: {
    ...Fonts.whiteColor14Medium,
    backgroundColor: Colors.blackColor,
    position: "absolute",
    bottom: 40.0,
    alignSelf: "center",
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding - 5.0,
    borderRadius: Sizes.fixPadding - 5.0,
    overflow: "hidden",
    zIndex: 100.0,
  },
  header: {
    backgroundColor: Colors.primaryColor,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding + 5.0,
  },
  container: {
    position: "absolute",
    margin: 'auto',
    left: 0,
    right: 0,
    top:0,
    bottom:0,
    justifyContent:'center',
  },
  findAndOfferRideInfoWrapper: {
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.shadow,
    margin: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding,
    borderWidth: 0,
    maxHeight:screenHeight*0.85,
  },
  findAndOfferRideButtonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Sizes.fixPadding,
    borderColor:Colors.secondaryColor,
    backgroundColor: Colors.whiteColor,
    borderWidth: 1,
  },
  findAndOfferRideButton: {
    flex: 1,
    padding: Sizes.fixPadding + 3.0,
    alignItems: "center",
    justifyContent: "center",
  },
  findRideButton: {
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomLeftRadius: Sizes.fixPadding,
  },
  offerRideButton: {
    borderTopRightRadius: Sizes.fixPadding,
    borderBottomRightRadius: Sizes.fixPadding,
  },
  locationIconWrapper: {
    width: 24.0,
    height: 24.0,
    borderRadius: 12.0,
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  locationBox: {
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.blackColor,
    borderWidth: 1.0,
    borderRadius: Sizes.fixPadding,
    flexDirection: "row",
    alignItems: "center",
    padding: Sizes.fixPadding + 2.0,
  },
  dateAndTimeAndSeatWrapper: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    flexDirection: "row",
    alignItems: "center",
    borderColor: Colors.blackColor,
    borderWidth: 1.0,
    padding: Sizes.fixPadding + 2.0,
  },
  repentionWrapper:{
    borderRadius: Sizes.fixPadding,
    borderWidth: 1.0,
    marginTop: Sizes.fixPadding * 2.0,    
  },
  repention:{
    flexDirection: "row",
    alignItems: "center",
    padding: Sizes.fixPadding + 2.0,
  },
  days:{
    flexDirection:"row",
    alignItems: 'center',
    padding:0,
    margin:0,
  },
  dayView:{
    paddingBottom:Sizes.fixPadding + 3.0,
  },
  daySelect:{
    flexDirection:"row",
    alignItems: 'center',
    paddingTop:Sizes.fixPadding + 3.0,
    justifyContent:'space-evenly',
  },
  day:{
    alignItems: 'center',
    justifyContent: 'center',
    borderColor : '#0CB408',
    borderRadius: 13,
    borderWidth:2,
    height:26,
    width:26
  },
  dayOff:{
    alignItems: 'center',
    justifyContent: 'center',
    borderColor : 'transparent',
    borderRadius: 15,
    borderWidth:2,
    height:30,
    width:30
  },
  calenderDateWrapStyle: {
    alignItems: "center",
    justifyContent: "center",
    width: 28.0,
    height: 28.0,
    borderRadius: Sizes.fixPadding - 7.0,
    borderWidth: 1.5,
  },
  dialogButton: {
    marginTop: Sizes.fixPadding * 2.0,
  },
  viewAvailable:{
    ...Fonts.blueColor14SemiBold,
    textAlign:'center',
    marginVertical:Sizes.fixPadding * 2.0,
  },
  timeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    margin: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 4.0,
  },
  sheetStyle: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: Sizes.fixPadding * 4.0,
    borderTopRightRadius: Sizes.fixPadding * 4.0,
    paddingTop: Sizes.fixPadding * 2.0,
    maxHeight: screenHeight - 150,
  },
  sheetHeader: {
    marginHorizontal: Sizes.fixPadding * 2.0,
    textAlign: "center",
    ...Fonts.primaryColor16SemiBold,
    marginBottom: Sizes.fixPadding * 2.5,
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
  headerAccountBedge: {
    position: "absolute",
    top: -7,
    right: -7,
    width: 18.0,
    height: 18.0,
    borderRadius: 9.0,
    backgroundColor: Colors.redColor,
    justifyContent:'flex-start',
    alignItems:'center',
  },
  count:{
    ...Fonts.whiteColor13Medium
  }
});
