import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Platform,
  TouchableOpacity,
  Image,
  FlatList
} from "react-native";
import React, { useMemo, useState, useEffect } from "react";
import {
  Colors,
  Fonts,
  Sizes,
  CommonStyles,
  screenHeight,
} from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import Header from "../../components/header";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Overlay } from "@rneui/themed";
import { BottomSheet } from "@rneui/themed";
import RadioGroup from 'react-native-radio-buttons-group';
import DateTimePicker from "../../components/dateTimePicker";
import { useSelector, useDispatch } from 'react-redux';
import { getUserData, getIsSearched, resetSearched } from "../../store/home";
import LoadingIndicator from "../../components/loadingIndicator";
import useApi from "../../hooks/useApi";
import carsApi from "../../api/cars";
import ridesApi from "../../api/rides";
import AlertMessage from "../../components/alertMessage";
import { getPickUpData } from "../../store/pickup";
import { getDestinationData } from "../../store/destination";
import { myRideAdded } from "../../store/myRides";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const hoursList = [...range(1, 12)];

const minutesList = [...range(0, 59)];

function range(start, end) {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
}

const OfferRideScreen = ({ navigation, route }) => {
  const [showCarSheet, setshowCarSheet] = useState(false);
  const [selectedCar, setselectedCar] = useState({});
  const [showNoOfSeatSheet, setshowNoOfSeatSheet] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedSeat, setselectedSeat] = useState();
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [selectedDateAndTime, setselectedDateAndTime] = useState("");
  const [price, setPrice] = useState("");
  const [seats, setSeats] = useState([]);
  const [selectedDate, setselectedDate] = useState("");
  const [showDateTimeSheet, setshowDateTimeSheet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [defaultDate, setdefaultDate] = useState(new Date().getDate());
  const {t, i18n} = useTranslation();

  const [selectedHour, setselectedHour] = useState(
    hoursList[new Date().getHours() - 1]
  );
  const [selectedMinute, setselectedMinute] = useState(
    minutesList[new Date().getMinutes()]
  );
  const [selectedAmPm, setselectedAmPm] = useState(
    new Date().toLocaleTimeString().slice(-2)
  );
  const [errorMessage, setErrorMessage] = useState();
  const [errorAlert, setErrorAlert] = useState(false);
  const [selectedId, setSelectedId] = useState('1');
  const [days, setDays] = useState(['Mon','Tue','Wed','Thu','Fri','Sat','Sun']);
  const [title, setTitle] =  useState('');
  const [selected, setSelected] = useState([]);
  const [showConfirmDialog, setshowConfirmDialog] = useState(false);
  const getCarsApi = useApi(carsApi.getApprovedCars);
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

const dispatch = useDispatch();
const homeData = useSelector(getUserData());
const pickupData = useSelector(getPickUpData());
const destinationData = useSelector(getDestinationData());
const isSearched = useSelector(getIsSearched());
const [isVisible, setIsVisible] = useState(false);
const [formErrors, setFormErrors] = useState([]);
useEffect(()=>{
  getCarsApi.request();
},[]);


useEffect(()=>{
  if(showCarSheet && getCarsApi.loading) setLoading(true);
},[showCarSheet]);

useEffect(()=>{
  if(!getCarsApi.loading && getCarsApi.data.length > 0) handleCarSelect(getCarsApi.data[0]);
  if(loading && !getCarsApi.loading){     
    setLoading(false)
  };
},[getCarsApi.loading]);

useEffect(() => {
  if (route.params?.address) {
    if (route.params.addressFor === "pickup") {
      setPickupAddress(route.params.address);
    } else {
      setDestinationAddress(route.params.address);
    }
  }
}, [route.params?.address]);


const applyChanges = (arr) => {
  setTitle('Every ' + arr.join(', '));
  setSelected(arr);
}

const handleOnPress = (value) => {
  setVisible(value==='2');
  setSelectedId(value);
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

const hasError = (name) => {
  if(formErrors.some(e=>e.type == name)) return true;
  return false
};


const isAllValid = () => {
  let errors = [];
  if(!pickupAddress) errors.push({type:t('leaving from'), message:t('Please provide departure address')});
  if(!destinationAddress) errors.push({type:t('going to'), message:t('Please provide destination address')});
  if(!selectedDateAndTime) errors.push({type:t('time hour'), message:t('Please select date and time for your ride')});
  if(!selectedCar?.id) errors.push({type:t('Car Model'), message:t('Please select car model you wish to use')});
  if(!selectedSeat) errors.push({type:t('available seats'), message:t('Please select available seats in your car')});
  if(!price) errors.push({type:t('price per seat'), message:t('Please specify price per seat in your ride')});
  return errors;
}

useEffect(() => {
  if(isSearched && homeData){
    setPickupAddress(pickupData.address);
    setDestinationAddress(destinationData.address);
    setselectedDateAndTime(homeData.selectedDateAndTime);
    dispatch(resetSearched())
  }
}, [isSearched,homeData,pickupData,destinationData])

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={t("offer a ride")} navigation={navigation} />
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
        >
          {locationInfo()}
          {carInfo()}
          {seatInfo()}
          {priceInfo()}
          {repentionInfo()}
          {continueButton()}
        </ScrollView>
      </View>
      {cardSheet()}
      {noOfSeatSheet()}
      {dateTimePicker()}
      {confirmRideDialog()}
      {loadingIndicator()}
      {alertMessage()}
      {formErrorsDialog()}
    </View>
  );

  function loadingIndicator(){
    return (<LoadingIndicator visible={loading}/>)
  }

  function alertMessage() {
    return <AlertMessage 
      visible={errorAlert} 
      errorMessage={errorMessage} 
      setVisible={setErrorAlert}
    />
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
          <Text style={styles.sheetHeader}>{t('Number of seats')}</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0 }}
          >
            <View>
              {seats.map((item, index) => (
                <View key={`${index}`}>
                  <Text
                    onPress={() => {

                      setselectedSeat(item);
                      setshowNoOfSeatSheet(false);
                    }}
                    style={{
                      ...(selectedSeat == item
                        ? { ...Fonts.secondaryColor16SemiBold }
                        : { ...Fonts.blackColor16SemiBold }),
                      textAlign: "center",
                    }}
                  >
                    {i18n.language !== 'kiny' ? item+' '+t(item > 1 ? 'seats' : 'seat') : t(item > 1 ? 'seats' : 'seat')+' '+item }

                  </Text>
                  {index == seats.length - 1 ? null : (
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
              {getCarsApi.data.map((item, index) => (
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
                  {index == getCarsApi.data.length - 1 ? null : (
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

  function continueButton() {
    return (
      <View style={{ backgroundColor: Colors.whiteColor }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleContinue}
          
          style={{
            ...CommonStyles.button,
            marginVertical: Sizes.fixPadding * 2.0,
          }}
        >
          <Text style={{ ...Fonts.whiteColor18Bold }}>{t('Set the ride')} </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function confirmRideDialog() {
    return (
      <Overlay
        isVisible={showConfirmDialog}
        onBackdropPress={() => setshowConfirmDialog(false)}
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
            {t('dear driver')}{t('you are setting a ride of')}{i18n.language !== 'kiny' ? selectedSeat+' '+t(selectedSeat > 1 ? 'seats' : 'seat') : t(selectedSeat > 1 ? 'seats' : 'seat')+' '+selectedSeat }, {t('each rider will pay')} {price} Rwf
          </Text>
          <View style={styles.btnContainer}>
           
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit}
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

  function seatInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
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
          style={[{ ...styles.valueBox, ...CommonStyles.rowAlignCenter },hasError('Available seats') ? {borderColor:Colors.redColor} : {}]}

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
            {selectedSeat ? (i18n.language !== 'kiny' ? selectedSeat+' '+t(selectedSeat > 1 ? 'seats' : 'seat') : t(selectedSeat > 1 ? 'seats' : 'seat')+' '+selectedSeat) : t("Pick available seats")}
          </Text>
          <Ionicons name="chevron-down" color={Colors.grayColor} size={20.5} />
        </TouchableOpacity>
      </View>
    );
  }

  function carInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0, marginTop:Sizes.fixPadding }}>
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
            {t('Car Model')}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setshowCarSheet(true);
          }}
          style={[{ ...styles.valueBox, ...CommonStyles.rowAlignCenter },hasError('Car Model') ? {borderColor:Colors.redColor} : {}]}

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
            {selectedCar ? selectedCar.carModel : t("Pick the car model")}
          </Text>
          <Ionicons name="chevron-down" color={Colors.grayColor} size={20.5} />
        </TouchableOpacity>
      </View>
    );
  }

  function priceInfo() {
    return (
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
        
        <View style={[styles.valueBox, hasError('Price per seat') ? {borderColor:Colors.redColor} : {}]}>
          <TextInput
            placeholder={t("Enter a price per seat")}
            style={{
              ...Fonts.blackColor15Medium,
              
            }}
            placeholderTextColor={Colors.grayColor}
            selectionColor={Colors.primaryColor}
            cursorColor={Colors.primaryColor}
            keyboardType="numeric"
            onChangeText={setPrice}
          />
        </View>
        <View style={styles.repentionWrapper}>
          <View style={styles.repention}>
            <Image
              source={require("../../assets/images/icons/recurring-event.png")}
              style={{ width: 20.0, height: 20.0, resizeMode: "contain" }}
            />
            <Text
              style={{
                ...Fonts.blackColor15SemiBold,
                flex: 1,
                marginLeft: Sizes.fixPadding,
              }}
            >
              {t('recurring')}
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
        </View>
      </View>
    );
  }

  function locationInfo() {
    return (
      <View style={styles.locationInfoWrapper}>
        <View>
          <View style={styles.locationWrapper}>
            <Ionicons
              name="location-sharp"
              color={Colors.blackColor}
              size={20}
            />
            <Text
              style={{
                ...Fonts.blackColor15SemiBold,
                paddingHorizontal:Sizes.fixPadding,
              }}
            >
              {t('leaving from')} 
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.push("PickLocation", { addressFor: "pickup", screen: "OfferRide" });
            }}
            style={[styles.locationBox,hasError('Leaving from') ? {borderColor:Colors.redColor} : {}]}
          >
              
              {pickupAddress ? (
                <Text
                  numberOfLines={2}
                  style={{
                    ...Fonts.secondaryColor14Medium,
                  }}
                >
                  {pickupAddress}
                </Text>
              ) : <Text style={{ ...Fonts.grayColor15Medium }}>
              {t('Your departure location')}
            </Text>}
          </TouchableOpacity>
        </View>
        <View>
          <View style={styles.locationWrapper}>
            <Ionicons
              name="location-sharp"
              color={Colors.blackColor}
              size={20}
            />
            <Text
              style={{
                ...Fonts.blackColor15SemiBold,
                paddingHorizontal:Sizes.fixPadding,
              }}
            >
              {t('going to')}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.push("PickLocation", { addressFor: "destination", screen: "OfferRide" });
            }}
            style={[styles.locationBox,hasError('Going To') ? {borderColor:Colors.redColor} : {}]}
          >
              
              {destinationAddress ? (
                <Text
                  numberOfLines={2}
                  style={{
                    ...Fonts.secondaryColor14Medium,
                    marginTop: Sizes.fixPadding - 5.0,
                  }}
                >
                  {destinationAddress}
                </Text>
              ) : <Text style={{ ...Fonts.grayColor15Medium }}>
              {t('Your destination location')}
            </Text>}
          </TouchableOpacity>
        </View>
        <View>
          <View style={styles.locationWrapper}>
            <Ionicons
              name="calendar-sharp"
              color={Colors.blackColor}
              size={20}
            />
            <Text
              style={{
                ...Fonts.blackColor15SemiBold,
                paddingHorizontal:Sizes.fixPadding,
              }}
            >
              {t('time hour')}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setselectedHour(selectedHour);
              setselectedMinute(selectedMinute);
              setselectedAmPm(selectedAmPm);
              setshowDateTimeSheet(true);
            }}
            style={[styles.dateAndTimeAndSeatWrapper,hasError('Date & time') ? {borderColor:Colors.redColor} : {}]}
          >
            <Text
              numberOfLines={2}
              style={{
                ...(selectedDateAndTime
                  ? { ...Fonts.secondaryColor16SemiBold }
                  : { ...Fonts.grayColor15SemiBold }),
                flex: 1,
              }}
            >
              {selectedDateAndTime ? selectedDateAndTime : t("Select data and time")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function repentionInfo(){
    <View style={styles.repentionWrapper}>
      <View style={styles.repention}>
        <Image
          source={require("../../assets/images/icons/recurring-event.png")}
          style={{ width: 20.0, height: 20.0, resizeMode: "contain" }}
        />
        <Text
          style={{
            ...Fonts.blackColor15SemiBold,
            flex: 1,
            marginLeft: Sizes.fixPadding,
          }}
        >
          {t('recurring')}
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
    </View>
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
        limit={true}
      />
    );
  }

  function handleContinue(){
    setIsVisible(false);
    setFormErrors([]);
    const errors = isAllValid();
    if(errors.length){
      setFormErrors(errors);
      return setIsVisible(true);
    }
    setshowConfirmDialog(true)
  }

  async function handleSubmit(){
    
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
      car_id:selectedCar.id
    }
    
    setLoading(true);
    setshowConfirmDialog(false);
    try {
      const result = await ridesApi.addRide(ride);
      setLoading(false) 
      if (!result.ok) {
        if (result.data) setErrorMessage(t(result.data.error));
        else {
          setErrorMessage(t("unexpected error occured"));
        }
        return setErrorAlert(true);
      }
      dispatch(myRideAdded(result.data));
      navigation.navigate({
        name:"ConfirmScheduling",
        params: { dateTime:selectedDateAndTime,seats: selectedSeat},
        merge:true
      });
    } catch (error) {
      setErrorMessage(t("unexpected error occured"));
      setErrorAlert(true);
    }
    
    
  }

  function handleCarSelect(car){
    setselectedCar(car)
    setSeats([...range(1, parseInt(car.carSeats)-1)]);
    setshowCarSheet(false);
  }


  function formErrorsDialog() {
    const renderItem = ({ item }) => (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding,
        }}
      >
        <Text style={{ ...Fonts.blackColor15SemiBold}}>
          {item.type} 
        </Text>
        <Text style={{ ...Fonts.blackColor14Medium}}>
          {item.message}
        </Text>
      </View>
    );
    return (
      <Overlay
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
        overlayStyle={styles.dialogStyle}
      >
        <View>
          <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setIsVisible(false)
              }}
              style={{padding:Sizes.fixPadding}}
          >
            <MaterialIcons
              name="close"
              color={Colors.blackColor}
              size={20}
              style={{alignSelf:'flex-end'}}
            />
          </TouchableOpacity>
          <Text style={{ ...Fonts.blackColor16Bold, textAlign: "center", paddingBottom:Sizes.fixPadding * 2.0 }}>
            {t('ERRORS')} 
          </Text>
          <FlatList
            data={formErrors}
            keyExtractor={(item,index) => `${index}`}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
          </View>
      </Overlay>
    );
  }

  
};

