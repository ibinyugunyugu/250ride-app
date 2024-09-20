import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import MyStatusBar from "../../components/myStatusBar";
import Header from "../../components/header";
import {
  Colors,
  Fonts,
  Sizes,
  CommonStyles,
  screenHeight,
} from "../../constants/styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DashedLine from "react-native-dashed-line";
import { BottomSheet } from "@rneui/themed";
import requestsApi from "../../api/requests";
import { useFocusEffect } from "@react-navigation/native";
import useApi from "../../hooks/useApi";
import LoadingIndicator from "../../components/loadingIndicator";
import settings from "../../constants/settings";
import populizeAddress from "../../functions/populizeAddress";
import { Snackbar } from "react-native-paper";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const RideRequestScreen = ({ navigation }) => {
  const [showRequestSheet, setshowRequestSheet] = useState(false);
  const [selectedRequestCount, setselectedRequestCount] = useState();
  const getRequestsApi = useApi(requestsApi.getRequests);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [requestUsers, setRequestUsers] = useState(getRequestsApi.data);
  const [rideLists, setRidesList] = useState(getRequestsApi.data);
  const {t, i18n} = useTranslation();

  useFocusEffect(
    useCallback(() => {
      getRequestsApi.request();
    }, [])
  );

  useEffect(()=>{
    setRidesList(getRequestsApi.data);
  },[getRequestsApi.data])

  return (
    <View style={{ flex: 1,backgroundColor:Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={t("request for ride")} navigation={navigation} noBack={true}/>
        {rideLists.length == 0 ? noRequestInfo() : requestsInfo()}
      </View>
      {requestSheet()}
      {loadingIndicator()}
      {snackBarInfo()}
    </View>
  );

  function loadingIndicator(){
    return <LoadingIndicator visible={loading}/>
  }

  function noRequestInfo() {
    return (
      <View style={styles.emptyPage}>
        <Image
          source={require("../../assets/images/empty_ride.png")}
          style={{ width: 50.0, height: 50.0, resizeMode: "contain" }}
        />
        <Text
          style={{ ...Fonts.grayColor16SemiBold, marginTop: Sizes.fixPadding }}
        >
          {t('you have no pending requests')}
        </Text>
      </View>
    );
  }

  function requestSheet() {
    return (
      <BottomSheet
        scrollViewProps={{ scrollEnabled: false }}
        isVisible={showRequestSheet}
        onBackdropPress={() => {
          setshowRequestSheet(false);
        }}
      >
        <View style={{ ...styles.sheetStyle }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {requestUsers.slice(0, selectedRequestCount).map((item) => (
              <View key={`${item.id}`} style={styles.requestWrapper}>
                <View style={{ ...CommonStyles.rowAlignCenter }}>
                  <Image
                    source={item?.user?.photo ? {uri:settings.host+'images/'+item?.user?.photo} : require("../../assets/images/avatar.png")}
                    style={{
                      width: 82.0,
                      height: 82.0,
                      borderRadius: Sizes.fixPadding - 5.0,
                    }}
                  />
                  <View style={styles.requestDetailWrapper}>
                    <Text style={{ ...Fonts.blackColor15SemiBold }}>
                      {item.user.name}
                    </Text>

                    <View>
                      <View style={{ ...CommonStyles.rowAlignCenter }}>
                        
                        <MaterialIcons
                          name="phone-in-talk"
                          color={Colors.blackColor}
                          size={15}
                        />
                        
                        <Text
                          numberOfLines={1}
                          style={{
                            flex: 1,
                            ...Fonts.blackColor12Medium,
                            marginLeft: Sizes.fixPadding,
                          }}
                        >
                          {item.user.fullPhone}
                        </Text>
                      </View>

                      <View style={{ ...CommonStyles.rowAlignCenter }}>
                        
                        <Ionicons 
                          name="time-outline"
                          color={Colors.blackColor}
                          size={15}
                        />
                        <Text
                          numberOfLines={1}
                          style={{
                            flex: 1,
                            ...Fonts.blackColor12Medium,
                            marginLeft: Sizes.fixPadding,
                          }}
                        >
                          {t('booked at')} {(item?.created_at?.split('T')[1]).split('.')[0]}
                        </Text>
                      </View>

                      <View style={{ ...CommonStyles.rowAlignCenter }}>
                        
                        <MaterialIcons
                          name="event-seat"
                          color={Colors.blackColor}
                          size={15}
                        />
                        <Text
                          numberOfLines={1}
                          style={{
                            flex: 1,
                            ...Fonts.blackColor12Medium,
                            marginLeft: Sizes.fixPadding,
                          }}
                        >
                          {i18n.language !== 'kiny' ? item.seats+' '+t(item.seats > 1 ? 'seats' : 'seat') : t(item.seats > 1 ? 'seats' : 'seat')+' '+item.seats }
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    ...CommonStyles.rowAlignCenter,
                    marginTop: Sizes.fixPadding + 2.0,
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      handleDecision(false,item.id);
                    }}
                    style={{
                      backgroundColor: Colors.whiteColor,
                      ...styles.sheetButton,
                      marginRight: Sizes.fixPadding,
                    }}
                  >
                    <Text style={{ ...Fonts.blackColor16SemiBold }}>
                      {t('decline')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      handleDecision(true,item.id);
                    }}
                    style={{
                      ...styles.sheetButton,
                      backgroundColor: Colors.secondaryColor,
                      marginLeft: Sizes.fixPadding,
                    }}
                  >
                    <Text style={{ ...Fonts.whiteColor16SemiBold }}>
                      {t('accept')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </BottomSheet>
    );
  }

  function requestsInfo() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {}}
        style={styles.requestInfoWrapper}
      >
        <View style={{ flex: 1 }}>
          <View style={{ ...CommonStyles.rowAlignCenter }}>
            <Ionicons
              name="calendar-outline"
              color={Colors.blackColor}
              size={14}
            />
            <Text
              numberOfLines={1}
              style={{
                maxWidth: "50%",
                ...Fonts.blackColor14Medium,
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
              {(item?.datetime?.split('T')[1]).split('.')[0]}
            </Text>
          </View>

          <View style={{ marginVertical: Sizes.fixPadding - 5.0 }}>
            <View style={{ ...CommonStyles.rowAlignCenter }}>
              <MaterialIcons
                name="location-pin"
                color={Colors.blackColor}
                size={15}
              />
              <Text
                numberOfLines={1}
                style={{
                  flex: 1,
                  ...Fonts.blackColor12Medium,
                  marginLeft: Sizes.fixPadding,
                }}
              >
                {populizeAddress(item,true)}
              </Text>
            </View>

            <View style={{ ...CommonStyles.rowAlignCenter }}>
              
              <MaterialIcons
                name="location-pin"
                color={Colors.blackColor}
                size={15}
              />
              <Text
                numberOfLines={1}
                style={{
                  flex: 1,
                  ...Fonts.blackColor12Medium,
                  marginLeft: Sizes.fixPadding,
                }}
              >
                 {populizeAddress(item)}
              </Text>
            </View>
            <View style={{ ...CommonStyles.rowAlignCenter }}>
              
              <MaterialIcons
                name="event-seat"
                color={Colors.blackColor}
                size={15}
              />
              <Text
                numberOfLines={1}
                style={{
                  flex: 1,
                  ...Fonts.blackColor12Medium,
                  marginLeft: Sizes.fixPadding,
                }}
              >
                {i18n.language !== 'kiny' ? item.seats+' '+t(item.seats > 1 ? 'seats' : 'seat')+t('remaining') : t('remaining')+t(item.seats > 1 ? 'seats' : 'seat')+' '+item.seats }
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setRequestUsers(item.ride_requests.filter(req=>!req.riderDeleted));
            setselectedRequestCount(item.ride_requests.length);
            setshowRequestSheet(true);
          }}
          style={styles.requestCountButton}
        >
          <Text style={{ ...Fonts.whiteColor15Medium }}>
          {i18n.language == 'kiny' ? t('request') : ''} {item.ride_requests?.filter(req=>!req.riderDeleted).length} {i18n.language == 'kiny' ? '' : t('request')}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
    return (
      <FlatList
        data={rideLists}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: Sizes.fixPadding * 2.0 }}
      />
    );
  }

  function snackBarInfo() {
    return (
      <Snackbar
        style={{ backgroundColor: Colors.blackColor }}
        elevation={0}
        visible={alert}
        duration={1000}
        onDismiss={() => setAlert(false)}
      >
        <Text style={{ ...Fonts.whiteColor14Medium }}>{errorMessage}</Text>
      </Snackbar>
    );
  }

  async function handleDecision(decision,reqId){
    if(!reqId) return;
    let dec = decision ? t("accepted") : t("declined");
    setAlert(false);
    setLoading(true);
    const result = decision ? 
    await requestsApi.approveRequest(reqId) : 
    await requestsApi.declineRequest(reqId);
    setAlert(true);
    setLoading(false) 
    if (!result.ok) {
      return setErrorMessage(result.data.error ? t(result.data.error) : `${dec}ing request failed, Try again.`)
    }
    setshowRequestSheet(false);
    setErrorMessage(`${t('done')}, ${t("request")} ${dec}`);
    setRidesList(result.data);
    setAlert(true);
  }
};

