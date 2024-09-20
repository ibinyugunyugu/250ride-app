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

const rides = [
  {
    id: "1",
    amount: "Rwf 500",
    profile: require("../../assets/images/user/user8.png"),
    name: "Jenny Wilson",
    rating: "4.8",
    availableSheet: 2,
  },
  {
    id: "2",
    amount: "Rwf 500",
    profile: require("../../assets/images/user/user2.png"),
    name: "Guy Hawkins",
    rating: "4.5",
    availableSheet: 3,
  },
  {
    id: "3",
    amount: "Rwf 500",
    profile: require("../../assets/images/user/user3.png"),
    name: "Jacob Jones",
    rating: "4.3",
    availableSheet: 1,
  },
  {
    id: "4",
    amount: "$30.00",
    profile: require("../../assets/images/user/user4.png"),
    name: "Floyd Miles",
    rating: "4.5",
    availableSheet: 2,
  },
  {
    id: "5",
    amount: "$35.00",
    profile: require("../../assets/images/user/user5.png"),
    name: "Jerome Bell",
    rating: "4.5",
    availableSheet: 2,
  },
  {
    id: "6",
    amount: "$10.00",
    profile: require("../../assets/images/user/user6.png"),
    name: "Jenny Wilsonl",
    rating: "4.2",
    availableSheet: 1,
  },
  {
    id: "7",
    amount: "$15.00",
    profile: require("../../assets/images/user/user7.png"),
    name: "Arlene McCoy",
    rating: "4.8",
    availableSheet: 2,
  },
];

const SuggestionScreen = ({ navigation, route }) => {
  const [selected, setSelected] = useState('');

  useEffect(() => {
    if (route.params?.dateTime) {
      setSelected(route.params.dateTime);
    }
  }, [route.params?.dateTime]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={"Suggestion"} navigation={navigation} />
        {alertBox()}
        {ridesInfo()}
      </View>
    </View>
  );

  function ridesInfo() {
    const renderItem = ({ item }) => (
      <RideSummary item={item} navigation={navigation}/>
    );
    return (
      <View style={{ flex: 1 }}>
        <Text 
          style={{ 
            ...Fonts.blackColor16Medium, 
            paddingTop: Sizes.fixPadding * 3.0,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          You may choose this also:
        </Text>
        <FlatList
          data={[]}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: Sizes.fixPadding * 2.0 }}
        />
      </View>
    );
  }
 
  function alertBox() {
    return (
      <View style={styles.alertBox}>
        <Text>{selected}</Text>
        <View style={styles.infoBox}>
          <Text style={{...Fonts.blackColor18SemiBold, textAlign:'center'}}>
            No Rides for this Date & hour 
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {}}
            style={{
              ...CommonStyles.button,
              marginTop: Sizes.fixPadding * 2.0,
              marginHorizontal: Sizes.fixPadding * 6.0,
              width:'auto'
            }}
          >
            <Text style={{ ...Fonts.whiteColor15Medium}}>Create a ride alert</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
};

export default SuggestionScreen;

const styles = StyleSheet.create({
  alertBox: {
    borderWidth:1.0,
    borderColor:Colors.grayColor,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding + 2.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
  },
  infoBox: {
    paddingVertical:Sizes.fixPadding * 4.0,
    alignContent:'center',
    justifyContent:'center',
  },
});