export default OfferRideScreen;

const styles = StyleSheet.create({
  locationWrapper:{
    flexDirection:'row', 
    paddingTop:Sizes.fixPadding*2.0,
    paddingBottom:Sizes.fixPadding,
  },
  locationIconWrapper: {
    width: 24.0,
    height: 24.0,
    borderRadius: 12.0,
    borderWidth: 1.0,
    alignItems: "center",
    justifyContent: "center",
  },
  locationInfoWrapper: {
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding,
  },
  valueBox: {
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding,
    borderColor:Colors.blackColor,
    borderWidth:1,
    borderRadius: Sizes.fixPadding,
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
  repentionWrapper:{
    paddingTop:Sizes.fixPadding*2
  },
  repention:{
    flexDirection: "row",
    alignItems: "center",
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
  locationBox: {
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.blackColor,
    borderWidth: 1.0,
    borderRadius: Sizes.fixPadding,
    flexDirection: "row",
    alignItems: "center",
    padding: Sizes.fixPadding + 2.0,
  },
  locationIconWrapper: {
    width: 24.0,
    height: 24.0,
    borderRadius: 12.0,
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
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
  dialogStyle: {
    width: "90%",
    borderRadius: Sizes.fixPadding,
    padding: 0,
    overflow: "hidden",
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
    marginTop: Sizes.fixPadding * 4.0,
  },
});
