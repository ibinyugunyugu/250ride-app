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
import SingleRideDriver from "../../components/singleRideDriver";
import { Snackbar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { getRideId, resetRideId } from "../../store/home";
import { setRideInfo } from "../../store/rideInfo";
import AlertMessage from "../../components/alertMessage";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const MyRidesScreen = ({ navigation, route }) => {
  const getRidesApi = useApi(ridesApi.getRides);
  const [rides, setrides] = useState(getRidesApi.data);
  const [snackMessage, setSnackMessage] = useState();
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const rideId = useSelector(getRideId());
  const dispatch = useDispatch();
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
    if(!loading && rideId){
      dispatch(resetRideId());
      let rideIndex = getRidesApi.data.findIndex((item) => item.id === rideId)
      if(rideIndex != -1){
        let ride = getRidesApi.data[rideIndex];
        dispatch(setRideInfo(ride));
        navigation.push("MyRideDetail");
      }
      else{
        setErrorMessage(t("ride not found"));
        setError(true);
      }
      
    }
    setrides(getRidesApi.data);
  },[getRidesApi.data])

  useEffect(() => {
    if (route.params?.id) {
      const copyData = rides;
      const newData = copyData.filter((item) => item.id !== route.params.id);
      setrides(newData);
    }
    if (route.params?.action) {
      setSnackMessage(t(`ride ${route.params?.action.toLowerCase()}ed`)+'!')
    }
  }, [route.params]);

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
      <SingleRideDriver item={item} navigation={navigation}/>
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
        <Text style={{ ...Fonts.whiteColor14Medium }}>{snackMessage}</Text>
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

export default MyRidesScreen;

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
