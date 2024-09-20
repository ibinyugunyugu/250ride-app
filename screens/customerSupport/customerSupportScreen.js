import {
  ScrollView,
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Colors,
  screenWidth,
  Fonts,
  Sizes,
  CommonStyles,
} from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import Header from "../../components/header";
import Ionicons from "react-native-vector-icons/Ionicons";
import AlertMessage from "../../components/alertMessage";
import usersApi from "../../api/users";
import LoadingIndicator from "../../components/loadingIndicator";
import { Snackbar } from "react-native-paper";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const CustomerSupportScreen = ({ navigation }) => {

  const [message, setMessage] = useState("");

  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showSnackBar, setShowSnackBar] = useState(false);
  const {t, i18n} = useTranslation();

  useEffect(() => {
    if(!showSnackBar) return;
    const timeOut = setTimeout(() => {
        navigation.pop();
    }, 3000);

    return () => {
      clearTimeout(timeOut)
    }
  }, [showSnackBar])


  const handleSubmit = async () => {
    if(!message){
      setFailed(true);
      return setErrorMessage(t("Tell us, how would you like us to support you"));
    }
      
    setFailed(false);
    setLoading(true);
    const result = await usersApi.sendMessage({message});
    setLoading(false);
    if (!result.ok) {
      setFailed(true);
      return setErrorMessage(result.data ? t(result.data.error) : t("Sending message failed, Try again"));
    }
    setMessage('');
    setShowSnackBar(true)
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={t("Customer support")} navigation={navigation} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
        >
          {constactInfo()}
          {messageInfo()}
        </ScrollView>
      </View>
      {submitButton()}
      {alertMessage()}
      {loadingIndicator()}
      {snackBarInfo()}
    </View>
  );

  function submitButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={!message}
        onPress={handleSubmit}
        style={{ ...CommonStyles.button, margin: Sizes.fixPadding * 2.0 }}
      >
        <Text style={{ ...Fonts.whiteColor18Bold }}>{t('Submit')}</Text>
      </TouchableOpacity>
    );
  }

  function alertMessage() {
    return <AlertMessage 
      visible={failed} 
      errorMessage={errorMessage} 
      setVisible={setFailed}
    />
  }

  function loadingIndicator(){
    return <LoadingIndicator visible={loading} />
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
        <Text style={{ ...Fonts.whiteColor14Medium }}>{t('Message sent')}!</Text>
      </Snackbar>
    );
  }
  

  function messageInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text
          style={{
            ...Fonts.blackColor15SemiBold,
            marginBottom: Sizes.fixPadding,
          }}
        >
          {t('Message')}
        </Text>
        <View style={styles.valueBox}>
          <TextInput
            style={{
              ...Fonts.blackColor15Medium,
              padding: 0,
              height: Platform.OS == "ios" ? 100.0 : null,
            }}
            placeholderTextColor={Colors.grayColor}
            selectionColor={Colors.blackColor}
            cursorColor={Colors.blackColor}
            multiline={true}
            numberOfLines={7}
            textAlignVertical="top"
            value={message}
            onChangeText={(value) => setMessage(value)}
          />
        </View>
      </View>
    );
  }

  function emailInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text
          style={{
            ...Fonts.blackColor15SemiBold,
            marginBottom: Sizes.fixPadding,
          }}
        >
          Email address
        </Text>
        <View style={styles.valueBox}>
          <TextInput
            placeholder="Enter your email address"
            style={styles.textFieldStyle}
            placeholderTextColor={Colors.grayColor}
            selectionColor={Colors.primaryColor}
            cursorColor={Colors.primaryColor}
            keyboardType="email-address"
          />
        </View>
      </View>
    );
  }

  function nameInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text
          style={{
            ...Fonts.blackColor15SemiBold,
            marginBottom: Sizes.fixPadding,
          }}
        >
          Name
        </Text>
        <View style={styles.valueBox}>
          <TextInput
            placeholder="Enter your name"
            style={styles.textFieldStyle}
            placeholderTextColor={Colors.grayColor}
            selectionColor={Colors.primaryColor}
            cursorColor={Colors.primaryColor}
          />
        </View>
      </View>
    );
  }

  function callAndMailButton() {
    return (
      <View
        style={{
          flexDirection: "row",
          marginBottom: Sizes.fixPadding,
          marginHorizontal: Sizes.fixPadding,
        }}
      >
        <View style={styles.callAndMailButtonStyle}>
          <Ionicons name="call-outline" color={Colors.primaryColor} size={20} />
          <Text
            numberOfLines={1}
            style={{
              marginLeft: Sizes.fixPadding,
              ...Fonts.primaryColor16SemiBold,
            }}
          >
            Call us
          </Text>
        </View>
        <View style={styles.callAndMailButtonStyle}>
          <Ionicons name="mail-outline" color={Colors.primaryColor} size={20} />
          <Text
            numberOfLines={1}
            style={{
              marginLeft: Sizes.fixPadding,
              ...Fonts.primaryColor16SemiBold,
            }}
          >
            Mail us
          </Text>
        </View>
      </View>
    );
  }

  function constactInfo() {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          margin: Sizes.fixPadding * 3.0,
        }}
      >
        <Image
          source={require("../../assets/images/customer_support.png")}
          style={{
            width: screenWidth / 2.5,
            height: screenWidth / 2.5,
            resizeMode: "contain",
          }}
        />
        <Text
          style={{
            ...Fonts.blackColor18SemiBold,
            marginTop: Sizes.fixPadding * 2.0,
          }}
        >
          {t('Get in touch with us')} 
        </Text>
      </View>
    );
  }
};

export default CustomerSupportScreen;

const styles = StyleSheet.create({
  valueBox: {
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding + 5.0,
    borderWidth:1.0,
    borderColor: Colors.grayColor,
    borderRadius: Sizes.fixPadding,
  },
  callAndMailButtonStyle: {
    flex: 1,
    ...CommonStyles.shadow,
    ...CommonStyles.rowAlignCenter,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding + 5.0,
    justifyContent: "center",
    marginHorizontal: Sizes.fixPadding,
  },
  textFieldStyle: {
    ...Fonts.blackColor15Medium,
    height: 20.0,
    padding: 0,
  },
});
