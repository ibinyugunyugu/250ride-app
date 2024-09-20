import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors, Sizes, Fonts, CommonStyles } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import Header from "../../components/header";
import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BottomSheet } from "@rneui/themed";
import NoOfSeatSheet from "../../components/noOfSeatSheet";
import UploadButton from "../../components/uploadButton";
import carsApi from "../../api/cars";
import useApi from "../../hooks/useApi";
import { Snackbar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { getCarInfo, resetCarInfo } from "../../store/carInfo";
import { Overlay } from "@rneui/themed";
import DateTimePicker from "../../components/dateTimePicker";
import LoadingIndicator from "../../components/loadingIndicator";
import AlertMessage from "../../components/alertMessage";
import '../../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const AddVehicleScreen = ({ navigation }) => {
  const car = useSelector(getCarInfo());
  const [carModel, setCarModel] = useState("");
  const [carColor, setCarColor] = useState("");
  const [showNoOfSeatSheet, setshowNoOfSeatSheet] = useState(false);
  const [selectedSeat, setselectedSeat] = useState();
  const [plateNumber, setPlateNumber] = useState();
  const [insurance, setInsurance] = useState();
  const [insuranceExpire, setInsuranceExpire] = useState();
  const [tic, setTic] = useState();
  const [ticExpire, setTicExpire] = useState();
  const [ruraImage, setRuraImage] = useState();
  const [ruraExpire, setRuraExpire] = useState();

  const [isVisible, setIsVisible] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSnackBar, setShowSnackBar] = useState(false);

  const [selectedDateAndTime, setselectedDateAndTime] = useState("");
  const [selectedDate, setselectedDate] = useState("");
  const [showDateTimeSheet, setshowDateTimeSheet] = useState(false);
  const [showDeleteDialog, setshowDeleteDialog] = useState(false);
  const [activeField, setActiveField] = useState("");
  const {t, i18n} = useTranslation();
  const isAllValid = () => {
    let errors = [];
    
    if(!carModel) errors.push({type:t('Car Model'), message:t('Please provide your car model')});
    if(!carColor) errors.push({type:t('Car Color'), message:t('Please specify the color of your car')});
    if(!selectedSeat) errors.push({type:t('Car seats'), message:t('Please select your car seats')});
    if(!plateNumber) errors.push({type:t('Plate Number'), message:t('Please provide plate number of your car')});
    if(!insurance) errors.push({type:t('Insurance Image'), message:t('Upload an image of insurance')});
    if(!insuranceExpire) errors.push({type:'Insurance Expiration Date', message:t('Please provide your insurance expiration date')});
    if(!ticExpire) errors.push({type:t('Inspection Expiration Date'), message:t('Please provide your technical inspection expiration date')});
    if(!tic) errors.push({type:t('Technical Inspection Image'), message:t('Upload an image of Technical Inspection')});
    if(ruraImage && !ruraExpire) errors.push({type:t('RURA Expiration date'), message:t('Please enter expiration date')});
    return errors;
  }

  useEffect(() => {
    if(!car){
      setCarModel();
      setCarColor();
      setselectedSeat();
      setPlateNumber();
      setInsurance();
      setInsuranceExpire();
      setTic();
      setTicExpire();
      setRuraImage();
      setRuraExpire();
    }
    else{
      setCarModel(car.carModel);
      setCarColor(car.carColor);
      setselectedSeat(car.carSeats);
      setPlateNumber(car.plateNumber);
      setInsurance(car.insuranceImage);
      setInsuranceExpire(car.insuranceExpire?.split('T')[0]);
      setTic(car.ticImage);
      setTicExpire(car.ticExpire?.split('T')[0]);
      setRuraImage(car.ruraImage);
      setRuraExpire(car.ruraExpire?.split('T')[0]);
    }
  }, [car])

  const handleSubmit = async () => {
    setIsVisible(false);
    setFormErrors([]);
    const errors = isAllValid();
    if(errors.length){
      setFormErrors(errors);
      return setIsVisible(true);
    }
    const data = {
      carModel,
      carColor,
      selectedSeat,
      plateNumber,
      insurance,
      insuranceExpire,
      ticExpire,
      tic,
      ruraImage,
      ruraExpire
    }    
    setFailed(false);
    setLoading(true);
    const result = await carsApi.addCar(data);
    setLoading(false);
    if (!result.ok) {
      setFailed(true);
      return setErrorMessage(result.data ? t(result.data.error) : t("adding car failed try again"));
    }
    navigation.pop();
  }

  const handleUpdate = async () => {
    setIsVisible(false);
    setFormErrors([]);
    const errors = isAllValid();
    if(errors.length){
      setFormErrors(errors);
      return setIsVisible(true);
    }
    const data = {
      id:car.id,
      carModel,
      carColor,
      selectedSeat,
      plateNumber,
      insurance,
      insuranceExpire,
      ticExpire,
      tic,
      ruraImage,
      ruraExpire
    }    
    setFailed(false);
    setLoading(true);
    const result = await carsApi.updateCar(data);
    setLoading(false);
    if (!result.ok) {
      setFailed(true);
      return setErrorMessage(result.data ? t(result.data.error) : t("updating car failed try again"));
    }
    navigation.pop();
  }

  const hasError = (name,image) => {
    if(formErrors.some(e=>e.type == name)) return true;
    else if(image && formErrors.some(e=>e.type == image)) return true
    return false
  };

  const handleDelete = async () =>{
    setFailed(false);
    setLoading(true);
    const result = await carsApi.deleteCar(car.id);
    setLoading(false);
    if (!result.ok) {
      setFailed(true);
      return setErrorMessage(result.data ? t(result.data.error) : t("deleting car failed try again"));
    }
    navigation.push("UserVehicles",{id:car.id});
  }

  const handleDateSelect = (field, newDate) => {
    setActiveField(field);
    setselectedDate(newDate);
    setshowDateTimeSheet(true)
  }


  useEffect(()=>{
    if(!selectedDateAndTime) return;
    switch (activeField) {
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
        <Header title={car ? t("Vehicle Details") : t("Add vehicle")} navigation={navigation} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
        >
          {vehicleForm()}
        </ScrollView>
      </View>
      {addButton()}
      {noOfSeatSheet()}
      {snackBarInfo()}
      {formErrorsDialog()}
      {dateTimePicker()}
      {loadingIndicator()}
      {alertMessage()}
      {deleteCarDialog()}
    </View>
  );

  function addButton() {
    return (
      <View style={{...CommonStyles.rowAlignCenter}}>
      {car.carModel ? <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setshowDeleteDialog(true);
        }}
        style={styles.deleteCarButton}
      >
        <Text numberOfLines={1} style={{ ...Fonts.blackColor18Bold }}>
          {t("Delete Car")}
        </Text>
      </TouchableOpacity> : null}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          car.carModel ? handleUpdate() : handleSubmit();
        }}
        style={{
          flex:1,
          ...CommonStyles.button,
          marginVertical: Sizes.fixPadding * 2.0,
        }}
      >
        <Text style={{ ...Fonts.whiteColor18Bold }}>{ car.carModel ? t('Update car') : t('Add')}</Text>
      </TouchableOpacity>
      </View>
    );
  }

  function snackBarInfo() {
    return (
      <Snackbar
        style={{ backgroundColor: Colors.blackColor }}
        elevation={0}
        visible={showSnackBar}
        duration={1000}
        onDismiss={() => setShowSnackBar(false)}
      >
        <Text style={{ ...Fonts.whiteColor14Medium }}>{t('Vehicle Added')}!</Text>
      </Snackbar>
    );
  }
  
  function vehicleForm() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <View style={styles.infoRow}>
          <Text
            style={{
              ...Fonts.blackColor15SemiBold,
              marginBottom: Sizes.fixPadding,
            }}
          >
            {t('car model')}
          </Text>
          <View style={[styles.valueBox, hasError('Car Model') ? {borderColor:Colors.redColor} : {}]}>
            <TextInput
              placeholder={t("Enter your car model")}
              style={styles.textFieldStyle}
              placeholderTextColor={Colors.grayColor}
              selectionColor={Colors.blackColor}
              cursorColor={Colors.blackColor}
              value={carModel}
              onChangeText={(value) => setCarModel(value)}
            />
          </View>
      </View>
        <View style={styles.infoRow}>
          <Text
            style={{
              ...Fonts.blackColor15SemiBold,
              marginBottom: Sizes.fixPadding,
            }}
          >
            {t('Car Color')}
          </Text>
          <View style={[styles.valueBox, hasError('Car Color') ? {borderColor:Colors.redColor} : {}]}>
            <TextInput
              placeholder={t("Enter vehicle color")}
              style={styles.textFieldStyle}
              placeholderTextColor={Colors.grayColor}
              selectionColor={Colors.primaryColor}
              cursorColor={Colors.primaryColor}
              value={carColor}
              onChangeText={(value) => setCarColor(value)}
            />
          </View>
        </View>
        <View style={styles.infoRow}>
          <Text
            style={{
              ...Fonts.blackColor15SemiBold,
              marginBottom: Sizes.fixPadding,
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
              {t("Plate Number")}
            </Text>
            <View style={[styles.valueBox, hasError('Plate Number') ? {borderColor:Colors.redColor} : {}]}>
              <TextInput
                style={styles.textInput}
                placeholder={t("Enter the plate number")}
                selectionColor={Colors.blackColor}
                cursorColor={Colors.blackColor}
                onChangeText={setPlateNumber}
                value={plateNumber}
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
      </View>
    );
  }

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
      visible={failed} 
      errorMessage={errorMessage} 
      setVisible={setFailed}
    />
  }

  function deleteCarDialog() {
    return (
      <Overlay
        isVisible={showDeleteDialog}
        onBackdropPress={() => setshowDeleteDialog(false)}
        overlayStyle={styles.dialogStyle}
      >
        <View
          style={{
            marginVertical: Sizes.fixPadding * 3.5,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          <Octicons
            name="question"
            color={Colors.secondaryColor}
            size={50}
            style={{paddingBottom:Sizes.fixPadding * 3.0, alignSelf:'center'}}
          />
          <Text style={{ ...Fonts.blackColor16SemiBold, textAlign: "center" }}>
            {t('DELETE CAR')}
          </Text>

          <Text style={{ 
              ...Fonts.blackColor15Medium, 
              marginTop:Sizes.fixPadding * 3.0,
              textAlign: "center" 
            }}>
            {t('Are you sure you want to delete this car from your account')}
          </Text>

          <View style={styles.btnContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setshowDeleteDialog(false);
                
              }}
              style={{ ...CommonStyles.button, 
                backgroundColor:Colors.secondaryColor, 
                paddingHorizontal: Sizes.fixPadding * 3.0 
              }}
            >
              <Text style={{ ...Fonts.whiteColor15Medium }}>
                {t('no')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleDelete}
              style={{ ...CommonStyles.button, backgroundColor: Colors.blackColor, paddingHorizontal: Sizes.fixPadding * 3.0 }}
            >
              <Text style={{ ...Fonts.whiteColor15Medium }}>
                {t('yes')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Overlay>
    );
  }

};

export default AddVehicleScreen;

const styles = StyleSheet.create({
  valueBox: {
    backgroundColor: Colors.whiteColor,
    borderWidth: 1.0,
    borderColor:Colors.blackColor,
    borderRadius: Sizes.fixPadding,
    justifyContent:'center',
    paddingHorizontal: Sizes.fixPadding,
    height:44
  },
  textFieldStyle: {
    ...Fonts.blackColor15Medium,
  },
  vehicleImageWrapper: {
    backgroundColor: "#E7E7E7",
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding * 4.0,
    margin: Sizes.fixPadding * 2.0,
    alignItems: "center",
  },
  sheetStyle: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: Sizes.fixPadding * 2.0,
    borderTopRightRadius: Sizes.fixPadding * 2.0,
    paddingTop: Sizes.fixPadding * 2.5,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingBottom: Sizes.fixPadding * 1.5,
  },
  circle40: {
    width: 40.0,
    height: 40.0,
    borderRadius: 20.0,
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.shadow,
    alignItems: "center",
    justifyContent: "center",
  },
  rideWrapper: {
    borderWidth:1,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding,
    borderColor: Colors.blackColor,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  infoRow:{
    marginBottom: Sizes.fixPadding * 2.0,
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
  deleteCarButton: {
    flex: 1,
    ...CommonStyles.button,
    backgroundColor: Colors.whiteColor,
    marginHorizontal: Sizes.fixPadding,
  },
  dialogStyle: {
    width: "90%",
    borderRadius: Sizes.fixPadding,
    padding: 0,
    overflow: "hidden",
  },
  btnContainer:{
    flexDirection:'row',
    justifyContent:'center',
    marginTop: Sizes.fixPadding * 4.0,
  },
});
