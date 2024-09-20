import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import Header from "../../components/header";
import { CreditCardInput } from "rn-card-input";

const CreditCardScreen = ({ navigation }) => {
  const [cardNumberStatus, setcardNumberStatus] = useState("invalid");
  const [cardExpiryStatus, setcardExpiryStatus] = useState("invalid");
  const [cardCvcStatus, setcardCvcStatus] = useState("invalid");
  const [cardHolderStatus, setcardHolderStatus] = useState("invalid");
  const [saveCard, setsaveCard] = useState(true);

  const _onChange = (formData) => {
    setcardNumberStatus(formData.values.number);
    setcardExpiryStatus(formData.values.expiry);
    setcardCvcStatus(formData.values.cvc);
    setcardHolderStatus(formData.values.name);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={"Credit card"} navigation={navigation} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
          contentContainerStyle={{ paddingTop: Sizes.fixPadding * 2.0 }}
        >
          {cardDetails()}
        </ScrollView>
      </View>
      {continueButton()}
    </View>
  );

  function continueButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.push("SuccessfullyAddAndSend", { successFor: "money" });
        }}
        style={{
          ...CommonStyles.button,
          marginVertical: Sizes.fixPadding * 2.0,
        }}
      >
        <Text style={{ ...Fonts.whiteColor18Bold }}>Continue</Text>
      </TouchableOpacity>
    );
  }

  function cardDetails() {
    return (
      <CreditCardInput
        requiresName
        requiresCVC
        labelStyle={{ ...Fonts.blackColor16SemiBold }}
        inputStyle={styles.cardInputFieldStyle}
        inputContainerStyle={{
          marginTop: Sizes.fixPadding * 2.0,
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
        cardFontFamily={"Montserrat_SemiBold"}
        cardScale={1.13}
        validColor={"black"}
        invalidColor={"red"}
        placeholderColor={Colors.grayColor}
        onChange={_onChange}
        cardImageFront={require("../../assets/images/card_bg.png")}
        cardImageBack={require("../../assets/images/card_bg.png")}
      />
    );
  }
};

export default CreditCardScreen;

const styles = StyleSheet.create({
  cardInputFieldStyle: {
    ...Fonts.blackColor16Medium,
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.shadow,
    borderColor: Colors.lightGrayColor,
    borderWidth: 1.0,
    paddingHorizontal: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding - 5.0,
    height: 50.0,
    marginTop: Sizes.fixPadding - 2.0,
  },
});
