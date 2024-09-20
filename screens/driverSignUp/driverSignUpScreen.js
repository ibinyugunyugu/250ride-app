import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList
} from "react-native";
import React, {useEffect, useState} from "react";
import { Colors, CommonStyles, Fonts, Sizes, screenHeight } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Header from "../../components/header";
import NoOfSeatSheet from "../../components/noOfSeatSheet";
import PhoneNumber from "../../components/phoneNumber";
import UploadButton from "../../components/uploadButton";
import { Overlay } from "@rneui/themed";
import DateTimePicker from "../../components/dateTimePicker";
import AlertMessage from "../../components/alertMessage";
import LoadingIndicator from "../../components/loadingIndicator";
import authApi from "../../api/auth";
import useAuth from "../../auth/useAuth";
import CountryPicker from 'react-native-country-picker-modal'
import saveToStore from "../../hooks/saveToStore";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const DriverSignUpScreen = ({ navigation }) => {
  const auth = useAuth();
  const { user } = auth;
  const [name, setName] = useState(user?.name);
  const [defaultPhone, setDefaultPhone] = useState(user?.phoneNumber);
  const [phoneNumber, setPhoneNumber] = useState({
    phoneNumber:user?.phoneNumber,
    countryCode:user?.countryCode,
    countryIso:user?.countryIso,
  }); 
  const [carModel, setCarModel] = useState();
  const [carColor, setCarColor] = useState();
  const [carImage, setCarImage] = useState();
  const [license, setLicense] = useState();
  const [licenseNumber, setLicenseNumber] = useState();
  const [licenseExpire, setLicenseExpire] = useState();
  const [idImage, setIdImage] = useState();
  const [idNumber, setIdNumber] = useState();
  const [idNumberExpire, setIdNumberExpire] = useState();
  const [plateNumber, setPlateNumber] = useState();
  const [insurance, setInsurance] = useState();
  const [insuranceNumber, setInsuranceNumber] = useState();
  const [insuranceExpire, setInsuranceExpire] = useState();
  const [tic, setTic] = useState();
  const [ticNumber, setTicNumber] = useState();
  const [ticExpire, setTicExpire] = useState();
  const [ruraExpire, setRuraExpire] = useState();
  const [ruraImage, setRuraImage] = useState();
  const [showNoOfSeatSheet, setshowNoOfSeatSheet] = useState(false);
  const [selectedSeat, setselectedSeat] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  const [selectedDateAndTime, setselectedDateAndTime] = useState("");
  const [selectedDate, setselectedDate] = useState("");
  const [showDateTimeSheet, setshowDateTimeSheet] = useState(false);
  const [activeField, setActiveField] = useState("");

  const [signUpFailed, setSignUpFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [nationalityCode, setNationalityCode] = useState('RW')
  const [nationalityName, setNationalityName] = useState('Rwanda')
  const [withCountryNameButton, setWithCountryNameButton] = useState(
    true,
  )
  const [idType, setIdType] = useState("ID Card");
  const [showExpire, setShowExpire] = useState(false);
  const [withFlag, setWithFlag] = useState(true)
  const [withEmoji, setWithEmoji] = useState(true)
  const [withFilter, setWithFilter] = useState(true)
  const [withAlphaFilter, setWithAlphaFilter] = useState(false)
  const [withCallingCode, setWithCallingCode] = useState(false)
  const {t, i18n} = useTranslation();

  const onSelect = (country) => {
    setIdType(country.name === 'Rwanda' ? "ID Card" : "Passport");
    setShowExpire(country.name !== 'Rwanda');
    setNationalityCode(country.cca2)
    setNationalityName(country.name)
    setIdImage()
    setIdNumber()
    setIdNumberExpire()
  }
  

  const isAllValid = () => {
    let errors = [];
    if(!name) errors.push({type:t('Name'), message:t('Please provide your name')});
    if(!phoneNumber) errors.push({type:t('Phone Number'), message:t('Please provide your phone number')});
    if(!nationalityCode) errors.push({type:t('Nationality'), message:t('Please select your nationality')});
    if(!idNumber) errors.push({type:t(idType + ' Number'), message:t('Please enter '+idType+' Number')});
    if(idNumber && idType == "ID Card" &&idNumber.length !== 16) errors.push({type:t(idType + ' Number'), message:t(idType+' Number should be 16 digits')});
    if(showExpire && !idNumberExpire) errors.push({type:t(idType + ' Expiration Date'), message:t('Please enter expiration date')});
    if(!idImage) errors.push({type:t(idType + ' Image'), message:t('Please upload '+idType+' image')});
    if(!carModel) errors.push({type:t('Car Model'), message:t('Please provide your car model')});
    if(!carColor) errors.push({type:t('Car Color'), message:t('Please specify the color of your car')});
    //if(!carImage) errors.push({type:'Car Photo', message:'Please upload image of your car'});
    if(!selectedSeat) errors.push({type:t('Car seats'), message:t('Please select your car seats')});
    if(!licenseNumber) errors.push({type:t('Driving License'), message:t('Please provide your driving license number')});
    if(!licenseExpire) errors.push({type:t('Driving Expiration Date'), message:t('Please provide your driving license expiration date')});
    if(!license) errors.push({type:t('License Image'), message:t('Upload an image of your driving license')});
    if(!plateNumber) errors.push({type:t('Plate Number'), message:t('Please provide plate number of your car')});
    if(!insurance) errors.push({type:t('Insurance Image'), message:t('Upload an image of insurance')});
    if(!insuranceExpire) errors.push({type:'Insurance Expiration Date', message:t('Please provide your insurance expiration date')});
    if(!ticExpire) errors.push({type:t('Inspection Expiration Date'), message:t('Please provide your technical inspection expiration date')});
    if(!tic) errors.push({type:t('Technical Inspection Image'), message:t('Upload an image of Technical Inspection')});
    if(ruraImage && !ruraExpire) errors.push({type:t('RURA Expiration date'), message:t('Please enter expiration date')});
    if(!agree) errors.push({type:t('terms and conditions'), message:t('please read and tick the box if you agree')});
    return errors;
  }

  const handleSubmit = async () => {
    setIsVisible(false);
    setFormErrors([]);
    const errors = isAllValid();
    if(errors.length){
      setFormErrors(errors);
      return setIsVisible(true);
    }
    const data = {
      name,
      ...phoneNumber,
      carModel,
      carColor,
      carImage,
      selectedSeat,
      licenseNumber,
      licenseExpire,
      license,
      nationalityCode,
      nationalityName,
      idType,
      idImage,
      idNumber,
      idNumberExpire,
      plateNumber,
      insurance,
      insuranceExpire,
      ticExpire,
      tic,
      ruraImage,
      ruraExpire,
      agree
    }    
    setSignUpFailed(false);
    setLoading(true);
    const result = await authApi.signupDriver(data);
    setLoading(false);
    if (!result.ok) {
      setSignUpFailed(true);
      return setErrorMessage(result.data ? t(result.data.error) : t('sign up failed try again'));
    }
    auth.logIn(result.data);
    
    navigation.push("Verification");
  }

  const handleDateSelect = (field, newDate) => {
    setActiveField(field);
    setselectedDate(newDate);
    setshowDateTimeSheet(true)
  }

  const hasError = (name,image) => {
    if(formErrors.some(e=>e.type == name)) return true;
    else if(image && formErrors.some(e=>e.type == image)) return true
    return false
  };

  useEffect(()=>{
    if(!selectedDateAndTime) return;
    switch (activeField) {
      case 'license':
        setLicenseExpire(selectedDateAndTime);
        break;
      case 'idNumber':
        setIdNumberExpire(selectedDateAndTime);
        break;
      case 'insurance':
        setInsuranceExpire(selectedDateAndTime);
        break;        
      case 'tic':
        setTicExpire(selectedDateAndTime);
        break;    
      case 'ruraExpire':
        setRuraExpire(selectedDateAndTime);
        break;    
      default:
        break;
    }
  },[showDateTimeSheet]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <Header title={t("Driver registration")} navigation={navigation} />
        <ScrollView style={{flex:1, padding:Sizes.fixPadding*2.0}}>
          <View style={styles.infoRow}>
            <Text
              style={{
                ...Fonts.blackColor15Medium,
              }}
            >
              { t('name')}
            </Text>
            <View style={[styles.valueBox, hasError('Name') ? {borderColor:Colors.redColor} : {}]}>
              <TextInput
                style={styles.textInput}
                selectionColor={Colors.blackColor}
                cursorColor={Colors.blackColor}
                onChangeText={setName}
                value={name}
              />
            </View>
          </View>
          
          <PhoneNumber title={t('Phone Number')} setPhone={setPhoneNumber} phoneNumber={phoneNumber}/>
          <View style={styles.infoRow}>
            <Text
              style={{
                ...Fonts.blackColor15Medium,
              }}
            >
              {t('Nationality')}
            </Text>
            <View style={[styles.valueBox, hasError('Nationality') ? {borderColor:Colors.redColor} : {}]}>
              <CountryPicker
                {...{
                  countryCode: nationalityCode,
                  withFilter,
                  withFlag,
                  withCountryNameButton,
                  withAlphaFilter,
                  withCallingCode,
                  withEmoji,
                  onSelect,
                }}
              />
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.uploadRow}>
              <View style={{flex:1}}>
                <Text
                  style={{
                    ...Fonts.blackColor15Medium,
                  }}
                >
                  {t(idType + ' Number')}
                </Text>
                <View style={[styles.valueBox, hasError(idType+' Number') ? {borderColor:Colors.redColor} : {}]}>
                  <TextInput
                    style={{
                      ...Fonts.blackColor15Medium,
                      height: 44,
                    }}
                    selectionColor={Colors.blackColor}
                    cursorColor={Colors.blackColor}
                    onChangeText={setIdNumber}
                    numberOfLines={1}
                    maxLength={16}
                    defaultValue={idNumber}
                    keyboardType={showExpire ? "default" : "numeric"}
                  />
                </View>
              </View>
              {showExpire ? <View style={{marginLeft:Sizes.fixPadding}}>
                <Text
                  style={{
                    ...Fonts.blackColor15Medium,
                  }}
                >
                  {t('Expire date')} 
                </Text>
                <TouchableOpacity style={[styles.sideInput, hasError(idType + ' Expiration date') ? {borderColor:Colors.redColor} : {}]}
                onPress={()=>{
                  handleDateSelect('idNumber',idNumberExpire)
                }}>
                  <Text style={{paddingRight:Sizes.fixPadding }}>
                    {idNumberExpire ? idNumberExpire : 'MM/YY'}
                  </Text>

                  <Ionicons
                    name="calendar-outline"
                    color={Colors.blackColor}
                    size={20.0}
                  />

                </TouchableOpacity>
              </View> : null}
            </View>
            <UploadButton setSingleFile={setIdImage} singleFile={idImage} hasError={hasError(idType + ' Image')}/>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.uploadRow}>
              <View style={{flex:1}}>
                <Text
                  style={{
                    ...Fonts.blackColor15Medium,
                  }}
                >
                  {t('Driving License')}
                </Text>
                <View style={[styles.valueBox, hasError('Driving License') ? {borderColor:Colors.redColor} : {}]}>
                  <TextInput
                    style={{
                      ...Fonts.blackColor15Medium,
                    }}
                    selectionColor={Colors.blackColor}
                    cursorColor={Colors.blackColor}
                    onChangeText={setLicenseNumber}
                    keyboardType="numeric"
                    numberOfLines={1}
                    maxLength={16}
                  />
                </View>
              </View>
              <View style={{marginLeft:Sizes.fixPadding}}>
                <Text
                  style={{
                    ...Fonts.blackColor15Medium,
                  }}
                >
                  {t('Expire date')}
                </Text>
                <TouchableOpacity style={[styles.sideInput, hasError('Driving Expiration Date') ? {borderColor:Colors.redColor} : {}]}
                  onPress={()=>{
                    handleDateSelect('license',licenseExpire)
                  }}>
                  <Text style={{paddingRight:Sizes.fixPadding }}>
                    {licenseExpire ? licenseExpire : 'MM/YY'}
                  </Text>

                  <Ionicons
                    name="calendar-outline"
                    color={Colors.blackColor}
                    size={20.0}
                  />

                </TouchableOpacity>
              </View>
            </View>
            <UploadButton setSingleFile={setLicense} singleFile={license} hasError={hasError('License Image')}/>
          </View>
          <View style={styles.infoRow}>
            <Text
              style={{
                ...Fonts.blackColor15Medium,
              }}
            >
              {t('Car Model')}
            </Text>
            <View style={[styles.valueBox, hasError('Car Model') ? {borderColor:Colors.redColor} : {}]}>
              <TextInput
                style={styles.textInput}
                placeholder={t("Enter your car model")}
                selectionColor={Colors.blackColor}
                cursorColor={Colors.blackColor}
                onChangeText={setCarModel}
              />
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text
              style={{
                ...Fonts.blackColor15Medium,
              }}
            >
              {t('Car Color')}
            </Text>
            <View style={[styles.valueBox, hasError('Car Color') ? {borderColor:Colors.redColor} : {}]}>
              <TextInput
                style={styles.textInput}
                selectionColor={Colors.blackColor}
                cursorColor={Colors.blackColor}
                onChangeText={setCarColor}
              />
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text
              style={{
                ...Fonts.blackColor15Medium,
              }}
            >
              {t('Car seats')}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setshowNoOfSeatSheet(true);
              }}
              style={styles.rideWrapper}
            >
              
              <Text
                style={{
                  ...(selectedSeat
                    ? { ...Fonts.blackColor16SemiBold }
                    : { ...Fonts.grayColor15Medium }),
                }}
              >
                {selectedSeat ? (i18n.language !== 'kiny' ? selectedSeat+' '+t(selectedSeat > 1 ? 'seats' : 'seat') : t(selectedSeat > 1 ? 'seats' : 'seat')+' '+selectedSeat) : t('Pick number of seats') }
              </Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                color={Colors.blackColor}
                size={20}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.infoRow}>
            <Text
              style={{
                ...Fonts.blackColor15Medium,
              }}
            >
              {t('Plate Number')}
            </Text>
            <View style={[styles.valueBox, hasError('Plate Number') ? {borderColor:Colors.redColor} : {}]}>
              <TextInput
                style={styles.textInput}
                placeholder={t("Enter the plate number")}
                selectionColor={Colors.blackColor}
                cursorColor={Colors.blackColor}
                onChangeText={setPlateNumber}
              />
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.uploadRow}>
            <View style={{flex:1}}>
              <Text
                style={{
                  ...Fonts.blackColor15Medium,
                }}
              >
                {t('Vehicle insurance')}
              </Text>
              <View style={[styles.valueBox, hasError('Insurance Image') ? {borderColor:Colors.redColor} : {}]}>
                <UploadButton setSingleFile={setInsurance} singleFile={insurance} hasError={hasError('Insurance Image')}/>
              </View>
            </View>
            <View style={{marginLeft:Sizes.fixPadding}}>
              <Text
                style={{
                  ...Fonts.blackColor15Medium,
                }}
              >
                {t('Expire date')}
              </Text>
              <TouchableOpacity style={[styles.sideInput, hasError('Insurance Expiration Date') ? {borderColor:Colors.redColor} : {}]}
                onPress={()=>{
                  handleDateSelect('insurance',insuranceExpire)
                }}>
                <Text style={{paddingRight:Sizes.fixPadding }}>
                  {insuranceExpire ? insuranceExpire : 'MM/YY'}
                </Text>
                
                <Ionicons
                  name="calendar-outline"
                  color={Colors.blackColor}
                  size={20.0}
                />

              </TouchableOpacity>
            </View>
            </View>
            
          </View>
          <View style={styles.infoRow}>
            <View style={styles.uploadRow}>
              <View style={{flex:1}}>
                <Text
                  style={{
                    ...Fonts.blackColor15Medium,
                  }}
                >
                  {t('Technical Inspection')}
                </Text>
                <View style={[styles.valueBox, hasError('Technical Inspection Image') ? {borderColor:Colors.redColor} : {}]}>
                  <UploadButton setSingleFile={setTic} singleFile={tic} hasError={hasError('Technical Inspection Image')}/>
                </View>
              </View>
              <View style={{marginLeft:Sizes.fixPadding}}>
                <Text
                  style={{
                    ...Fonts.blackColor15Medium,
                  }}
                >
                  {t('Expire date')}
                </Text>
                <TouchableOpacity style={[styles.sideInput, hasError('Inspection Expiration Date') ? {borderColor:Colors.redColor} : {}]}
                  onPress={()=>{
                    handleDateSelect('tic',ticExpire)
                    setActiveField('tic');
                  }}>
                  <Text style={{paddingRight:Sizes.fixPadding }}>
                    {ticExpire ? ticExpire : 'MM/YY'}
                  </Text>
                  
                  <Ionicons
                    name="calendar-outline"
                    color={Colors.blackColor}
                    size={20.0}
                  />

                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.uploadRow}>
              <View style={{flex:1}}>
                {ruraImage ? <Text
                    style={{
                      ...Fonts.blackColor15Medium,
                    }}
                  >
                    {t('Valid transport authorization from RURA')}
                  </Text> : 
                  <Text
                  style={{
                    ...Fonts.blackColor15Medium,
                  }}
                >
                  {t('Valid transport authorization from RURA')} {'\n'}({t('if any')})
                </Text>}
                <View style={styles.valueBox}>
                  <UploadButton setSingleFile={setRuraImage} singleFile={ruraImage}/>
                </View>
              </View>
              {ruraImage ? <View style={{marginLeft:Sizes.fixPadding}}>
                <Text
                  style={{
                    ...Fonts.blackColor15Medium,
                  }}
                >
                  {'\n'}{t('Expire date')}
                </Text>
                <TouchableOpacity style={[styles.sideInput, hasError('RURA Expiration Date') ? {borderColor:Colors.redColor} : {}]}
                  onPress={()=>{
                    handleDateSelect('ruraExpire',ruraExpire)
                    setActiveField('ruraExpire');
                  }}>
                  <Text style={{paddingRight:Sizes.fixPadding }}>
                    {ruraExpire ? ruraExpire : 'MM/YY'}
                  </Text>
                  
                  <Ionicons
                    name="calendar-outline"
                    color={Colors.blackColor}
                    size={20.0}
                  />

                </TouchableOpacity>
              </View> : null}
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text
              style={{
                ...Fonts.blackColor15Medium,
              }}
            >
              {t('terms and conditions')}
            </Text>
            <View style={{...CommonStyles.rowAlignCenter}}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setAgree(!agree);
                }}
                style={{
                  marginVertical: Sizes.fixPadding,
                  ...styles.agreeBox,
                }}
              >
                <View
                  style={agree ? {
                    ...styles.agreeWrapper,
                    backgroundColor:Colors.secondaryColor
                  }
                  :
                  {...styles.agreeWrapper}
                }
                >
                  <MaterialIcons
                    name="check"
                    color={Colors.whiteColor}
                    size={20.0}
                  />
                </View>
                <View style={{flexDirection:'row', flex:1, paddingLeft: Sizes.fixPadding}}>
                  <Text >
                    {t('i certify that i have read and accept')}
                    <Text onPress={() => { navigation.push('TermsAndConditions') }} style={{ color: Colors.secondaryColor }}> {t('terms and conditions')} </Text>
                    {t('and')}
                    <Text onPress={() => { navigation.push('PrivacyPolicy') }} style={{ color: Colors.secondaryColor }}> {t('privacy statement')} </Text>
                    {t('and that all information i gave above is all correct')}
                  </Text>
                </View>
                
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.pop();
              }}
              style={{ ...CommonStyles.button, backgroundColor:Colors.whiteColor }}
            >
              <Text style={{ ...Fonts.blackColor15Medium }}>
              {t('cancel')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                handleSubmit();
              }}
              style={{ ...CommonStyles.button, paddingHorizontal:Sizes.fixPadding * 2.0 }}
              >
              <Text style={{ ...Fonts.whiteColor15Medium }}>
              {t('sign up')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      {noOfSeatSheet()}
      {formErrorsDialog()}
      {dateTimePicker()}
      {loadingIndicator()}
      {alertMessage()}
    </View>
  );


  function noOfSeatSheet() {
    return (
      <NoOfSeatSheet
        showNoOfSeatSheet ={showNoOfSeatSheet}
        setshowNoOfSeatSheet ={setshowNoOfSeatSheet}
        setselectedSeat ={setselectedSeat}
        selectedSeat={selectedSeat}
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

  function loadingIndicator(){
    return <LoadingIndicator visible={loading} />
  }

  function alertMessage() {
    return <AlertMessage 
      visible={signUpFailed} 
      errorMessage={errorMessage} 
      setVisible={setSignUpFailed}
    />
  }
};

export default DriverSignUpScreen;

const styles = StyleSheet.create({
  locationIconWrapper: {
    width: 8.0,
    height: 8.0,
    borderRadius: 4.0,
    borderWidth: 1.0,
    alignItems: "center",
    justifyContent: "center",
  },
  locationName: {
    ...Fonts.blackColor14Medium,
  },
  verticalSolidLine: {
    flex:1,
    height: 15.0,
    width: 1.0,
    borderStyle: "solid",
    borderColor: Colors.blackColor,
    borderWidth: 2.0,
  },
  verticalDashedLine: {
    height: 15.0,
    width: 1.0,
    borderStyle: "dashed",
    borderColor: Colors.grayColor,
    borderWidth: 0.8,
    marginLeft: Sizes.fixPadding - 2.0,
  },
  rideWrapper: {
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.shadow,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding,
    borderColor: Colors.blackColor,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  dateTimeAndRatingDivider: {
    width: 1.0,
    backgroundColor: Colors.grayColor,
    height: "80%",
    marginHorizontal: Sizes.fixPadding - 5.0,
  },
  valueBox: {
    backgroundColor: Colors.whiteColor,
    borderWidth: 1.0,
    borderColor:Colors.blackColor,
    borderRadius: Sizes.fixPadding,
    justifyContent:'center',
    paddingHorizontal: Sizes.fixPadding,
    height:44
  },
  mobileNumberWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    paddingVertical: 0,
    borderWidth: 1.0,
    borderColor:Colors.blackColor
  },
  infoRow:{
    marginBottom: Sizes.fixPadding * 2.0,
  },
  btnContainer:{
    flexDirection:'row',
    justifyContent:'center',
    marginTop: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding*4.0,
  },
  textInput:{
    ...Fonts.blackColor15Medium,
    height:44
  },
  sideInput:{
    padding:Sizes.fixPadding, 
    borderWidth:1, 
    borderRadius:Sizes.fixPadding,
    flexDirection:'row'
  },
  uploadRow:{
    flexDirection:'row', 
    alignItems:'center',
  },
  dialogStyle: {
    width: "90%",
    borderRadius: Sizes.fixPadding,
    padding: 0,
    overflow: "hidden",
    maxHeight:screenHeight*0.8
  },
  agreeWrapper: {
    width: 24.0,
    height: 24.0,
    borderRadius: 2.0,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.secondaryColor,
  },
  agreeBox: {
    backgroundColor: Colors.whiteColor,
    flexDirection: "row",
    alignItems: "center",
  },
});
