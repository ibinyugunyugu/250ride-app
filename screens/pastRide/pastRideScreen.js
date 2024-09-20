import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput
} from "react-native";
import React, { useState } from "react";
import MyStatusBar from "../../components/myStatusBar";
import { Colors, CommonStyles, Fonts, Sizes } from "../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import DashedLine from "react-native-dashed-line";
import Header from "../../components/header";
import { Overlay } from "@rneui/themed";
import ShareButton from "../../components/shareButton";
import IntlPhoneInput from "react-native-intl-phone-input";
import PhoneNumber from "../../components/phoneNumber";

const passengerList = [
  {
    id: "1",
    profile: require("../../assets/images/user/user10.png"),
    name: "Savannah Nguyen",
  },
  {
    id: "2",
    profile: require("../../assets/images/user/user1.jpeg"),
    name: "Brooklyn Simmons",
  },
];

const reviewsList = [
  {
    id: "1",
    profile: require("../../assets/images/user/user11.png"),
    name: "Wade Warren",
    rating: 4.8,
    reviewDate: "25 jan 2023",
    review:
      "Lorem ipsum dolor sit amet consectetur. Allaliquam sit mollis adipiscing donec ut sed. Dictum dignissim enim condimentum vitae aliquam sed. ",
  },
  {
    id: "2",
    profile: require("../../assets/images/user/user12.png"),
    name: "Jenny wilsom",
    rating: 3.5,
    reviewDate: "25 jan 2023",
    review:
      "Lorem ipsum dolor sit amet consectetur. Allaliquam sit mollis adipiscing donec ut sed. Dictum dignissim enim condimentum vitae aliquam sed. ",
  },
];

