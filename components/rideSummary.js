import { 
  Text, 
  View, 
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React from "react";
import { CommonStyles, Fonts, Sizes, Colors } from "../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import populizeAddress from "../functions/populizeAddress";
import settings from "../constants/settings";
import { setRideInfo } from "../store/rideInfo";
import { useDispatch } from "react-redux";
import '../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const RideSummary = ({ item, navigation }) => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  return (
    <TouchableOpacity
        
        activeOpacity={0.8}
        onPress={() => {
          if(parseInt(item.remainingSeats) < 1) return;
          dispatch(setRideInfo(item));
          navigation.push("RideDetail");
        }}
        style={parseInt(item.remainingSeats) < 1 
          ?  
          {...styles.rideWrapper, opacity:0.8} 
          :
          styles.rideWrapper
        }
      >
        <View
          style={{
            paddingHorizontal: Sizes.fixPadding,
            ...CommonStyles.rowAlignCenter,
          }}
        >
          <View style={{ flex: 1, flexDirection:'row' }}>
            <View style={{justifyContent:'space-between'}}>
              <Text style={styles.locationName}>
              {(item.datetime.split('T')[1]).split(':')[0]}:{(item.datetime.split('T')[1]).split(':')[1]}
              </Text>
              <Text style={styles.locationName}>
              {(item.endtime.split('T')[1]).split(':')[0]}:{(item.endtime.split('T')[1]).split(':')[1]}
              </Text>
            </View>
            <View style={{paddingHorizontal:Sizes.fixPadding, alignItems:'center', marginBottom:5}}>
              <View
                style={{
                  ...styles.locationIconWrapper,
                  borderColor: Colors.blackColor,
                }}
              >
              </View>
              <View style={styles.verticalSolidLine}></View>
              <View
                style={{
                  ...styles.locationIconWrapper,
                  borderColor: Colors.blackColor,
                }}
              >
              </View>
            </View>
            <View style={{ flex: 1, justifyContent:'space-between' }}>
              <Text numberOfLines={1} style={styles.locationName}>{populizeAddress(item,true)}</Text>
              <Text numberOfLines={1} style={styles.locationName}>{populizeAddress(item)}</Text>
            </View>
          </View>
          <Text style={{ ...Fonts.blackColor16SemiBold }}>Rwf {item.price}</Text>
        </View>

        <View
          style={{
            ...CommonStyles.rowAlignCenter,
            marginHorizontal: Sizes.fixPadding,
            paddingTop: Sizes.fixPadding  ,
          }}
        >
          <View
            style={{
              flex: 1,
              ...CommonStyles.rowAlignCenter,
              marginRight: Sizes.fixPadding,
            }}
          >
            <Image
              source={item?.driver?.user?.photo ? {uri:settings.host+'images/'+item?.driver?.user?.photo} : require("../assets/images/avatar.png")}
              style={{
                width: 40.0,
                height: 40.0,
                borderRadius: Sizes.fixPadding - 5.0,
              }}
            />
            <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding }}>
              <Text numberOfLines={1} style={{ ...Fonts.blackColor15SemiBold }}>
                {item?.driver?.user?.name}
              </Text>
              <View
                style={{
                  ...CommonStyles.rowAlignCenter,
                  marginTop: Sizes.fixPadding - 8.0,
                  alignItems:'center'
                }}
              >
                <MaterialIcons
                    name="star"
                    color={Colors.secondaryColor}
                    size={15}
                    style={{alignSelf:'baseline'}}

                  />
                <Text
                  numberOfLines={1}
                  style={{ ...Fonts.grayColor13SemiBold}}
                >
                  4.8
                  
                </Text>
                
                <View style={styles.dateTimeAndRatingDivider}></View>
                <View style={{ ...CommonStyles.rowAlignCenter }}>
                  <Text
                    style={{
                      ...Fonts.grayColor13SemiBold,
                      marginRight: Sizes.fixPadding - 8.0,
                    }}
                  >
                    {item?.distance ? item?.distance?.text+ t('from you') : t('driver')}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ width: "30%", alignItems: "flex-end" }}>
            {parseInt(item.remainingSeats) > 0 ? (parseInt(item.remainingSeats) < 5 ? <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[1, 2, 3, 4].map((no) => (
                <MaterialIcons
                  key={`${no}`}
                  name="event-seat"
                  color={
                    no > item.remainingSeats
                      ? Colors.redColor
                      : Colors.greenColor
                  }
                  size={16}
                  style={{
                    marginLeft: Sizes.fixPadding - 5.0,
                    alignSelf: "center",
                  }}
                />
              ))}
            </ScrollView>
            :
            <Text style={{ ...Fonts.blackColor16SemiBold }}>
               {i18n.language !== 'kiny' ? item.remainingSeats+' '+t(item.remainingSeats > 1 ? 'seats' : 'seat') : t(item.remainingSeats > 1 ? 'seats' : 'seat')+' '+item.remainingSeats }
            </Text>)
          :
          <Text style={{ ...Fonts.blackColor16SemiBold }}>{t('full')}</Text>
          }
          </View>
        </View>
      </TouchableOpacity>
  );
};

export default RideSummary;

const styles = StyleSheet.create({
  locationIconWrapper: {
    width: 8.0,
    height: 8.0,
    borderRadius: 4.0,
    borderWidth: 1.0,
    alignItems: "center",
    justifyContent: "center",
  },
  locationName: {
    ...Fonts.blackColor14Medium,
  },
  verticalSolidLine: {
    flex:1,
    height: 15.0,
    width: 1.0,
    borderStyle: "solid",
    borderColor: Colors.blackColor,
    borderWidth: 2.0,
  },
  rideWrapper: {
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.shadow,
    borderRadius: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding,
  },
  dateTimeAndRatingDivider: {
    width: 1.0,
    backgroundColor: Colors.grayColor,
    height: "80%",
    marginHorizontal: Sizes.fixPadding - 5.0,
  },
});