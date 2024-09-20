import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import {
  Colors,
  Fonts,
  Sizes,
  CommonStyles,
  screenHeight,
} from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const RegisterScreen = ({ navigation }) => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
          contentContainerStyle={{}}
        >
          {imageView()}
          {registerInfo()}
        </ScrollView>
      </View>
    </View>
  );

  function header() {
    return (
      <View
        style={{
          backgroundColor: Colors.primaryColor,
          padding: Sizes.fixPadding * 2.0,
        }}
      >
        <MaterialIcons
          name="arrow-back-ios"
          color={Colors.whiteColor}
          size={22}
          onPress={() => {
            navigation.pop();
          }}
        />
      </View>
    );
  }

  function registerInfo() {
    return (
      <View style={{ flex: 1 }}>
        {registerDescription()}
        {nameInfo()}
        {emailInfo()}
        {phoneNumberInfo()}
        {registerButton()}
      </View>
    );
  }

  function phoneNumberInfo() {
    return (
      <View style={{ ...styles.valueBox }}>
        <Ionicons name="call-outline" color={Colors.grayColor} size={18} />
        <TextInput
          placeholder="Enter your phone number"
          style={styles.textFieldStyle}
          placeholderTextColor={Colors.grayColor}
          selectionColor={Colors.primaryColor}
          cursorColor={Colors.primaryColor}
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={(value) => setPhoneNumber(value)}
        />
      </View>
    );
  }

  function emailInfo() {
    return (
      <View
        style={{ ...styles.valueBox, marginVertical: Sizes.fixPadding * 2.0 }}
      >
        <Ionicons name="mail-outline" color={Colors.grayColor} size={18} />
        <TextInput
          placeholder="Enter your email address"
          style={styles.textFieldStyle}
          placeholderTextColor={Colors.grayColor}
          selectionColor={Colors.primaryColor}
          cursorColor={Colors.primaryColor}
          keyboardType="email-address"
          value={email}
          onChangeText={(value) => setemail(value)}
        />
      </View>
    );
  }

  function nameInfo() {
    return (
      <View style={{ ...styles.valueBox, marginTop: Sizes.fixPadding }}>
        <Ionicons name="person-outline" color={Colors.grayColor} size={18} />
        <TextInput
          placeholder="Enter your name"
          style={styles.textFieldStyle}
          placeholderTextColor={Colors.grayColor}
          selectionColor={Colors.primaryColor}
          cursorColor={Colors.primaryColor}
          value={name}
          onChangeText={(value) => setname(value)}
        />
      </View>
    );
  }

  function registerButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.push("Verification");
        }}
        style={{
          ...CommonStyles.button,
          marginVertical: Sizes.fixPadding * 4.0,
        }}
      >
        <Text style={{ ...Fonts.whiteColor18Bold }}>Register</Text>
      </TouchableOpacity>
    );
  }

  function registerDescription() {
    return (
      <View style={{ alignItems: "center", margin: Sizes.fixPadding * 3.0 }}>
        <Text style={{ ...Fonts.blackColor20SemiBold }}>Register</Text>
        <Text
          style={{
            ...Fonts.grayColor15Medium,
            textAlign: "center",
            marginTop: Sizes.fixPadding,
          }}
        >
          Welcome, please create your account using email address
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
};

export default RegisterScreen;

const styles = StyleSheet.create({
  imageViewWrapStyle: {
    height: screenHeight / 2.7,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -40.0,
  },
  valueBox: {
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding + 5.0,
    ...CommonStyles.shadow,
    borderRadius: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    ...CommonStyles.rowAlignCenter,
  },
  textFieldStyle: {
    ...Fonts.blackColor15Medium,
    height: 20.0,
    padding: 0,
    flex: 1,
    marginLeft: Sizes.fixPadding,
  },
});