const PastRideScreen = ({ navigation, route }) => {
  const [showCancelDialog, setshowCancelDialog] = useState(false);
  const [showConfirmDialog, setshowConfirmDialog] = useState(false);
  const [showPaymentDialog, setshowPaymentDialog] = useState(false);
  const [showPayWithMomo, setshowPayWithMomo] = useState(false);
  const [showMomoSuccess, setshowMomoSuccess] = useState(false);
  const [value, setValue] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [payOption, setPayOption] = useState();
  const [alert, setAlert] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {riderInfo()}
          {divider()}
          {riderDetail()}
          {divider()}
          {priceDetails()}
          {divider()}
          {vehicleInfo()}
        </ScrollView>
      </View>
    </View>
  );

  function header() {
    return (
      <View style={{ justifyContent: "center" }}>
        <Header title={"Ride details"} navigation={navigation} />
        {route?.params?.id ? (
          <MaterialIcons
            name="call"
            color={Colors.whiteColor}
            size={20}
            style={{ position: "absolute", right: 20 }}
          />
        ) : null}
      </View>
    );
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
            {payOption !== 'Momo' ? 'PAY FOR THE RIDE' : 'PAY WITH MOMO' }
          </Text>
          <View style={{marginVertical: Sizes.fixPadding * 2.0}}>
              <Text
                style={{
                  ...Fonts.blackColor15Medium,
                  marginBottom: Sizes.fixPadding,
                }}
              >
                Amount to pay 
              </Text>
              <View style={styles.valueBox}>
                <TextInput
                  style={{
                    ...Fonts.blackColor15Medium,
                    height: 20.0,
                  }}
                  selectionColor={Colors.blackColor}
                  cursorColor={Colors.blackColor}
                  onChange={setValue}
                  value="600"
                />
              </View>
            </View>
            {payOption === 'Momo' && <PhoneNumber title={'Phone Number'} setPhone={setPhoneNumber} />}

            <Text
              style={{
                ...Fonts.blackColor15Medium,
                marginBottom: Sizes.fixPadding,
              }}
            >
              Payment option
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
                Momo
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
                Cash
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
                Dear rider, you will pay cash at arrival
              </Text>

            </View>}
                       
            {payOption && <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if ((payOption === 'Momo' && !phoneNumber) || !payOption){
                  setAlert(true);
                  setTimeout(() => {
                    setAlert(false);
                  }, 2000);
                }
                else if (payOption === 'Cash'){
                  setshowPaymentDialog(false);
                  navigation.push("Tracking");
                }
                else {
                  setshowPaymentDialog(false);
                  setshowPayWithMomo(true);
                }
              }}
              style={{ ...CommonStyles.button, marginHorizontal:0 }}
              >
              <Text style={{ ...Fonts.whiteColor15Medium }}>
                {payOption !== 'Cash' ? 'Pay Now' : 'Continue'}
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
            Dear Rider, you are booking 2 seats 
          </Text>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setshowConfirmDialog(false);
              }}
              style={{ ...CommonStyles.button, backgroundColor:Colors.whiteColor }}
            >
              <Text style={{ ...Fonts.blackColor15Medium }}>
                Cancel
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setshowConfirmDialog(false);
                navigation.push("ConfirmPooling");
              }}
              style={{ ...CommonStyles.button }}
              >
              <Text style={{ ...Fonts.whiteColor15Medium }}>
                Continue
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
            Confirm the payment in your mobile phone
          </Text>

          <Text style={{ 
              ...Fonts.blackColor15Medium, 
              marginVertical:Sizes.fixPadding * 3.0,
              textAlign: "center" 
            }}>
            If you don’t see it automatically please dial *182*7*1# 
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
              Confirm
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
            CONGRATULATIONS !!!!!!!
          </Text>

          <Text style={{ 
              ...Fonts.blackColor15Medium, 
              marginVertical:Sizes.fixPadding * 3.0,
              textAlign: "center" 
            }}>
            Your payment have paid successfully your ride
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
              Start your ride
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
            CANCEL RIDE REQUEST
          </Text>

          <Text style={{ 
              ...Fonts.blackColor15Medium, 
              marginTop:Sizes.fixPadding * 3.0,
              textAlign: "center" 
            }}>
            Are you sure you want to cancel a ride request
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
                No
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setshowCancelDialog(false);
                navigation.navigate({
                  name: "Rides",
                  params: {
                    id: route.params.id,
                  },
                  merge: true,
                });
              }}
              style={{ ...CommonStyles.button, backgroundColor: Colors.blackColor, paddingHorizontal: Sizes.fixPadding * 3.0 }}
              >
              <Text style={{ ...Fonts.whiteColor15Medium }}>
                Yes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
      </Overlay>
    );
  }

  function footer() {
    return (
      <View style={styles.footer}>
        {route?.params?.id ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setshowCancelDialog(true);
            }}
            style={styles.cancelRideButton}
          >
            <Text numberOfLines={1} style={{ ...Fonts.blackColor18Bold }}>
              Cancel ride 
            </Text>
          </TouchableOpacity>
        ) : null}
          {!route?.params?.status ? <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setshowConfirmDialog(true)
            }}
            style={{
              flex: 1,
              ...CommonStyles.button,
              marginHorizontal: Sizes.fixPadding,
            }}
          >
            <Text numberOfLines={1} style={{ ...Fonts.whiteColor18Bold }}>
              Request ride
            </Text>
          </TouchableOpacity>
          :
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
              Confirm
            </Text>
          </TouchableOpacity>
        }
      </View>
    );
  }

  function vehicleInfo() {
    return (
      <View style={styles.vehicleInfoWrapper}>
        <View>
          <Text style={{ ...Fonts.blackColor17SemiBold }}>Vehicle info</Text>
          <View style={{ marginVertical: Sizes.fixPadding }}>
            <Text style={{ ...Fonts.blackColor14SemiBold }}>Car model</Text>
            <Text
              style={{
                ...Fonts.blackColor14Medium,
                marginTop: Sizes.fixPadding - 7.0,
              }}
            >
              Volkswagen Polo 
            </Text>
          </View>
          <View style={{ marginBottom: Sizes.fixPadding }}>
            <Text style={{ ...Fonts.blackColor14SemiBold }}>Color</Text>
            <Text
              style={{
                ...Fonts.blackColor14Medium,
                marginTop: Sizes.fixPadding - 7.0,
              }}
            >
              Black Color
            </Text>
          </View>
          <View>
            <Text style={{ ...Fonts.blackColor14SemiBold }}>Plate number</Text>
            <Text
              style={{
                ...Fonts.blackColor14Medium,
                marginTop: Sizes.fixPadding - 7.0,
              }}
            >
              RAD 478 B
            </Text>
          </View>
        </View>
        <Image
          source={require("../../assets/images/car.png")}
          style={{
            resizeMode:'contain',
            marginTop: Sizes.fixPadding * 2.0
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
              Rider details
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
              From:
            </Text>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                ...Fonts.blackColor14Medium,
                marginHorizontal: Sizes.fixPadding,
              }}
            >
              Nyamirambo, KN287ST
            </Text>
          </View>

          

          <View style={{ ...CommonStyles.rowAlignCenter }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor14SemiBold }}>
              To:
            </Text>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                ...Fonts.blackColor14Medium,
                marginHorizontal: Sizes.fixPadding,
              }}
            >
              Muhima, KN 356 ST
            </Text>
          </View>

          <View style={{ ...CommonStyles.rowAlignCenter }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor14SemiBold }}>
              Time:
            </Text>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                ...Fonts.blackColor14Medium,
                marginHorizontal: Sizes.fixPadding,
              }}
            >
              10h30 - 11h00
            </Text>
          </View>

          <View style={{ ...CommonStyles.rowAlignCenter }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor14SemiBold }}>
              Distance:
            </Text>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                ...Fonts.blackColor14Medium,
                marginHorizontal: Sizes.fixPadding,
              }}
            >
              12 Km
            </Text>
          </View>

        </View>
      </View>
    );
  }

  function priceDetails() {
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
              About Price
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
              Seats:
            </Text>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                ...Fonts.blackColor14Medium,
                marginHorizontal: Sizes.fixPadding,
              }}
            >
              1
            </Text>
          </View>

          

          <View style={{ ...CommonStyles.rowAlignCenter }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor14SemiBold }}>
            Price :
            </Text>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                ...Fonts.blackColor14Medium,
                marginHorizontal: Sizes.fixPadding,
              }}
            >
              500 Rwf 
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
          source={require("../../assets/images/user/user9.png")}
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
            Jacob Jones
          </Text>
          <View
            style={{
              ...CommonStyles.rowAlignCenter,
              marginVertical: Sizes.fixPadding - 6.0,
            }}
          >
            <Text style={{ ...Fonts.grayColor14SemiBold }}>4.8</Text>
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
              120 review
            </Text>
          </View>
          <Text numberOfLines={1} style={{ ...Fonts.grayColor14SemiBold }}>
            Driver
          </Text>
        </View>
        <ShareButton/>
      </View>
    );
  }
  function alertMessage() {
    return alert ? (
      <Text style={styles.alertTextStyle}>
        Please provide your details
      </Text>
    ) : null;
  }
};

export default PastRideScreen;

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
    ...CommonStyles.rowAlignCenter,
  },
  cancelRideButton: {
    flex: 1,
    ...CommonStyles.button,
    backgroundColor: Colors.whiteColor,
    marginHorizontal: Sizes.fixPadding,
  },
  dialogStyle: {
    width: "80%",
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
    justifyContent:'space-evenly',
    marginTop: Sizes.fixPadding * 4.0,
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
});
