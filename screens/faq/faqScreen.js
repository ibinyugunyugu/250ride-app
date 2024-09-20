import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import Header from "../../components/header";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const faqsList = [
  {
    id: "1",
    question: "FOR DRIVERS",
    answer: '',
  },
  {
    id: "2",
    question: "1. How can I register as a driver on 250 Ride?",
    answer: 'To register as a driver, please fill out your personal and car identification information, and submit valid corresponding documents.',
  },
  {
    id: "3",
    question: "2. What documents do I need to provide during the registration process?",
    answer: 'You need to submit your ID document or passport, driving license, car identification document, car insurance, car technical inspection certificate, and, if applicable, a transport license from RURA. All documents must be valid.',
  },
  {
    id: "4",
    question: "3. How long does the driver registration approval process take?",
    answer: 'The driver registration approval process takes a maximum of 24 hours. In some cases, government institutions may be consulted for document authenticity verification.',
  },
  {
    id: "5",
    question: "4. Can I offer rides only within my city, or can I provide rides across the entire country?",
    answer: 'You can offer rides anywhere in Rwanda, as the 250 Ride app serves the entire country.',
  },
  {
    id: "6",
    question: "5. How do I set a ride price and how am I paid?",
    answer: 'You can set your own ride price within the app based on your judgment; payment can be made before the ride via a digital payment tool or with cash upon arrival.',
  },
  {
    id: "7",
    question: "FOR RIDERS",
    answer: '',
  },
  {
    id: "8",
    question: "1. How do I find available rides on 250 Ride?",
    answer: 'Simply open the app, enter your departure and destination locations, ride time, and browse through the available rides. Choose the one that best fits your schedule and preferences.',
  },
  {
    id: "9",
    question: "2. How can I pay for my ride?",
    answer: 'Payment is made digitally before or upon arrival through the app. You can use a digital payment method or cash.',
  },
  {
    id: "10",
    question: "3. What happens if I need to cancel my ride?",
    answer: 'You can cancel your ride through the app. However, please be aware of the cancellation policy, as there may be charges depending on the timing of the cancellation.',
  },
  {
    id: "11",
    question: "4. Can I schedule rides in advance?",
    answer: 'Yes, you can schedule rides in advance through the app. This is especially convenient for planning trips or ensuring you have a ride when needed.',
  },
  {
    id: "12",
    question: "5. Is there customer support available if I encounter any issues during my ride?",
    answer: 'Yes, 250 Ride provides customer support to address any issues or concerns you may have during your ride. You can contact support through the app or website.',
  },
];

const FaqScreen = ({ navigation }) => {
  const {t, i18n} = useTranslation();
  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={t("FAQs")} navigation={navigation} />
        {faqsInfo()}
      </View>
    </View>
  );

  function faqsInfo() {
    const renderItem = ({ item, index }) => (
      <View>
        <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
          <Text style={{ ...Fonts.blackColor16SemiBold }}>{t(item.question)}</Text>
          <Text
            style={{
              ...Fonts.grayColor15Medium,
              textAlign: "justify",
              marginTop: Sizes.fixPadding - 5.0,
            }}
          >
            {item.answer ? t(item.answer) : ''}
          </Text>
        </View>
        {index == faqsList.length - 1 ? null : (
          <View style={styles.divider}></View>
        )}
      </View>
    );
    return (
      <FlatList
        data={faqsList}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: Sizes.fixPadding * 2.0 }}
      />
    );
  }
};

export default FaqScreen;

const styles = StyleSheet.create({
  divider: {
    backgroundColor: Colors.lightGrayColor,
    height: 1.0,
    marginVertical: Sizes.fixPadding * 1.5,
  },
});
