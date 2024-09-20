import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList
} from "react-native";
import React, { useEffect, useState } from "react";
import MyStatusBar from "../../components/myStatusBar";
import { Colors, CommonStyles, Fonts, Sizes, screenHeight } from "../../constants/styles";
import Octicons from "react-native-vector-icons/Octicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import Header from "../../components/header";
import { Overlay } from "@rneui/themed";
import settings from "../../constants/settings";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useSelector, useDispatch } from "react-redux";
import { getRideInfo } from "../../store/rideInfo";
import DateTimePicker from "../../components/dateTimePicker";
import populizeAddress from "../../functions/populizeAddress";
import AlertMessage from "../../components/alertMessage";
import ridesApi from "../../api/rides";
import LoadingIndicator from "../../components/loadingIndicator";
import { myRideRemoved } from "../../store/myRides";
import { BottomSheet } from "@rneui/themed";
import { resetOpenPop, setOpenPop } from "../../store/home";
import carsApi from "../../api/cars";
import useApi from "../../hooks/useApi";
import { getPickUpData } from "../../store/pickup";
import { getDestinationData } from "../../store/destination";
import { Snackbar } from "react-native-paper";
import { setRideInfo } from "../../store/rideInfo";
import {Linking} from 'react-native'
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 


const hoursList = [...range(1, 12)];

const minutesList = [...range(0, 59)];

function range(start, end) {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
}


