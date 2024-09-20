import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import {
  Colors,
  Fonts,
  Sizes,
  CommonStyles,
  screenHeight,
} from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import OTPTextView from "react-native-otp-textinput";
import LoadingIndicator from "../../components/loadingIndicator";
import usersApi from "../../api/users";
import useAuth from "../../auth/useAuth";
import AlertMessage from "../../components/alertMessage";
import saveToStore from "../../hooks/saveToStore";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const VerificationScreen = ({ navigation, route }) => {
  const {params} = route;
  const [otpInput, setotpInput] = useState("");
  const [time, setTime] = useState(30);
  const auth = useAuth();
  const { user } = auth;
  const [refreshed, setRefreshed] = useState(false);
  const [verifyFailed, setVerifyFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fullPhone, setFullphone] = useState("");
  const [isSingle, setIsSingle] = useState(false);
  const {t} = useTranslation();
  const timeOutCallback = useCallback(
    () => setTime((currTimer) => (currTimer == 0 ? null : currTimer - 1)),
    []
  );

  useEffect(() => {
    time > 0 && setTimeout(timeOutCallback, 1000);
    () => {
      return clearTimeout(timeOutCallback);
    };
  }, [time, timeOutCallback]);

  const resetTimer = function () {
    if (!time) {
      setTime(30);
    }
  };

  const handleSubmit = async () => {
    setVerifyFailed(false);
    if(otpInput.length != 4){
      setVerifyFailed(true);
      return setErrorMessage(t('code must be 4-digit'))
    }
    setLoading(true);
    let userData = {...route.params, code: otpInput}
    try {
      const result = await usersApi.verifySms(userData);
      setLoading(false)
      if (!result.ok) {
        setErrorMessage(result.data.error ? t(result.data.error) : t('verification failed try again'))
        return setVerifyFailed(true);
      }
      auth.logIn(result.data);
      
      navigation.push("BottomTabBar");
    } catch (error) {
      setErrorMessage(t('unexpected error occured'))
      return setVerifyFailed(true);
    }
  };

  const resendSms = async () => {
    setLoading(true);
    setVerifyFailed(false);
    const result = await usersApi.resendSms();
    setLoading(false)
    if (!result.ok) {
      setErrorMessage(t('resend code failed'))
      return setVerifyFailed(true);
    }
    setotpInput("");
    resetTimer();
    setRefreshed(!refreshed);
  };

  useEffect(()=>{
    if(params?.countryCode && params?.phoneNumber && params?.name) { 
      setFullphone(params?.countryCode+' '+params?.phoneNumber); setIsSingle(true) 
    }
    else if(!params?.phoneNumber && user?.phoneVerified) navigation.push('BottomTabBar');
    else if(!user) navigation.navigate({name:'Home', merge:true});
    else if(user) setFullphone(user?.countryCode+' '+user?.phoneNumber);
  },[user, params])

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
          contentContainerStyle={{}}
        >
          {imageView()}
          <View style={{ flex: 1}}>
          {verificationInfo()}
          </View>
        </ScrollView>
      </View>
      <LoadingIndicator visible={loading} />
      {alertMessage()}
    </View>
  );

  function header() {
    return (
      <View
        style={{
          backgroundColor: Colors.bodyBackColor,
          padding: Sizes.fixPadding * 2.0,
        }}
      >
        <MaterialIcons
          name="arrow-back-ios"
          color={Colors.blackColor}
          size={22}
          onPress={() => {
            navigation.pop();
          }}
        />
      </View>
    );
  }

  function verificationInfo() {
    return (
      <View style={{ flex: 1 }}>
        {verificationDescription()}
        {otpFields()}
        {timeInfo()}
        {verifyButton()}
        {resendInfo()}
      </View>
    );
  }

  function timeInfo() {
    return (
      <Text
        style={{
          ...Fonts.blackColor16SemiBold,
          textAlign: "center",
          margin: Sizes.fixPadding * 3.0,
        }}
      >
        00:{time?.toString().length == 1 ? `0${time}` : time}
      </Text>
    );
  }

  function resendInfo() {
    return (
      <Text
        style={{
          ...Fonts.blackColor16SemiBold,
          margin: Sizes.fixPadding * 2.0,
          textAlign: "center",
        }}
      >
        {t("did not receive code")}? {}
        <Text
          onPress={resendSms}
          style={!time ? { ...Fonts.blueColor16SemiBold }:null}
        >
          {t("resend")}
        </Text>
      </Text>
    );
  }

  function otpFields() {
    return (
      <OTPTextView
        containerStyle={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          justifyContent: "center",
        }}
        handleTextChange={(text) => {
          setotpInput(text);
        }}
        inputCount={4}
        keyboardType="numeric"
        tintColor={Colors.blackColor}
        offTintColor={Colors.lightGrayColor}
        textInputStyle={{ ...styles.textFieldStyle }}
      />
    );
  }

  function verifyButton() {
    return (
      <TouchableOpacity
        disabled={otpInput.length !== 4}
        activeOpacity={0.8}
        onPress={handleSubmit}
        style={otpInput.length === 4 ? { ...CommonStyles.button } : { ...CommonStyles.button,backgroundColor:Colors.grayColor } }
      >
        <Text style={{ ...Fonts.whiteColor18Bold }}>{t('verify')}</Text>
      </TouchableOpacity>
    );
  }

  function verificationDescription() {
    return (
      <View style={{ alignItems: "center", margin: Sizes.fixPadding * 3.0 }}>
        <Text style={{ ...Fonts.blackColor20SemiBold }}>{t('otp verification')}</Text>
        <Text
          style={{
            ...Fonts.grayColor15Medium,
            textAlign: "center",
            marginTop: Sizes.fixPadding,
          }}
        >
          {t('confirmation code has been sent to you your mobile number')} {fullPhone}
        </Text>
      </View>
    );
  }

  function imageView() {
    return (
      <View style={styles.imageViewWrapStyle}>
        <Image
          source={require("../../assets/images/verification.png")}
          style={{ width: "100%", height: "65%", resizeMode: "contain" }}
        />
      </View>
    );
  }

  function alertMessage() {
    return <AlertMessage 
      visible={verifyFailed} 
      errorMessage={errorMessage} 
      setVisible={setVerifyFailed}
    />
  }
  
};

export default VerificationScreen;

const styles = StyleSheet.create({
  imageViewWrapStyle: {
    height: screenHeight / 2.7,
    backgroundColor: Colors.bodyBackColor,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -40.0,
  },
  textFieldStyle: {
    borderBottomWidth: null,
    borderRadius: Sizes.fixPadding - 5.0,
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.blackColor,
    borderWidth: 1.5,
    ...Fonts.blackColor20SemiBold,
    ...CommonStyles.shadow,
    marginHorizontal: Sizes.fixPadding - 3.0,
  },
  dialogStyle: {
    width: "85%",
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
