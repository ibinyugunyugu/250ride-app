import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import {
  Colors,
  Fonts,
  Sizes,
  screenHeight,
  CommonStyles,
} from "../../constants/styles";
import MapViewDirections from "react-native-maps-directions";
import { Key } from "../../constants/key";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as Animatable from "react-native-animatable";
import BottomSheet from "react-native-simple-bottom-sheet";
import MyStatusBar from "../../components/myStatusBar";
import Header from "../../components/header";
import DashedLine from "react-native-dashed-line";

const pessengersList = [
  {
    id: "1",
    profile: require("../../assets/images/user/user6.png"),
    name: "Cameron Williamson",
  },
  {
    id: "2",
    profile: require("../../assets/images/user/user5.png"),
    name: "Brooklyn Simmons",
  },
  {
    id: "3",
    profile: require("../../assets/images/user/user2.png"),
    name: "leslie alexander",
  },
  {
    id: "4",
    profile: require("../../assets/images/user/user3.png"),
    name: "Jacob jones",
  },
];

const routesList = [
  {
    id: "1",
    title: "Ride start",
    address: "2715 Ash Dr. San Jose, South Dakota 83475",
    coordinate: {
      latitude: 22.573856,
      longitude: 88.243163,
    },
    isPickDropPoint: false,
  },
  {
    id: "2",
    title: "Pick up cameron willimson",
    address: "2715 Ash Dr. San Jose, South Dakota 83475",
    coordinate: {
      latitude: 22.573856,
      longitude: 88.293163,
    },
    isPickDropPoint: true,
  },
  {
    id: "3",
    title: "Pick up brooklyn simmons",
    address: "2715 Ash Dr. San Jose, South Dakota 83475",
    coordinate: {
      latitude: 22.573856,
      longitude: 88.323163,
    },
    isPickDropPoint: true,
  },
  {
    id: "4",
    title: "Drop up cameron willimson",
    address: "2715 Ash Dr. San Jose, South Dakota 83475",
    coordinate: {
      latitude: 22.603856,
      longitude: 88.363163,
    },
    isPickDropPoint: true,
  },
  {
    id: "5",
    title: "Pick up leslie alexander",
    address: "2715 Ash Dr. San Jose, South Dakota 83475",
    coordinate: {
      latitude: 22.603856,
      longitude: 88.393163,
    },
    isPickDropPoint: true,
  },
  {
    id: "6",
    title: "Pick up jacob jones",
    address: "2715 Ash Dr. San Jose, South Dakota 83475",
    coordinate: {
      latitude: 22.623856,
      longitude: 88.423163,
    },
    isPickDropPoint: true,
  },
  {
    id: "7",
    title: "Drive",
    address: "2715 Ash Dr. San Jose, South Dakota 83475",
    coordinate: {
      latitude: 22.64668,
      longitude: 88.41377,
    },
    isPickDropPoint: false,
  },
  {
    id: "8",
    title: "Drop up brooklyn simmons",
    address: "2715 Ash Dr. San Jose, South Dakota 83475",
    coordinate: {
      latitude: 22.663856,
      longitude: 88.433163,
    },
    isPickDropPoint: true,
  },
  {
    id: "9",
    title: "Drop up leslie alexander",
    address: "2715 Ash Dr. San Jose, South Dakota 83475",
    coordinate: {
      latitude: 22.693856,
      longitude: 88.433163,
    },
    isPickDropPoint: true,
  },
  {
    id: "10",
    title: "Drop up jacob jones",
    address: "2715 Ash Dr. San Jose, South Dakota 83475",
    coordinate: {
      latitude: 22.723856,
      longitude: 88.403163,
    },
    isPickDropPoint: true,
  },
  {
    id: "11",
    title: "Ride end",
    address: "2715 Ash Dr. San Jose, South Dakota 83475",
    coordinate: {
      latitude: 22.713856,
      longitude: 88.363163,
    },
    isPickDropPoint: false,
  },
];

const StartRideScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={"Ride request"} navigation={navigation} />
        {directionInfo()}
        {rideInfoSheet()}
        {startRideButton()}
      </View>
    </View>
  );

  function startRideButton() {
    return (
      <View style={{ backgroundColor: Colors.whiteColor }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.push("EndRide");
          }}
          style={{
            ...CommonStyles.button,
            marginVertical: Sizes.fixPadding * 2.0,
          }}
        >
          <Text style={{ ...Fonts.whiteColor18Bold }}>Start ride</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function rideInfoSheet() {
    return (
      <BottomSheet
        isOpen={false}
        sliderMinHeight={380}
        sliderMaxHeight={screenHeight - 150.0}
        lineContainerStyle={{ height: 0.0 }}
        lineStyle={{ height: 0.0 }}
        wrapperStyle={{ ...styles.bottomSheetWrapStyle }}
      >
        {(onScrollEndDrag) => (
          <ScrollView
            onScrollEndDrag={onScrollEndDrag}
            contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 10.0 }}
            showsVerticalScrollIndicator={false}
          >
            <Animatable.View
              animation="slideInUp"
              iterationCount={1}
              duration={1500}
            >
              <Text
                style={{
                  ...Fonts.blackColor16SemiBold,
                  textAlign: "center",
                  margin: Sizes.fixPadding * 2.0,
                }}
              >
                Ride start on 25 june 2023
              </Text>
              {passengersInfo()}
              {routesInfo()}
            </Animatable.View>
          </ScrollView>
        )}
      </BottomSheet>
    );
  }

  function routesInfo() {
    return (
      <View style={{ marginTop: Sizes.fixPadding * 2.0 }}>
        {routesList.map((item, index) => (
          <View
            key={`${item.id}`}
            style={{
              flexDirection: "row",
              marginHorizontal: Sizes.fixPadding * 2.0,
            }}
          >
            <View>
              {item.isPickDropPoint ? (
                <View style={styles.sheetLocationIconWrapper}>
                  <MaterialIcons
                    name="location-pin"
                    color={Colors.grayColor}
                    size={10}
                  />
                </View>
              ) : (
                <Image
                  source={require("../../assets/images/icons/car.png")}
                  style={styles.sheetCarImage}
                />
              )}

              {index === routesList.length - 1 ? null : verticalDashLine()}
            </View>
            <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
              <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
                {item.title}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  ...Fonts.blackColor14Medium,
                  marginTop: Sizes.fixPadding - 8.0,
                }}
              >
                {item.address}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  }

  function verticalDashLine() {
    return (
      <DashedLine
        axis="vertical"
        dashLength={3}
        dashColor={Colors.lightGrayColor}
        dashThickness={1}
        style={{
          height: 45.0,
          marginLeft: Sizes.fixPadding - 2.0,
        }}
      />
    );
  }

  function passengersInfo() {
    const renderItem = ({ item }) => (
      <View
        style={{
          alignItems: "center",
          width: 70.0,
          marginHorizontal: Sizes.fixPadding * 1.4,
        }}
      >
        <Image
          source={item.profile}
          style={{ width: 50.0, height: 50.0, borderRadius: 25.0 }}
        />
        <Text
          style={{
            ...Fonts.grayColor12Medium,
            textAlign: "center",
            marginTop: Sizes.fixPadding - 5.0,
          }}
        >
          {item.name}
        </Text>
      </View>
    );
    return (
      <FlatList
        data={pessengersList}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    );
  }

  function verticalDashLine() {
    return (
      <DashedLine
        axis="vertical"
        dashLength={3}
        dashColor={Colors.lightGrayColor}
        dashThickness={1}
        style={{
          height: 45.0,
          marginLeft: Sizes.fixPadding - 2.0,
        }}
      />
    );
  }

  function directionInfo() {
    return (
      <MapView
        region={{
          latitude: 22.563643,
          longitude: 88.34588,
          latitudeDelta: 0.25,
          longitudeDelta: 0.25,
        }}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        mapType="terrain"
      >
        {routesList.map((item, index) => {
          return (
            <Marker key={`${item.id}`} coordinate={item.coordinate}>
              {item.isPickDropPoint ? (
                <View
                  style={{
                    ...styles.markerCircle,
                    borderColor: Colors.greenColor,
                  }}
                >
                  <MaterialIcons
                    name="location-pin"
                    color={Colors.greenColor}
                    size={14.0}
                  />
                </View>
              ) : (
                <Image
                  source={require("../../assets/images/icons/car.png")}
                  style={{ width: 20.0, height: 20.0, resizeMode: "contain" }}
                />
              )}
            </Marker>
          );
        })}
        {routesList.map((item, index) => {
          return index !== routesList.length - 1 ? (
            <MapViewDirections
              key={`${item.id}`}
              origin={item.coordinate}
              destination={routesList[index + 1].coordinate}
              apikey={Key.apiKey}
              strokeColor={Colors.primaryColor}
              strokeWidth={3}
            />
          ) : null;
        })}
      </MapView>
    );
  }
};

export default StartRideScreen;

const styles = StyleSheet.create({
  bottomSheetWrapStyle: {
    borderTopLeftRadius: Sizes.fixPadding * 4.0,
    borderTopRightRadius: Sizes.fixPadding * 4.0,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: -Sizes.fixPadding,
  },
  locationIconWrapper: {
    width: 16.0,
    height: 16.0,
    borderRadius: 8.0,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.0,
  },
  sheetLocationIconWrapper: {
    width: 16.0,
    height: 16.0,
    borderRadius: 8.0,
    borderColor: Colors.grayColor,
    borderWidth: 1.0,
    alignItems: "center",
    justifyContent: "center",
  },
  markerCircle: {
    width: 20.0,
    height: 20.0,
    borderRadius: 10.0,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.whiteColor,
  },
  sheetCarImage: {
    width: 16.0,
    height: 16.0,
    resizeMode: "contain",
    tintColor: Colors.grayColor,
  },
});
