import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Colors, Fonts, Sizes, CommonStyles } from "../constants/styles";
import { View, StyleSheet, Text, BackHandler, Platform, Image } from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import RidesScreen from "../screens/rides/ridesScreen";
import SearchScreen from "../screens/search/searchScreen";
import HomeScreen from "../screens/home/homeScreen";
import ProfileScreen from "../screens/profile/profileScreen";
import RiderRequestsScreen from "../screens/riderRequests/riderRequestsScreen";
import RideRequestScreen from "../screens/rideRequest/rideRequestScreen";
import useAuth from "../auth/useAuth";
import { useSelector, useDispatch } from 'react-redux';
import { getScreen, getUserData, resetScreen, setRequestId, setRideId, setScreen } from "../store/home";
import MyRidesScreen from "../screens/rides/myRidesScreen";
import SearchRequestsScreen from "../screens/search/searchRequestsScreen";
import useApi from "../hooks/useApi";
import notificationsApi from "../api/notifications";
import { setNotifications } from "../store/notifications";
import useNotifications from "../hooks/useNotifications";
import '../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const Tab = createBottomTabNavigator();

const BottomTabBarScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const screen = useSelector(getScreen());
  const homeData = useSelector(getUserData());
  useNotifications((notification)=>handlePress(notification?.notification?.request?.content));
  const auth = useAuth();
  const { user } = auth;
  const {t, i18n} = useTranslation();

  const getNotificationsApi = useApi(notificationsApi.getNotifications);

  useFocusEffect(
    useCallback(() => {
      getNotificationsApi.request();
      dispatch(resetScreen());
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(setNotifications({notifications:getNotificationsApi.data}));
    }, [getNotificationsApi.data])
  );

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

  const handlePress = (item) => {
    let {data} = item;
    dispatch(setRideId({ride_id:data.ride_id}));
    dispatch(setRequestId({ride_request_id:data.ride_request_id}))
    dispatch(setScreen({screen:data.screen}));
    if(data.screen === "AvailableRides") return navigation.push(data.screen);
    else return navigation.push("BottomTabBar");
  }
   
  const [backClickCount, setBackClickCount] = useState(0);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors.secondaryColor,
          tabBarInactiveTintColor: Colors.blackColor,
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBarStyle,
        }}
        initialRouteName={screen ? screen : (homeData.searched == 1 ? "Search" : "Home")}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused, color }) =>
              tabSort({
                focused,
                color,
                icon: "home-outline",
                tab: t('homeTab'),
                isRotate: false,
              }),
          }}
        />
        <Tab.Screen
          name="Search"
          component={user?.currentProfile === '1' ? SearchScreen : SearchRequestsScreen}
          options={{
            tabBarIcon: ({ focused, color }) =>
              tabSort({
                focused,
                color,
                icon: "search",
                tab: t('searchTab'),
                isRotate: false,
              }),
          }}
        />
        <Tab.Screen
          name="Rides"
          component={user?.currentProfile === '1' ? RidesScreen : MyRidesScreen}
          options={{
            tabBarIcon: ({ focused, color }) =>
              tabSort({
                focused,
                color,
                icon: 'car',
                // icon: require("../assets/images/icons/rides.png"),
                tab: t('ridesTab'),
                isRotate: false,
                isImage:false
              }),
          }}
        />
        <Tab.Screen
          name="RiderRequests"
          component={user?.currentProfile === '1' ? RiderRequestsScreen : RideRequestScreen}
          options={{
            tabBarIcon: ({ focused, color }) =>
              tabSort({
                focused,
                color,
                icon: "git-pull-request-outline",
                tab: t('requestsTab'),
                isRotate: false,
              }),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused, color }) =>
              tabSort({
                focused,
                color,
                icon: "person-outline",
                tab: t('profileTab'),
                isRotate: false,
              }),
          }}
        />
      </Tab.Navigator>
      {exitInfo()}
    </>
  );

  function tabSort({ focused, color, icon, tab, isRotate, isImage }) {
    return (
      <View style={{ alignItems: "center" }}>
        <View style={{ width: 26.0, height: 26.0 }}>
          {!isImage ? <Ionicons
            name={icon}
            size={22}
            color={color}
            style={{
              marginBottom: Sizes.fixPadding - 7.0,
              transform: [{ rotate: isRotate ? "-45deg" : "0deg" }],
            }}
          />
          :
          <Image
            source={icon}
            style={{ width: 23, height: 23, resizeMode: "contain" }}
          />
          }
        </View>
        <Text
          style={
            focused
              ? { ...Fonts.secondaryColor14Medium }
              : { ...Fonts.blackColor14Medium }
          }
        >
          {tab}
        </Text>
      </View>
    );
  }

  function exitInfo() {
    return backClickCount == 1 ? (
      <View style={styles.exitInfoWrapStyle}>
        <Text style={{ ...Fonts.whiteColor14Medium }}>
          Press Back Once Again To Exit!
        </Text>
      </View>
    ) : null;
  }
};

export default BottomTabBarScreen;

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
  tabBarStyle: {
    backgroundColor: Colors.whiteColor,
    borderTopColor: Colors.bodyBackColor,
    borderTopWidth: 1.0,
    height: Platform.OS == "ios" ? 100.0 : 70.0,
    ...CommonStyles.shadow,
  },
  selectedTabIndicator: {
    width: 46.0,
    height: 6.0,
    backgroundColor: Colors.secondaryColor,
    position: "absolute",
    top: -14.0,
  },
});