export default RideRequestScreen;

const styles = StyleSheet.create({
  emptyPage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: Sizes.fixPadding * 2.0,
  },
  requestDetailWrapper: {
    flex: 1,
    marginLeft: Sizes.fixPadding,
    height: 82.0,
    justifyContent: "space-between",
  },
  requestWrapper: {
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.shadow,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  requestInfoWrapper: {
    ...CommonStyles.rowAlignCenter,
    ...CommonStyles.shadow,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  sheetStyle: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: Sizes.fixPadding * 4.0,
    borderTopRightRadius: Sizes.fixPadding * 4.0,
    paddingTop: Sizes.fixPadding * 3.0,
    maxHeight: screenHeight - 150,
  },
  locationIconWrapper: {
    width: 12.0,
    height: 12.0,
    borderRadius: 6.0,
    borderWidth: 1.0,
    alignItems: "center",
    justifyContent: "center",
  },
  dateTimeDivider: {
    marginHorizontal: Sizes.fixPadding - 5.0,
    width: 1.0,
    backgroundColor: Colors.blackColor,
    height: "100%",
  },
  requestCountButton: {
    borderRadius: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding + 2.0,
    paddingVertical: Sizes.fixPadding - 2.0,
    color:Colors.whiteColor,
    backgroundColor:Colors.secondaryColor
  },
  sheetButton: {
    flex: 1,
    ...CommonStyles.shadow,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Sizes.fixPadding - 5.0,
    padding: Sizes.fixPadding,
  },
});
