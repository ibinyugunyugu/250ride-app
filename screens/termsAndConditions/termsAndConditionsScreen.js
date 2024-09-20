import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import Header from "../../components/header";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const termsAndConditions = [
  "TERMS AND CONDITIONS",
  "Last Updated: 16/02/2024",
  "1. Acceptance of Terms",
  "By using the carpooling service provided by 250 Ride Ltd, hereinafter referred to as '250 Ride,' you agree to abide by these Terms and Conditions. If you do not agree to these terms, please refrain from using our services.",
  "2. Use of Services",
  "2.1 Eligibility",
  "You must be at least 18 years old to use our carpooling platform. By using the service, you affirm that you are of legal age.",
  "2.2 Account Creation",
  "To access our carpooling services, you are required to create an account by providing accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials.",
  "2.3 User Conduct",
  "Users are expected to adhere to the following community guidelines to ensure a positive and safe carpooling experience",
  "2.3.1 Respect and Courtesy",
  " - Treat fellow passengers and drivers with respect and courtesy.",
  " - Avoid offensive language, harassment, or any form of discrimination.",
  "2.3.2 Safety First",
  " - Prioritize safety during rides by following traffic rules and guidelines.",
  " - Report any safety concerns promptly through the in-app reporting feature.",
  "2.3.3 Reliability",
  " - Be punctual for both pick-up and drop-off times.",
  " - Notify other users and 250 Ride in advance if there are any changes to your schedule.",
  "2.3.4 Communication",
  " - Communicate clearly and respectfully with drivers and passengers.",
  " - Use in-app communication features for ride-related discussions.",
  "2.3.5 Luggage Compliance",
  " - Ensure your luggage complies with local laws and regulations.",
  " - Do not carry any unlawful items, hazardous materials, or substances prohibited by law.",
  "2.3.6 Personal Identification",
  " - Carry valid personal identification as required by local laws.",
  " - Provide accurate and up-to-date information on your 250 Ride profile.",
  "2.3.7 Cleanliness and Maintenance",
  " - Keep vehicles clean and well-maintained for a comfortable ride.",
  " - Drivers, ensure your vehicle complies with roadworthiness standards.",
  "2.3.8 Cancellations",
  " - Honor your commitments and try to avoid last-minute cancellations.",
  " - Follow the cancellation policy outlined in the Terms and Conditions.",
  "2.3.9 Feedback and Reporting",
  " - Provide honest and constructive feedback after each ride.",
  " - Report any concerns, uncomfortable situations, or violations promptly using the in-app reporting feature.",
  "2.3.10 Compliance with Laws",
  " - Adhere to all local laws and regulations during rides.",
  " - Both riders and drivers are responsible for compliance.",
  'By consolidating the community guidelines into the "User Conduct" section of the "Use of Services" part, users can easily find and understand their responsibilities while using the carpooling platform.',
  "3. Termination or Suspension of User Accounts",
  "3.1 Criteria for Termination or Suspension",
  "We reserve the right to terminate or suspend user accounts for reasons including, but not limited to",
  " - Violation of these Terms and Conditions.",
  " - Any behavior that poses a threat to the safety and well-being of the community or the platform.",
  " - Non-compliance with aforementioned community guidelines.",
  "3.2 Notice and Investigation",
  "Prior to the termination or suspension of an account, we may conduct an investigation to ensure the validity of the reported violation. Users will be provided with notice of the investigation when feasible, and they may have an opportunity to address the concerns raised.",
  "3.3 Appeals Process",
  "If an account is suspended or terminated, affected users may have the right to appeal the decision. Information on the appeals process, including how to submit an appeal, will be provided to the user in question.",
  "3.4 Consequences of Termination",
  "Upon termination or suspension of an account, users may lose access to the carpooling platform and associated services. Any ongoing transactions, bookings, or scheduled rides may be affected, and users will be informed of any necessary actions on their part.",
  "4. Carpooling Services",
  "4.1 Safety",
  "Users are responsible for their safety during carpool rides. Exercise caution, follow traffic rules, and report any safety concerns promptly.",
  "",
  "For Riders",
  "4.1.1 Luggage Compliance",
  " - Ensure that your luggage complies with Rwandan law and regulations.",
  " - Do not carry any unlawful items, hazardous materials, or substances prohibited by law.",
  "4.1.2 Personal Identification",
  " - Carry valid personal identification as required by Rwandan law.",
  " - Provide accurate and up-to-date information on your 250Ride profile.",
  "4.1.3 Respectful Behavior",
  " - Treat drivers and fellow passengers with respect and courtesy.",
  " - Refrain from any behavior that may cause discomfort or harm to others.",
  "4.1.4 Reporting Concerns",
  " - Report any safety concerns, uncomfortable situations, or violations of our community guidelines promptly.",
  " - Use the in-app reporting feature to notify us of any issues during or after a ride.",
  "",
  "For Taxi Drivers",
  "4.1.5 Vehicle Compliance",
  " - Ensure your vehicle complies with Rwandan roadworthiness standards and has all required documentation.",
  " - Keep the car's emergency kit up-to-date and easily accessible.",
  "",
  "4.1.6 Driver Compliance",
  " - Possess a valid and up-to-date driver's license as required by Rwandan law.",
  " - Maintain a professional and courteous demeanor with riders.",
  "4.1.7 Vehicle Cleanliness",
  " - Keep your vehicle clean and well-maintained for a comfortable and safe ride.",
  "4.1.8 Compliance Checks",
  " - Conduct periodic checks to ensure riders' compliance with luggage regulations.",
  " - Politely inform riders of any violations and request necessary corrections.",
  "4.1.9 Reporting Issues",
  " - Report any rider behavior that raises safety concerns or violates community guidelines.",
  " - Use the in-app reporting feature to notify us of any issues during or after a ride.",
  "4.1.10 Emergency Situations",
  " - In the event of an emergency, call local emergency services immediately.",
  "4.1.11 Compliance with Laws",
  "- Both riders and drivers must comply with all Rwandan laws and regulations.",
  "4.2 Accuracy of Information",
  "Users must provide accurate and up-to-date information on their profiles, including identification data and vehicle details.",
  "4.3 Feedback and Ratings",
  "Users are encouraged to provide honest feedback and ratings for drivers and fellow passengers.",
  "4.4 Ride Cancellations and No-Show Policy",
  "4.4.1 Driver No-Show",
  "In the event that the driver fails to appear at the designated departure time, the rider who made the booking will receive reimbursement from 250 Ride. Simultaneously, the driver will incur transaction fees, which will be deducted by 250 Ride.",
  "4.4.2 Rider No-Show",
  "If a rider fails to appear at the departure time, their payment will not be subject to reimbursement. However, the driver will be compensated at the time corresponding to the scheduled arrival time.",
  "4.4.3 Cancellation Policy",
  "Cancellation reimbursements and transaction fees are governed by the following criteria",
  "For rides equal to or less than 40km",
  " - Cancellations initiated by either the driver or the rider are eligible for reimbursement if made prior to 40 minutes from the departure time.",
  " - If the cancellation is carried out by the driver, no transaction fee will be imposed on either party.",
  " - In the event of rider-initiated cancellations, 250 Ride will retain a transaction fee.",
  "For rides above 40km",
  " - Cancellations initiated by either the driver or the rider are eligible for reimbursement if made prior to 2 hours from the departure time.",
  " - If the cancellation is carried out by the driver, no transaction fee will be imposed.",
  " - In the event of rider-initiated cancellations, 250 Ride will retain a transaction fee.",
  "5. Privacy Policy",
  "Our Privacy Policy governs the collection, use, and disclosure of personal information. By using our services, you agree to the terms outlined in our Privacy Policy",
  "6. Intellectual Property",
  "6.1 Intellectual Property Rights",
  "All intellectual property rights associated with our carpooling platform, including trademarks, logos, and content, belong to 250 RIDE Ltd.",
  "6.2 User Responsibilities",
  "Users are granted a limited, non-exclusive, non-transferable license to access and use the platform for the purpose of offering or utilizing carpooling services. Users must not reproduce, modify, distribute, or create derivative works based on the platform without explicit permission.",
  "7. Termination of Services",
  "We reserve the right to terminate or suspend user accounts for violations of these Terms and Conditions, illegal activities, or any other behavior that may harm the community or our platform.",
  "8. Changes to Terms and Conditions",
  "8.1 Frequency of Updates",
  "We may update these Terms and Conditions periodically. Users will be notified of any significant changes. It is encouraged that users regularly review the Terms and Conditions for any updates.",
  "8.2 Encourage Regular Review",
  "Users are responsible for periodically reviewing the Terms and Conditions, even if they are not notified of specific changes. Continued use of our services constitutes acceptance of the updated terms.",
  "9. Disclaimer Clause",
  "The carpooling platform does not guarantee the availability of rides, and the service may be subject to disruptions or changes.",
  "10. Contact Information",
  "If you have any questions or concerns regarding these Terms and Conditions, please contact us at info@250ride.rw",
  "Thank you for choosing 250Ride. We appreciate your cooperation in ensuring a safe and enjoyable carpooling experience for everyone."
];

const TermsAndConditionsScreen = ({ navigation }) => {
  const {t, i18n} = useTranslation();
  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={t("Terms and conditions")} navigation={navigation} />
        {termsAndConditionsInfo()}
      </View>
    </View>
  );

  function termsAndConditionsInfo() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: Sizes.fixPadding + 5.0 }}
      >
        {termsAndConditions.map((item, index) => (
          <Text key={`${index}`} style={styles.termsAndConditionTextStyle}>
            {item ? t(item) : ''}
          </Text>
        ))}
      </ScrollView>
    );
  }
};

export default TermsAndConditionsScreen;

const styles = StyleSheet.create({
  termsAndConditionTextStyle: {
    ...Fonts.grayColor14Medium,
    marginVertical: Sizes.fixPadding - 5.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    textAlign: "justify",
  },
});
