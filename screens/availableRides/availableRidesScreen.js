import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors, CommonStyles, Fonts, Sizes } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import Header from "../../components/header";
import RideSummary from "../../components/rideSummary";
import useApi from "../../hooks/useApi";
import ridesApi from "../../api/rides";
import LoadingIndicator from "../../components/loadingIndicator";
import { getTempInfo } from "../../store/tempInfo";
import { useDispatch, useSelector } from "react-redux";
import { getRideId, resetRideId } from "../../store/home";
import { setRideInfo } from "../../store/rideInfo";
import AlertMessage from "../../components/alertMessage";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const AvailableRidesScreen = ({ navigation }) => {

  const dispatch = useDispatch();
  const {t} = useTranslation(); 
  const getRidesApi = useApi(ridesApi.availableRides);
  const rideId = useSelector(getRideId());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(()=>{
    getRidesApi.request();
  },[]);

  useEffect(()=>{
    if(!getRidesApi.loading) setLoading(getRidesApi.loading);
  },[getRidesApi.loading]);


  useEffect(()=>{
    if(!loading && rideId){
      dispatch(resetRideId());
      let rideIndex = getRidesApi.data.findIndex((item) => item.id === rideId)
      if(rideIndex != -1){
        let ride = getRidesApi.data[rideIndex];
        dispatch(setRideInfo(ride));
        navigation.push("RideDetail");
      }
      else{
        setErrorMessage(t('ride not found'));
        setError(true);
      }
    }
  },[getRidesApi.data])

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={t('available rides')} navigation={navigation} />
        {getRidesApi.data?.length == 0 ? noRidesInfo() : ridesInfo()}
      </View>
      {loadingIndicator()}
      {alertMessage()}
    </View>
  );

  function loadingIndicator(){
    return <LoadingIndicator visible={loading}/>
  }

  function ridesInfo() {
    const renderItem = ({ item }) => (
      <RideSummary item={item} navigation={navigation}/>
    );
    return (
      <FlatList
        data={getRidesApi.data}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: Sizes.fixPadding * 2.0 }}
      />
    );
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
          {t('empty ride list')}
        </Text>
      </View>
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

export default AvailableRidesScreen;

const styles = StyleSheet.create({
  emptyPage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: Sizes.fixPadding * 2.0,
  },
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
  verticalDashedLine: {
    height: 15.0,
    width: 1.0,
    borderStyle: "dashed",
    borderColor: Colors.grayColor,
    borderWidth: 0.8,
    marginLeft: Sizes.fixPadding - 2.0,
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
