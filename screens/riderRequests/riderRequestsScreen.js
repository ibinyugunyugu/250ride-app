import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Colors, Sizes, Fonts, CommonStyles } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Header from "../../components/header";
import requestsApi from "../../api/requests";
import useApi from "../../hooks/useApi";
import LoadingIndicator from "../../components/loadingIndicator";
import { useFocusEffect } from "@react-navigation/native";
import populizeAddress from "../../functions/populizeAddress";
import { Overlay } from "@rneui/themed";
import AlertMessage from "../../components/alertMessage";
import Octicons from "react-native-vector-icons/Octicons";
import { setRideInfo } from "../../store/rideInfo";
import { useDispatch } from "react-redux";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 
const RiderRequestsScreen = ({ navigation, route }) => {

  const getRequestsApi = useApi(requestsApi.getRequests);
  const [requests, setRequests] = useState(getRequestsApi.data);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false)
  const [alert, setAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [newItem, setNewItem] = useState();
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      getRequestsApi.request();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      setRequests(getRequestsApi.data);
    }, [getRequestsApi.loading])
  );


  // useEffect(()=>{
  //   setLoading(getRequestsApi.loading);
  // },[getRequestsApi.loading]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
      <Header title={t("request")} noBack={true} navigation={navigation} />
        {requests.length == 0 ? noRidesInfo() : ridesInfo()}
      </View>
      {alertMessage()}
      {loadingIndicator()}
      {cancelRequestDialog()}
    </View>
  );

  function alertMessage() {
    return <AlertMessage 
      visible={alert} 
      errorMessage={errorMessage} 
      setVisible={setAlert}
    />
  }

  function loadingIndicator(){
    return <LoadingIndicator visible={loading}/>
  }

  function noRidesInfo() {
    return (
      <View style={styles.emptyPage}>
        <Image
          source={require("../../assets/images/empty_ride.png")}
          style={{ width: 50.0, height: 50.0, resizeMode: "contain" }}
        />
        <Text
          style={{ ...Fonts.grayColor16SemiBold, marginTop: Sizes.fixPadding }}
        >
          {t('empty request list')}
        </Text>
      </View>
    );
  }

  function ridesInfo() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if(item.requestStatus == "Accepted") {
            let {ride} =  item;
            ride.bookStatus = item.bookStatus;
            ride.bookedSeats = item.seats;
            ride.ratings = item.ratings;
            ride.reqId = item.id;
            dispatch(setRideInfo(ride));
            navigation.push("RideDetail");
          }
        }}
        style={styles.rideWrapper}
      >
        
        <View style={{flex:1, flexDirection:'row'}}>
          <View style={styles.rideDetailWrapper}>
            <Text style={{ ...Fonts.blackColor16SemiBold }}>
              {item?.ride ? item?.ride?.driver?.user?.name : t('pending alert')}
            </Text>

            <View style={styles.infoRow}>
              <Ionicons
                name="calendar-outline"
                color={Colors.blackColor}
                size={15}
              />
              <Text
                numberOfLines={1}
                style={{
                  maxWidth: "50%",
                  ...Fonts.blackColor14edium,
                  marginLeft: Sizes.fixPadding - 5.0,
                }}
              >
                {new Date(item?.ride ? item?.ride?.datetime?.split('T')[0] : item?.date?.split('T')[0]).toDateString()}
              </Text>
              <View style={styles.dateTimeDivider}></View>
              <Ionicons name="time-outline" color={Colors.blackColor} size={15} />
              <Text
                numberOfLines={1}
                style={{
                  flex: 1,
                  ...Fonts.blackColor14Medium,
                  marginLeft: Sizes.fixPadding - 5.0,
                }}
              >
                {item?.ride ? (item?.ride?.datetime?.split('T')[1]).split('.')[0] : (item?.date.split('T')[1]).split('.')[0]}
              </Text>
            </View>
            
            <View>
              <View
                style={{
                  ...CommonStyles.rowAlignCenter,
                  paddingTop:Sizes.fixPadding - 5.0
                }}
              >
                <View style={{ flex: 1, flexDirection:'row' }}>
                  <View style={{paddingRight:Sizes.fixPadding, alignItems:'center', marginBottom:5}}>
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
                {/* <Text style={{ ...Fonts.blackColor16SemiBold }}>Rwf {item?.ride?.price}</Text> */}
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons
                  name="event-seat"
                  color={Colors.blackColor}
                  size={14}
                />
                <Text
                  style={{
                    ...Fonts.blackColor14Medium,
                    marginLeft: Sizes.fixPadding-3.0,
                  }}
                >
                  {item?.seats}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    ...Fonts.blackColor14SemiBold,
                    marginLeft: Sizes.fixPadding-5.0,
                  }}
                >
                  {t('seats')}
                </Text>
                
              </View>
            </View>
          </View>
          <View style={{justifyContent:'space-between', alignItems:'flex-end'}}>
            <Ionicons
              name="trash"
              color={Colors.blackColor}
              size={20}
              onPress={() => {setShowDialog(true); setNewItem(item)}}
            />
            <View
              style={{
                ...styles[item?.requestStatus],
                ...styles.statusBtn
                }}
            >
              <Text style={{ ...Fonts.whiteColor12Medium, textAlign:'center' }}>{t(item?.requestStatus.toLowerCase())}</Text>
            </View>
          </View>
        </View>
        
      </TouchableOpacity>
    );
    return (
      <FlatList
        data={requests}
        keyExtractor={(item) => `${item?.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: Sizes.fixPadding * 2.0 }}
      />
    );
  }

  function cancelRequestDialog() {
    return (
      <Overlay
        isVisible={showDialog}
        onBackdropPress={() => setShowDialog(false)}
        overlayStyle={styles.dialogStyle}
      >
        <View
          style={{
            marginVertical: Sizes.fixPadding * 3.5,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          <Octicons
            name="question"
            color={Colors.secondaryColor}
            size={50}
            style={{paddingBottom:Sizes.fixPadding * 3.0, alignSelf:'center'}}
          />
          <Text style={{ ...Fonts.blackColor16SemiBold, textAlign: "center" }}>
            {t('cancel')} {newItem?.ride_id ? t('REQUEST') : t('ALERT')}
          </Text>

          <Text style={{ 
              ...Fonts.blackColor15Medium, 
              marginTop:Sizes.fixPadding * 3.0,
              textAlign: "center" 
            }}>
            {t('are you sure you want to cancel this')} {newItem?.ride_id ? t('request') : t('alert')}
          </Text>

          <View style={styles.btnContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setShowDialog(false);
                
              }}
              style={{ ...CommonStyles.button, 
                backgroundColor:Colors.secondaryColor, 
                paddingHorizontal: Sizes.fixPadding * 3.0 
              }}
            >
              <Text style={{ ...Fonts.whiteColor15Medium }}>
                {t('no')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleCancel}
              style={{ ...CommonStyles.button, backgroundColor: Colors.blackColor, paddingHorizontal: Sizes.fixPadding * 3.0 }}
              >
              <Text style={{ ...Fonts.whiteColor15Medium }}>
                {t('yes')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
      </Overlay>
    );
  }

  async function handleCancel(){
    if(!newItem?.id) return;
    setAlert(false);
    setLoading(true);
    setShowDialog(false);
    const result = await requestsApi.cancelRequest(newItem.id);
    setLoading(false) 
    if (!result.ok) {
      setAlert(true);
      return setErrorMessage(result.data.error ? t(result.data.error) : t('canceling failed try again'))
    }
    getRequestsApi.request();
  }

};

export default RiderRequestsScreen;

const styles = StyleSheet.create({
  emptyPage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: Sizes.fixPadding * 2.0,
  },
  headerAccountBedge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 10.0,
    height: 10.0,
    borderRadius: 5.0,
    backgroundColor: Colors.redColor,
  },
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
  Waiting:{
    backgroundColor:'#6C63FF'
  },
  Accepted:{
    backgroundColor:'#027500'
  },
  Rejected:{
    backgroundColor:'#9C0000'
  },
  Expired:{
    backgroundColor:'#9C0000'
  },
  infoRow:{
    ...CommonStyles.rowAlignCenter, 
    paddingTop: Sizes.fixPadding - 5.0
  },
  statusBtn:{
    borderRadius: Sizes.fixPadding - 2.0,
    paddingVertical: Sizes.fixPadding - 4.0,
    marginTop: Sizes.fixPadding - 2.0,
    width:80
  },
  locationIconWrapper: {
    width: 8.0,
    height: 8.0,
    borderRadius: 4.0,
    borderWidth: 1.0,
    alignItems: "center",
    justifyContent: "center",
  },
  verticalSolidLine: {
    flex:1,
    height: 15.0,
    width: 1.0,
    borderStyle: "solid",
    borderColor: Colors.blackColor,
    borderWidth: 2.0,
  },
  locationName: {
    ...Fonts.blackColor14Medium,
  },
  dialogStyle: {
    width: "90%",
    borderRadius: Sizes.fixPadding,
    padding: 0,
    overflow: "hidden",
  },
  btnContainer:{
    flexDirection:'row',
    justifyContent:'center',
    marginTop: Sizes.fixPadding * 4.0,
  },
});
