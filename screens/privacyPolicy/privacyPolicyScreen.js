import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import Header from "../../components/header";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const privacyPolicies = [
  "PRIVACY POLICY",
  "Last Updated: 16/02/2024",
  "1. Introduction",
  "Welcome to 250Ride, the carpooling service provided by 250 Ride Ltd Your privacy is important to us, and we are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our carpooling platform.",
  "2. Collected Information",
  "2.1 Information Provided by You",
  "When you use our services, we may collect the following information from you:",
  "Registration Information: This includes your mobile phone number, name, email, and any other details required for account creation.",
  "User Profile Information: Information you voluntarily provide, such as profile pictures, personal identification data, and vehicle details.",
  "2.2 Information Collected Automatically",
  "We may use various technologies to automatically collect data whenever you access or use our carpooling platform, including:",
  "Technical Information: Time, date, and other statistics of your service usage.",
  "Location Information: We use geolocation data to connect users with carpool drivers.",
  "Usage Information: Data related to how you interact with our platform.",
  "Call Information: For quality and training purposes, call center bookings may be recorded.",
  "3. Use of Collected Information",
  "We collect and use the information for the following purposes:",
  "Connecting Users: Facilitate carpooling connections between users and drivers.",
  "Account Management: Create and update user accounts, process payments, and personalize user experiences.",
  "Service Improvement: Analyze, improve, and develop our carpooling services.",
  "Communication: Send updates, promotions, and important information to users.",
  "Customer Support: Provide assistance and support to our users.",
  "Safety and Security: Respond to safety issues, accidents, disputes, and requests from authorities.",
  "4. Sharing and Disclosure of Collected Information",
  "We may share your information under the following circumstances:",
  "With Carpool Drivers: Basic information to facilitate carpool services.",
  "With Payment Service Providers: Information necessary for payment processing.",
  "For Legal Reasons: Disclosure to government authorities and law enforcement when required by applicable law.",
  "5. Security",
  "We take reasonable precautions to securely store the collected information. While we strive to protect your data, we cannot guarantee absolute security during data transmission.",
  "6. User Control and Account Termination",
  "You can control your account and the information you provide. If you wish to cancel your account, please contact us at info@250ride.rw ",
  "We may retain certain information for dispute resolution, fraud prevention, and legal compliance.",
  "7. Privacy Policy Updates",
  "We may update this Privacy Policy to reflect changes in our practices. Any updates will be effective immediately upon posting on our platform. We encourage users to review this policy periodically.",
  "8. Contact Information",
  "If you have any questions or comments about this Privacy Policy, please contact us at info@250ride.rw",
  "Thank you for choosing 250Ride! Your privacy and safety are our top priorities."
];

const PrivacyPolicyScreen = ({ navigation }) => {
  const {t, i18n} = useTranslation();
  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={t("Privacy policy")} navigation={navigation} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 1.5 }}
        >
          {privacyPolicyInfo()}
        </ScrollView>
      </View>
    </View>
  );

  function privacyPolicyInfo() {
    return (
      <View>
        {privacyPolicies.map((item, index) => (
          <Text key={`${index}`} style={styles.privacyPolicyTextStyle}>
            {t(item)}
          </Text>
        ))}
      </View>
    );
  }
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  appIcon: {
    height: 80.0,
    width: "100%",
    resizeMode: "contain",
    marginVertical: -Sizes.fixPadding,
  },
  privacyPolicyTextStyle: {
    ...Fonts.grayColor14Medium,
    marginVertical: Sizes.fixPadding - 5.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    textAlign: "justify",
  },
});
