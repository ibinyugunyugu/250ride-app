import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors, CommonStyles, Fonts, Sizes } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import Header from "../../components/header";
import useApi from "../../hooks/useApi";
import requestsApi from "../../api/requests";
import LoadingIndicator from "../../components/loadingIndicator";
import RequestSummary from "../../components/requestSummary";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const AvailableRequestsScreen = ({ navigation }) => {

  const getRequestsApi = useApi(requestsApi.availableRequests);
  const [loading, setLoading] = useState(true);
  const {t} = useTranslation(); 
  useEffect(()=>{
    getRequestsApi.request();
  },[]);

  useEffect(()=>{
    if(!getRequestsApi.loading) setLoading(getRequestsApi.loading);
  },[getRequestsApi.loading]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={t('available requests')} navigation={navigation} />
        {getRequestsApi.data.length == 0 ? noRequestsInfo() : requestsInfo()}
      </View>
      {loadingIndicator()}
    </View>
  );

  function loadingIndicator(){
    return <LoadingIndicator visible={loading}/>
  }

  function requestsInfo() {
    const renderItem = ({ item }) => (
      <RequestSummary item={item} navigation={navigation}/>
    );
    return (
      <FlatList
        data={getRequestsApi.data}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: Sizes.fixPadding * 2.0 }}
      />
    );
  }

  function noRequestsInfo() {
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
};

export default AvailableRequestsScreen;

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
