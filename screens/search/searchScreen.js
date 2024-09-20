import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Colors, Sizes, Fonts, CommonStyles, screenHeight } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Header from "../../components/header";
import RideSummary from "../../components/rideSummary";
import { useSelector, useDispatch } from 'react-redux';
import { getUserData, getIsSearched, resetSearched, resetData, getPopUp, resetOpenPop, setOpenPop } from "../../store/home";

import { Overlay } from "@rneui/themed";
import DateTimePicker from "../../components/dateTimePicker";
import LoadingIndicator from "../../components/loadingIndicator";
import { getPickUpData, resetPickUp } from "../../store/pickup";
import { getDestinationData, resetDestination } from "../../store/destination";
import useAuth from "../../auth/useAuth";
import requestsApi from "../../api/requests";
import ridesApi from "../../api/rides";
import AlertMessage from "../../components/alertMessage";
import useApi from "../../hooks/useApi";
import { useFocusEffect } from "@react-navigation/native";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 
const hoursList = [...range(1, 12)];

const minutesList = [...range(0, 59)];

function range(start, end) {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
}

const SearchScreen = ({ navigation, route }) => {

  const newDate = Date.now();
  const getNearByApi = useApi(ridesApi.nearByPickup);
  const [nearBy, setNearBy] = useState(getNearByApi.data); //allRides
  const [rides, setrides] = useState([]); //allRides
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [pickAlert, setpickAlert] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showDialog, setshowDialog] = useState(false);
  const todayDate = `${new Date(newDate).getFullYear()}-${
    new Date(newDate).getMonth() + 1
  }-${new Date(newDate).getDate()}`;
  
  const [selectedDateAndTime, setselectedDateAndTime] = useState("");
  const [selectedDate, setselectedDate] = useState(""); 
  const [showDateTimeSheet, setshowDateTimeSheet] = useState(false);
  const [defaultDate, setdefaultDate] = useState(new Date(newDate).getDate());
  const [selectedHour, setselectedHour] = useState(hoursList[(new Date(newDate).getHours()) - 1]);
  const [selectedMinute, setselectedMinute] = useState(minutesList[new Date(newDate).getMinutes()]);
  const [selectedAmPm, setselectedAmPm] = useState(selectedHour >= 12 ? 'PM' : 'AM');
  const [alert, setAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isSuggestion, setIsSuggetion] = useState();
  const clearSearch = () => {
    setShowAlert(false);
    setSearched(false);
    setPickupAddress('');
    setDestinationAddress('');
  }

  const dispatch = useDispatch();
  const homeData = useSelector(getUserData());
  const isSearched = useSelector(getIsSearched());
  const pickupData = useSelector(getPickUpData());
  const destinationData = useSelector(getDestinationData());
  const popUp = useSelector(getPopUp());

  const auth = useAuth();
  const { user } = auth;
  const {t, i18n} = useTranslation();

  useEffect(() => {
    if(isSearched && homeData  && user?.currentProfile == '1'){
      setPickupAddress(pickupData.address);
      setDestinationAddress(destinationData.address);
      setselectedDateAndTime(homeData.selectedDateAndTime);
      handleSearch();
      setSearched(true);
      
    }
  }, [isSearched,homeData])

  useEffect(() => {
    if (route.params?.address && popUp) {
      if (route.params.addressFor === "pickup") {
        setPickupAddress(route.params.address);
      } else {
        setDestinationAddress(route.params.address);
      }
      setshowDialog(true);
    }
  }, [route.params?.address]);

  // useEffect(()=>{
  //   setrides(getNearByApi.data);
  // },[getNearByApi.loading]);

  // useEffect(()=>{
  //   getNearByApi.request();
  //   setPopUp(true);
  //   console.log('switch on search')
  // },[]);


  useFocusEffect(
    useCallback(() => {
      setNearBy(getNearByApi.data);
    }, [getNearByApi.loading])
  );

  useFocusEffect(
    useCallback(() => {
      getNearByApi.request();
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={searched ? t('search results') : t('search')} noBack={true} navigation={navigation} />
        {searchBox()}
        {showAlert ? alertBox() : null}
        {(!rides.length && !nearBy.length) ? noRidesInfo() : ridesInfo()}
      </View>
      {pickAddressMessage()}
      {dateTimePicker()}
      {editSearchDialog()}
      {alertMessage()}
      {loadingIndicator()}
      {successDialog()}
    </View>
  );

  function loadingIndicator(){
    return (<LoadingIndicator visible={loading}/>)
  }

  function successDialog() {
    return (
      <Overlay
        isVisible={success}
        onBackdropPress={() => {
          setSuccess(false);
          navigation.navigate({name:'RiderRequests', merge:true})
        }}
        overlayStyle={styles.dialogStyle}
      >
        <View 
          style={{
            marginTop: Sizes.fixPadding,
            marginBottom: Sizes.fixPadding * 3.5,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setShowAlert(false);
                setSuccess(false);
                navigation.navigate({name:'RiderRequests', merge:true})
              }}
          >
            <MaterialIcons
              name="close"
              color={Colors.blackColor}
              size={20}
              style={{alignSelf:'flex-end'}}
            />
          </TouchableOpacity>

          <Ionicons
            name="checkmark-circle-outline"
            color={Colors.secondaryColor}
            size={70}
            style={{paddingBottom:Sizes.fixPadding * 3.0, alignSelf:'center'}}
          />
          <Text style={{ ...Fonts.blackColor16Medium, textAlign: "center" }}>
            {t('your alert have been created successfully')}!
          </Text>
        </View>
        
      </Overlay>
    );
  }

  function alertMessage() {
    return <AlertMessage 
      visible={alert} 
      errorMessage={errorMessage} 
      setVisible={setAlert}
    />
  }
  
  function dateTimePicker() {
    return (
      <DateTimePicker
        defaultDate={defaultDate}
        showDateTimeSheet={showDateTimeSheet}
        setshowDateTimeSheet={setshowDateTimeSheet}
        setselectedDateAndTime={setselectedDateAndTime}
        setselectedDate={setselectedDate}
        setdefaultDate={setdefaultDate}
        selectedDate={selectedDate}
        withHours={user?.currentProfile === '1' ? true : false }
        limit={true}
      />
    );
  }

  function noRidesInfo() {
    return (
      <View style={styles.emptyPage}>
        <Image
          source={require("../../assets/images/empty_ride.png")}
          style={{ width: 50.0, height: 50.0, resizeMode: "contain" }}
        />
        <Text
          style={{ ...Fonts.grayColor16SemiBold, marginTop: Sizes.fixPadding }}
        >
          {t('empty ride list')}
        </Text>
      </View>
    );
  }

  function ridesInfo() {
    const renderItem = ({ item }) => (
      <RideSummary item={item} navigation={navigation} key={item.id}/>
    );
    return (
      <View style={{ flex: 1 }}>
        <Text 
          style={{ 
            ...Fonts.blackColor18SemiBold, 
            paddingTop: Sizes.fixPadding * 3.0,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          {searched ? ( !isSuggestion ? `${t('search results')} ${rides.length}` : t('suggestions')) : t('nearby pickups')}
        </Text>
        
        <FlatList
          data={searched ? rides : nearBy}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: Sizes.fixPadding * 2.0 }}
          
        />
      </View>
      
    );
  }

  function searchBox() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          dispatch(setOpenPop());
          setshowDialog(true);
        }}
        style={searched ? 
          {paddingTop: Sizes.fixPadding/2.0, ...styles.searchBox} 
          : 
          {paddingVertical: Sizes.fixPadding, ...styles.searchBox}
        }
      >
        {
        searched
          ?
          <View style={{flex:1, flexDirection:'row'}}>
            <View style={{flex:1}}>
              <View>
                <View style={{flexDirection:'row'}}>
                  <View style={{flex:1}}>
                    <Text numberOfLines={1} style={{...Fonts.blackColor14Medium}}>
                      {pickupAddress}
                    </Text>
                  </View>
                    <MaterialIcons
                      name="arrow-forward"
                      color={Colors.blackColor}
                      size={15.0}
                    />
                  <View style={{flex:1}}>
                    <Text numberOfLines={1} style={{...Fonts.blackColor14Medium}}>
                      {destinationAddress}
                    </Text>
                  </View>
                </View>
              </View> 
              <Text numberOfLines={1} style={{...Fonts.blackColor14Medium}}>
                {selectedDateAndTime}
              </Text>
            </View>
            <Text style={{
              ...Fonts.blackColor14SemiBold, 
              padding: Sizes.fixPadding
              }}
              onPress={clearSearch}
            >
              {t('clear')}
            </Text>
          </View>
          
          :
          <View
            style={{
              borderColor: Colors.redColor,
              ...styles.locationIconWrapper,
              flex:1,
            }}
          >
            <MaterialIcons
              name="search"
              color={Colors.blackColor}
              size={20.0}
              style={{alignSelf:'flex-end'}}
            />
          </View>
        }
      </TouchableOpacity>
    )
  }

  function alertBox() {
    return (
      <View style={styles.alertBox}>
        <View style={styles.infoBox}>
          <Text style={{...Fonts.blackColor18SemiBold, textAlign:'center'}}>
            {t('no rides for this date hour')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleCreateAlert}
            style={{
              ...CommonStyles.button,
              marginTop: Sizes.fixPadding * 2.0,
              marginHorizontal: Sizes.fixPadding * 6.0,
              width:'auto'
            }}
          >
            <Text style={{ ...Fonts.whiteColor15Medium, textAlign:'center'}}>{t('create a ride alert')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  function pickAddressMessage() {
    return pickAlert ? (
      <Text style={styles.alertTextStyle}>
        {t('please pick the correct locations')}
      </Text>
    ) : null;
  }


  function editSearchDialog() {
    return (
      <Overlay
        isVisible={showDialog}
        onBackdropPress={handleClosePop}
        overlayStyle={styles.dialogStyle}
      >
        <TouchableOpacity
          onPress={handleClosePop}
        >
          <MaterialIcons
            name="close"
            color={Colors.blackColor}
            size={20.0}
            style={{ alignSelf:'flex-end', marginHorizontal: Sizes.fixPadding * 2.0, }}
          />
        </TouchableOpacity>
        <View>
          <Text style={{ ...Fonts.blackColor16SemiBold, textAlign: "center" }}>
            {t('Edit your search')}
          </Text>
        </View>
        <View
          style={styles.searchDataWrapper}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setshowDialog(false);
              navigation.push("PickLocation", { addressFor: "pickup", screen: "Search" });
            }}
            style={{
              paddingTop: Sizes.fixPadding,
              ...styles.locationBox,
              borderBottomWidth: 1.0,
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
              <Text numberOfLines={1} style={{ ...Fonts.blackColor15Medium }}>
                {t('departure')}
              </Text>
              {pickupAddress ? (
                <Text
                  numberOfLines={2}
                  style={{
                    ...Fonts.grayColor14Medium,
                    marginTop: Sizes.fixPadding - 5.0,
                  }}
                >
                  {pickupAddress}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setshowDialog(false);
              navigation.push("PickLocation", { addressFor: "destination", screen: "Search" });
            }}
            style={{
              paddingTop: Sizes.fixPadding,
              ...styles.locationBox,
              borderBottomWidth: 1.0,
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
              <Text numberOfLines={1} style={{ ...Fonts.blackColor15Medium }}>
                {t('destination')}
              </Text>
              {destinationAddress ? (
                <Text
                  numberOfLines={2}
                  style={{
                    ...Fonts.grayColor14Medium,
                    marginTop: Sizes.fixPadding - 5.0,
                  }}
                >
                  {destinationAddress}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        
          <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setshowDateTimeSheet(true);
                setselectedHour(selectedHour);
                setselectedMinute(selectedMinute);
                setselectedAmPm(selectedAmPm);
              }}
              style={{
                ...styles.locationBox,         
                paddingTop: Sizes.fixPadding       
              }}
            >
              <View
                style={{
                  borderColor: Colors.redColor,
                  ...styles.locationIconWrapper,
                }}
              >
                <Ionicons
                  name="calendar-outline"
                  color={Colors.blackColor}
                  size={18}
                />
              </View>
              <Text
                numberOfLines={2}
                style={{
                  ...(selectedDateAndTime
                    ? { ...Fonts.blackColor16SemiBold }
                    : { ...Fonts.blackColor15Medium }),
                  flex: 1,
                  marginLeft: Sizes.fixPadding,
                }}
              >
                {selectedDateAndTime ? selectedDateAndTime : t('time hour')}
              </Text>
            </TouchableOpacity>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (pickupAddress && destinationAddress && selectedDateAndTime) {
              handleClosePop();
              handleSearch();
            } else {
              setpickAlert(true);
              setTimeout(() => {
                setpickAlert(false);
              }, 2000);
            }
            
          }}
          style={{ ...CommonStyles.button, marginTop: Sizes.fixPadding * 2.0, }}
        >
          <Text style={{ ...Fonts.whiteColor15Medium }}>
            {t('search')}
          </Text>
        </TouchableOpacity>
      </Overlay>
    );
  }

  function handleClosePop(){
    dispatch(resetOpenPop());
    setshowDialog(false);
  }


  async function handleCreateAlert()
  {
    let ride = {
      pickupStreetNo:pickupData.streetNo,
      pickupStreet:pickupData.street,
      pickupDistrict:pickupData.district,
      pickupPostalCode:pickupData.postalCode,
      pickupCity:pickupData.city,
      pickupRegion:pickupData.region,
      pickupCountry:pickupData.country,
      pickupAddress:pickupData.address,
      pickupLat:pickupData.lat,
      pickupLng:pickupData.lng,
      destinationStreetNo:destinationData.streetNo,
      destinationStreet:destinationData.street,
      destinationDistrict:destinationData.district,
      destinationPostalCode:destinationData.postalCode,
      destinationCity:destinationData.city,
      destinationRegion:destinationData.region,
      destinationCountry:destinationData.country,
      destinationAddress:destinationData.address,
      destinationLat:destinationData.lat,
      destinationLng:destinationData.lng,
      date:selectedDateAndTime,
      seats:homeData.selectedSeat,
    }
    
    setLoading(true);
    try {
      const result = await requestsApi.createAlert(ride);
      setLoading(false) 
      if (!result.ok) {
        if (result.data) setErrorMessage(t(result.data.error));
        else {
          setErrorMessage(t('an unexpected error occurred'));
        }
        return setAlert(true);
      }
      dispatch(resetDestination());
      dispatch(resetPickUp());
      dispatch(resetData());
      clearSearch();
      setselectedDateAndTime("");
      setSuccess(true);
    } catch (error) {
      setErrorMessage(t('an unexpected error occurred'));
      setAlert(true);
    }
    dispatch(resetSearched())
    
  }

  async function handleSearch(){
    let ride = {
      pickupStreetNo:pickupData.streetNo,
      pickupStreet:pickupData.street,
      pickupDistrict:pickupData.district,
      pickupPostalCode:pickupData.postalCode,
      pickupCity:pickupData.city,
      pickupRegion:pickupData.region,
      pickupCountry:pickupData.country,
      pickupAddress:pickupData.address,
      pickupLat:pickupData.lat,
      pickupLng:pickupData.lng,
      destinationStreetNo:destinationData.streetNo,
      destinationStreet:destinationData.street,
      destinationDistrict:destinationData.district,
      destinationPostalCode:destinationData.postalCode,
      destinationCity:destinationData.city,
      destinationRegion:destinationData.region,
      destinationCountry:destinationData.country,
      destinationAddress:destinationData.address,
      destinationLat:destinationData.lat,
      destinationLng:destinationData.lng,
      date:selectedDateAndTime ? selectedDateAndTime : homeData.selectedDateAndTime,
      seats:homeData.selectedSeat,
    }
    setLoading(true);
    setIsSuggetion(false);
    setShowAlert(false);
    try {
      const result = await ridesApi.searchRide(ride);
      setLoading(false) 
      if (!result.ok) {
        if (result.data) setErrorMessage(t(result.data.error));
        else {
          setErrorMessage(t('an unexpected error occurred'));
        }
        return setAlert(true);
      }
      let allRides = result.data.rides;
      let allSuggestions = result.data.suggestions;
      
      setrides(allRides.length ? allRides : allSuggestions);
      setIsSuggetion(allRides.length ? false : true);
      setShowAlert(allRides.length ? false : true);
      
      setSearched(true);
    } catch (error) {
      setLoading(false) 
      setErrorMessage(t('an unexpected error occurred'));
      setAlert(true);
    }
  }
};

export default SearchScreen;

const styles = StyleSheet.create({
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

  emptyPage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: Sizes.fixPadding * 2.0,
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

  rideWrapper: {
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.rowAlignCenter,
    ...CommonStyles.shadow,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  locationIconWrapper: {
    width: 24.0,
    height: 24.0,
    borderRadius: 12.0,
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: {
    borderWidth:1.0,
    borderColor: Colors.grayColor,
    borderRadius: Sizes.fixPadding,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Sizes.fixPadding + 2.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
  },
  searchDataWrapper: {
    borderWidth:1.0,
    borderColor: Colors.grayColor,
    borderRadius: Sizes.fixPadding,
    margin: Sizes.fixPadding * 2.0,
    marginBottom: 0,
    paddingHorizontal: Sizes.fixPadding + 2.0,
  },
  locationBox: {
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.grayColor,
    borderRadius: Sizes.fixPadding,
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: Sizes.fixPadding,
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
  dialogStyle: {
    width: "80%",
    borderRadius: Sizes.fixPadding,
    padding: 0,
    overflow: "hidden",
    paddingTop:Sizes.fixPadding * 2.0,
    paddingBottom:Sizes.fixPadding * 3.0,
  },
  calenderDateWrapStyle: {
    alignItems: "center",
    justifyContent: "center",
    width: 28.0,
    height: 28.0,
    borderRadius: Sizes.fixPadding - 7.0,
    borderWidth: 1.5,
  },
  timeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    margin: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 4.0,
  },
  alertBox: {
    borderWidth:1.0,
    borderColor:Colors.grayColor,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding + 2.0,
    margin: Sizes.fixPadding * 2.0,
  },
  infoBox: {
    paddingVertical:Sizes.fixPadding * 2.0,
    alignContent:'center',
    justifyContent:'center',
  },
});
