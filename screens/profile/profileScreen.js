import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useState } from "react";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Overlay } from "@rneui/themed";
import Header from "../../components/header";
import useAuth from "../../auth/useAuth";
import settings from "../../constants/settings";
import LoadingIndicator from "../../components/loadingIndicator";
import AlertMessage from "../../components/alertMessage";
import userApi from "../../api/users";
import ShareButton from "../../components/shareButton";
import { useDispatch } from "react-redux";
import { resetData, resetSearched } from "../../store/home";
import { resetPickUp } from "../../store/pickup";
import { resetDestination } from "../../store/destination";
import saveToStore from "../../hooks/saveToStore";
import { clearNotifications } from "../../store/notifications";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const ProfileScreen = ({ navigation }) => {
  const [showLogoutDialog, setshowLogoutDialog] = useState(false);
  const [showDeactivateDialog, setshowDeactivateDialog] = useState(false);
  const [isSettings, setIsSettings] = useState(false);
  const [modeDialog, setModeDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pickAlert, setpickAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sharing, setSharing] = useState(false);
  const auth = useAuth();
  const { user, logOut } = auth;
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  return ( 
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={isSettings ? t("Settings") : t("Profile")} noBack={!isSettings} onClick={isSettings ? ()=>setIsSettings(false) : null} navigation={navigation}/>
        {!isSettings ?
        <ScrollView showsVerticalScrollIndicator={false}>
          {profileInfo()}
          {profileOptions()}
        </ScrollView>
        :
        <ScrollView showsVerticalScrollIndicator={false}>
          {settingsOptions()}
        </ScrollView>
        }
      </View>
      {logoutDialog()}
      {deactivateDialog()}
      {loadingIndicator()}
      {alertMessage()}
      {switchProfileDialog()}
      <View style={{width:0,height:0}}>
        <ShareButton sharing={sharing} setSharing={setSharing}/>
      </View>
    </View>
  );

  function loadingIndicator(){
    return <LoadingIndicator visible={loading}/>
  }

  function alertMessage() {
    return <AlertMessage 
      visible={pickAlert} 
      setVisible={setpickAlert} 
      errorMessage={errorMessage}
    /> 
  }

  function deactivateDialog() {
    return (
      <Overlay
        isVisible={showDeactivateDialog}
        onBackdropPress={() => setshowDeactivateDialog(false)}
        overlayStyle={styles.dialogStyle}
      >
        <View
          style={{
            marginVertical: Sizes.fixPadding * 2.5,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          <Text style={{ ...Fonts.blackColor16SemiBold, textAlign: "center" }}>
            {t('Are you sure you want to deactivate your account')}
          </Text>
          <Text style={{ ...Fonts.blackColor14Medium, textAlign: "center",  paddingTop:Sizes.fixPadding  }}>
            {('By doing so, your account and data associated with it will be deleted')}.{`\n`} {t('This action is irreversable')}
          </Text>
        </View>
        <View style={{ ...CommonStyles.rowAlignCenter, ...styles.btnContainer }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setshowDeactivateDialog(false);
            }}
            style={{
              ...styles.dialogButton,
              paddingHorizontal: Sizes.fixPadding * 3.0 
            }}
          >
            <Text style={{ ...Fonts.blackColor16SemiBold }}>{t('no')}</Text>
          </TouchableOpacity>
          <View style={{ backgroundColor: Colors.whiteColor, width: 2.0 }} />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleDeactivate}
            style={{...styles.dialogButton, backgroundColor: Colors.secondaryColor}}
          >
            <Text style={{ ...Fonts.whiteColor16SemiBold }}>{t('Deactivate')}</Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    );
  }

  function logoutDialog() {
    return (
      <Overlay
        isVisible={showLogoutDialog}
        onBackdropPress={() => setshowLogoutDialog(false)}
        overlayStyle={styles.dialogStyle}
      >
        <View
          style={{
            marginVertical: Sizes.fixPadding * 2.5,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          <Text style={{ ...Fonts.blackColor16SemiBold, textAlign: "center" }}>
            {t('Are you sure you want to logout this account')}?
          </Text>
        </View>
        <View style={{ ...CommonStyles.rowAlignCenter, ...styles.btnContainer }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setshowLogoutDialog(false);
            }}
            style={{
              ...styles.dialogButton,
              paddingHorizontal: Sizes.fixPadding * 3.0 
            }}
          >
            <Text style={{ ...Fonts.blackColor16SemiBold }}>{t('no')}</Text>
          </TouchableOpacity>
          <View style={{ backgroundColor: Colors.whiteColor, width: 2.0 }} />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              dispatch(resetSearched());
              dispatch(resetDestination());
              dispatch(resetPickUp());
              dispatch(resetData());
              dispatch(clearNotifications());
              logOut();
              navigation.navigate({name:"Language",merge:true});
              setshowLogoutDialog(false);
            }}
            style={{...styles.dialogButton, backgroundColor: Colors.secondaryColor}}
          >
            <Text style={{ ...Fonts.whiteColor16SemiBold }}>{t('Logout')}</Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    );
  }

  function profileOptions() {
    return (
      <View
        style={{
          backgroundColor: Colors.whiteColor,
          padding: Sizes.fixPadding * 2.0,
        }}
      >
        {divider()}
        {user?.currentProfile == 2 ? profileOptionSort({
          icon: "wallet-outline",
          icontype: "Ionicons",
          option: t("Wallet"),
          detail: t("You can check all transaction"),
          onPress: () => {
            navigation.push("Wallet");
          },
        }) : null}
        {user?.currentProfile == 2 ? divider() : null}
        {user?.currentProfile == 2 ? profileOptionSort({
          icon: "car-outline",
          option: t("My Cars"),
          detail: t("You can add or remove your cars"),
          onPress: () => {
            navigation.push("UserVehicles");
          },
        }) : null}
        {user?.currentProfile == 2 ? divider() : null}
        {user?.currentProfile == 1 ? profileOptionSort({
          icon: "swap-vertical",
          icontype: "Ionicons",
          option: t("Transaction"),
          detail: t("View all the transaction"),
          onPress: () => {
            navigation.push("Transactions");
          },
        }) : null}
        {user?.currentProfile == 1 ? divider() : null}
        {profileOptionSort({
          icon: "cog",
          option: t("Settings"),
          detail: t("You can edit your settings"),
          onPress: () => {
            setIsSettings(true);
          },
        })}        
        {divider()}
        {profileOptionSort({
          icon: "headphones",
          option: t("Customer support"),
          detail: t("You can reach to us for any issue"),
          onPress: () => {
            navigation.push("CustomerSupport");
          },
        })}
        {divider()}
        {profileOptionSort({
          icon: "share-social-outline",
          icontype: "Ionicons",
          option: t("Share the app"),
          detail: t("Please share this app"),
          onPress: () => {
            setSharing(true)
          },
        })}
        {(user?.isDriver && user?.isRider) ? divider() : null}
        {(user?.isDriver && user?.isRider) ? profileOptionSort({
          icon: require("../../assets/images/icons/switch.png"),
          isImage:true,
          option: t("Switch account"),
          detail: t("You can switch your account"),
          onPress: () => {
            setModeDialog(true)
          },
        }) : null }
        {divider()}
        {logoutInfo()}
      </View>
    );
  }
  

  function settingsOptions() {
    return (
      <View
        style={{
          backgroundColor: Colors.whiteColor,
          padding: Sizes.fixPadding * 2.0,
        }}
      >
        {profileOptionSort({
          icon: "globe-outline",
          icontype: "Ionicons",
          option: t("Change Language"),
          onPress: () => {
            navigation.push("ChangeLanguage");
          },
        })}
        {divider()}
        {profileOptionSort({
          icon: require("../../assets/images/icons/faq.png"),
          option: t("FAQ"),
          isImage:true,
          onPress: () => {
            navigation.push("Faq");
          },
        })}
        {divider()}
        {profileOptionSort({
          icon: "shield-alert-outline",
          option: t("Privacy policy"),
          onPress: () => {
            navigation.push("PrivacyPolicy");
          },
        })}
        {divider()}
        {profileOptionSort({
          icon: "clipboard-list",
          option: t("Terms and conditions"),
          onPress: () => {
            navigation.push("TermsAndConditions");
          },
        })}
        {divider()}
        {profileOptionSort({
          icon: "close-circle",
          icontype: "Ionicons",
          option: t("Deactivate Account"),
          onPress: () => {
            setshowDeactivateDialog(true);
          },
        })}
      </View>
    );
  }

  function logoutInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setshowLogoutDialog(true);
        }}
        style={{ flexDirection: "row" }}
      >
        <MaterialCommunityIcons
          name={"logout"}
          size={20}
          color={Colors.blackColor}
        />
        <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding }}>
          <Text numberOfLines={1} style={{ ...Fonts.blackColor16SemiBold }}>
            {t('Logout option')}
          </Text>
        </View>
        <MaterialCommunityIcons
          name={"chevron-right"}
          size={24}
          color={Colors.secondaryColor}
          style={{ alignSelf: "center" }}
        />
      </TouchableOpacity>
    );
  }

  function divider() {
    return (
      <View
        style={{
          backgroundColor: Colors.blackColor,
          height: 1.0,
          marginVertical: Sizes.fixPadding * 2.0,
        }}
      ></View>
    );
  }

  function profileOptionSort({ icon, option, detail, onPress, icontype, isImage }) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={{ flexDirection: "row" }}
      >
        {icontype ? <Ionicons
          name={icon}
          size={20}
          color={Colors.blackColor}
        />
          :
        (!isImage 
          ? 
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={Colors.blackColor}
        />
        :
        <Image
            source={icon}
            style={{ width: 20, height: 20, resizeMode: "contain" }}
          />
        )
        }
        <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding }}>
          <Text numberOfLines={1} style={{ ...Fonts.blackColor16SemiBold }}>
            {option}
          </Text>
          { detail ? 
          <Text
            numberOfLines={1}
            style={{
              ...Fonts.blackColor14Medium,
              marginTop: Sizes.fixPadding - 8.0,
            }}
          >
            {detail}
          </Text>
           : 
          null}
        </View>
        <MaterialCommunityIcons
          name={"chevron-right"}
          size={24}
          color={Colors.secondaryColor}
          style={{ alignSelf: "center" }}
        />
      </TouchableOpacity>
    );
  }

  function profileInfo() {
    return (
      <View
        style={{
          ...CommonStyles.rowAlignCenter,
          margin: Sizes.fixPadding * 2.0,
        }}
      >
        <View>
          <Image
            source={user?.photo ? {uri:settings.host+'images/'+user.photo} : require("../../assets/images/avatar.png")}
            style={{ width: 60.0, height: 60.0, borderRadius: 35.0 }}
          />
           <View style={[styles.statusBtn,parseInt(user?.currentProfile) == 1 ? {backgroundColor:Colors.secondaryColor} : {backgroundColor:Colors.blackColor}]}>
            <Text style={{ ...Fonts.whiteColor12Medium, textAlign:'center' }}>{parseInt(user?.currentProfile) == 1 ? t(`rider`) : t(`driver`)}</Text>
          </View>
        </View>
        <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding + 3.0 }}>
          <Text style={{ ...Fonts.blackColor16SemiBold }}>{user?.name}</Text>
          <Text style={{ ...Fonts.blackColor16Medium }}>
            {user?.countryCode}{' '}{user?.phoneNumber}
          </Text>
          <Text style={{ ...Fonts.blackColor16Medium }}>
            {user?.email}
          </Text>
        </View>
        <MaterialCommunityIcons
          name="square-edit-outline"
          color={Colors.secondaryColor}
          size={24}
          onPress={() => {
            navigation.push("EditProfile");
          }}
        />
      </View>
    );
  }
  function switchProfileDialog() {
    return (
      <Overlay
        isVisible={modeDialog}
        onBackdropPress={() => setModeDialog(false)}
        overlayStyle={styles.dialogStyle}
      >
        <View
          style={{
            marginVertical: Sizes.fixPadding * 2.5,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          <Text style={{ ...Fonts.blackColor16Medium, textAlign: "center" }}>
            { 
              user?.currentProfile === '2' 
              ? 
              t('your account is in driver mode would you like to switch to rider mode')
              :
              t('your account is in rider mode would you like to switch to driver mode')
            }
          </Text>
        </View>
        <View style={{ ...CommonStyles.rowAlignCenter, ...styles.btnContainer }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setModeDialog(false);
            }}
            style={{
              ...styles.dialogBtn,
              paddingHorizontal: Sizes.fixPadding * 3.0 
            }}
          >
            <Text style={{ ...Fonts.blackColor16SemiBold }}>{('cancel')}</Text>
          </TouchableOpacity>
          <View style={{ backgroundColor: Colors.whiteColor, width: 2.0 }} />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSwitch}
            style={{...styles.dialogBtn, backgroundColor: Colors.secondaryColor}}
          >
            <Text style={{ ...Fonts.whiteColor16SemiBold }}>{t('continue')}</Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    );
  }

  async function handleSwitch(){
    setModeDialog(false);
    setpickAlert(false);
    setLoading(true);
    const result = await userApi.switchAccount();
    setLoading(false) 
    if (!result.ok) {
      return setErrorMessage(result.data.error ? t(result.data.error) : t('switching account failed try again'))
    }
    setErrorMessage(t("account switched to"));
    setpickAlert(true);
    auth.logIn(result.data);
    
  }

  async function handleDeactivate(){
    setshowDeactivateDialog(false);
    setpickAlert(false);
    setLoading(true);
    const result = await userApi.deactivateAccount();
    setLoading(false) 
    if (!result.ok) {
      return setErrorMessage(result.data.error ? t(result.data.error) : t("deleting account failed try again"))
    }
    dispatch(resetSearched());
    dispatch(resetDestination());
    dispatch(resetPickUp());
    dispatch(resetData());
    logOut();
    navigation.navigate({name:"Language",merge:true});
    
  }
};

export default ProfileScreen;

const styles = StyleSheet.create({
  dialogButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius:Sizes.fixPadding,
    paddingVertical:Sizes.fixPadding/2.0,
    width:100
  },
  dialogStyle: {
    width: "80%",
    borderRadius: Sizes.fixPadding,
    padding: 0,
    overflow: "hidden",
  },
  btnContainer:{
    flexDirection:'row',
    justifyContent:'center',
    paddingBottom:Sizes.fixPadding*2.0
  },
  dialogBtn: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius:Sizes.fixPadding,
    paddingVertical:Sizes.fixPadding/2.0,
    width:120
  },
  statusBtn:{
    borderRadius: Sizes.fixPadding - 2.0,
    padding: Sizes.fixPadding - 7.0,
    marginTop: Sizes.fixPadding,
  }
});
