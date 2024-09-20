import { 
    Text, 
    View, 
    StyleSheet,
    TouchableOpacity,
    Image,
  } from "react-native";
import React from "react";
import { CommonStyles, Fonts, Sizes, Colors } from "../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { setRideInfo } from "../store/rideInfo";
import { useDispatch } from "react-redux";
import settings from "../constants/settings";
import '../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

  const SingleRideRider = ({ item, navigation }) => {
    const {ride} = item;
    ride.bookStatus = item.bookStatus;
    ride.bookedSeats = item.seats;
    ride.ratings = item.ratings;
    ride.reqId = item.id;
    const {t, i18n} = useTranslation();

    const dispatch = useDispatch();
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          dispatch(setRideInfo(ride));
          navigation.push("RideDetail");
        }}
        style={styles.rideWrapper}
      >
        <View>
          <Image
            source={ride?.driver?.user?.photo ? {uri:settings.host+'images/'+ride?.driver?.user?.photo} : require("../assets/images/avatar.png")}
            style={{
              width: 82.0,
              height: 82.0,
              borderRadius: Sizes.fixPadding - 5.0,
            }}
          />
          <View
            style={{
              ...styles[item?.bookStatus],
              ...styles.statusBtn
              }}
          >
            <Text style={{ ...Fonts.whiteColor12Medium, textAlign:'center' }}>{t(item?.bookStatus.toLowerCase())}</Text>
          </View>
        </View>
        
        <View style={styles.rideDetailWrapper}>
          <Text style={{ ...Fonts.blackColor16SemiBold }}>{ride?.driver?.user?.name}</Text>

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
              {new Date(ride?.datetime).toDateString()}
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
              {ride?.datetime?.split('T')[1].split('.')[0]}
            </Text>
          </View>

          <View>
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
                {populizeAddress(ride,true)}
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
                {populizeAddress(ride)}
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
                {item?.seats}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  export default SingleRideRider;
  
  const styles = StyleSheet.create({
    dateTimeDivider: {
      marginHorizontal: Sizes.fixPadding - 5.0,
      width: 1.0,
      backgroundColor: Colors.blackColor,
      height: "100%",
    },
    rideDetailWrapper: {
      flex: 1,
      marginLeft: Sizes.fixPadding,
      justifyContent: "space-between",
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
    Booked:{
      backgroundColor:'#000000'
    },
    Confirm:{
      backgroundColor:'#9C0000'
    },
    Confirmed:{
      backgroundColor:'#027500'
    },
    infoRow:{
      ...CommonStyles.rowAlignCenter, 
      paddingTop: Sizes.fixPadding - 8.0
    },
    statusBtn:{
      borderRadius: Sizes.fixPadding - 2.0,
      padding: Sizes.fixPadding - 7.0,
      marginTop: Sizes.fixPadding,
    }
  });