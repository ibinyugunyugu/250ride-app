import { Text, View, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import MyStatusBar from "../../components/myStatusBar";
import Header from "../../components/header";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";

const transactionsList = [];
const transactionsLists = [
  {
    id: "1",
    title: "You have paid a ride",
    date: "25 jan 2023 | 10:23 AM",
    amount: "Rwf 500",
    isIncome: false,
  },
  {
    id: "2",
    title: "Add to wallet",
    date: "25 jan 2023 | 10:23 AM",
    amount: "Rwf 500",
    isIncome: false,
  },
  {
    id: "3",
    title: "You have paid a ride",
    date: "25 jan 2023 | 10:23 AM",
    amount: "Rwf 500",
    isIncome: false,
  },
  {
    id: "4",
    title: "You have paid a ride",
    date: "25 jan 2023 | 10:23 AM",
    amount: "Rwf 500",
    isIncome: false,
  },
  {
    id: "5",
    title: "Add ro wallet",
    date: "25 jan 2023 | 10:23 AM",
    amount: "Rwf 500",
    isIncome: false,
  },
  {
    id: "6",
    title: "You have paid a ride",
    date: "25 jan 2023 | 10:23 AM",
    amount: "Rwf 500",
    isIncome: false,
  },
  {
    id: "7",
    title: "You have paid a ride",
    date: "25 jan 2023 | 10:23 AM",
    amount: "Rwf 500",
    isIncome: false,
  },
  {
    id: "8",
    title: "You have paid a ride",
    date: "25 jan 2023 | 10:23 AM",
    amount: "Rwf 500",
    isIncome: false,
  },
  {
    id: "9",
    title: "You have paid a ride",
    date: "25 jan 2023 | 10:23 AM",
    amount: "Rwf 500",
    isIncome: false,
  },
  {
    id: "10",
    title: "You have paid a ride",
    date: "25 jan 2023 | 10:23 AM",
    amount: "Rwf 500",
    isIncome: false,
  },
  {
    id: "11",
    title: "You have paid a ride",
    date: "25 jan 2023 | 10:23 AM",
    amount: "Rwf 500",
    isIncome: false,
  },
  {
    id: "12",
    title: "You have paid a ride",
    date: "25 jan 2023 | 10:23 AM",
    amount: "Rwf 500",
    isIncome: false,
  },
];

const RiderTransactionsScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={"Transaction"} navigation={navigation} />
        {transactionInfo()}
      </View>
    </View>
  );

  function transactionInfo() {
    const renderItem = ({ item, index }) => (
      <TouchableOpacity 
        onPress={() => {
          navigation.push("PastRide");
        }}
        style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}
      >
        <View style={{ ...CommonStyles.rowAlignCenter }}>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor15SemiBold }}>
              {item.title}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                ...Fonts.blackColor13Medium,
                marginTop: Sizes.fixPadding - 7.0,
              }}
            >
              Aime NTWALI | {item.date}
            </Text>
          </View>
          <View>
            <Text
              style={
                item.isIncome
                  ? { ...Fonts.greenColor16SemiBold }
                  : { ...Fonts.redColor16SemiBold }
              }
            >
              {item.amount}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                ...Fonts.blackColor13Medium,
                marginTop: Sizes.fixPadding - 7.0,
              }}
            >
              Momo
            </Text>
          </View>
          
        </View>
        {index == transactionsList.length - 1 ? null : (
          <View
            style={{
              backgroundColor: Colors.grayColor,
              height: 1.0,
              marginVertical: Sizes.fixPadding * 2.0,
            }}
          />
        )}
      </TouchableOpacity>
    );
    return (
      <FlatList
        data={transactionsList}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: Sizes.fixPadding * 2.0 }}
      />
    );
  }
};

export default RiderTransactionsScreen;
