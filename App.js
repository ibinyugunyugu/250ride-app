import "react-native-gesture-handler";
import "core-js/stable/atob";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabBarScreen from "./components/bottomTabBarScreen";
import { LogBox, PermissionsAndroid, View } from "react-native";
import { useFonts } from "expo-font";
import * as ExpoSplashScreen from "expo-splash-screen";
import React, { useCallback, useState } from "react";
import PickLocationScreen from "./screens/pickLocation/pickLocationScreen";
import AvailableRidesScreen from "./screens/availableRides/availableRidesScreen";
import RideDetailScreen from "./screens/rideDetail/rideDetailScreen";
import RideMapViewScreen from "./screens/rideMapView/rideMapViewScreen";
import ReviewsScreen from "./screens/reviews/reviewsScreen";
import MessageScreen from "./screens/message/messageScreen";
import ConfirmPoolingScreen from "./screens/confirmPooling/confirmPoolingScreen";
import OfferRideScreen from "./screens/offerRide/offerRideScreen";
import NotificationsScreen from "./screens/notifications/notificationsScreen";
import RideRequestScreen from "./screens/rideRequest/rideRequestScreen";
import StartRideScreen from "./screens/startRide/startRideScreen";
import EndRideScreen from "./screens/endRide/endRideScreen";
import RideCompleteScreen from "./screens/rideComplete/rideCompleteScreen";
import RiderTransactionsScreen from "./screens/transactions/riderTransactionsScreen";
import PaymentMethodsScreen from "./screens/paymentMethods/paymentMethodsScreen";
import CreditCardScreen from "./screens/creditCard/creditCardScreen";
import BankInfoScreen from "./screens/bankInfo/bankInfoScreen";
import AddAndSendMoneyScreen from "./screens/addAndSendMoney/addAndSendMoneyScreen";
import SuccessfullyAddAndSendScreen from "./screens/successfullyAddAndSend/successfullyAddAndSendScreen";
import EditProfileScreen from "./screens/editProfile/editProfileScreen";
import RideHistoryScreen from "./screens/rideHistory/rideHistoryScreen";
import HistoryRideDetailScreen from "./screens/historyRideDetail/historyRideDetailScreen";
import UserVehiclesScreen from "./screens/userVehicles/userVehiclesScreen";
import AddVehicleScreen from "./screens/addVehicle/addVehicleScreen";
import TermsAndConditionsScreen from "./screens/termsAndConditions/termsAndConditionsScreen";
import PrivacyPolicyScreen from "./screens/privacyPolicy/privacyPolicyScreen";
import CustomerSupportScreen from "./screens/customerSupport/customerSupportScreen";
import FaqScreen from "./screens/faq/faqScreen";
import SignUpScreen from "./screens/signUpScreen";
import SignInScreen from "./screens/signInScreen";
import LanguageScreen from "./screens/auth/langScreen";
import VerificationScreen from "./screens/auth/verificationScreen";
import SuggestionScreen from "./screens/suggestion/suggestionScreen";
import TrackingScreen from "./screens/tracking/trackingScreen";
import PastRideScreen from "./screens/pastRide/pastRideScreen";
import ProgressScreen from "./screens/progress/progressScreen";
import WalletScreen from "./screens/wallet/walletScreen";
import ClearBalanceScreen from "./screens/clearBalance/clearBalanceScreen";
import AuthContext from "./auth/context";
import HomeScreen from "./screens/home/homeScreen";
import RegistrationTypeScreen from "./screens/registrationType/registrationTypeScreen";
import DriverSignUpScreen from "./screens/driverSignUp/driverSignUpScreen";
import ChangeLangScreen from "./screens/changeLang/changeLangScreen";
import { Provider } from 'react-redux';
import store from './store';
import ConfirmSchedulingScreen from "./screens/confirmScheduling/confirmSchedulingScreen";
import MyRideDetailScreen from "./screens/rideDetail/myRideDetailScreen";

import OfflineNotice from "./components/offlineNotice";
import AvailableRequestsScreen from "./screens/availableRequests/availableRequestsScreen";
import RideTrackingScreen from "./screens/rideTracking/rideTrackingScreen";

import 'intl-pluralrules'

//ExpoSplashScreen.preventAutoHideAsync();

LogBox.ignoreAllLogs();

const Stack = createStackNavigator();


