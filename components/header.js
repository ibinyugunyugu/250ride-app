import { Text, View, StyleSheet,} from "react-native";
import React, { useCallback, useContext, useEffect } from "react";
import { CommonStyles, Fonts, Sizes, Colors } from "../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AuthContext from "../auth/context";
import { getNotifications, setNotifications } from "../store/notifications";
import { useDispatch, useSelector } from "react-redux";
import useApi from "../hooks/useApi";
import notificationsApi from "../api/notifications";
import { useFocusEffect } from "@react-navigation/native";


const Header = ({ title, navigation, noBack, onClick }) => {
  const {user} = useContext(AuthContext);
  const dispatch = useDispatch();
  const notifications = useSelector(getNotifications());
  const nondelivered = Array.isArray(notifications) ? notifications.filter(item=>!item.delivered) : [];
  const getNotificationsApi = useApi(notificationsApi.getNotifications);

  useFocusEffect(
    useCallback(() => {
      getNotificationsApi.request();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      let array = getNotificationsApi.data;
      if(!Array.isArray(array)) return;
      let newArray = array.map((object, i) => ({ ...object, key: parseInt(i + 1)+"" }));
      dispatch(setNotifications({notifications:newArray}));
    }, [getNotificationsApi.data])
  );

  return (
    <View
      style={{
        backgroundColor: Colors.whiteColor,
        ...CommonStyles.rowAlignCenter,
        padding: Sizes.fixPadding * 2.0,
        flexDirection:'row',
        justifyContent:'space-between',
        alignContent:'center'
      }}
    >
      <View>
        {!noBack ? <MaterialIcons
        name="arrow-back-ios"
        color={Colors.blackColor}
        size={24}
        onPress={() => {
          onClick ? onClick() : navigation.pop();
        }}
      /> : null}
      </View>
      
      <Text
        numberOfLines={1}
        style={{
          marginLeft: Sizes.fixPadding,
          ...Fonts.blackColor18SemiBold,
          textAlign: 'center'
        }}
      >
        {title}
      </Text>
      <View style={{width:30}}></View>
      {user ? <View style={{ position: "absolute", right: 20 }}>
        <MaterialIcons
          name="notifications"
          color={Colors.blackColor}
          size={24}
          onPress={() => {
            notificationsApi.clearNotifications();
            navigation.push("Notifications");
          }}
        />
        {nondelivered.length ? <View style={styles.headerAccountBedge}><Text style={styles.count}>{nondelivered.length > 9 ? '9+' : nondelivered.length}</Text></View> : null}
      </View> 
      :
      null}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerAccountBedge: {
    position: "absolute",
    top: -7,
    right: -7,
    width: 18.0,
    height: 18.0,
    borderRadius: 9.0,
    backgroundColor: Colors.redColor,
    justifyContent:'flex-start',
    alignItems:'center',
  },
  count:{
    ...Fonts.whiteColor13Medium
  }
});