import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  Colors,
  Sizes,
  Fonts,
  CommonStyles,
  screenHeight,
} from "../constants/styles";
import MyStatusBar from "../components/myStatusBar";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import LoadingIndicator from "../components/loadingIndicator";
import authApi from "../api/auth";
import useAuth from "../auth/useAuth";
import AlertMessage from "../components/alertMessage";
import PhoneNumber from "../components/phoneNumber";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import '../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const SignUpScreen = ({ navigation, route }) => {

  const auth = useAuth();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState({});
  const [signUpFailed, setSignUpFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [marginBottom, setMarginBottom] = useState(0);
  const [agree, setAgree] = useState(false);
  const {t} = useTranslation(); 

  useEffect(() => {
    if (route.params?.phoneNumber) {
      setPhoneNumber(route.params?.phoneNumber);
      setErrorMessage(t(route.params?.errorMessage));
      return setSignUpFailed(true);
    }
  }, [route.params?.phoneNumber]);

  const handleSubmit = async () => {
    if (!phoneNumber?.phoneNumber || !name) {
      setErrorMessage(t('provide all details'));
      return setSignUpFailed(true);
    }
    else if (!agree) {
      setErrorMessage(t('please read and tick the box if you agree'));
      return setSignUpFailed(true);
    }
    setSignUpFailed(false);
    setLoading(true);
    const result = await authApi.signupRider({ ...phoneNumber, name });
    setLoading(false);
    if (!result.ok) {
      setErrorMessage(result.data ? t(result.data.error) : t('sign up failed try again'))
      return setSignUpFailed(true);
    }
    auth.logIn(result.data);

    navigation.push("Verification");
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

  function loadingIndicator() {
    return (<LoadingIndicator visible={loading} />)
  }

  function signUpDetails() {
    return (
      <View style={[styles.container, { marginBottom: Platform.OS == "ios" ? marginBottom : 0 }]}>
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
                paddingBottom: Sizes.fixPadding * 2.0,
              }}
            >
              { t('sign up')}
            </Text>
            <View style={{ marginBottom: Sizes.fixPadding * 2.0 }}>
              <Text
                style={{
                  ...Fonts.blackColor15Medium,
                  marginBottom: Sizes.fixPadding,
                }}
              >
                { t('name')}
              </Text>
              <View style={styles.valueBox}>
                <TextInput
                  style={{
                    ...Fonts.blackColor15Medium,
                    height: 44
                  }}
                  selectionColor={Colors.blackColor}
                  cursorColor={Colors.blackColor}
                  onChangeText={setName}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </View>
            </View>
            <PhoneNumber title={t('telephone')} setPhone={setPhoneNumber} phoneNumber={phoneNumber} onFocus={handleFocus} onBlur={handleBlur} />
            <View style={styles.infoRow}>
              <Text
                style={{
                  ...Fonts.blackColor15Medium,
                }}
              >
                 {t('terms and conditions')}
              </Text>
              <View style={{ ...CommonStyles.rowAlignCenter }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setAgree(!agree);
                  }}
                  style={{
                    marginVertical: Sizes.fixPadding,
                    ...styles.agreeBox,
                  }}
                >
                  <View
                    style={agree ? {
                      ...styles.agreeWrapper,
                      backgroundColor: Colors.secondaryColor
                    }
                      :
                      { ...styles.agreeWrapper }
                    }
                  >
                    <MaterialIcons
                      name="check"
                      color={Colors.whiteColor}
                      size={20.0}
                    />
                  </View>
                  <View style={{ flexDirection: 'row', flex: 1, paddingLeft: Sizes.fixPadding }}>
                    <Text >
                      {t('i certify that i have read and accept')}
                      <Text onPress={() => { navigation.push('TermsAndConditions') }} style={{ color: Colors.secondaryColor }}> {t('terms and conditions')} </Text>
                      {t('and')}
                      <Text onPress={() => { navigation.push('PrivacyPolicy') }} style={{ color: Colors.secondaryColor }}> {t('privacy statement')} </Text>
                      {t('and that all information i gave above is all correct')}
                    </Text>
                  </View>

                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.pop();
              }}
              style={{ ...CommonStyles.button, ...styles.dialogButton, backgroundColor: Colors.whiteColor }}
            >
              <Text style={{ ...Fonts.blackColor15Medium }}>
              {t('cancel')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit}
              style={{ ...CommonStyles.button, ...styles.dialogButton }}
            >
              <Text style={{ ...Fonts.whiteColor15Medium }}>
                {t('sign up')}
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
      visible={signUpFailed}
      setVisible={setSignUpFailed}
      errorMessage={errorMessage}
    />
  }

  function handleFocus() {
    setMarginBottom(150)
  }

  function handleBlur() {
    setMarginBottom(0)
  }
};

export default SignUpScreen;

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
    top: 0,
    bottom: 0,
    justifyContent: 'center',

  },
  wrapper: {
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.shadow,
    margin: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding,
    borderWidth: 0,
    paddingBottom: Sizes.fixPadding * 2.0
  },
  findAndOfferRideButtonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Sizes.fixPadding,
    borderColor: Colors.secondaryColor,
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
  repentionWrapper: {
    borderRadius: Sizes.fixPadding,
    borderWidth: 1.0,
    marginTop: Sizes.fixPadding * 2.0,
  },
  repention: {
    flexDirection: "row",
    alignItems: "center",
    padding: Sizes.fixPadding + 2.0,
  },
  days: {
    flexDirection: "row",
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
  dayView: {
    paddingBottom: Sizes.fixPadding + 3.0,
  },
  daySelect: {
    flexDirection: "row",
    alignItems: 'center',
    paddingTop: Sizes.fixPadding + 3.0,
    justifyContent: 'space-evenly',
  },
  day: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#0CB408',
    borderRadius: 13,
    borderWidth: 2,
    height: 26,
    width: 26
  },
  dayOff: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'transparent',
    borderRadius: 15,
    borderWidth: 2,
    height: 30,
    width: 30
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
    paddingHorizontal: Sizes.fixPadding * 2.0,
    marginLeft: 0,
  },
  viewAvailable: {
    ...Fonts.blueColor14SemiBold,
    textAlign: 'center',
    marginVertical: Sizes.fixPadding * 2.0,
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
    borderWidth: 1.0,
    borderColor: Colors.blackColor,
    borderRadius: Sizes.fixPadding,
    height: 44
  },
  mobileNumberWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding - 7.0,
    borderWidth: 1.0,
    borderColor: Colors.blackColor
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  agreeWrapper: {
    width: 24.0,
    height: 24.0,
    borderRadius: 2.0,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.secondaryColor,
  },
  agreeBox: {
    backgroundColor: Colors.whiteColor,
    flexDirection: "row",
    alignItems: "center",
  },
});
