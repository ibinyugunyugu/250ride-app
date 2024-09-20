import React from "react";
import {
	Colors,
	Sizes,
	Fonts,
} from "../constants/styles";
import { View, StyleSheet, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Overlay } from "@rneui/themed";
import '../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

export default function LoadingIndicator({ visible=false }) {
  const {t} = useTranslation(); 
  return (
      <Overlay isVisible={visible} overlayStyle={styles.dialogStyle}>
        <View style={{ margin: Sizes.fixPadding * 3.0 }}>
          <ActivityIndicator size={40} color={Colors.secondaryColor} />
          <Text
            style={{
              marginTop: Sizes.fixPadding,
              ...Fonts.blackColor18SemiBold,
            }}
          >
          {t('loading')}
          </Text>
        </View>
      </Overlay>
  );
}

const styles = StyleSheet.create({
  dialogStyle: {
    width: "85%",
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});