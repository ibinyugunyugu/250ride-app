import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import React, { useState } from "react";
import MyStatusBar from "../../components/myStatusBar";
import {
  Colors,
  Sizes,
  Fonts,
  screenWidth,
  CommonStyles,
} from "../../constants/styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from "react-native-gesture-handler";
import Header from "../../components/header";
import useAuth from "../../auth/useAuth";
import AlertMessage from "../../components/alertMessage";

const WalletScreen = ({ navigation }) => {
  const auth = useAuth();
  const { driver } = auth;
  const [balance, setBalance] = useState(parseInt(driver.balance));
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={"Wallet"} navigation={navigation} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Sizes.fixPadding }}
        >
          {walletImage()}
          {balanceInfo()}
        </ScrollView>
      </View>
      {alertMessage()}
    </View>
  );

  function balanceInfo() {
    return (
      <View style={styles.balanceInfoWrapper}>
        <View style={{ alignItems: "center", margin: Sizes.fixPadding * 4.0 }}>
          <Text style={{ ...Fonts.blackColor22Bold }}>{balance > 0 ? '-'+driver.balance : 0} Rwf</Text>
          <Text style={{ ...Fonts.blackColor18Medium }}>Available balance</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.push("Transactions");
          }}
          style={styles.optionWrapper}
        >
          <View>
            <MaterialCommunityIcons
              name="swap-vertical"
              color={Colors.secondaryColor}
              size={30}
            />
          </View>
          <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor16SemiBold }}>
              Transaction
            </Text>
            <Text
              numberOfLines={1}
              style={{
                ...Fonts.blackColor14Medium,
                marginTop: Sizes.fixPadding - 8.0,
              }}
            >
              View all transaction list
            </Text>
          </View>
          <Ionicons
            name="chevron-forward-outline"
            color={Colors.blackColor}
            size={24}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if(balance > 0){
              navigation.push("ClearBalance");
            }
            else{
              setMessage("You have no balance to clear");
              setAlert(true)
            }
          }}
          style={{
            ...styles.optionWrapper,
            marginVertical: Sizes.fixPadding * 2.0,
          }}
        >
          <Image
            source={require("../../assets/images/clear.png")}
            style={{width:30, height:30, resizeMode:'contain' }}
          />
          <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor16SemiBold }}>
              Clear Balance
            </Text>
            <Text
              numberOfLines={1}
              style={{
                ...Fonts.grayColor14Medium,
                marginTop: Sizes.fixPadding - 8.0,
              }}
            >
              You can clear balance
            </Text>
          </View>
          <Ionicons
            name="chevron-forward-outline"
            color={Colors.blackColor}
            size={24}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function walletImage() {
    return (
      <Image
        source={require("../../assets/images/wallet.png")}
        style={styles.walletImageStyle}
      />
    );
  }

  function alertMessage() {
    return <AlertMessage 
      visible={alert} 
      setVisible={setAlert} 
      errorMessage={message}
    /> 
  }

};

export default WalletScreen;

const styles = StyleSheet.create({
  balanceInfoWrapper: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    ...CommonStyles.shadow,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
    padding: Sizes.fixPadding + 5.0,
    marginTop: Sizes.fixPadding * 3.0,
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
});
