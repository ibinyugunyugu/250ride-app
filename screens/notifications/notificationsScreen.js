import { StyleSheet, View, Animated, Image, Text, Alert, Pressable } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import {
  Colors,
  CommonStyles,
  Fonts,
  Sizes,
  screenWidth,
} from "../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SwipeListView } from "react-native-swipe-list-view";
import { Snackbar } from "react-native-paper";
import Header from "../../components/header";
import MyStatusBar from "../../components/myStatusBar";
import { getNotifications } from "../../store/notifications";
import { useSelector } from "react-redux";
import getDate from "../../functions/getDate";
import { useDispatch } from "react-redux";
import { setTempInfo } from "../../store/tempInfo";
import notificationsApi from "../../api/notifications";
import { setRideId, setScreen, setRequestId } from "../../store/home";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 
const rowTranslateAnimatedValues = {};

const NotificationsScreen = ({ navigation }) => {
  const notifications = useSelector(getNotifications()); 
  const dispatch = useDispatch();
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [listData, setListData] = useState(notifications);
  const {t, i18n} = useTranslation();

  Array(listData.length + 1)
    .fill("")
    .forEach((_, i) => {
      rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
    });

  const animationIsRunning = useRef(false);

  const handlePress = (data) => {
    let {item} = data;
    if(item.ride_id || item.ride_request_id){

      dispatch(setRideId({ride_id:item.ride_id}));
      dispatch(setRequestId({ride_request_id:item.ride_request_id}))
      dispatch(setScreen({screen:item.screen}));
      if(item.screen === "AvailableRides") return navigation.push(item.screen);
      else return navigation.push("BottomTabBar");
      
    }
    else{
      return Alert.alert(item?.title, item?.body);
    }
  }

  function translateBody(str) {
    if(i18n.language !== 'kiny') return str; 
    const obj = {
      "Hey, there is a new ride heading to":"Hari urugendo rushya rubonetse rwerekeza", 
      "check it out" : "rurebe",
      "Your ride heading to" : "Urugendo rwanyu rwerekeza",
      "have been updated" : "rwahinduwe",
      "have just started at" : "ruratangijwe, bikozwe ",
      "have just ended at" : "rurasojwe, bikozwe ",
      "A new request is available for one of your rides" : "Mufite ubusabe bushya kuri rumwe mu ngendo zanyu",
      "A seat in your ride have just been booked" : "Umwanya mu rugendo rwanyu usabwe numugenzi",
      "keep it up" : "mukomereze aho",
      "has confirmed ride heading to" : "amaze kwemeza urugendo rwerekeza",
      "Payment mode is" : "Uburyo bwo kwishyura ni",
      "one of the rides you booked, have been canceled by the driver" : "Rumwe mu ngendo wasabyemo umwanya, ruhagaritswe na shoferi",
      "Good news, your request for a ride heading to" : "Amakuru meza, ubusabe bwanyu mu rugendo rwerekeza",
      "have been approved" : "bumaze kwemerwa",
      "have been declined" : "ntibwemewe",
    };

    for (const x in obj) {
      str = str.replace(new RegExp(x, 'g'), obj[x]);
    }
    return str;
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={t("Notification")} navigation={navigation} />
        {listData.length == 0 ? noNotificationInfo() : notificationsInfo()}
      </View>
      {snackBar()}
    </View>
  );

  function noNotificationInfo() {
    return (
      <View style={styles.noNotificationPage}>
        <Image
          source={require("../../assets/images/icons/empty_noty.png")}
          style={{ width: 65, height: 65, resizeMode: "contain" }}
        />
        <Text
          style={{
            ...Fonts.grayColor18SemiBold,
            marginTop: Sizes.fixPadding,
          }}
        >
          {t('No new notification')}
        </Text>
      </View>
    );
  }

  function snackBar() {
    return (
      <Snackbar
        style={{ backgroundColor: Colors.blackColor }}
        elevation={0}
        visible={showSnackBar}
        onDismiss={() => setShowSnackBar(false)}
      >
        <Text style={{ ...Fonts.whiteColor14Medium }}>
          Notification Dismissed!
        </Text>
      </Snackbar>
    );
  }

  function notificationsInfo() {
    const onSwipeValueChange = (swipeData) => {
      const { key, value } = swipeData;
      if (
        value > screenWidth ||
        (value < -screenWidth && !animationIsRunning.current)
      ) {
        animationIsRunning.current = true;
        Animated.timing(rowTranslateAnimatedValues[key], {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          const newData = [...listData];
          const prevIndex = listData.findIndex((item) => item.key === key);
          const notyId = listData[prevIndex].id;
          notificationsApi.deleteNotification(notyId);
          newData.splice(prevIndex, 1);
          setListData(newData);
          setShowSnackBar(true);
          animationIsRunning.current = false;
        });
      }
    };

    const renderItem = (data) => (
      <Pressable
        onPress={()=>{
          handlePress(data)
        }}
      >
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
          <View
            style={{
              marginHorizontal: Sizes.fixPadding * 2.0,
              paddingVertical: Sizes.fixPadding * 2.0,
            }}
          >
            <View style={{ ...CommonStyles.rowAlignCenter }}>
              <View style={{ ...CommonStyles.shadow, ...styles.iconWrapStyle }}>
                <MaterialIcons
                  name="notifications-none"
                  size={22}
                  color={Colors.secondaryColor}
                />
              </View>
              <View style={{ flex: 1, marginLeft: Sizes.fixPadding + 5.0 }}>
                <Text
                  numberOfLines={1}
                  style={!data.item.delivered ? { ...Fonts.blackColor16SemiBold } : { ...Fonts.blackColor15Medium }}
                >
                  {t(data.item.title)}
                </Text>
                <Text
                  numberOfLines={4}
                  style={{
                    marginVertical: Sizes.fixPadding - 7.0,
                    ...Fonts.blackColor14Medium,
                  }}
                >
                  {translateBody(data.item.body)}
                </Text>
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                  <Text style={{ ...Fonts.grayColor14SemiBold }}>{getDate(data.item.created_at)}</Text>
                  {data.item.matched ? <View style={{flexDirection:'row'}}>
                    <View style={styles.locationIconWrapper}>
                      <MaterialIcons
                        name="check"
                        color={Colors.whiteColor}
                        size={16.0}
                      />
                    </View>
                    <Text numberOfLines={1} style={{ ...Fonts.blackColor14SemiBold, marginLeft: Sizes.fixPadding }}>
                      {t('Matched')}
                    </Text>
                  </View> : null}
                </View>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: Colors.lightGrayColor,
            height: 1.0,
          }}
        />
      </Pressable>
    );

    const renderHiddenItem = (data) => <View style={styles.rowBack} />;

    return (
      <SwipeListView
        data={listData}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-screenWidth}
        leftOpenValue={screenWidth}
        onSwipeValueChange={onSwipeValueChange}
        useNativeDriver={false}
        showsVerticalScrollIndicator={false}
      />
    );
  }
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  rowBack: {
    backgroundColor: Colors.primaryColor,
    flex: 1,
  },
  iconWrapStyle: {
    width: 50.0,
    height: 50.0,
    borderRadius: 25.0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.whiteColor,
  },
  noNotificationPage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: Sizes.fixPadding * 2.0,
  },
  locationIconWrapper: {
    width: 20.0,
    height: 20.0,
    borderRadius: 10.0,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.greenColor,
    backgroundColor: Colors.greenColor
  },
});
