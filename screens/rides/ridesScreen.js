import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Colors, Sizes, Fonts, CommonStyles } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import ridesApi from "../../api/rides";
import Header from "../../components/header";
import useApi from "../../hooks/useApi";
import { useFocusEffect } from "@react-navigation/native";
import SingleRideRider from "../../components/singleRideRider";
import { Snackbar } from "react-native-paper";
import { getRequestId, getUserData, resetRequestId, resetScheduled } from "../../store/home";
import { useSelector, useDispatch } from 'react-redux';
import AlertMessage from "../../components/alertMessage";
import { setRideInfo } from "../../store/rideInfo";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const RidesScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const getRidesApi = useApi(ridesApi.getRides);
  const [rides, setrides] = useState(getRidesApi.data);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const homeData = useSelector(getUserData());
  const requestId = useSelector(getRequestId());
  const {t, i18n} = useTranslation();

  useFocusEffect(
    useCallback(() => {
      getRidesApi.request();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if(!getRidesApi.loading) setLoading(getRidesApi.loading);
    }, [getRidesApi.loading])
  );


  useEffect(()=>{
    if(!loading && requestId){
      dispatch(resetRequestId());
      let index = getRidesApi.data.findIndex((item) => item.id === requestId)
      if(index != -1){
        let rideReq = getRidesApi.data[index];
        const {ride} = rideReq;
        ride.bookStatus = rideReq.bookStatus;
        ride.bookedSeats = rideReq.seats;
        ride.ratings = rideReq.ratings;
        ride.reqId = rideReq.id;
        dispatch(setRideInfo(ride));
        navigation.push("RideDetail");
      }
      else{
        setErrorMessage(t("ride not found"));
        setError(true);
      }
      
    }
    if(Array.isArray(getRidesApi.data)){
      setrides(getRidesApi.data.filter((item) => item.requestStatus == 'Accepted'));
    }
  },[getRidesApi.data])

  useEffect(() => {
    if (route.params?.id) {
      const copyData = rides;
      const newData = copyData.filter((item) => item.id !== route.params.id);
      setrides(newData);
    }
    if (route.params?.status) {
      setShowSnackBar(true);
    }
  }, [route]);

  useEffect(()=>{
    if(homeData.scheduled){
      dispatch(resetScheduled())
    }
  },[homeData])

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
      <Header title={t("My Rides")} noBack={true} navigation={navigation} />
        {rides.length == 0 ? noRidesInfo() : ridesInfo()}
      </View>
      {snackBarInfo()}
      {alertMessage()}
    </View>
  );

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
          {t('empty ride list')}
        </Text>
      </View>
    );
  }

  function ridesInfo() {
    const renderItem = ({ item }) => (
      <SingleRideRider item={item} navigation={navigation}/>
    );
    return (
      <FlatList
        data={rides}
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
        visible={showSnackBar}
        duration={1000}
        onDismiss={() => setShowSnackBar(false)}
      >
        <Text style={{ ...Fonts.whiteColor14Medium }}>{t(`ride ${route.params?.status.toLowerCase()}`)}</Text>
      </Snackbar>
    );
  }

  function alertMessage() {
    return <AlertMessage 
      visible={error} 
      errorMessage={errorMessage} 
      setVisible={setError}
    />
  }

};

export default RidesScreen;

const styles = StyleSheet.create({
  emptyPage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: Sizes.fixPadding * 2.0,
  },
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
