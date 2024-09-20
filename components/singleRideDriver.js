import { 
  Text, 
  View, 
  StyleSheet,
  TouchableOpacity
} from "react-native";
import React from "react";
import { CommonStyles, Fonts, Sizes, Colors } from "../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import populizeAddress from "../functions/populizeAddress";
import { setRideInfo } from "../store/rideInfo";
import { useDispatch } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import '../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const SingleRideDriver = ({ item, navigation }) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  return (
    <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          dispatch(setRideInfo(item));
          navigation.push("MyRideDetail");
        }}
        style={styles.rideWrapper}
      >
        
        <View style={styles.rideDetailWrapper}>
          <View style={{flex:1}}>
            <View style={styles.infoRow}>
              <MaterialIcons
                name="location-pin"
                color={Colors.blackColor}
                size={14}
              />
              <Text
                numberOfLines={1}
                style={{
                  ...Fonts.blackColor14SemiBold,
                  marginLeft: Sizes.fixPadding-5.0,
                }}
              >
                {t('from')}:
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  flex: 1,
                  ...Fonts.blackColor12Medium,
                  marginLeft: Sizes.fixPadding-3.0,
                }}
              >
                {populizeAddress(item,true)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons
                name="location-pin"
                color={Colors.blackColor}
                size={14}
              />
              <Text
                numberOfLines={1}
                style={{
                  ...Fonts.blackColor14SemiBold,
                  marginLeft: Sizes.fixPadding-5.0,
                }}
              >
                {t('to')}:
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  flex: 1,
                  ...Fonts.blackColor12Medium,
                  marginLeft: Sizes.fixPadding-3.0,
                }}
              >
                {populizeAddress(item)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons
                name="calendar-outline"
                color={Colors.blackColor}
                size={14}
              />
              <Text
                numberOfLines={1}
                style={{
                  maxWidth: "50%",
                  ...Fonts.blackColor14edium,
                  marginLeft: Sizes.fixPadding - 5.0,
                }}
              >
                {new Date(item?.datetime?.split('T')[0]).toDateString()}
              </Text>
              <View style={styles.dateTimeDivider}></View>
              <Ionicons name="time-outline" color={Colors.blackColor} size={14} />
              <Text
                numberOfLines={1}
                style={{
                  flex: 1,
                  ...Fonts.blackColor14Medium,
                  marginLeft: Sizes.fixPadding - 5.0,
                }}
              >
                {item.datetime.split('T')[1].split('.')[0]}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons
                name="event-seat"
                color={Colors.blackColor}
                size={14}
              />
              <Text
                numberOfLines={1}
                style={{
                  ...Fonts.blackColor14SemiBold,
                  marginLeft: Sizes.fixPadding-5.0,
                }}
              >
                {t('seats')}:
              </Text>
              <Text
                style={{
                  ...Fonts.blackColor14Medium,
                  marginLeft: Sizes.fixPadding-3.0,
                }}
              >
                {item.seats}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Octicons
                name="eye"
                color={Colors.blackColor}
                size={15}
              />
              <Text
                numberOfLines={1}
                style={{
                  ...Fonts.blackColor14SemiBold,
                  marginLeft: Sizes.fixPadding-5.0,
                }}
              >
                {t('view')}:
              </Text>
              <Text
                style={{
                  ...Fonts.blackColor14Medium,
                  marginLeft: Sizes.fixPadding-3.0,
                }}
              >
                {item.views.length}
              </Text>
            </View>
          </View>
          <View style={{justifyContent:'space-between', alignItems:'flex-end'}}>
            <View
              style={{
                ...styles[item.status],
                ...styles.statusBtn
                }}
            >
              <Text style={{ ...Fonts.whiteColor12Medium, textAlign:'center' }}>{t(item.status.toLowerCase())}</Text>
            </View>
            <Text style={{ ...Fonts.blackColor14SemiBold }}>Rwf {item.price}</Text>
          </View>
        </View>
      </TouchableOpacity>
  );
};

export default SingleRideDriver;

const styles = StyleSheet.create({
  dateTimeDivider: {
    marginHorizontal: Sizes.fixPadding - 5.0,
    width: 1.0,
    backgroundColor: Colors.blackColor,
    height: "100%",
  },
  rideDetailWrapper: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection:'row'
  },
  rideWrapper: {
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.rowAlignCenter,
    ...CommonStyles.shadow,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  'In Progress':{
    backgroundColor:'#000000'
  },
  Canceled:{
    backgroundColor:'#9C0000'
  },
  Waiting:{
    backgroundColor:'#027500'
  },
  Served:{
    backgroundColor:'#0052B4'
  },
  infoRow:{
    ...CommonStyles.rowAlignCenter, 
    paddingTop: Sizes.fixPadding - 8.0
  },
  statusBtn:{
    borderRadius: Sizes.fixPadding - 2.0,
    paddingVertical: Sizes.fixPadding - 5.0,
    width:80
  },
});