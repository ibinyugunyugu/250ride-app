import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput
} from "react-native";
import React, { useEffect, useState } from "react";
import MyStatusBar from "../../components/myStatusBar";
import { Colors, CommonStyles, Fonts, Sizes, screenHeight } from "../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Header from "../../components/header";
import { Overlay } from "@rneui/themed";
import ShareButton from "../../components/shareButton";
import LoginSignUpDialog from "../../components/loginSignUpDialog";
import PhoneNumber from "../../components/phoneNumber";
import settings from "../../constants/settings";
import useAuth from "../../auth/useAuth";
import LoadingIndicator from "../../components/loadingIndicator";
import userApi from "../../api/users";
import ridesApi from "../../api/rides";
import requestsApi from "../../api/requests";
import AlertMessage from "../../components/alertMessage";
import { useSelector, useDispatch } from "react-redux";
import { getRideInfo, setRideInfo } from "../../store/rideInfo";
import { BottomSheet } from "@rneui/themed";
import { resetDestination } from "../../store/destination";
import { resetPickUp } from "../../store/pickup";
import { resetData } from "../../store/home";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

function range(start, end) {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
}

const RideDetailScreen = ({ navigation, route }) => {
  const [showCancelDialog, setshowCancelDialog] = useState(false);
  const [showConfirmDialog, setshowConfirmDialog] = useState(false);
  const [showPaymentDialog, setshowPaymentDialog] = useState(false);
  const [showPayWithMomo, setshowPayWithMomo] = useState(false);
  const [showMomoSuccess, setshowMomoSuccess] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const [showNoticeDialog, setShowNoticeDialog] = useState(false);
  const [showRateDialog, setshowRateDialog] = useState(false);
  const [showRate, setshowRate] = useState(false);
  const [showDialog, setshowDialog] = useState(false);
  const [rating, setrating] = useState(3);
  const [value, setValue] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [alert, setAlert] = useState(false);
  const [payOption, setPayOption] = useState();
  const [success, setSuccess] = useState(false);
  const [modeDialog, setModeDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pickAlert, setpickAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showNoOfSeatSheet, setshowNoOfSeatSheet] = useState(false);
  const [viewAdded, setViewAdded] = useState(false);
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setselectedSeat] = useState();
  const [status, setStatus] = useState();
  const [item, setItem] = useState(useSelector(getRideInfo()));
  const auth = useAuth();
  const { user, logOut } = auth;
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    setStatus(item.bookStatus);
    if(!viewAdded && item){
      ridesApi.viewRide(item.id);
      setViewAdded(true)
    }
    if(seats.length) return;
    if(item.status == 'Waiting' || item.status == 'In Progress') repeater();
    if(parseInt(item.remainingSeats) > 0) setSeats([...range(1, parseInt(item.remainingSeats))]);
    else{setSeats([])}
    if(item.status == 'In Progress' && item.bookStatus == 'Confirmed') setShowNoticeDialog(true);
    else if(item.status == 'Served' && !item.ratings && item.bookStatus == 'Confirmed') setshowRate(true)
  }, [item])

  useEffect(() => {
    if(!showNoticeDialog) return;
    const timeOut = setTimeout(() => {
      setShowNotice(true)
    }, 2000);

    return () => {
      clearTimeout(timeOut)
    }
  }, [showNoticeDialog])

  useEffect(() => {
    if(!showRate) return;
    const timeOut = setTimeout(() => {
      setshowRateDialog(true)
    }, 2000);

    return () => {
      clearTimeout(timeOut)
    }
  }, [showRate])

  let regionTimeout;

  const repeater = () => {
    if(!item.reqId) return;
    //console.log('launched!')
    regionTimeout = setTimeout(async() => {
      let result = await requestsApi.getRequest(item.reqId);
      if(result.data.ride.status !== item.status){
        //console.log(result.data.ride.status)
        //console.log(item.status)
        let newItem = result.data;
        const {ride} = newItem;
        ride.bookStatus = newItem.bookStatus;
        ride.bookedSeats = newItem.seats;
        ride.ratings = newItem.ratings;
        ride.reqId = newItem.id;
        if(ride.status == 'In Progress' && ride.bookStatus == 'Confirmed') setShowNoticeDialog(true);
        else if(ride.status == 'Served' && !ride.ratings && ride.bookStatus == 'Confirmed') setshowRate(true)
      }
      repeater();
    }, 5000);
  }

  useEffect(()=>{
    return () => { clearTimeout(regionTimeout); };
  },[])

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={t('ride details')} navigation={navigation}/>
        <ScrollView showsVerticalScrollIndicator={false}>
          {riderInfo()}
          {divider()}
          {riderDetail()}
          {divider()}
          {vehicleInfo()}
        </ScrollView>
      </View>
      {footer()}
      {cancelRideDialog()}
      {confirmRideDialog()}
      {payRideDialog()}
      {payWithMomoDialog()}
      {paymentSuccessDialog()}
      {noticeDialog()}
      {giveRateDialog()}
      {successDialog()}
      {switchProfileDialog()}
      {alertMessage()}
      {loginSignUpDialog()}
      {loadingIndicator()}
      {noOfSeatSheet()}
    </View>
  );

  function loadingIndicator(){
    return <LoadingIndicator visible={loading}/>
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
              {seats.map((item, index) => (
                <View key={`${index}`}>
                  <Text
                    onPress={() => {
                      setselectedSeat(item);
                      setshowNoOfSeatSheet(false);
                      setshowConfirmDialog(true);
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

  function loginSignUpDialog() {
    return (
      <LoginSignUpDialog 
        navigation={navigation}
        showDialog={showDialog}
        setshowDialog={setshowDialog} 
        selectedTabIndex={1}
      />
    )
  }

  function payRideDialog() {
    return (
      <Overlay
        isVisible={showPaymentDialog}
        onBackdropPress={() => setshowPaymentDialog(false)}
        overlayStyle={styles.dialogStyle}
      >
        <View
          style={{
            marginVertical: Sizes.fixPadding * 2.0,
            marginHorizontal: Sizes.fixPadding * 3.0,
          }}
        >
          <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setshowPaymentDialog(false)
              }}
          >
            <MaterialIcons
              name="close"
              color={Colors.blackColor}
              size={20}
              style={{alignSelf:'flex-end'}}
            />
          </TouchableOpacity>
          
          <Text style={{ 
            ...Fonts.blackColor16SemiBold, 
            textAlign: "center",

          }}>
            {payOption !== 'Momo' ? t('pay for the ride') : t('pay with momo') }
          </Text>
          <View style={{marginVertical: Sizes.fixPadding * 2.0}}>
              <Text
                style={{
                  ...Fonts.blackColor15Medium,
                  marginBottom: Sizes.fixPadding,
                }}
              >
                {t('amount to pay')}
              </Text>
              <View style={styles.valueBox}>
                <TextInput
                  style={{
                    ...Fonts.blackColor15Medium,
                    height: 44
                  }}
                  selectionColor={Colors.blackColor}
                  cursorColor={Colors.blackColor}
                  onChange={setValue}
                  value={item.price}
                />
              </View>
            </View>
            {payOption === 'Momo' && <PhoneNumber title={t('telephone')} setPhone={setPhoneNumber} />}

            <Text
              style={{
                ...Fonts.blackColor15Medium,
                marginBottom: Sizes.fixPadding,
              }}
            >
              {t('payment option')}
            </Text>

            <View style={{
                ...CommonStyles.rowAlignCenter,
                marginBottom: Sizes.fixPadding * 2.0,
              }}>

              <Text 
                style={payOption === 'Momo' 
                      ? 
                      {...styles.paymentOption, ...styles.left, ...styles.active}
                      :
                      {...styles.paymentOption, ...styles.left}
                }
                onPress={()=>setPayOption('Momo')}
              >
                {t('momo')}
              </Text>
              <Text 
                style={payOption === 'Cash' 
                ? 
                {...styles.paymentOption, ...styles.right, ...styles.active}
                :
                {...styles.paymentOption, ...styles.right}
          }
                onPress={()=>setPayOption('Cash')}
              >
                {t('cash')}
              </Text>

            </View>

            {payOption === 'Cash' && <View style={{
                ...CommonStyles.rowAlignCenter,
                marginBottom: Sizes.fixPadding * 2.0,
              }}>

              <MaterialIcons
                name="info-outline"
                color={Colors.blackColor}
                size={20}
              />
              <Text style={{...Fonts.blackColor15Medium,}}>
                {t('dear rider')} {t('you will pay cash at arrival')}
              </Text>

            </View>}
                       
            {payOption && <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if ((payOption === 'Momo' && !phoneNumber) || !payOption){
                  setpickAlert(true);
                  setErrorMessage(t('enter mtn number to use for payment'));
                }
                else {
                  handlePayment();
                }
              }}
              style={{ ...CommonStyles.button, marginHorizontal:0 }}
              >
              <Text style={{ ...Fonts.whiteColor15Medium }}>
                {payOption !== 'Cash' ? t('pay now') : t('continue')}
              </Text>
            </TouchableOpacity>}

        </View>
        
      </Overlay>
    );
  }

  function confirmRideDialog() {
    return (
      <Overlay
        isVisible={showConfirmDialog}
        onBackdropPress={() => {setshowConfirmDialog(false); setselectedSeat()}}
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
          {t('dear rider')+' '+t('you are booking')} {i18n.language !== 'kiny' ? selectedSeat+' '+t(selectedSeat > 1 ? 'seats' : 'seat') : t(selectedSeat > 1 ? 'seats' : 'seat')+' '+selectedSeat }
          </Text>
          <View style={styles.btnContainer}>
            {/* <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setshowConfirmDialog(false);
              }}
              style={{ ...CommonStyles.button, backgroundColor:Colors.whiteColor }}
            >
              <Text style={{ ...Fonts.blackColor15Medium }}>
                Cancel
              </Text>
            </TouchableOpacity> */}
            
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleConfirm}
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


  function payWithMomoDialog() {
    return (
      <Overlay
        isVisible={showPayWithMomo}
        onBackdropPress={() => setshowPayWithMomo(false)}
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
            {t('confirm the payment in your mobile phone')}
          </Text>

          <Text style={{ 
              ...Fonts.blackColor15Medium, 
              marginVertical:Sizes.fixPadding * 3.0,
              textAlign: "center" 
            }}>
              {t('if you do not see it automatically')}
          </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setshowPayWithMomo(false);
                setshowMomoSuccess(true);
              }}
              style={{ ...CommonStyles.button,  paddingHorizontal: Sizes.fixPadding * 3.0 }}
              >
              <Text style={{ ...Fonts.whiteColor15Medium }}>
              {t('confirm')}
              </Text>
            </TouchableOpacity>
          </View>
      </Overlay>
    );
  }


  function paymentSuccessDialog() {
    return (
      <Overlay
        isVisible={showMomoSuccess}
        onBackdropPress={() => setshowMomoSuccess(false)}
        overlayStyle={styles.dialogStyle}
      >
        <View
          style={{
            marginVertical: Sizes.fixPadding * 3.5,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          <Image
            source={require("../../assets/images/paymentSuccess.png")}
            style={{
              resizeMode:'contain',
              width:150,
              height:150,
              alignSelf:'center'
            }}
          />
          <Text style={{ ...Fonts.blackColor16SemiBold, textAlign: "center" }}>
            {t('congratulations')} !!!!!!!
          </Text>

          <Text style={{ 
              ...Fonts.blackColor15Medium, 
              marginVertical:Sizes.fixPadding * 3.0,
              textAlign: "center" 
            }}>
            {t('your ride payment has been completed successfully')}
          </Text>

          
            
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setshowMomoSuccess(false);
                navigation.push("Tracking");
              }}
              style={{ ...CommonStyles.button,  paddingHorizontal: Sizes.fixPadding * 3.0 }}
              >
              <Text style={{ ...Fonts.whiteColor15Medium }}>
              {t('start your ride')}
              </Text>
            </TouchableOpacity>
          </View>
      </Overlay>
    );
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
            {t('cancel ride request')}
          </Text>

          <Text style={{ 
              ...Fonts.blackColor15Medium, 
              marginTop:Sizes.fixPadding * 3.0,
              textAlign: "center" 
            }}>
            {t('are you sure you want to cancel a ride request')}
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

  function giveRateDialog() {
    return (
      <Overlay
        isVisible={showRateDialog}
        onBackdropPress={() => setshowRateDialog(false)}
        overlayStyle={styles.dialogStyle}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
        >
          <View
            style={{
              backgroundColor: Colors.whiteColor,
              marginHorizontal: Sizes.fixPadding * 2.0,
              marginVertical: Sizes.fixPadding * 2.5,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/images/rating.png")}
                style={{ width: 150.0, height: 150.0, resizeMode: "contain" }}
              />
              <Text
                style={{
                  ...Fonts.blackColor16SemiBold,
                  marginTop: Sizes.fixPadding,
                }}
              >
                {t('thank you for riding with 250ride') }
              </Text>

              <Text
                style={{
                  ...Fonts.blackColor14Medium,
                  marginTop: Sizes.fixPadding,
                }}
              >
                {t('rate the driver')}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: Sizes.fixPadding * 2.0,
                }}
              >
                {ratingSort({ no: 1 })}
                {ratingSort({ no: 2 })}
                {ratingSort({ no: 3 })}
                {ratingSort({ no: 4 })}
                {ratingSort({ no: 5 })}
              </View>
            </View>
            
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleRateDriver}
              style={{
                ...CommonStyles.button,
                marginHorizontal: 0,
                marginTop: Sizes.fixPadding * 2.0,
              }}
            >
              <Text style={{ ...Fonts.whiteColor18Bold }}>{t('rate')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Overlay>
    );
  }

  function ratingSort({ no }) {
    return (
      <MaterialIcons
        name="star"
        color={rating >= no ? Colors.blackColor : Colors.lightGrayColor}
        size={40}
        onPress={() => setrating(no)}
        style={{ marginHorizontal: Sizes.fixPadding - 8.0 }}
      />
    );
  }

  function noticeDialog() {
    return (
      <Overlay
        isVisible={showNotice}
        onBackdropPress={() => setShowNotice(false)}
        overlayStyle={styles.dialogStyle}
      >
        <View
          style={{
            marginVertical: Sizes.fixPadding * 3.5,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
    
          <Text style={{ ...Fonts.blackColor16Bold, textAlign: "center", paddingBottom:Sizes.fixPadding * 3.0 }}>
            {t('notice')} 
          </Text>

          <Text style={{ ...Fonts.blackColor15SemiBold}}>
            1. {t("Luggage Law Compliance")}
          </Text>
          <Text style={{ 
              ...Fonts.blackColor14Medium, 
              marginBottom:Sizes.fixPadding * 2.0,
            }}>
             - {t("Drivers should ensure riders' luggage adheres to government regulations, with accompanying receipts or documentation as necessary")}
             {'\n'}
             - {t("Prohibited items must be absent")}
          </Text>

          <Text style={{ ...Fonts.blackColor15SemiBold}}>
            2. {t("Car Status and Emergency Kits")}
          </Text>
          <Text style={{ 
              ...Fonts.blackColor14Medium, 
              marginBottom:Sizes.fixPadding * 2.0,
            }}>
            - {t("Riders should confirm cars are devoid of major safety hazards.")}
            {'\n'}
            - {t("Essential safety equipment like spare tires, jacks, and basic tools should be present.")}
          </Text>

          <Text style={{ ...Fonts.blackColor15SemiBold}}>
            3. {t("Identification Documents")}
          </Text>       
          <Text style={{ 
              ...Fonts.blackColor14Medium, 
              marginBottom:Sizes.fixPadding * 2.0,
            }}>
            - {t("Riders must verify the driver's identity matches the online registration.")}
            {'\n'}
            - {t("Drivers should possess all required documents mandated by law.")}
            {'\n'}
            - {t("The absence of police fines hindering the journey should be confirmed by the driver.")}
          </Text>   

          
            
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setShowNotice(false);
                //navigation.push("RideProgress");
              }}
              style={{ ...CommonStyles.button,  paddingHorizontal: Sizes.fixPadding * 3.0 }}
              >
              <Text style={{ ...Fonts.whiteColor15Medium }}>
                {t('continue')}
              </Text>
            </TouchableOpacity>
          </View>
      </Overlay>
    );
  }

  function successDialog() {
    return (
      <Overlay
        isVisible={success}
        onBackdropPress={() => {
          setSuccess(false);
          navigation.pop()
        }}
        overlayStyle={styles.dialogStyle}
      >
        <View
          style={{
            marginVertical: Sizes.fixPadding * 3.5,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setSuccess(false);
                navigation.pop()
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
            {t('your rating has been submitted successfully')}
          </Text>
        </View>
        
      </Overlay>
    );
  }

  function footer() {
    return (
      <View style={styles.footer}>
        {status ? (status !== 'Confirmed' ? 
          (<View style={{...CommonStyles.rowAlignCenter}}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setshowCancelDialog(true);
              }}
              style={styles.cancelRideButton}
            >
              <Text numberOfLines={1} style={{ ...Fonts.blackColor18Bold }}>
                {t('cancel ride')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setshowPaymentDialog(true)
              }}
              style={{
                flex: 1,
                ...CommonStyles.button,
                marginHorizontal: Sizes.fixPadding,
              }}
            >
              <Text numberOfLines={1} style={{ ...Fonts.whiteColor18Bold }}>
                {t('confirm')}
              </Text>
            </TouchableOpacity>
          </View>)
          : 
          <View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.confirmedButton}
            >
              <Text numberOfLines={1} style={{ ...Fonts.whiteColor18Bold }}>
                {t('confirmed')}
              </Text>
            </TouchableOpacity>
          </View>
          )
          : 
          <View style={{...CommonStyles.rowAlignCenter}}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleRequest}
              style={{
                flex: 1,
                ...CommonStyles.button,
                marginHorizontal: Sizes.fixPadding,
              }}
            >
              <Text numberOfLines={1} style={{ ...Fonts.whiteColor18Bold }}>
                {t('request ride')}
              </Text>
            </TouchableOpacity>
          </View>
          }
          {/* {!route?.params?.status ? 
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if(route?.params?.action === 'Start') setShowNotice(true);
                else if(route?.params?.action === 'End') setshowRateDialog(true);
              }}
              style={{
                flex: 1,
                ...CommonStyles.button,
                marginHorizontal: Sizes.fixPadding,
              }}
            >
            <Text numberOfLines={1} style={{ ...Fonts.whiteColor18Bold }}>
              {route?.params?.action} Ride
            </Text>
            </TouchableOpacity> 
          : null} */}
      </View>
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
             {item.car.carModel}
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
              {item.car?.carColor}
            </Text>
          </View>
          <View style={{ marginBottom: Sizes.fixPadding }}>
            <Text style={{ ...Fonts.blackColor14SemiBold }}>{t('plate number')}</Text>
            <Text
              style={{
                ...Fonts.blackColor14Medium,
                marginTop: Sizes.fixPadding - 7.0,
              }}
            >
              {item.car.plateNumber}
            </Text>
          </View>
          {item.bookedSeats ? <View>
            <Text style={{ ...Fonts.blackColor14SemiBold }}>{t('your seats')}</Text>
            <Text
              style={{
                ...Fonts.blackColor14Medium,
                marginTop: Sizes.fixPadding - 7.0,
              }}
            >
              {i18n.language !== 'kiny' ? item.bookedSeats+' '+t(item.bookedSeats > 1 ? 'seats' : 'seat') : t(item.bookedSeats > 1 ? 'seats' : 'seat')+' '+item.bookedSeats }
            </Text>
          </View> : null}
        </View>
        <Image
          source={{uri:settings.host+'cars/'+item.car.carImage}}
          style={{
            width:160,
            height:160,
            resizeMode:'contain',
            marginTop:Sizes.fixPadding * 2.0
          }}
        />
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
              {t('ride details')}
            </Text>
            <Text
              onPress={() => {
                navigation.push("RideTracking");
              }}
              style={{
                ...Fonts.blueColor14SemiBold,
              }}
            >
              {t('map view')}
            </Text>
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
              {new Date(item.datetime).toDateString()}
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
              {(item?.datetime?.split('T')[1]).split(':')[0]}h{(item?.datetime?.split('T')[1]).split(':')[1]} 
              {` - `}
              {(item?.endtime?.split('T')[1]).split(':')[0]}h{(item?.endtime?.split('T')[1]).split(':')[1]} 
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

          <View style={{ ...CommonStyles.rowAlignCenter }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor14SemiBold }}>
            {t('price')}:
            </Text>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                ...Fonts.blackColor14Medium,
                marginHorizontal: Sizes.fixPadding,
              }}
            >
              Rwf {item.price}
            </Text>
          </View>

        </View>
      </View>
    );
  }

  function riderInfo() {
    return (
      <View
        style={{
          ...CommonStyles.rowAlignCenter,
          margin: Sizes.fixPadding * 2.0,
          marginBottom: 0,
          paddingBottom: Sizes.fixPadding * 3.0,
        }}
      >
        <Image
        source={item?.driver?.user?.photo ? {uri:settings.host+'images/'+item?.driver?.user?.photo} : require("../../assets/images/avatar.png")}
          style={{
            width: 80.0,
            height: 80.0,
            borderRadius: Sizes.fixPadding - 5.0,
          }}
        />
        <View
          style={{
            flex: 1,
            marginHorizontal: Sizes.fixPadding,
          }}
        >
          <Text numberOfLines={1} style={{ ...Fonts.blackColor17SemiBold }}>
            {item?.driver?.user?.name}
          </Text>
          <View
            style={{
              ...CommonStyles.rowAlignCenter,
              marginVertical: Sizes.fixPadding - 6.0,
            }}
          >
            <Text style={{ ...Fonts.grayColor14SemiBold }}>{item.ratings ? item.ratings : 0}</Text>
            <MaterialIcons
              name="star"
              color={Colors.secondaryColor}
              size={16}
            />
            <View style={styles.ratingAndReviewDivider}></View>
            <Text
              numberOfLines={1}
              style={{ ...Fonts.grayColor14SemiBold, flex: 1 }}
            >
              0 {t('reviews')}
            </Text>
          </View>
          <Text numberOfLines={1} style={{ ...Fonts.grayColor14SemiBold }}>
          {t('driver')}:
          </Text>
        </View>
        <ShareButton/>
      </View>
    );
  }

  function alertMessage() {
    return <AlertMessage 
      visible={pickAlert} 
      errorMessage={errorMessage} 
      setVisible={setpickAlert}
    />
  }

  function handleRequest() {
    if(!user) return setshowDialog(true);
    else if(user && user.currentProfile == '2') return setModeDialog(true);
    else if(!selectedSeat) return setshowNoOfSeatSheet(true);
    setshowConfirmDialog(true)
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
            marginVertical: Sizes.fixPadding * 3.5,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          <Text style={{ 
              ...Fonts.blackColor15Medium, 
              marginTop:Sizes.fixPadding * 3.0,
              textAlign: "center" 
            }}>
            { 
              user?.currentProfile === '2' 
              ? 
              t('your account is in driver mode would you like to switch to rider mode')
              :
              t('your account is in rider mode would you like to switch to driver mode')
            }
          </Text>

          <View style={styles.btnContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setModeDialog(false);
                
              }}
              style={{ ...CommonStyles.button, 
                backgroundColor:Colors.secondaryColor, 
                paddingHorizontal: Sizes.fixPadding * 3.0 
              }}
            >
              <Text style={{ ...Fonts.whiteColor15Medium }}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSwitch}
              style={{ ...CommonStyles.button, backgroundColor: Colors.blackColor, paddingHorizontal: Sizes.fixPadding * 3.0 }}
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


  async function handleConfirm(){
    setpickAlert(false);
    setLoading(true);
    setshowConfirmDialog(false);
    const result = await ridesApi.bookRide(item.id,selectedSeat);
    setLoading(false) 
    if (!result.ok) {
      setpickAlert(true);
      return setErrorMessage(result.data.error ? t(result.data.error) : t('booking ride failed try again'))
    }
    dispatch(resetDestination());
    dispatch(resetPickUp());
    dispatch(resetData());

    navigation.push("ConfirmPooling",{message:result.data.message});
  }

  async function handleCancel(){
    setshowCancelDialog(false);
    setpickAlert(false);
    setLoading(true);
    const result = await requestsApi.cancelRequest(item.reqId);
    setLoading(false) 
    if (!result.ok) {
      setpickAlert(true);
      return setErrorMessage(result.data.error ? t(result.data.error) : t('canceling ride failed try again'))
    }
    navigation.navigate({
      name: "Rides",
      params: {
        id: item.reqId,
      },
      merge: true,
    });
  }

  async function handlePayment(){
    setshowPaymentDialog(false);
    setpickAlert(false);
    setLoading(true);
    const result = await requestsApi.payRide(item.reqId,payOption,phoneNumber);
    setLoading(false) 
    setpickAlert(true);
    if (!result.ok) {
      setTimeout(() => {
        setshowPaymentDialog(true);
      }, 2000);
      return setErrorMessage(result.data.error ? t(result.data.error) : t('payment failed please try again'))
    }
    
    if(payOption === "Momo") return setshowPayWithMomo(true);
    setStatus('Confirmed');
    return navigation.navigate({name:"Rides",merge:true,params:{status:'Confirmed'}});
  }

  async function handleRateDriver(){
    setshowRateDialog(false);
    setpickAlert(false);
    setLoading(true);
    const result = await requestsApi.rateDriver(item.reqId,rating+'');
    setLoading(false) 
    setpickAlert(true);
    if (!result.ok) {
      setTimeout(() => {
        setshowRateDialog(true);
      }, 2000);
      return setErrorMessage(result.data.error ? t(result.data.error) : t('rating failed please try again'))
    }
    setSuccess(true)
  }
};

export default RideDetailScreen;

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
    width: 22.0,
    height: 22.0,
    borderRadius: 11.0,
    borderWidth: 1.0,
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
    
  },
  cancelRideButton: {
    flex: 1,
    ...CommonStyles.button,
    backgroundColor: Colors.whiteColor,
    marginHorizontal: Sizes.fixPadding,
  },
  confirmedButton: {
    ...CommonStyles.button,
    backgroundColor: Colors.greenColor,
    marginHorizontal: Sizes.fixPadding,
    color:Colors.whiteColor,
    width:'60%',
    alignSelf:'center'
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
  
  valueBox: {
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding,
    borderWidth: 1.0,
    borderColor:Colors.blackColor,
    borderRadius: Sizes.fixPadding,
    height:44
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
