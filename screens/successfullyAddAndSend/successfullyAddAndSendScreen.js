import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  BackHandler,
} from "react-native";
import React, { useCallback } from "react";
import { Colors, Sizes, Fonts } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import { useFocusEffect } from "@react-navigation/native";

const SuccessfullyAddAndSendScreen = ({ navigation, route }) => {
  const backAction = () => {
    if (Platform.OS === "ios") {
      navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
      });
    } else {
      navigation.push("BottomTabBar");
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

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={styles.center}>{congratsInfo()}</View>
      {backToHome()}
    </View>
  );

  function backToHome() {
    return (
      <Text
        onPress={() => {
          navigation.push("BottomTabBar");
        }}
        style={{
          ...Fonts.primaryColor16SemiBold,
          margin: Sizes.fixPadding * 2.0,
          alignSelf: "center",
        }}
      >
        Back to home
      </Text>
    );
  }

  function congratsInfo() {
    return (
      <View style={{ alignItems: "center" }}>
        <Image
          source={require("../../assets/images/icons/success.png")}
          style={{ width: 83.0, height: 83.0, resizeMode: "contain" }}
        />
        <Text
          style={{
            ...Fonts.primaryColor20SemiBold,
            marginTop: Sizes.fixPadding + 8.0,
          }}
        >
          $150.00 {route?.params?.successFor == "money" ? "added" : "sended"}
        </Text>
        <Text
          style={{
            ...Fonts.grayColor14SemiBold,
            textAlign: "center",
            marginTop: Sizes.fixPadding,
          }}
        >
          {route?.params?.successFor == "money"
            ? "Congratulation your money successfully added into wallet"
            : "Congratulation your money successfully send in your bank"}
        </Text>
      </View>
    );
  }
};

export default SuccessfullyAddAndSendScreen;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: Sizes.fixPadding * 4.0,
  },
});
