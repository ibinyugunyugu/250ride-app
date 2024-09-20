import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState} from "react";
import MyStatusBar from "../../components/myStatusBar";
import {
  Colors,
  Sizes,
  Fonts,
  screenWidth,
  CommonStyles,
} from "../../constants/styles";
import IntlPhoneInput from "react-native-intl-phone-input";
import Header from "../../components/header";
import { Overlay } from "@rneui/themed";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import PhoneNumber from "../../components/phoneNumber";
import useAuth from "../../auth/useAuth";

const ClearBalanceScreen = ({ navigation }) => {
  const auth = useAuth();
  const { driver } = auth;
  const [showPayWithMomo, setshowPayWithMomo] = useState(false);
  const [showMomoSuccess, setshowMomoSuccess] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [alert, setAlert] = useState(false);
  const [balance, setBalance] = useState(parseInt(driver.balance));
  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={"Clear balance"} navigation={navigation} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Sizes.fixPadding }}
        >
          {textInput()}
          {balanceInfo()}
        </ScrollView>
      </View>
      {payWithMomoDialog()}
      {paymentSuccessDialog()}
      {alertMessage()}
    </View>
  );

  function textInput() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{paddingVertical: Sizes.fixPadding, ...styles.TextInput}}
      >
        <Text style={{ ...Fonts.blackColor16Medium }}>Balance</Text>
        <Text style={{ ...Fonts.blackColor16Medium }}>
          {balance > 0 ? '-'+driver.balance : 0} Rwf</Text>
      </TouchableOpacity>
    )
  }

  function balanceInfo() {
    return (
      <View style={styles.balanceInfoWrapper}>
        <View style={{ alignItems: "center", marginVertical: Sizes.fixPadding * 2.0, }}>
          <Text style={{ ...Fonts.blackColor18Medium }}>CLEAR BALANCE</Text>
        </View>

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
                    height: 24.0,
                  }}
                  selectionColor={Colors.blackColor}
                  cursorColor={Colors.blackColor}
                  defaultValue={balance}
                />
              </View>
            </View>
            <PhoneNumber title={'Phone Number'} setPhone={setPhoneNumber} />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (!phoneNumber){
                  setAlert(true);
                  setTimeout(() => {
                    setAlert(false);
                  }, 2000);
                }
                else{
                  setshowPayWithMomo(true);
                }
              }}
              style={{ ...CommonStyles.button, marginHorizontal:0 }}
              >
              <Text style={{ ...Fonts.whiteColor15Medium }}>
                Clear
              </Text>
            </TouchableOpacity>
      </View>
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
            source={require("../../assets/images/cleared.png")}
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
            Your payment have cleared successfully your balance          
          </Text>
          </View>
      </Overlay>
    );
  }

  function alertMessage() {
    return alert ? (
      <Text style={styles.alertTextStyle}>
        Please provide phone number
      </Text>
    ) : null;
  }

};

export default ClearBalanceScreen;

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
  balanceInfoWrapper: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    ...CommonStyles.shadow,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingBottom: Sizes.fixPadding * 3.0,
    marginTop: Sizes.fixPadding * 4.0,
  },
  header: {
    backgroundColor: Colors.primaryColor,
    padding: Sizes.fixPadding * 2.0,
    alignItems: "center",
    justifyContent: "center",
  },
  walletImageStyle: {
    width: screenWidth / 3.0,
    height: screenWidth / 3.0,
    resizeMode: "contain",
    alignSelf: "center",
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding * 2.0,
  },
  circle40: {
    width: 40.0,
    height: 40.0,
    borderRadius: 20.0,
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.shadow,
    alignItems: "center",
    justifyContent: "center",
  },
  optionWrapper: {
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.shadow,
    borderRadius: Sizes.fixPadding,
    ...CommonStyles.rowAlignCenter,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding + 5.0,
  },
  TextInput: {
    borderWidth:1.0,
    borderColor: Colors.grayColor,
    borderRadius: Sizes.fixPadding,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:'space-between',
    paddingHorizontal: Sizes.fixPadding + 2.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding * 5.0,
    marginBottom: Sizes.fixPadding * 3.0,
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
  dialogStyle: {
    width: "80%",
    borderRadius: Sizes.fixPadding,
    padding: 0,
    overflow: "hidden",
    tintColor:Colors.blackColor,
    
  },
  
});
