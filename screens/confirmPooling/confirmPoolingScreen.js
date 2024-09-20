import { Text, View, Image, Platform, BackHandler, Dimensions} from "react-native";
import React, { useCallback, useEffect } from "react";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { resetData, setScheduled, setScreen } from "../../store/home";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const {width} = Dimensions.get('window');

const ConfirmPoolingScreen = ({ navigation, route }) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
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

  useEffect(()=>{
    dispatch(resetData());
  },[]);

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
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {congratsInfo()}
      </View>
      {backToHome()}
    </View>
  );

  function backToHome() {
    return (
      <Text
        onPress={() => { 
          dispatch(setScreen({screen:"RiderRequests"}));
          navigation.push("BottomTabBar");
        }}
        style={{
          ...Fonts.blackColor18SemiBold,
          margin: Sizes.fixPadding * 2.0,
          alignSelf: "center",
        }}
      >
        {t('close')}
      </Text>
    );
  }

  function congratsInfo() {
    return (
      <View style={{ alignItems: "center", margin: Sizes.fixPadding * 2.0, flex:1 }}>
        <View style={{flex:1, alignContent:'center', justifyContent:'center'}}>
          <Image
            source={require("../../assets/images/confirm_pooling.png")}
            style={{width, height:200, resizeMode:'contain' }}
          />
        </View>
        <View style={{flex:1}}>
          <Text
            style={{
              ...Fonts.blackColor18SemiBold,
              marginTop: Sizes.fixPadding * 2.0,
              marginBottom: Sizes.fixPadding * 2.0,
              textAlign:'center'
            }}
          >
            {t('congratulations')}
          </Text>
          <Text style={{ ...Fonts.blackColor14Medium, textAlign: "center" }}>
            {t(route?.params?.message)}
          </Text>
        </View>
        
      </View>
    );
  }
};

export default ConfirmPoolingScreen;
