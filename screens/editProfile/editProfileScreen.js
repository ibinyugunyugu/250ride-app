import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList

} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors, Sizes, Fonts, CommonStyles, screenHeight } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import Header from "../../components/header";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BottomSheet } from "@rneui/themed";
import useAuth from "../../auth/useAuth";
import settings from "../../constants/settings";
import UploadButton from "../../components/uploadButton";
import LoadingIndicator from "../../components/loadingIndicator";
import AlertMessage from "../../components/alertMessage";
import userApi from "../../api/users";
import CountryPicker from 'react-native-country-picker-modal'
import DateTimePicker from "../../components/dateTimePicker";
import { Overlay } from "@rneui/themed";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const EditProfileScreen = ({ navigation }) => {
  const auth = useAuth();
  const { user, driver } = auth;
  const [userName, setuserName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [mobileNo, setMobileNo] = useState(user?.phoneNumber);
  const [showChangeProfileSheet, setshowChangeProfileSheet] = useState(false);
  const [userImage, setUserImage] = useState(user?.photo);
  const [newImage, setNewImage] = useState();
  const [changed, setChanged] = useState(false);
  const [open, setOpen] = useState(false);
  const [pickAlert, setpickAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [verify, setVerify] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [withFlag] = useState(true)
  const [withFilter] = useState(true)
  const [withAlphaFilter] = useState(true)
  const [withCallingCode] = useState(true)
  const [withCountryNameButton] = useState(
    true,
  )
  const [visible, setVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [license, setLicense] = useState(driver?.licenseImage);
  const [licenseNumber, setLicenseNumber] = useState(driver?.licenseNumber);
  const [licenseExpire, setLicenseExpire] = useState(driver?.licenseExpire);
  const [idImage, setIdImage] = useState(driver?.idImage);
  const [idNumber, setIdNumber] = useState(driver?.idNumber);
  const [nationalityCode, setNationalityCode] = useState(driver?.nationalityCode.toUpperCase())
  const [nationalityName, setNationalityName] = useState(driver?.nationalityName.toUpperCase())
  const [idNumberExpire, setIdNumberExpire] = useState(driver?.idNumberExpire);
  const [idType, setIdType] = useState(driver?.idType);
  const [showExpire, setShowExpire] = useState(nationalityName !== 'Rwanda');
  const [withEmoji, setWithEmoji] = useState(true)
  const [selectedDateAndTime, setselectedDateAndTime] = useState("");
  const [selectedDate, setselectedDate] = useState("");
  const [showDateTimeSheet, setshowDateTimeSheet] = useState(false);
  const [activeField, setActiveField] = useState("");
  const {t, i18n} = useTranslation();

  const onSelectNationality = (country) => {
    setIdType(country.name === 'Rwanda' ? "ID Card" : "Passport");
    setShowExpire(country.name !== 'Rwanda');
    setNationalityCode(country.cca2)
    setNationalityName(country.name)
    setIdImage()
    setIdNumber()
    setIdNumberExpire()
  }
  const [formErrors, setFormErrors] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState({
    countryCode:user?.countryCode,
    countryIso:user?.countryIso,
  }); 
  const onSelect = (country) => {
    let phone = {
      countryCode:country.callingCode[0],
      countryIso:country.cca2,
    };
    setPhoneNumber(phone)
  }


  const isAllValid = () => {
    let errors = [];
    if(!userName) errors.push({type:t('Name'), message:t('Please provide your name')});
    if(!phoneNumber) errors.push({type:t('Phone Number'), message:t('Please provide your phone number')});
    if(!nationalityCode) errors.push({type:t('Nationality'), message:t('Please select your nationality')});
    if(!idNumber) errors.push({type:t(idType + ' Number'), message:t('Please enter '+idType+' Number')});
    if(idNumber && idType == "ID Card" &&idNumber.length !== 16) errors.push({type:t(idType + ' Number'), message:t(idType+' Number should be 16 digits')});
    if(showExpire && !idNumberExpire) errors.push({type:idType + ' Expiration date', message:'Please enter expiration date'});
    if(!idImage) errors.push({type:t(idType + ' Image'), message:t('Please upload '+idType+' image')});
    if(!licenseNumber) errors.push({type:t('Driving License'), message:t('Please provide your driving license number')});
    if(!licenseExpire) errors.push({type:t('Driving Expiration Date'), message:t('Please provide your driving license expiration date')});
    if(!license) errors.push({type:t('License Image'), message:t('Upload an image of your driving license')});
    return errors;
  }

  const handleDateSelect = (field, newDate) => {
    setActiveField(field);
    setselectedDate(newDate);
    setshowDateTimeSheet(true)
  }

  useEffect(()=>{
    if(!newImage) return;
    setUserImage(newImage);
    setChanged(true);
    setNewImage()
  },[newImage]);

  const hasError = (name,image) => {
    if(formErrors.some(e=>e.type == name)) return true;
    else if(image && formErrors.some(e=>e.type == image)) return true
    return false
  };

  const handleSubmit = async () => {
    setIsVisible(false);
    setFormErrors([]);
    const errors = isAllValid();
    if(errors.length && user.isDriver){
      setFormErrors(errors);
      return setIsVisible(true);
    }
    setpickAlert(false);
    let data = {
      countryCode:phoneNumber.countryCode,
      countryIso:phoneNumber.countryIso,
      phoneNumber:mobileNo,
      email,
      name:userName,
      photo:changed ? userImage : ''
    }
    if(user.isDriver){
        data.licenseNumber = licenseNumber;
        data.licenseExpire = licenseExpire;
        data.license = license;
        data.nationalityCode = nationalityCode;
        data.nationalityName = nationalityName;
        data.idType = idType;
        data.idImage = idImage;
        data.idNumber = idNumber;
        data.idNumberExpire = idNumberExpire;
        data.idChanged = idImage !== driver.idImage;
        data.licenseChanged = license !== driver.licenseImage;
      }


    setLoading(true);
    const result = await userApi.updateProfile(data);
    setLoading(false);
    if (!result.ok) {
      setErrorMessage(result.data ? t(result.data.error) : t('updating profile failed try again'));
      return setpickAlert(true);
    }
    if(result.data.verify) return navigation.push("Verification",{...data});
    auth.logIn(result.data);
    
    setErrorMessage(t('profile updated successfully'));
    return setpickAlert(true);
  };

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

  useEffect(() => {
    if(!verifying) return;
    const timeOut = setTimeout(() => {
      setErrorMessage("Verification failed!")
      setpickAlert(true);
      setVerifying(false);
    }, 5000);

    return () => {
      clearTimeout(timeOut)
    }
  }, [verifying])

  function handleVerify(){
    setVerifying(true);
  }

  useEffect(()=>{
    if(!selectedDateAndTime) return;
    switch (activeField) {
      case 'license':
        setLicenseExpire(selectedDateAndTime);
        break;
      case 'idNumber':
        setIdNumberExpire(selectedDateAndTime);
        break;
      default:
        break;
    }
  },[showDateTimeSheet]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={t("edit profile")} navigation={navigation} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
        >
          {profilePic()}
          {userNameInfo()}
          {mobileNoInfo()}
          {emailInfo()}
          {(user && user?.isDriver) ? <View>
            {nationalityInfo()}
            {iddocumentInfo()}
            {dlLicenseInfo()}
          </View> : null} 
        </ScrollView>
      </View>
      {updateButton()}
      {changePicSheet()}
      <View style={{width:0,height:0}}>
        <UploadButton setSingleFile={setNewImage} singleFile={newImage} open={open} setOpen={setOpen}/>
      </View>
      {loadingIndicator()}
      {alertMessage()}
      {dateTimePicker()}
      {formErrorsDialog()}
    </View>
  );

  function changePicSheet() {
    return (
      <BottomSheet
        isVisible={showChangeProfileSheet}
        onBackdropPress={() => {
          setshowChangeProfileSheet(false);
        }}
      >
        <View style={{ ...styles.sheetStyle }}>
          <Text
            style={{
              ...Fonts.blackColor18SemiBold,
              marginBottom: Sizes.fixPadding,
            }}
          >
            Change profile image
          </Text>
          {chagePicOptionSort({
            icon: "camera-alt",
            option: "Camera",
            color: Colors.secondaryColor,
          })}
          {chagePicOptionSort({
            icon: "photo",
            option: "Gallery",
            color: Colors.secondaryColor,
          })}
          {user.photo && chagePicOptionSort({
            icon: "delete",
            option: "Remove image",
            color: Colors.secondaryColor,
          })}
        </View>
      </BottomSheet>
    );
  }

  function chagePicOptionSort({ icon, option, color }) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setshowChangeProfileSheet(false);
          if(option === "Gallery") return setOpen(true);
        }}
        style={{
          ...CommonStyles.rowAlignCenter,
          marginVertical: Sizes.fixPadding,
        }}
      >
        <View style={styles.circle40}>
          <MaterialIcons name={icon} color={color} size={22} />
        </View>
        <Text
          numberOfLines={1}
          style={{
            ...Fonts.blackColor16Medium,
            flex: 1,
            marginLeft: Sizes.fixPadding + 5.0,
          }}
        >
          {option}
        </Text>
      </TouchableOpacity>
    );
  }

  function updateButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSubmit}
        style={{ ...CommonStyles.button, margin: Sizes.fixPadding * 2.0 }}
      >
        <Text style={{ ...Fonts.whiteColor18Bold }}>{t('update')}</Text>
      </TouchableOpacity>
    );
  }

  function mobileNoInfo() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection:'row'}}>
        <Text style={{ ...Fonts.blackColor15SemiBold }}>{t('Phone Number')}</Text>
        <Text style={{ color:Colors.redColor }}> *</Text>
        </View>
        <View style={{flexDirection:'row'}}>
          <View style={{...styles.textFieldStyle, paddingBottom:Sizes.fixPadding-2, paddingRight:Sizes.fixPadding}}>
            <CountryPicker
              {...{
                countryCode:phoneNumber.countryIso,
                withFilter,
                withFlag,
                withAlphaFilter,
                withCallingCode,
                withCallingCodeButton:true,
                onSelect,
              }}
              visible={visible}
            />
          </View>
        
          <TextInput
            placeholder={t("Enter Mobile number")}
            style={[styles.textFieldStyle, {flex:1}]}
            value={mobileNo}
            placeholderTextColor={Colors.grayColor}
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
            keyboardType="phone-pad"     
            onChangeText={setMobileNo}     
          />
          {verify ? (verifying ? <ActivityIndicator size="small" color={Colors.secondaryColor} /> : 
          <TouchableOpacity style={[styles.textFieldStyle, {paddingRight:Sizes.fixPadding}]} onPress={handleVerify}>
            <Text style={Fonts.secondaryColor14Medium}>Verify Me</Text>
          </TouchableOpacity>) : null}
        </View>
      </View>
    );
  }

  function emailInfo() {
    return (
      <View style={styles.container}>
        <Text style={{ ...Fonts.blackColor15SemiBold }}>{t('Email address')}</Text>
        <TextInput
          placeholder={t("Enter Email address")}
          style={styles.textFieldStyle}
          value={email}
          onChangeText={(value) => setEmail(value)}
          placeholderTextColor={Colors.grayColor}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
          keyboardType="email-address"
        />
      </View>
    );
  }

  function nationalityInfo() {
    return (
      <View style={styles.container}>
        <Text style={{ ...Fonts.blackColor15SemiBold }}>{t('Nationality')}</Text>
        <View style={[styles.textFieldStyle, hasError('Nationality') ? {borderColor:Colors.redColor} : {}]}>
          <CountryPicker
            {...{
              countryCode: nationalityCode,
              withFilter,
              withFlag,
              withCountryNameButton,
              withAlphaFilter,
              withCallingCode,
              withEmoji,
              onSelect:onSelectNationality,
            }}
          />
        </View>
      </View>
    );
  }

  function iddocumentInfo() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <View style={{flexDirection:'row'}}>
            <Text style={{ ...Fonts.blackColor15SemiBold }}>{t(idType + ' Number')}</Text>
            <Text style={{ color:Colors.redColor }}> *</Text>
          </View>

          {showExpire ? <View style={{flexDirection:'row'}}>
            <Text style={{ ...Fonts.blackColor15SemiBold }}>{t('Expire date')}</Text>
            <Text style={{ color:Colors.redColor }}> *</Text>
          </View> : null}
        </View>
        <View style={{flexDirection:'row'}}>       
          <TextInput
            placeholder={t(`Enter ${idType} number`)}
            style={[styles.textFieldStyle, {flex:1}, hasError(idType + ' Expiration date') ? {borderColor:Colors.redColor} : {}]}
            defaultValue={idNumber}
            onChangeText={setIdNumber}
            placeholderTextColor={Colors.grayColor}
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
            keyboardType={showExpire ? "default" : "numeric"}
          />
          {showExpire ? <TouchableOpacity style={[styles.textFieldStyle,{flexDirection:'row'}, hasError(idType + ' Expiration date') ? {borderColor:Colors.redColor} : {}]}
            onPress={()=>{
              handleDateSelect('idNumber',idNumberExpire)
            }}>
              <Text style={{paddingRight:Sizes.fixPadding }}>
                {idNumberExpire ? idNumberExpire.split('T')[0] : 'MM/YY'}
              </Text>

              <Ionicons
                name="calendar-outline"
                color={Colors.blackColor}
                size={20.0}
              />

            </TouchableOpacity> : null}
        </View>
        <UploadButton setSingleFile={setIdImage} singleFile={idImage} hasError={hasError(idType + ' Image')}/>
      </View>
    );
  }

  function dlLicenseInfo() {
    return (
      <View style={styles.container}>
        
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <View style={{flexDirection:'row'}}>
            <Text style={{ ...Fonts.blackColor15SemiBold }}>{t('Driving License')}</Text>
            <Text style={{ color:Colors.redColor }}> *</Text>
          </View>

          <View style={{flexDirection:'row'}}>
            <Text style={{ ...Fonts.blackColor15SemiBold }}>{t('Expire date')}</Text>
            <Text style={{ color:Colors.redColor }}> *</Text>
          </View>
        </View>
        <View style={{flexDirection:'row'}}>       
          <TextInput
            placeholder={t('Enter driving license number')}
            style={[styles.textFieldStyle, {flex:1}]}
            defaultValue={licenseNumber}
            placeholderTextColor={Colors.grayColor}
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
            keyboardType="phone-pad"     
            onChangeText={setLicenseNumber}     
          />
          <TouchableOpacity style={[styles.textFieldStyle,{flexDirection:'row'},  hasError('Driving Expiration Date')? {borderColor:Colors.redColor} : {}]}
            onPress={()=>{
              handleDateSelect('license',licenseExpire)
            }}>
            <Text style={{paddingRight:Sizes.fixPadding }}>
              {licenseExpire ? licenseExpire.split('T')[0] : 'MM/YY'}
            </Text>
            <Ionicons
              name="calendar-outline"
              color={Colors.blackColor}
              size={20.0}
            />
          </TouchableOpacity>
        </View>
        <UploadButton setSingleFile={setLicense} singleFile={license} hasError={hasError('License Image')}/>
      </View>
    );
  }

  function userNameInfo() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection:'row'}}>
        <Text style={{ ...Fonts.blackColor15SemiBold }}>{t('Full name')}</Text>
        <Text style={{ color:Colors.redColor }}> *</Text>
        </View>
        <TextInput
          placeholder={t("Enter User name")}
          style={styles.textFieldStyle}
          value={userName}
          onChangeText={(value) => setuserName(value)}
          placeholderTextColor={Colors.grayColor}
          cursorColor={Colors.blackColor}
          selectionColor={Colors.blackColor}
        />
      </View>
    );
  }

  function profilePic() {
    return (
      <View style={styles.profilePicWrapper}>
        <Image
          source={userImage ? {uri:!changed ? settings.host+'images/'+userImage : userImage.uri} : require("../../assets/images/avatar.png")}
          style={{ width: 100.0, height: 100.0, borderRadius: 50.0 }}
        />
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setOpen(true);
          }}
          style={styles.changePhotoCircleWrapper}
        >
          <Ionicons
            name="camera-outline"
            color={Colors.secondaryColor}
            size={20}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function dateTimePicker() {
    return (
      <DateTimePicker
        showDateTimeSheet={showDateTimeSheet}
        setshowDateTimeSheet={setshowDateTimeSheet}
        setselectedDateAndTime={setselectedDateAndTime}
        setselectedDate={setselectedDate}
        selectedDate={selectedDate}
      />
    );
  }

  function formErrorsDialog() {
    const renderItem = ({ item }) => (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding,
        }}
      >
        <Text style={{ ...Fonts.blackColor15SemiBold}}>
          {item.type} 
        </Text>
        <Text style={{ ...Fonts.blackColor14Medium}}>
          {item.message}
        </Text>
      </View>
    );
    return (
      <Overlay
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
        overlayStyle={styles.dialogStyle}
      >
        <View>
          <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setIsVisible(false)
              }}
              style={{padding:Sizes.fixPadding}}
          >
            <MaterialIcons
              name="close"
              color={Colors.blackColor}
              size={20}
              style={{alignSelf:'flex-end'}}
            />
          </TouchableOpacity>
          <Text style={{ ...Fonts.blackColor16Bold, textAlign: "center", paddingBottom:Sizes.fixPadding * 2.0 }}>
            {t('ERRORS')} 
          </Text>
          <FlatList
            data={formErrors}
            keyExtractor={(item,index) => `${index}`}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
          </View>
      </Overlay>
    );
  }
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container:{
    margin: Sizes.fixPadding * 2.0, 
    marginBottom:Sizes.fixPadding
  },
  sheetStyle: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: Sizes.fixPadding * 2.0,
    borderTopRightRadius: Sizes.fixPadding * 2.0,
    paddingTop: Sizes.fixPadding * 2.5,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingBottom:Sizes.fixPadding*1.5
  },
  changePhotoCircleWrapper: {
    width: 40.0,
    height: 40.0,
    borderRadius: 20.0,
    backgroundColor: Colors.bodyBackColor,
    position: "absolute",
    right: -5.0,
    bottom: -5.0,
    alignItems: "center",
    justifyContent: "center",
  },
  profilePicWrapper: {
    alignItems: "center",
    justifyContent: "center",
    margin: Sizes.fixPadding * 3.0,
    marginTop: Sizes.fixPadding,
    alignSelf: "center",
  },
  textFieldStyle: {
    ...Fonts.blackColor15Medium,
    marginTop: Sizes.fixPadding - 2.0,
    padding: 0,
    paddingBottom: Sizes.fixPadding - 5.0,
    borderBottomColor: Colors.blackColor,
    borderBottomWidth: 1.0,
  },
  circle40: {
    width: 40.0,
    height: 40.0,
    borderRadius: 20.0,
    backgroundColor: Colors.lightGrayColor,
    ...CommonStyles.shadow,
    alignItems: "center",
    justifyContent: "center",
  },
  dialogStyle: {
    width: "90%",
    borderRadius: Sizes.fixPadding,
    padding: 0,
    overflow: "hidden",
    maxHeight:screenHeight*0.8
  },
});
