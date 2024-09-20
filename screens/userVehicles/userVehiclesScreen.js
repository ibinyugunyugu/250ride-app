import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import Header from "../../components/header";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Snackbar } from "react-native-paper";
import carsApi from "../../api/cars";
import useApi from "../../hooks/useApi";
import AlertMessage from "../../components/alertMessage";
import LoadingIndicator from "../../components/loadingIndicator";
import settings from "../../constants/settings";
import { useDispatch } from "react-redux";
import { resetCarInfo, setCarInfo } from "../../store/carInfo";
import { useFocusEffect } from "@react-navigation/native";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const UserVehiclesScreen = ({ navigation, route }) => {
  const getCarsApi = useApi(carsApi.getAllCars);
  const [vehicles, setvehicles] = useState(getCarsApi.data);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false)
  const [alert, setAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      getCarsApi.request();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      setvehicles(getCarsApi.data);
    }, [getCarsApi.loading])
  );


  useEffect(() => {
    if (route.params?.id) {
      return deleteVehicle(route.params?.id);
    }
  }, [route.params?.id]);


  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={t("My cars")} navigation={navigation} />
        {vehicles.length == 0 ? noCarsInfo() : vehiclesInfo()}
      </View>
      {addButton()}
      {snackBarInfo()}
      {alertMessage()}
      {loadingIndicator()}
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


  function snackBarInfo() {
    return (
      <Snackbar
        style={{ backgroundColor: Colors.blackColor }}
        elevation={0}
        visible={showSnackBar}
        duration={1000}
        onDismiss={() => setShowSnackBar(false)}
      >
        <Text style={{ ...Fonts.whiteColor14Medium }}>{t('Vehicle Removed')}</Text>
      </Snackbar>
    );
  }

  function noCarsInfo() {
    return (
      <View style={styles.emptyPage}>
        <Image
          source={require("../../assets/images/empty_ride.png")}
          style={{ width: 50.0, height: 50.0, resizeMode: "contain" }}
        />
        <Text
          style={{ ...Fonts.grayColor16SemiBold, marginTop: Sizes.fixPadding }}
        >
          {t('empty cars list')}
        </Text>
      </View>
    );
  }

  function addButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          dispatch(resetCarInfo());
          navigation.push("AddVehicle");
        }}
        style={styles.addButtonStyle}
      >
        <MaterialIcons name="add" color={Colors.whiteColor} size={40} />
      </TouchableOpacity>
    );
  }

  function deleteVehicle({ id }) {
    const copyData = vehicles;
    const newData = copyData.filter((item) => item.id !== id);
    setShowSnackBar(true);
    setvehicles(newData);
  }

  function vehiclesInfo() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={()=>{
          dispatch(setCarInfo(item));
          navigation.push("AddVehicle");
        }}
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
        <ImageBackground
          source={{uri:settings.host+'cars/'+item.carImage}}
          style={{ width: "100%", height: 178.0 }}
          borderRadius={Sizes.fixPadding}
        >
          <LinearGradient
            colors={["rgba(255, 255, 255, 0)", "rgba(28, 28, 28, 0.5)"]}
            style={styles.vehicleImageOverlay}
          >
            <View
              style={{
                ...styles[item?.status],
                ...styles.statusBtn
                }}
            >
              <Text style={{ ...Fonts.whiteColor12Medium, textAlign:'center' }}>{item?.status}</Text>
            </View>
            <View>
              <Text numberOfLines={1} style={{ ...Fonts.whiteColor15SemiBold }}>
                {item.carModel}{' '}{item.plateNumber}
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
    return (
      <FlatList
        data={vehicles}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: Sizes.fixPadding * 2.0,
          paddingBottom: Sizes.fixPadding * 7.0,
        }}
      />
    );
  }
};

export default UserVehiclesScreen;

const styles = StyleSheet.create({
  emptyPage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: Sizes.fixPadding * 2.0,
  },
  vehicleImageOverlay: {
    width: "100%",
    height: "100%",
    borderRadius: Sizes.fixPadding,
    justifyContent: "space-between",
    padding: Sizes.fixPadding + 5.0,
  },
  addButtonStyle: {
    position: "absolute",
    bottom: 0,
    width: 52.0,
    height: 52.0,
    borderRadius: 26.0,
    backgroundColor: Colors.secondaryColor,
    alignSelf: "center",
    margin: Sizes.fixPadding * 2.0,
    alignItems: "center",
    justifyContent: "center",
  },
  Pending:{
    backgroundColor:'#6C63FF'
  },
  Approved:{
    backgroundColor:'#027500'
  },
  Declined:{
    backgroundColor:'#9C0000'
  },
  statusBtn:{
    borderRadius: Sizes.fixPadding - 2.0,
    paddingVertical: Sizes.fixPadding - 4.0,
    marginTop: Sizes.fixPadding - 2.0,
    width:80
  },
});
