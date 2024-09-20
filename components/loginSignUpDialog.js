import { Overlay } from "@rneui/base";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import {
    Colors,
    Sizes,
    Fonts,
    CommonStyles,
    screenHeight,
  } from "../constants/styles";
  import '../assets/i18n/i18n';
  import {useTranslation} from 'react-i18next'; 

const LoginSignUpDialog = ({showDialog, setshowDialog, navigation, selectedTabIndex}) => {
  const {t} = useTranslation(); 
    return (
      <Overlay
        isVisible={showDialog}
        onBackdropPress={() => setshowDialog(false)}
        overlayStyle={styles.dialogStyle}
      >
        <View>
          <Text style={{ ...Fonts.blackColor16SemiBold, textAlign: "center" }}>
          {t('your account')}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setshowDialog(false);
            navigation.push("SignIn", {category:selectedTabIndex});
          }}
          style={{ ...CommonStyles.button, ...styles.dialogButton }}
        >
          <Text style={{ ...Fonts.whiteColor15Medium }}>
            {selectedTabIndex == 1 ? t('existing rider') : t('existing driver')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setshowDialog(false);
            navigation.push(selectedTabIndex == 1 ? "SignUp" : "DriverSignUp", {category:selectedTabIndex});
          }}
          style={{ ...CommonStyles.button, ...styles.dialogButton }}
        >
          <Text style={{ ...Fonts.whiteColor15Medium }}>
            {selectedTabIndex == 1 ? t('new rider') : t('new driver')}
          </Text>
        </TouchableOpacity>
      </Overlay>
    );
  }

  export default LoginSignUpDialog;

  const styles = StyleSheet.create({
    dialogStyle: {
			width: "80%",
			borderRadius: Sizes.fixPadding,
			padding: 0,
			overflow: "hidden",
			paddingVertical:Sizes.fixPadding * 4.0,
      backgroundColor:Colors.whiteColor
    },
		dialogButton: {
			marginTop: Sizes.fixPadding * 2.0,
		},
  });