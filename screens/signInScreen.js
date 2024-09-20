import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import {
  Colors,
  Sizes,
  Fonts,
  CommonStyles,
  screenHeight,
} from "../constants/styles";
import MyStatusBar from "../components/myStatusBar";
import IntlPhoneInput from "react-native-intl-phone-input";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import LoadingIndicator from "../components/loadingIndicator";
import authApi from "../api/auth";
import useAuth from "../auth/useAuth";
import AlertMessage from "../components/alertMessage";
import PhoneNumber from "../components/phoneNumber";
import saveToStore from "../hooks/saveToStore";
import '../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const SignInScreen = ({ navigation, route }) => {

  const auth = useAuth();
  const [phoneNumber, setPhoneNumber] = useState({});
  const [loginFailed, setLoginFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {params} = route;
  const {t} = useTranslation(); 

  const handleSubmit = async () => {
    if (!phoneNumber){
      setErrorMessage(t('provide all details'));
      setLoginFailed(true);
    }
    setLoginFailed(false);
    setLoading(true);
    const result = await authApi.login({...phoneNumber, category:params?.category});
    setLoading(false) 
    if (!result.ok) {
      setErrorMessage(result.data.error ? t(result.data.error) : t('login failed try again'));
      
      if(result.status === 400) navigation.push('SignUp',{phoneNumber, errorMessage}); 
      else setLoginFailed(true);
      return true;
    }
    auth.logIn(result.data);
    
    navigation.push("Verification", { ...phoneNumber, category:params?.category });
  };


  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {map()}
        {signUpDetails()}
        {alertMessage()}
      </View>
      {loadingIndicator()}
    </View>
  );

  function loadingIndicator(){
    return (<LoadingIndicator visible={loading}/>)
  }

  function signUpDetails() {
    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View
            style={{
              marginHorizontal: Sizes.fixPadding * 2.0,
              marginTop: Sizes.fixPadding * 3.0,
            }}
          >
            
            <Text
              style={{
                ...Fonts.blackColor20SemiBold,
                textAlign: "center",
                paddingBottom:Sizes.fixPadding * 2.0,
              }}
            >
              { t('login')}
            </Text>
            <PhoneNumber title={t('telephone')} setPhone={setPhoneNumber} />
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.pop();
              }}
              style={{ ...CommonStyles.button, ...styles.dialogButton, backgroundColor:Colors.whiteColor }}
            >
              <Text style={{ ...Fonts.blackColor15Medium }}>
              { t('cancel')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit}
              style={{ ...CommonStyles.button, ...styles.dialogButton }}
              >
              <Text style={{ ...Fonts.whiteColor15Medium }}>
              { t('login')}
              </Text>
            </TouchableOpacity>
          </View>
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

  function alertMessage() {
    return <AlertMessage 
      visible={loginFailed} 
      setVisible={setLoginFailed} 
      errorMessage={errorMessage} 
    />
  }
};

export default SignInScreen;

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
  wrapper: {
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.shadow,
    margin: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding,
    borderWidth: 0,
    paddingBottom:Sizes.fixPadding * 2.0
  },
  findAndOfferRideButtonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Sizes.fixPadding,
    borderColor:Colors.secondaryColor,
    backgroundColor: Colors.bodyBackColor,
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
    paddingHorizontal:Sizes.fixPadding * 2.0,
    marginLeft:0,
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
  valueBox: {
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding + 5.0,
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
  btnContainer:{
    flexDirection:'row',
    justifyContent:'flex-end'
  }
});