const MyRideDetailScreen = ({ navigation,route }) => {
  const newDate = Date.now();
  const [showCarSheet, setshowCarSheet] = useState(false);
  const [selectedCar, setselectedCar] = useState({});
  const [cars, setCars] = useState([]);
  const [showSeats, setShowSeats] = useState(false);
  const [showCancelDialog, setshowCancelDialog] = useState(false);
  const [pickupChanged, setPickupChanged] = useState(false);
  const [destinationChanged, setDestinationChanged] = useState(false);
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [alert, setAlert] = useState(false);
  const [showDialog, setshowDialog] = useState(false);
  const [selectedDateAndTime, setselectedDateAndTime] = useState("");
  const [selectedDate, setselectedDate] = useState(""); 
  const [showDateTimeSheet, setshowDateTimeSheet] = useState(false);
  const [defaultDate, setdefaultDate] = useState(new Date(newDate).getDate());
  const [selectedHour, setselectedHour] = useState(hoursList[(new Date(newDate).getHours()) - 1]);
  const [selectedMinute, setselectedMinute] = useState(minutesList[new Date(newDate).getMinutes()]);
  const [selectedAmPm, setselectedAmPm] = useState(selectedHour >= 12 ? 'PM' : 'AM');
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [editing, setEditing] = useState(false);
  const [showConfirmDialog, setshowConfirmDialog] = useState(false);
  const [showEditDialog, setshowEditDialog] = useState(false);
  const [showChangeCarDialog, setshowChangeCarDialog] = useState(false);
  const [price, setPrice] = useState("");
  const [bookedSeat, setBookedSeat] = useState();
  const [showNoOfSeatSheet, setshowNoOfSeatSheet] = useState(false);
  const [seats, setSeats] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [selectedSeat, setselectedSeat] = useState();
  const [loading, setLoading] = useState(true);
  const [snackMessage, setSnackMessage] = useState();
  const dispatch = useDispatch();
  const item = useSelector(getRideInfo());
  const getCarsApi = useApi(carsApi.getApprovedCars);
  const pickupData = useSelector(getPickUpData());
  const destinationData = useSelector(getDestinationData());
  const {t, i18n} = useTranslation();
  useEffect(()=>{
    getCarsApi.request();
  },[]);
  
  
  useEffect(()=>{
    if(showCarSheet && getCarsApi.loading) setLoading(true);
  },[showCarSheet]);
  
  useEffect(()=>{
    if(!getCarsApi.loading && getCarsApi.data.length > 0) {
      setCars(getCarsApi.data);
      handleCarSelect(item.car)
    };
    if(loading && !getCarsApi.loading){     
      setLoading(false)
    };
  },[getCarsApi.loading]);

  useEffect(()=>{

    if(item){

      if(seats.length) return;
      if(parseInt(item.remainingSeats) > 0) setSeats([...range(1, parseInt(item?.car.carSeats))]);
      let date = item?.datetime?.split('T')[0];
      let time = item?.datetime?.split('T')[1].split('.')[0];
      let hour = parseInt(time.split(':')[0]);
      let minute = parseInt(time.split(':')[1]);
      let newHour = hour > 12 ? hour - 12 : hour; 
      newHour = newHour == 0 ? 12 : newHour;      
      let ampm = hour >= 12 ? 'PM' : 'AM';
      setPickupAddress(item?.pickupAddress)
      setDestinationAddress(item?.destinationAddress)
      setselectedDateAndTime(`${date} ${newHour}:${minute} ${ampm}`)
      setselectedSeat(item?.seats);
      setPrice(item?.price);
      setBookedSeat(parseInt(item?.seats)-parseInt(item?.remainingSeats));
      setAvailableSeats([...range(1, parseInt(item?.seats))]);
      let allPassengers = [];
      if(Array.isArray(item?.ride_requests)){
        item?.ride_requests?.map((req)=>{
          for(let i = 0; i < parseInt(req.seats); i++){
            if(req.requestStatus == "Accepted") allPassengers.push(req.user);
          }
        });
        setPassengers(allPassengers);
      }
    }
  },[item])

  useEffect(() => {
    if (route.params?.address) {
      if (route.params.addressFor === "pickup") {
        setPickupAddress(route.params.address);
        setPickupChanged(true);
      } else {
        setDestinationAddress(route.params.address);
        setDestinationChanged(true);
      }
      setshowDialog(true);
    }
  }, [route.params?.address]);


  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={t("ride details")} navigation={navigation} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {riderDetail()}
          {divider()}
          {passengerDetail()}
          {divider()}
          {seatsInfo()}
          {divider()}
          {vehicleInfo()}
        </ScrollView>
      </View>
      {footer()}
      {editLocationDialog()}
      {cancelRideDialog()}
      {alertMessage()}
      {dateTimePicker()}
      {loadingIndicator()}
      {bookedSeatsDialog()}
      {cardSheet()}
      {snackBarInfo()}
      {noOfSeatSheet()}
      {confirmRideDialog()}
      {editRideDialog()}
      {changeCarDialog()}
    </View>
  );

  function loadingIndicator(){
    return <LoadingIndicator visible={loading}/>
  }

  function cancelRideDialog() {
    return (
      <Overlay
        isVisible={showCancelDialog}
        onBackdropPress={() => setshowCancelDialog(false)}
        overlayStyle={styles.dialogStyle}
      >
        <View
          style={{
            marginVertical: Sizes.fixPadding * 3.5,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          <Octicons
            name="question"
            color={Colors.secondaryColor}
            size={50}
            style={{paddingBottom:Sizes.fixPadding * 3.0, alignSelf:'center'}}
          />
          <Text style={{ ...Fonts.blackColor16SemiBold, textAlign: "center" }}>
            {t('cancel ride')}
          </Text>

          <Text style={{ 
              ...Fonts.blackColor15Medium, 
              marginTop:Sizes.fixPadding * 3.0,
              textAlign: "center" 
            }}>
            {t('are you sure you want to cancel this ride')}
          </Text>

          <View style={styles.btnContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setshowCancelDialog(false);
                
              }}
              style={{ ...CommonStyles.button, 
                backgroundColor:Colors.secondaryColor, 
                paddingHorizontal: Sizes.fixPadding * 3.0 
              }}
            >
              <Text style={{ ...Fonts.whiteColor15Medium }}>
                {t('no')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleCancel}
              style={{ ...CommonStyles.button, backgroundColor: Colors.blackColor, paddingHorizontal: Sizes.fixPadding * 3.0 }}
              >
              <Text style={{ ...Fonts.whiteColor15Medium }}>
                {t('yes')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
      </Overlay>
    );
  }

  function bookedSeatsDialog() {
    const renderItem = ({ item }) => (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding,
        }}
      >
        <View style={{ flexDirection:'row'}}>
          <Text style={{ ...Fonts.blackColor15SemiBold}}>
            {t('name')}:
          </Text>
          <Text style={{ paddingLeft:Sizes.fixPadding,...Fonts.blackColor14Medium}}>
            {item?.user?.name}
          </Text>
        </View>
        <View style={{ flexDirection:'row'}}>
          <Text style={{ ...Fonts.blackColor15SemiBold}}>
          {t('telephone')}:
          </Text>
          <View style={{flexDirection:'row',flex:1, justifyContent:'space-between'}}>
            <Text style={{ paddingLeft:Sizes.fixPadding,...Fonts.blackColor14Medium}}>
              {item?.user?.fullPhone}
            </Text>
            <Text 
              style={{ ...Fonts.whiteColor13Medium, alignItems:'center', backgroundColor:Colors.secondaryColor, paddingHorizontal:Sizes.fixPadding/5, borderRadius:Sizes.fixPadding/2 }}
              onPress={() => {
                Linking.openURL(`tel:${item?.user?.fullPhone}`)
              }}
            >
              {t('call now')}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection:'row'}}>
          <Text style={{ ...Fonts.blackColor15SemiBold}}>
          {t('seats')}:
          </Text>
          <Text style={{ paddingLeft:Sizes.fixPadding,...Fonts.blackColor14Medium}}>
            {item?.seats}
          </Text>
        </View>
        <View style={{ flexDirection:'row'}}>
          <Text style={{ ...Fonts.blackColor15SemiBold}}>
          {t('payment mode')}:
          </Text>
          <Text style={{ paddingLeft:Sizes.fixPadding,...Fonts.blackColor14Medium}}>
          {item?.paymentMode ? item?.paymentMode : t('not confirmed')}
          </Text>
        </View>
        <View style={{ flexDirection:'row'}}>
          <Text style={{ ...Fonts.blackColor15SemiBold}}>
          {t('status')}:
          </Text>
          <Text style={{ paddingLeft:Sizes.fixPadding,...Fonts.blackColor14Medium}}>
            {item?.paymentMode == "Momo" ? t('paid') : t('not paid')}
          </Text>
        </View>
      </View>
    );
    return (
      <Overlay
        isVisible={showSeats}
        onBackdropPress={() => setShowSeats(false)}
        overlayStyle={styles.dialogStyle}
      >
        <View
          style={{
            margin: Sizes.fixPadding,
          }}
        >
          <Text style={{ ...Fonts.blackColor16Bold, textAlign: "center", paddingBottom:Sizes.fixPadding }}>
            {t('ride passengers list')}
          </Text>
          <FlatList
            data={item.ride_requests}
            keyExtractor={(item,index) => `${index}`}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Overlay>
    );
  }

  function passengerDetail() {
    const renderItem = ({ item, index }) => (
      <View
        style={{
          alignItems: "center",
          maxWidth: 72.0,
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
      >
        <Image
          source={
            index <= passengers.length - 1
              ? (passengers[index].photo ? {uri:settings.host+'images/'+passengers[index].photo} : require("../../assets/images/avatar.png"))
              : require("../../assets/images/icons/empty.png")
          }
          style={{ width: 50.0, height: 50.0, borderRadius: 25.0 }}
        />
        <Text
          numberOfLines={2}
          style={{
            ...Fonts.blackColor14Medium,
            textAlign: "center",
            marginTop: Sizes.fixPadding,
          }}
        >
          {index <= passengers.length - 1
            ? passengers[index].name
            : t('empty seat')}
        </Text>
      </View>
    );
    return (
      <View style={styles.passengerInfoWrapper}>
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 2.0,
            marginBottom: Sizes.fixPadding * 1.5,
          }}
        >
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={{ ...Fonts.blackColor17SemiBold }}>{t('passengers')}</Text>
            <Text
              onPress={() => {
                setShowSeats(true);
              }}
              style={{
                ...Fonts.blueColor14SemiBold,
              }}
            >
              {t('show list')}
            </Text>
          </View>
          <Text
            style={{
              ...Fonts.grayColor16Medium,
              marginTop: Sizes.fixPadding - 7.0,
            }}
          >
            {i18n.language == 'kiny' ? `${t('seats booked')} ${parseInt(item.seats) - parseInt(item.remainingSeats)}` : `${parseInt(item.seats) - parseInt(item.remainingSeats)} ${t('seats booked')}`}
          </Text>
        </View>
        <View>
          <FlatList
            data={availableSeats}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => `${item}`}
            renderItem={renderItem}
          />
        </View>
      </View>
    );
  }

  function footer() {
    return (
      item?.status === 'Waiting' ? 
      (route?.params?.action ? 
        <View style={styles.footer}><TouchableOpacity
          activeOpacity={0.8}
          onPress={handleRide}
          style={{
            flex: 1,
            ...CommonStyles.button,
            marginHorizontal: Sizes.fixPadding,
          }}
        >
        <Text numberOfLines={1} style={{ ...Fonts.whiteColor18Bold }}>
          {t(route?.params?.action.toLowerCase())} {t('ride')}
        </Text>
        </TouchableOpacity></View>
      : 
      (editing ? 
        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.pop();
            }}
            style={styles.cancelRideButton}
          >
            <Text numberOfLines={1} style={{ ...Fonts.blackColor16SemiBold }}>
              {t('close')}
            </Text>
          </TouchableOpacity>
        </View> : 
        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setshowCancelDialog(true);
            }}
            style={styles.cancelRideButton}
          >
            <Text numberOfLines={1} style={{ ...Fonts.blackColor16SemiBold }}>
              {t('cancel ride')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setEditing(true);
            }}
            style={{
              flex: 1,
              ...CommonStyles.button,
              marginHorizontal: Sizes.fixPadding,
            }}
          >
            <Text numberOfLines={1} style={{ ...Fonts.whiteColor16SemiBold }}>
            {t('edit ride')}
            </Text>
          </TouchableOpacity>
        </View>
      )) : (
        item?.status === 'In Progress' ? 
          (route?.params?.action ? 
            <View style={styles.footer}><TouchableOpacity
              activeOpacity={0.8}
              onPress={handleRide}
              style={{
                flex: 1,
                ...CommonStyles.button,
                marginHorizontal: Sizes.fixPadding,
              }}
            >
            <Text numberOfLines={1} style={{ ...Fonts.whiteColor18Bold }}>
            {t(route?.params?.action.toLowerCase())} {t('ride')}
            </Text>
            </TouchableOpacity></View>
          : null
          ) 
        : null)
    );
  }

  function vehicleInfo() {
    return (
      <View style={styles.vehicleInfoWrapper}>
        <View>
          <Text style={{ ...Fonts.blackColor17SemiBold }}>{t('vehicle info')}</Text>
          <View style={{ marginVertical: Sizes.fixPadding }}>
            <Text style={{ ...Fonts.blackColor14SemiBold }}>{t('car model')}</Text>
            <Text
              style={{
                ...Fonts.blackColor14Medium,
                marginTop: Sizes.fixPadding - 7.0,
              }}
            >
              {item?.car?.carModel} 
            </Text>
          </View>
          <View style={{ marginBottom: Sizes.fixPadding }}>
            <Text style={{ ...Fonts.blackColor14SemiBold }}>{t('color')}</Text>
            <Text
              style={{
                ...Fonts.blackColor14Medium,
                marginTop: Sizes.fixPadding - 7.0,
              }}
            >
              {item?.car?.carColor}
            </Text>
          </View>
          <View>
            <Text style={{ ...Fonts.blackColor14SemiBold }}>{t('plate number')}</Text>
            <Text
              style={{
                ...Fonts.blackColor14Medium,
                marginTop: Sizes.fixPadding - 7.0,
              }}
            >
              {item?.car?.plateNumber}
            </Text>
          </View>
        </View>
        <View style={{flex:1, alignItems:'flex-end'}}>
          {(editing && item?.seats == item?.remainingSeats) ? <TouchableOpacity
              onPress={() => {
                setshowChangeCarDialog(true)
              }}
            >
            <FontAwesome
              name="edit"
              color={Colors.blackColor}
              size={20}
            />
          </TouchableOpacity> : null}
          <Image
            source={{uri:settings.host+'cars/'+item?.car?.carImage}}
            style={{
              width:200,
              height:200,
              resizeMode:'contain',
            }}
          />
        </View>
        
      </View>
    );
  }

  function divider() {
    return (
      <View style={styles.verticalSolidLine}></View>
    )
  }

  function riderDetail() {
    return (
      <View
        style={{
          backgroundColor: Colors.whiteColor,
          paddingVertical: Sizes.fixPadding * 2.0,
        }}
      >
        <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
          <View style={{ ...CommonStyles.rowAlignCenter }}>
            <Text
              numberOfLines={1}
              style={{ flex: 1, ...Fonts.blackColor17SemiBold }}
            >
              {t('time hour')}
            </Text>
            {(editing && item?.seats == item?.remainingSeats) ? <TouchableOpacity
              onPress={() => {
                dispatch(setOpenPop());
                setshowDialog(true);
              }}
            >
              <FontAwesome
                name="edit"
                color={Colors.blackColor}
                size={20}
              />
            </TouchableOpacity> : null}
          </View>
        </View>
        <View
          style={{
            marginTop: Sizes.fixPadding + 5.0,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          <View style={{ ...CommonStyles.rowAlignCenter }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor14SemiBold }}>
            {t('from')}:
            </Text>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                ...Fonts.blackColor14Medium,
                marginHorizontal: Sizes.fixPadding,
              }}
            >
              {populizeAddress(item,true)}
            </Text>
          </View>

          

          <View style={{ ...CommonStyles.rowAlignCenter }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor14SemiBold }}>
            {t('to')}:
            </Text>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                ...Fonts.blackColor14Medium,
                marginHorizontal: Sizes.fixPadding,
              }}
            >
              {populizeAddress(item)}
            </Text>
          </View>

          <View style={{ ...CommonStyles.rowAlignCenter }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor14SemiBold }}>
            {t('date')}:
            </Text>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                ...Fonts.blackColor14Medium,
                marginHorizontal: Sizes.fixPadding,
              }}
            >
              {new Date(item?.datetime?.split('T')[0]).toDateString()}
            </Text>
          </View>

          <View style={{ ...CommonStyles.rowAlignCenter }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor14SemiBold }}>
            {t('time')}:
            </Text>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                ...Fonts.blackColor14Medium,
                marginHorizontal: Sizes.fixPadding,
              }}
            >
              {(item.datetime?.split('T')[1]).split(':')[0]}:{(item.datetime?.split('T')[1]).split(':')[1]}
              {` - `}
              {(item.endtime?.split('T')[1]).split(':')[0]}:{(item.endtime?.split('T')[1]).split(':')[1]}
            </Text>
          </View>
          <View style={{ ...CommonStyles.rowAlignCenter }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor14SemiBold }}>
            {t('distance')}:
            </Text>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                ...Fonts.blackColor14Medium,
                marginHorizontal: Sizes.fixPadding,
              }}
            >
              {item?.distanceText} {t('in')} {item?.durationText}
            </Text>
          </View>
         

        </View>
      </View>
    );
  }

  function seatsInfo() {
    return (
      <View
        style={{
          backgroundColor: Colors.whiteColor,
          paddingVertical: Sizes.fixPadding * 2.0,
        }}
      >
        <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
          <View style={{ ...CommonStyles.rowAlignCenter }}>
            <Text
              numberOfLines={1}
              style={{ flex: 1, ...Fonts.blackColor17SemiBold }}
            >
              {t('seats price')}
            </Text>
            {editing ? <TouchableOpacity
              onPress={() => {
                if(item?.seats != item?.remainingSeats) return setshowNoOfSeatSheet(true)
                setshowEditDialog(true);
              }}
            >
              <FontAwesome
                name="edit"
                color={Colors.blackColor}
                size={20}
              />
            </TouchableOpacity> : null}
          </View>
        </View>
        <View
          style={{
            marginTop: Sizes.fixPadding + 5.0,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          <View style={{ ...CommonStyles.rowAlignCenter }}>
            <View style={{ ...CommonStyles.rowAlignCenter, flex:1 }}>
              <Text numberOfLines={1} style={{ ...Fonts.blackColor14SemiBold }}>
                {t('booked seats')}:
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  flex: 1,
                  ...Fonts.blackColor14Medium,
                  marginHorizontal: Sizes.fixPadding,
                }}
              >
                {parseInt(item.seats) - parseInt(item.remainingSeats)}
              </Text>
            </View>
            <Text
              onPress={() => {
                navigation.push("RideTracking");
                // setShowSeats(true);
              }}
              style={{
                ...Fonts.blueColor14SemiBold,
              }}
            >
              {t('map view')}
            </Text>
          </View>

          

          <View style={{ ...CommonStyles.rowAlignCenter }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor14SemiBold }}>
              {t('available seats')}:
            </Text>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                ...Fonts.blackColor14Medium,
                marginHorizontal: Sizes.fixPadding,
              }}
            >
              {item.seats}
            </Text>
          </View>

          <View style={{ ...CommonStyles.rowAlignCenter }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor14SemiBold }}>
              {t('price per seat')}:
            </Text>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                ...Fonts.blackColor14Medium,
                marginHorizontal: Sizes.fixPadding,
              }}
            >
              {item.price}
            </Text>
          </View>

          <View style={{ ...CommonStyles.rowAlignCenter }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor14SemiBold }}>
              {t('total price')}:
            </Text>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                ...Fonts.blackColor14Medium,
                marginHorizontal: Sizes.fixPadding,
              }}
            >
              Rwf {parseInt(item.seats)*item.price}
            </Text>
          </View>

         

        </View>
      </View>
    );
  }

  function alertMessage() {
    return <AlertMessage 
      visible={alert} 
      errorMessage={errorMessage} 
      setVisible={setAlert}
    />
  }

  function editLocationDialog() {
    return (
      <Overlay
        isVisible={showDialog}
        onBackdropPress={handleClosePop}
        overlayStyle={styles.dialogStyles}
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
            {t('edit ride location')}
          </Text>
        </View>
        <View
          style={styles.searchDataWrapper}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setshowDialog(false);
              navigation.push("PickLocation", { addressFor: "pickup", screen: "MyRideDetail" });
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
              navigation.push("PickLocation", { addressFor: "destination", screen: "MyRideDetail" });
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
              handleUpdate();
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
            {t('update')}
          </Text>
        </TouchableOpacity>
      </Overlay>
    );
  }

  function snackBarInfo() {
    return (
      <Snackbar
        style={{ backgroundColor: Colors.blackColor }}
        elevation={0}
        visible={showSnackBar}
        duration={1000}
        onDismiss={() => setShowSnackBar(false)}
      >
        <Text style={{ ...Fonts.whiteColor14Medium }}>{snackMessage}</Text>
      </Snackbar>
    );
  }

  function noOfSeatSheet() {
    return (
      <BottomSheet
        scrollViewProps={{ scrollEnabled: false }}
        isVisible={showNoOfSeatSheet}
        onBackdropPress={() => {
          setshowNoOfSeatSheet(false);
        }}
      >
        <View style={{ ...styles.sheetStyle }}>
          <Text style={styles.sheetHeader}>{t('number of seats')}</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0 }}
          >
            <View>
              {seats.map((seat, index) => (
                <View key={`${index}`}>
                  {seat < bookedSeat ? null : <Text
                    onPress={() => {
                      setselectedSeat(seat);
                      setshowNoOfSeatSheet(false);
                      if(item.seats !== item.remainingSeats) setshowConfirmDialog(true);
                    }}
                    style={{
                      ...(selectedSeat == seat
                        ? { ...Fonts.secondaryColor16SemiBold }
                        : { ...Fonts.blackColor16SemiBold }),
                      textAlign: "center",
                    }}
                  >
                    {i18n.language !== 'kiny' ? seat+' '+t(seat > 1 ? 'seats' : 'seat') : t(seat > 1 ? 'seats' : 'seat')+' '+seat }
                  </Text>}
                  {(index == seats.length - 1 || seat < bookedSeat)  ? null : (
                    <View
                      style={{
                        height: 1.0,
                        backgroundColor: Colors.lightGrayColor,
                        marginVertical: Sizes.fixPadding * 2.0,
                      }}
                    />
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </BottomSheet>
    );
  }

  function confirmRideDialog() {
    return (
      <Overlay
        isVisible={showConfirmDialog}
        onBackdropPress={() => {setshowConfirmDialog(false); setselectedSeat(item.seats)}}
        overlayStyle={styles.dialogStyle}
      >
        <View
          style={{
            marginVertical: Sizes.fixPadding * 3.5,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          <MaterialIcons
            name="info-outline"
            color={Colors.blackColor}
            size={50}
            style={{paddingBottom:Sizes.fixPadding * 3.0, alignSelf:'center'}}
          />
          <Text style={{ ...Fonts.blackColor16SemiBold, textAlign: "center" }}>
            {t('you are about to change available seats of ride to')} {i18n.language !== 'kiny' ? selectedSeat+' '+t(selectedSeat > 1 ? 'seats' : 'seat') : t(selectedSeat > 1 ? 'seats' : 'seat')+' '+selectedSeat } 
          </Text>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleUpdate}
              style={{ ...CommonStyles.button, paddingHorizontal:Sizes.fixPadding * 2.0 }}
              >
              <Text style={{ ...Fonts.whiteColor15Medium }}>
                {t('continue')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
      </Overlay>
    );
  }

  function editRideDialog() {
    return (
      <Overlay
        isVisible={showEditDialog}
        onBackdropPress={() => {setshowEditDialog(false); setPrice(item.price); setselectedSeat(item.seats)}}
        overlayStyle={styles.dialogStyles}
      >
        <TouchableOpacity
          onPress={() => {setshowEditDialog(false); setPrice(item.price); setselectedSeat(item.seats)}}
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
            {t('edit seats and price')}
          </Text>
        </View>
        <View style={{ margin: Sizes.fixPadding * 2.0, marginBottom:0 }}>
          <View style={{flexDirection:'row'}}>
            <MaterialIcons
              name="event-seat"
              color={Colors.blackColor}
              size={20}
            />
            <Text
              style={{
                ...Fonts.blackColor15SemiBold,
                marginBottom: Sizes.fixPadding,
                paddingHorizontal:Sizes.fixPadding
              }}
            >
              {t('available seats')}
          </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setshowNoOfSeatSheet(true);
            }}
            style={{ ...styles.valueBox, ...CommonStyles.rowAlignCenter }}
          >
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                ...(selectedSeat
                  ? { ...Fonts.blackColor15Medium }
                  : { ...Fonts.grayColor15Medium }),
              }}
            >
              {selectedSeat ? 
              
              (i18n.language !== 'kiny' ? selectedSeat+' '+t(selectedSeat > 1 ? 'seats' : 'seat') : t(selectedSeat > 1 ? 'seats' : 'seat')+' '+selectedSeat)
              
              : t('pick') + t('available seats')}
            </Text>
            <Ionicons name="chevron-down" color={Colors.grayColor} size={20.5} />
          </TouchableOpacity>
        </View>
        <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <View style={{flexDirection:'row'}}>
          <Text
            style={{
              ...Fonts.blackColor15SemiBold,
              marginBottom: Sizes.fixPadding,
            }}
          >
            {t('price per seat')}
          </Text>
        </View>
        
        <View style={styles.valueBox}>
          <TextInput
            placeholder={t('enter')+t('price per seat')}
            style={{
              ...Fonts.blackColor15Medium,
              
            }}
            placeholderTextColor={Colors.grayColor}
            selectionColor={Colors.primaryColor}
            cursorColor={Colors.primaryColor}
            keyboardType="numeric"
            onChangeText={setPrice}
            defaultValue={price}
          />
        </View>
      </View>

        <View style={{ ...CommonStyles.rowAlignCenter, ...styles.btnContainer }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setshowEditDialog(false); 
              setPrice(item.price); 
              setselectedSeat(item.seats)
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
            onPress={handleUpdate}
            style={{...styles.dialogBtn, backgroundColor: Colors.secondaryColor}}
          >
            <Text style={{ ...Fonts.whiteColor16SemiBold }}>{t('update')}</Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    );
  }

  function changeCarDialog() {
    return (
      <Overlay
        isVisible={showChangeCarDialog}
        onBackdropPress={() => {setshowChangeCarDialog(false); handleCarSelect(item.car);}}
        overlayStyle={styles.dialogStyles}
      >
        <TouchableOpacity
          onPress={() => {setshowChangeCarDialog(false); handleCarSelect(item.car);}}
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
            {t('change ride car')}
          </Text>
        </View>
        <View style={{ margin: Sizes.fixPadding * 2.0, marginBottom:0 }}>
          <View style={{flexDirection:'row'}}>
            <Ionicons
              name="car"
              color={Colors.blackColor}
              size={20}
            />
            <Text
              style={{
                ...Fonts.blackColor15SemiBold,
                marginBottom: Sizes.fixPadding,
                paddingHorizontal:Sizes.fixPadding
              }}
            >
              {t('car model')}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setshowCarSheet(true);
            }}
            style={{ ...styles.valueBox, ...CommonStyles.rowAlignCenter }}
          >
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                ...(selectedCar
                  ? { ...Fonts.blackColor15Medium }
                  : { ...Fonts.grayColor15Medium }),
              }}
            >
              {selectedCar ? selectedCar.carModel : t('pick')+t('car model')}
            </Text>
            <Ionicons name="chevron-down" color={Colors.grayColor} size={20.5} />
          </TouchableOpacity>
        </View>
        <View style={{ margin: Sizes.fixPadding * 2.0, marginBottom:0 }}>
          <View style={{flexDirection:'row'}}>
            <MaterialIcons
              name="event-seat"
              color={Colors.blackColor}
              size={20}
            />
            <Text
              style={{
                ...Fonts.blackColor15SemiBold,
                marginBottom: Sizes.fixPadding,
                paddingHorizontal:Sizes.fixPadding
              }}
            >
              {t('available seats')}
          </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setshowNoOfSeatSheet(true);
            }}
            style={{ ...styles.valueBox, ...CommonStyles.rowAlignCenter }}
          >
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                ...(selectedSeat
                  ? { ...Fonts.blackColor15Medium }
                  : { ...Fonts.grayColor15Medium }),
              }}
            >
              {selectedSeat ? 
              
              (i18n.language !== 'kiny' ? selectedSeat+' '+t(selectedSeat > 1 ? 'seats' : 'seat') : t(selectedSeat > 1 ? 'seats' : 'seat')+' '+selectedSeat)
              
              : t('pick') + t('available seats')}            
            </Text>
            <Ionicons name="chevron-down" color={Colors.grayColor} size={20.5} />
          </TouchableOpacity>
        </View>

        <View style={{ ...CommonStyles.rowAlignCenter, ...styles.btnContainer }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setshowChangeCarDialog(false); 
              handleCarSelect(item.car);
            }}
            style={{
              ...styles.dialogBtn,
              paddingHorizontal: Sizes.fixPadding * 2.0 
            }}
          >
            <Text style={{ ...Fonts.blackColor16SemiBold }}>Cancel</Text>
          </TouchableOpacity>
          <View style={{ backgroundColor: Colors.whiteColor, width: 2.0 }} />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleUpdate}
            style={{...styles.dialogBtn, backgroundColor: Colors.secondaryColor}}
          >
            <Text style={{ ...Fonts.whiteColor16SemiBold }}>{t('update')}</Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    );
  }

  function handleClosePop(){
    dispatch(resetOpenPop());
    setshowDialog(false);
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
        withHours={true}
      />
    );
  }

  function cardSheet() {
    return (
      <BottomSheet
        scrollViewProps={{ scrollEnabled: false }}
        isVisible={showCarSheet}
        onBackdropPress={() => {
          setshowCarSheet(false);
        }}
      >
        <View style={{ ...styles.sheetStyle }}>
          <Text style={styles.sheetHeader}>{t('select your car')}</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 3.0 }}
          >
            <View>
              {cars.map((item, index) => (
                <View key={`${index}`}>
                  <Text
                    onPress={()=>handleCarSelect(item)}
                    style={{
                      ...Fonts.blackColor15SemiBold,
                      textAlign: "center",
                    }}
                  >
                    {item.carModel}
                  </Text>
                  {index == cars.length - 1 ? null : (
                    <View
                      style={{
                        backgroundColor: Colors.lightGrayColor,
                        height: 1.0,
                        marginVertical: Sizes.fixPadding * 2.0,
                      }}
                    />
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </BottomSheet>
    );
  }

  function handleCarSelect(car){
    setselectedCar(car)
    setSeats([...range(1, parseInt(car.carSeats)-1)]);
    setshowCarSheet(false);
  }

  async function handleCancel(){
    if(!item?.id) return;
    setAlert(false);
    setLoading(true);
    setshowCancelDialog(false);
    const result = await ridesApi.deleteRide(item.id);
    setLoading(false) 
    if (!result.ok) {
      setAlert(true);
      return setErrorMessage(result.data.error ? t(result.data.error) : t('canceling ride failed try again'))
    }
    dispatch(myRideRemoved({id:item.id}));
    navigation.navigate({name: "Rides",params: {id:item.id},merge: true});
  }

  async function handleUpdate(){
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
      datetime:selectedDateAndTime,
      seats:selectedSeat,
      price,
      pickupChanged,
      destinationChanged,
      car_id:selectedCar.id
    }
    setLoading(true);
    setAlert(false);
    setshowEditDialog(false);
    setshowConfirmDialog(false);
    setshowChangeCarDialog(false)
    setSnackMessage(t('ride updated')+'!');
    try {
      const result = await ridesApi.updateRide(item.id, ride);
      setLoading(false) 
      if (!result.ok) {
        if (result.data) setErrorMessage(t(result.data.error));
        else {
          setErrorMessage(t('an unexpected error occurred'));
        }
        return setAlert(true);
      }
      if(result.data?.item) dispatch(setRideInfo(result.data?.item));
      if (result.data?.message){
        setErrorMessage(t(result.data.message));
        return setAlert(true);
      }
      else setShowSnackBar(true);
      setEditing(false)
    } catch (error) {
      setLoading(false) 
      setErrorMessage(t('an unexpected error occurred'));
      setAlert(true);
    }
  }

  async function handleRide(){
    setLoading(true);
    setAlert(false);
    setSnackMessage(`Ride ${route.params?.action}ed!`)
    try {
      const result = await ridesApi.startStopRide(item.id);
      setLoading(false) 
      if (!result.ok) {
        console.log(result)
        if (result.data) setErrorMessage(t(result.data.error));
        else {
          setErrorMessage(t('an unexpected error occurred'));
        }
        return setAlert(true);
      }
      if(result.data?.item) dispatch(setRideInfo(result.data?.item));
      if (result.data?.message){
        setErrorMessage(t(result.data.message));
        return setAlert(true);
      }
      navigation.navigate({
        name: "Rides",
        params: {
          action: route.params.action,
        },
        merge: true,
      });
    } catch (error) {
      setLoading(false) 
      setErrorMessage(t('an unexpected error occurred'));
      setAlert(true);
    }
  }
};

export default MyRideDetailScreen;

const styles = StyleSheet.create({
  alertTextStyle: {
    ...Fonts.whiteColor14Medium,
    backgroundColor: Colors.blackColor,
    position: "absolute",
    bottom: 10.0,
    alignSelf: "center",
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding - 5.0,
    borderRadius: Sizes.fixPadding - 5.0,
    overflow: "hidden",
    zIndex: 100.0,
  },
  ratingAndReviewDivider: {
    width: 1.0,
    backgroundColor: Colors.grayColor,
    height: "80%",
    marginHorizontal: Sizes.fixPadding - 5.0,
  },
  locationIconWrapper: {
    width: 24.0,
    height: 24.0,
    borderRadius: 12.0,
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  verticalSolidLine: {
    flex:1,
    borderStyle: "solid",
    borderColor: Colors.blackColor,
    borderWidth: 0.8,
    marginHorizontal: Sizes.fixPadding + 1.0,
  },
  verticalDashedLine: {
    height: 15.0,
    width: 1.0,
    borderStyle: "dashed",
    borderColor: Colors.grayColor,
    borderWidth: 0.8,
    marginLeft: Sizes.fixPadding + 1.0,
  },
  verticalDivider: {
    height: "100%",
    backgroundColor: Colors.lightGrayColor,
    width: 1.0,
    marginHorizontal: Sizes.fixPadding,
  },
  passengerInfoWrapper: {
    backgroundColor: Colors.whiteColor,
    marginVertical: Sizes.fixPadding * 2.0,
    paddingTop: Sizes.fixPadding + 5.0,
    paddingBottom: Sizes.fixPadding * 2.0,
  },
  vehicleInfoWrapper: {
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    marginVertical: Sizes.fixPadding * 2.0,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  footer: {
    backgroundColor: Colors.whiteColor,
    paddingVertical: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding,
    ...CommonStyles.rowAlignCenter,
  },
  cancelRideButton: {
    flex: 1,
    ...CommonStyles.button,
    backgroundColor: Colors.whiteColor,
    marginHorizontal: Sizes.fixPadding,
  },
  dialogStyle: {
    width: "90%",
    borderRadius: Sizes.fixPadding,
    padding: 0,
    overflow: "hidden",
  },
  dialogStyles: {
    width: "80%",
    borderRadius: Sizes.fixPadding,
    padding: 0,
    overflow: "hidden",
    paddingTop:Sizes.fixPadding * 2.0,
    paddingBottom:Sizes.fixPadding * 3.0,
  },
  dialogButton: {
    flex: 1,
    backgroundColor: Colors.secondaryColor,
    alignItems: "center",
    justifyContent: "center",
    padding: Sizes.fixPadding + 2.0,
  },
  btnContainer:{
    flexDirection:'row',
    justifyContent:'center',
    marginTop: Sizes.fixPadding * 2.0,
  },
  dialogBtn: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius:Sizes.fixPadding,
    paddingVertical:Sizes.fixPadding/2.0,
    width:120
  },
  actionButton: {
    ...CommonStyles.button,
    backgroundColor: Colors.greenColor,
    marginHorizontal: Sizes.fixPadding,
    color:Colors.whiteColor,
    width:'60%',
    alignSelf:'center'
  },
  valueBox: {
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding,
    borderWidth: 1.0,
    borderColor:Colors.blackColor,
    borderRadius: Sizes.fixPadding,
  },
  mobileNumberWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding - 7.0,
    borderWidth: 1.0,
    borderColor:Colors.blackColor
  },
  paymentOption:{
    flex:1,
    padding:Sizes.fixPadding * 1.3,
    borderWidth: 1.0,
    borderColor:Colors.blackColor,
    borderRadius: Sizes.fixPadding,
    textAlign:'center'
  },
  right:{
    borderTopLeftRadius:0,
    borderBottomLeftRadius:0
  },
  left:{
    borderTopRightRadius:0,
    borderBottomRightRadius:0
  },
  active:{
    color:Colors.whiteColor,
    backgroundColor:Colors.blackColor
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
    marginBottom: Sizes.fixPadding * 2.0,
  },
});
