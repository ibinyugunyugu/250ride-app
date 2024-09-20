import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import React, { useState, useCallback } from "react";
import {
  Colors,
  Fonts,
  Sizes,
  CommonStyles,
  screenHeight,
} from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import IntlPhoneInput from "react-native-intl-phone-input";
import { useFocusEffect } from "@react-navigation/native";

const LoginScreen = ({ navigation }) => {
  const backAction = () => {
    if (Platform.OS === "ios") {
      navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
      });
    } else {
      backClickCount == 1 ? BackHandler.exitApp() : _spring();
      return true;
    }
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      navigation.addListener("gestureEnd", backAction);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", backAction);
        navigation.removeListener("gestureEnd", backAction);
      };
    }, [backAction])
  );

  function _spring() {
    setBackClickCount(1);
    setTimeout(() => {
      setBackClickCount(0);
    }, 1000);
  }

  const [backClickCount, setBackClickCount] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
          contentContainerStyle={{}}
        >
          {imageView()}
          {loginInfo()}
        </ScrollView>
      </View>
      {exitInfo()}
    </View>
  );

  function loginInfo() {
    return (
      <View style={{ flex: 1 }}>
        {loginDescription()}
        {mobileNumberInfo()}
        {loginButton()}
      </View>
    );
  }

  function loginButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.push("Register");
        }}
        style={{
          ...CommonStyles.button,
          marginVertical: Sizes.fixPadding * 4.0,
        }}
      >
        <Text style={{ ...Fonts.whiteColor18Bold }}>Login</Text>
      </TouchableOpacity>
    );
  }

  function mobileNumberInfo() {
    return (
      <IntlPhoneInput
        onChangeText={({ phoneNumber }) => setPhoneNumber(phoneNumber)}
        defaultCountry="US"
        containerStyle={styles.mobileNumberWrapStyle}
        placeholder={"Enter your mobile number"}
        phoneInputStyle={{ flex: 1, ...Fonts.blackColor15SemiBold }}
        placeholderTextColor={Colors.grayColor}
        dialCodeTextStyle={{
          ...Fonts.blackColor15SemiBold,
          marginHorizontal: Sizes.fixPadding - 2.0,
        }}
        modalCountryItemCountryNameStyle={{ ...Fonts.blackColor15SemiBold }}
        selectionColor={Colors.primaryColor}
        cursorColor={Colors.primaryColor}
      />
    );
  }

  function loginDescription() {
    return (
      <View style={{ alignItems: "center", margin: Sizes.fixPadding * 3.0 }}>
        <Text style={{ ...Fonts.blackColor20SemiBold }}>Login</Text>
        <Text
          style={{
            ...Fonts.grayColor15Medium,
            textAlign: "center",
            marginTop: Sizes.fixPadding,
          }}
        >
          Welcome, please login your account using mobile number
        </Text>
      </View>
    );
  }

  function imageView() {
    return (
      <View style={styles.imageViewWrapStyle}>
        <Image
          source={require("../../assets/images/auth.png")}
          style={{ width: "100%", height: "65%", resizeMode: "contain" }}
        />
      </View>
    );
  }

  function exitInfo() {
    return backClickCount == 1 ? (
      <View style={styles.exitInfoWrapStyle}>
        <Text style={{ ...Fonts.whiteColor14Medium }}>
          Press Back Once Again To Exit!
        </Text>
      </View>
    ) : null;
  }
};

export default LoginScreen;

const styles = StyleSheet.create({
  exitInfoWrapStyle: {
    backgroundColor: Colors.blackColor,
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    borderRadius: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
  },
  imageViewWrapStyle: {
    height: screenHeight / 2.7 + 20.0,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
  },
  mobileNumberWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding - 7.0,
    ...CommonStyles.shadow,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding,
  },
});