const App = () => {

  const [user, setUser] = useState();
  const [driver, setDriver] = useState();
  
  const [fontsLoaded] = useFonts({
    Montserrat_Medium: require("./assets/fonts/Poppins-Medium.ttf"),
    Montserrat_SemiBold: require("./assets/fonts/Poppins-SemiBold.ttf"),
    Montserrat_Bold: require("./assets/fonts/Poppins-Bold.ttf"),
  });

  
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await ExpoSplashScreen.hideAsync();
      
    }
  }, [fontsLoaded]);

  onLayoutRootView();
 
  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <View
      style={{ flex: 1}}
      onLayout={onLayoutRootView}>
      <AuthContext.Provider value={{user, setUser, driver, setDriver}}>
        <Provider store={store}>
          <OfflineNotice/>
          <NavigationContainer>
            
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
              initialRouteName={user ? "BottomTabBar" : "Language"}
            >
              
              <Stack.Screen name="Language" component={LanguageScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="Verification" component={VerificationScreen} />
              <Stack.Screen name="HomeGuest" component={HomeScreen} />
              
              <Stack.Screen
                name="BottomTabBar"
                component={BottomTabBarScreen}
                options={{ ...TransitionPresets.DefaultTransition }}
              />
              
              <Stack.Screen name="Suggestion" component={SuggestionScreen} />
              <Stack.Screen name="Tracking" component={TrackingScreen} />
              <Stack.Screen name="PickLocation" component={PickLocationScreen} />
              <Stack.Screen
                name="AvailableRides"
                component={AvailableRidesScreen}
              />
              <Stack.Screen
                name="AvailableRequests"
                component={AvailableRequestsScreen}
              />
              <Stack.Screen name="MyRideDetail" component={MyRideDetailScreen} />
              <Stack.Screen name="RideDetail" component={RideDetailScreen} />
              <Stack.Screen name="RideMapView" component={RideMapViewScreen} />
              <Stack.Screen name="RideTracking" component={RideTrackingScreen} />
              <Stack.Screen name="Reviews" component={ReviewsScreen} />
              <Stack.Screen name="Message" component={MessageScreen} />
              <Stack.Screen
                name="ConfirmPooling"
                component={ConfirmPoolingScreen}
              />
              <Stack.Screen
                name="ConfirmScheduling"
                component={ConfirmSchedulingScreen}
              />
              <Stack.Screen name="OfferRide" component={OfferRideScreen} />
              <Stack.Screen name="DriverSignUp" component={DriverSignUpScreen} />
              <Stack.Screen name="RegistrationType" component={RegistrationTypeScreen} />
              <Stack.Screen name="Notifications" component={NotificationsScreen} />
              <Stack.Screen name="RideRequest" component={RideRequestScreen} />
              <Stack.Screen name="RideProgress" component={ProgressScreen} />
              <Stack.Screen name="PastRide" component={PastRideScreen} />
              <Stack.Screen name="StartRide" component={StartRideScreen} />
              <Stack.Screen name="EndRide" component={EndRideScreen} />
              <Stack.Screen name="RideComplete" component={RideCompleteScreen} />
              <Stack.Screen name="Transactions" component={RiderTransactionsScreen} />
              <Stack.Screen
                name="AddAndSendMoney"
                component={AddAndSendMoneyScreen}
              />
              <Stack.Screen
                name="PaymentMethods"
                component={PaymentMethodsScreen}
              />
              <Stack.Screen name="CreditCard" component={CreditCardScreen} />
              <Stack.Screen
                name="SuccessfullyAddAndSend"
                component={SuccessfullyAddAndSendScreen}
              />
              <Stack.Screen name="Wallet" component={WalletScreen} />
              <Stack.Screen name="ClearBalance" component={ClearBalanceScreen} />
              <Stack.Screen name="BankInfo" component={BankInfoScreen} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} />
              <Stack.Screen name="RideHistory" component={RideHistoryScreen} />
              <Stack.Screen
                name="HistoryRideDetail"
                component={HistoryRideDetailScreen}
              />
              <Stack.Screen name="UserVehicles" component={UserVehiclesScreen} />
              <Stack.Screen name="AddVehicle" component={AddVehicleScreen} />
              <Stack.Screen
                name="TermsAndConditions"
                component={TermsAndConditionsScreen}
              />
              <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
              <Stack.Screen name="ChangeLanguage" component={ChangeLangScreen} />
              <Stack.Screen
                name="CustomerSupport"
                component={CustomerSupportScreen}
              />
              <Stack.Screen name="Faq" component={FaqScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      </AuthContext.Provider>
      </View>
    );
  }
};

export default App;
