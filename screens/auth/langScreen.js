import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  TouchableOpacity,
  BackHandler,
  Dimensions
} from "react-native";
import React, { useState, useCallback } from "react";
import {
  Colors,
  Fonts,
  Sizes,
  CommonStyles,
  screenHeight,
} from "../../constants/styles";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MyStatusBar from "../../components/myStatusBar";
import { useFocusEffect } from "@react-navigation/native";
import SelectDropdown from 'react-native-select-dropdown';
import { useSelector, useDispatch } from 'react-redux';
import { changeLanguage as changeLang, getLanguage } from "../../store/language";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 
import AsyncStorage from "@react-native-async-storage/async-storage";

const {width} = Dimensions.get('window');
const STORE_LANGUAGE_KEY = "settings.lang";

const LanguageScreen = ({ navigation }) => {
  const backAction = () => {
    if (Platform.OS === "ios") {
      navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
      });
    } else {
      backClickCount == 1 ? BackHandler.exitApp() : _spring();
      return true;
    }
  };

  const dispatch = useDispatch();
  const activeLang = useSelector(getLanguage());

  const {t, i18n} = useTranslation(); 
  
  const [currentLanguage,setLanguage] =useState('en'); 
  
  const changeLanguage = value => { 
    i18n 
      .changeLanguage(value) 
      .then(async () => {
        try {
          //save a user's language choice in Async storage
          await AsyncStorage.setItem(STORE_LANGUAGE_KEY, value);
        } catch (error) {}
        return setLanguage(value)
      }) 
      .catch(err => console.log(err)); 
  }; 

  
  const countriesWithFlags = [
    {title: 'English', image: require('../../assets/images/flags/gb.png')},
    {title: 'Kinyarwanda', image: require('../../assets/images/flags/rw.png')},
  ];
  const [selected, setSelected ] = useState(countriesWithFlags[activeLang]);

  const handleOnSelect = (selectedItem, id) => {
    let langs = ['en','kiny'];
    setSelected(selectedItem);
    dispatch(changeLang({id}));
    changeLanguage(langs[id]);
  }

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

  function _spring() {
    setBackClickCount(1);
    setTimeout(() => {
      setBackClickCount(0);
    }, 1000);
  }

  const [backClickCount, setBackClickCount] = useState(0);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
          contentContainerStyle={{}}
        >
          {imageView()}
          {languageInfo()}
        </ScrollView>
      </View>
      {exitInfo()}
    </View>
  );

  function languageInfo() {
    return (
      <View style={{ flex: 1, marginHorizontal:Sizes.fixPadding*3.0 }}>
        {languageDescription()}
        {mobileNumberInfo()}
        {changeLanguageButton()}
      </View>
    );
  }

  function changeLanguageButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.push("HomeGuest");
        }}
        style={{
          ...CommonStyles.button,
          marginVertical: Sizes.fixPadding * 4.0,
        }}
      >
        <Text style={{ ...Fonts.whiteColor18SemiBold }}>{t('select')}</Text>
      </TouchableOpacity>
    );
  }

  function mobileNumberInfo() {
    return (
      <View style={{
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginVertical: Sizes.fixPadding * 4.0, 
      }}>
        <SelectDropdown
          data={countriesWithFlags}
          // defaultValueByIndex={1}
          defaultValue={selected}
          onSelect={(selectedItem, index) => {
            handleOnSelect(selectedItem, index);
          }}
          buttonStyle={styles.dropdown3BtnStyle}
          renderCustomizedButtonChild={(selectedItem, index) => {
            return (
              <View style={styles.dropdown3BtnChildStyle}>
                {selectedItem ? (
                  <Image source={selectedItem.image} style={styles.dropdown3BtnImage} />
                ) : null}
                <Text style={styles.dropdown3BtnTxt}>{selectedItem ? selectedItem.title : t('select country')}</Text>
                <FontAwesome name="chevron-down" color={'#444'} size={18} />
              </View>
            );
          }}
          dropdownStyle={styles.dropdown3DropdownStyle}
          rowStyle={styles.dropdown3RowStyle}
          renderCustomizedRowChild={(item, index) => {
            return (
              <View style={styles.dropdown3RowChildStyle}>
                <Image source={item.image} style={styles.dropdownRowImage} />
                <Text style={styles.dropdown3RowTxt}>{item.title}</Text>
              </View>
            );
          }}
        />
      </View>
    );
  }

  function languageDescription() {
    return (
      <View style={{ alignItems: "center", marginVertical: Sizes.fixPadding * 3.0 }}>
        <Text style={{ ...Fonts.blackColor20SemiBold }}>{t('select your language')}</Text>
        
      </View>
    );
  }

  function imageView() {
    return (
      <View style={styles.imageViewWrapStyle}>
        <Image
          source={require("../../assets/images/language.png")}
          style={{ width: "100%", height: "65%", resizeMode: "contain" }}
        />
      </View>
    );
  }

  function exitInfo() {
    return backClickCount == 1 ? (
      <View style={styles.exitInfoWrapStyle}>
        <Text style={{ ...Fonts.whiteColor14Medium }}>
          {t('press back again')}
        </Text>
      </View>
    ) : null;
  }
};

export default LanguageScreen;

const styles = StyleSheet.create({
  exitInfoWrapStyle: {
    backgroundColor: Colors.blackColor,
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    borderRadius: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
  },
  imageViewWrapStyle: {
    height: screenHeight / 2.7 + 20.0,
    backgroundColor: Colors.whiteColor,
    alignItems: "center",
    justifyContent: "center",
  },
  mobileNumberWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding - 7.0,
    ...CommonStyles.shadow,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding,
  },

  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    width,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
  },
  headerTitle: {color: '#000', fontWeight: 'bold', fontSize: 16},
  saveAreaViewContainer: {flex: 1, backgroundColor: '#FFF'},
  viewContainer: {flex: 1, width, backgroundColor: '#FFF'},
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '10%',
    paddingBottom: '20%',
  },

  dropdown3BtnStyle: {
    width:'auto',
    backgroundColor: '#FFF',
    paddingHorizontal: 0,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.blackColor,
  },
  dropdown3BtnChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  dropdown3BtnImage: {width: 45, height: 35, resizeMode: 'cover'},
  dropdown3BtnTxt: {
    ...Fonts.blackColor16Medium,
    marginHorizontal: 12,
  },
  dropdown3DropdownStyle: {backgroundColor: 'slategray'},
  dropdown3RowStyle: {
    backgroundColor: Colors.whiteColor,
    borderBottomColor: Colors.blackColor,
    height: 50,
  },
  dropdown3RowChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  dropdownRowImage: {width: 45, height: 35, resizeMode: 'cover'},
  dropdown3RowTxt: {
    ...Fonts.blackColor16Medium,
    marginHorizontal: 12,
  }
});
