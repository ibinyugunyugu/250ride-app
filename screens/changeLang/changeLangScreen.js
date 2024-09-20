import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import {
  Colors,
  Fonts,
  Sizes,
  CommonStyles,
} from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import Header from "../../components/header";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 
import AsyncStorage from "@react-native-async-storage/async-storage";

const languages = ['English','Kinyarwanda'];
const STORE_LANGUAGE_KEY = "settings.lang";
const ChangeLangScreen = ({ navigation }) => {
  const {t, i18n} = useTranslation();
  let langs = ['en','kiny'];
  let index = langs.findIndex(x => x == i18n.language);
  const [selected, setSelected] = useState(index);

  const changeLanguage = value => { 
    i18n 
      .changeLanguage(value) 
      .then(async () => {
        try {
          //save a user's language choice in Async storage
          await AsyncStorage.setItem(STORE_LANGUAGE_KEY, value);
        } catch (error) {}
        return navigation.pop()
      }) 
      .catch(err => console.log(err)); 
  }; 

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={t("Choose your language")} navigation={navigation} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
        >
          {changeLang()}
        </ScrollView>
      </View>
      {submitButton()}
    </View>
  );

  function submitButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          changeLanguage(langs[selected]);
        }}
        style={{ ...CommonStyles.button, margin: Sizes.fixPadding * 2.0 }}
      >
        <Text style={{ ...Fonts.whiteColor18Bold }}>{t('confirm')}</Text>
      </TouchableOpacity>
    );
  }

  function changeLang() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text
          style={{
            ...Fonts.blackColor16SemiBold,
            marginBottom: Sizes.fixPadding,
          }}
        >
          {t('Choose your language')}
        </Text>
        {languages.map((lang,index) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setSelected(index);
            }}
            key={index}
            style={{
              marginVertical: Sizes.fixPadding,
              ...styles.locationBox,
            }}
          >
            <View
              style={index === selected ? {
                ...styles.locationIconWrapper,
                backgroundColor:Colors.secondaryColor
              }
              :
              {...styles.locationIconWrapper}
            }
            >
              <MaterialIcons
                name="check"
                color={Colors.whiteColor}
                size={20.0}
              />
            </View>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor16Medium, marginLeft: Sizes.fixPadding }}>
              {lang}
            </Text>
          </TouchableOpacity>
        ))}
        
      </View>
    );
  }
};

export default ChangeLangScreen;

const styles = StyleSheet.create({
  locationIconWrapper: {
    width: 24.0,
    height: 24.0,
    borderRadius: 12.0,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.secondaryColor,
  },
  locationBox: {
    backgroundColor: Colors.whiteColor,
    flexDirection: "row",
    alignItems: "center",
  },
});
