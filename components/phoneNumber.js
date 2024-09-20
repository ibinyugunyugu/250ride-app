import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors, Fonts, Sizes } from "../constants/styles";
import IntlPhoneInput from "react-native-intl-phone-input";

export default function PhoneNumber({setPhone,title,phoneNumber={}, onFocus=()=>{}, onBlur=()=>{}}) {
  const handleSelect = (value) => {
    let phone = {
      phoneNumber:value.unmaskedPhoneNumber,
      countryCode:value.selectedCountry.dialCode,
      countryIso:value.selectedCountry.code,
    };
    setPhone(phone);
  }

  return (
    <View style={{marginBottom: Sizes.fixPadding * 2.0}}>
      <Text
        style={{
          ...Fonts.blackColor15Medium,
          marginBottom: Sizes.fixPadding,
        }}
      >
        {title}
      </Text>
      <IntlPhoneInput
        onChangeText={handleSelect}
        defaultCountry="RW"
        containerStyle={styles.mobileNumberWrapStyle}
        placeholder={phoneNumber?.phoneNumber ? phoneNumber?.phoneNumber : " "}
        phoneInputStyle={{ flex: 1, ...Fonts.blackColor15SemiBold }}
        placeholderTextColor={Colors.blackColor}
        dialCodeTextStyle={{
          ...Fonts.blackColor15SemiBold,
          marginHorizontal: Sizes.fixPadding - 2.0,
        }}
        modalCountryItemCountryNameStyle={{ ...Fonts.blackColor15SemiBold }}
        selectionColor={Colors.blackColor}
        cursorColor={Colors.blackColor}
        phoneNumber={phoneNumber?.phoneNumber}
        mask="999 999 999"
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  mobileNumberWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding - 7.0,
    borderWidth: 1.0,
    borderColor:Colors.blackColor
  },
})