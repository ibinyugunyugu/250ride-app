import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import {
	Colors, Sizes,
} from "../constants/styles";
import useLocation from "../hooks/useLocation";
import '../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

function OfflineNotice(props) {
  const {t, i18n} = useTranslation();

  const netInfo = useNetInfo();
  useLocation();
  if (netInfo.type !== "unknown" && netInfo.isInternetReachable === false)
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{t('no internet connection')}</Text>
      </View>
    );

  return null;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: Colors.blackColor,
    justifyContent: "center",
    position: "absolute",
    // top: Constants.statusBarHeight,
    paddingVertical:Sizes.fixPadding,
    width: "100%",
    zIndex: 1,
  },
  text: {
    color: Colors.whiteColor,
  },
});

export default OfflineNotice;
