import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TouchableNativeFeedback} from 'react-native'
import React, { useEffect, useState } from 'react'
import { BottomSheet } from "@rneui/themed";
import { Calendar } from "react-native-calendars";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
    Colors,
    Sizes,
    Fonts,
    CommonStyles,
    screenHeight,
  } from "../constants/styles";
import DashedLine from "react-native-dashed-line";
import CustomScrollPicker from './customScrollPicker';
import moment from 'moment';
import dayjs from 'dayjs';
import '../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const hoursList = [...range(1, 12)];
const minutesList = [...range(0, 59)];
const initYear = 1949;
const currentYear = Number((new Date()).getFullYear());
const years = Array(currentYear - initYear + 3).fill().map((v,i)=>i + 1);

function range(start, end) {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
}


export default function DateTimePicker({
    setselectedDate,
    showDateTimeSheet,
    setshowDateTimeSheet,
    setselectedDateAndTime,
    selectedDate,
    withHours=false,
    limit=false,
}) {
  const today = moment();
  const nextYear = moment().add(1, 'years').unix()*1e3;
  const {t} = useTranslation(); 

  const start = Date.parse(`${today.year()}-${today.month()+1}-${today.date()}`);
  const newDate = selectedDate ? new Date(selectedDate) : Date.now();
  let newHour = new Date(newDate).getHours() > 12 ? new Date(newDate).getHours() - 12 : new Date(newDate).getHours(); 
  newHour = newHour == 0 ? 12 : newHour;
  const todayDate = `${new Date(newDate).getFullYear()}-${
    new Date(newDate).getMonth() + 1
  }-${today.date()}`;

  const [defaultDate, setdefaultDate] = useState(today.date());
  const [selectedHour, setselectedHour] = useState(hoursList[newHour-1]);
  const [selectedMinute, setselectedMinute] = useState(minutesList[new Date(newDate).getMinutes()]);
  const [selectedAmPm, setselectedAmPm] = useState(new Date(newDate).getHours() >= 12 ? 'PM' : 'AM');
  const [arr] = useState([...range(dayjs().year(), dayjs().year() + 30)]);
  const [customDate, setCustomDate] = useState(dayjs());
  const [isModalVisible, setIsModalVisible] = useState(false);

    return (
        <BottomSheet
          modalProps={{ height: 200.0 }}
          scrollViewProps={{ scrollEnabled: false }}
          isVisible={showDateTimeSheet}
          onBackdropPress={() => {
            setshowDateTimeSheet(false);
          }}
        >
          <View style={styles.sheetStyle}>
            <Text
              style={{ ...styles.sheetHeader, marginBottom: Sizes.fixPadding }}
            >
              {t('select date')}
            </Text>
  
            <ScrollView showsVerticalScrollIndicator={false}>
              <Calendar
                monthFormat={`MMMM  yyyy`}
                initialDate={customDate.format('YYYY-MM-DD')}
                renderArrow={(direction) =>
                  direction == "left" ? (
                    <MaterialIcons
                      name="arrow-back-ios"
                      color={Colors.grayColor}
                      size={18}
                    />
                  ) : (
                    <MaterialIcons
                      name="arrow-forward-ios"
                      color={Colors.grayColor}
                      size={18}
                    />
                  )
                }
                disableAllTouchEventsForDisabledDays={true}
                disableAllTouchEventsForInactiveDays={true}
                minDate={today.format('YYYY-MM-DD')}
                renderHeader={renderCustomHeader}
                hideExtraDays={true}
                disableMonthChange={true}
                firstDay={1}
                onPressArrowLeft={(subtractMonth) => subtractMonth()}
                onPressArrowRight={(addMonth) => addMonth()}
                enableSwipeMonths={true}
                dayComponent={({ date, state }) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        if((parseInt(date.timestamp) < start) || (limit && parseInt(date.timestamp) > nextYear)) return;
                        const displayTime = withHours ? ` ${selectedHour}:${selectedMinute} ${selectedAmPm}` : '';
                        setselectedDate(`${date.year}-${date.month}-${date.day}`);
                        setdefaultDate(date.day);
                  
                        setselectedDateAndTime(
                          `${date.year}-${date.month}-${date.day} ${`\n`} ${displayTime}`
                        );
                      }}
                      style={{
                        ...styles.calenderDateWrapStyle,
                        borderColor:
                          date.day == defaultDate
                            ? Colors.secondaryColor
                            : Colors.whiteColor,
                      }}
                    >
                      <Text
                        style={
                          date.day == defaultDate
                            ? { ...Fonts.secondaryColor16SemiBold }
                            : 
                            ((parseInt(date.timestamp) < start || (limit && parseInt(date.timestamp) > nextYear))
                            ?
                            { ...Fonts.grayColor16SemiBold }
                            :
                            { ...Fonts.blackColor16SemiBold })
                        }
                      >
                        {date.day}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                theme={{
                  calendarBackground: Colors.whiteColor,
                  textSectionTitleColor: Colors.grayColor,
                  monthTextColor: Colors.blackColor,
                  textMonthFontFamily: "Montserrat_SemiBold",
                  textDayHeaderFontFamily: "Montserrat_Medium",
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 12,
                }}
              />

            {withHours && <DashedLine
              dashLength={3}
              dashThickness={1}
              dashColor={Colors.grayColor}
              style={{ marginVertical: Sizes.fixPadding * 2.0 }}
            />}

            {withHours && <View style={styles.timeWrapper}>
              {hourPicker()}
              <Text
                style={{
                  ...Fonts.primaryColor18SemiBold,
                  marginHorizontal: Sizes.fixPadding * 2.0,
                }}
              >
                :
              </Text>
              {minutePicker()}
              <Text
                style={{
                  ...Fonts.primaryColor18SemiBold,
                  marginHorizontal: Sizes.fixPadding * 2.0,
                }}
              >
                :
              </Text>
              {amPmPicker()}
            </View>}
  
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  const displayTime = withHours ? ` ${selectedHour}:${selectedMinute} ${selectedAmPm}` : '';
                  
                  setselectedDateAndTime(
                    `${selectedDate ? selectedDate : todayDate}`
                      +
                      `${displayTime}`
                  );
                  setselectedDate(selectedDate ? selectedDate : todayDate)
                  setshowDateTimeSheet(false);
                  setdefaultDate(today.date());
                  setselectedDate()
                }}
                style={{
                  ...CommonStyles.button,
                  marginHorizontal: Sizes.fixPadding * 2.0,
                  marginBottom: Sizes.fixPadding * 2.0,
                }}
              >
                <Text style={{ ...Fonts.whiteColor18Bold }}>{t('okay')}</Text>
              </TouchableOpacity>
            </ScrollView>
          
          {isModalVisible && arr.length > 0 && (
                <View
                    style={{
                        zIndex: 10,
                        position: 'absolute',
                        height: '100%',
                        backgroundColor: Colors.whiteColor,
                        ...styles.sheetHeader,
                        alignSelf:'center',
                        paddingHorizontal:Sizes.fixPadding * 2
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginVertical: Sizes.fixPadding,
                        }}
                    >
                        <Text
                          style={{  marginBottom: Sizes.fixPadding }}
                        >
                          {t('select year')}
                        </Text>
                        <TouchableNativeFeedback onPress={() => setIsModalVisible(false)}>
                        <MaterialIcons
                          name="close"
                          color={Colors.blackColor}
                          size={18}
                          style={{alignSelf:'flex-end'}}
                        />
                        </TouchableNativeFeedback>
                    </View>
                    <ScrollView>
                        <View
                            style={{
                                alignItems: 'center',
                                zIndex: 25,
                                padding: 15,
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            {arr.map((year) => (
                                <TouchableOpacity
                                    key={year}
                                    onPress={() => {
                                      let dayJs = dayjs();
                                      setCustomDate((prev) => dayJs.subtract(dayJs.year() - year, 'years'));
                                      setIsModalVisible(false);
                                    }}
                                >
                                    <View style={{ padding: 10, width: '100%' }}>
                                        <Text style={{ ...Fonts.blackColor16SemiBold }}>{year}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            )}
            </View>
        </BottomSheet>
      );


      function hourPicker() {
        return (
          <CustomScrollPicker
            list={hoursList}
            selected={selectedHour}
            setSelected={setselectedHour}
            prePend={'0'}
          />
        );
      }
    
      function minutePicker() {
        return (
          <CustomScrollPicker
            list={minutesList}
            selected={selectedMinute}
            setSelected={setselectedMinute}
            prePend={'0'}
          />
        );
      }

      function amPmPicker() {
        return (
          <CustomScrollPicker
            list={['AM','PM']}
            selected={selectedAmPm}
            setSelected={setselectedAmPm}
            prePend={'0'}
          />
        );
      }

      function renderCustomHeader(date) {
        const header = date.toString('MMMM yyyy');
        const [month, year] = header.split(' ');
        const textStyle = {
          ...Fonts.blackColor15SemiBold
        };
        return (
          <View style={styles.header}>
            <Text style={[styles.month, textStyle]}>{`${month} `}</Text>
            <TouchableOpacity style={{flexDirection:'row'}} onPress={() => setIsModalVisible(true)}>
              <Text style={[styles.year, textStyle]}>{year}</Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                color={Colors.grayColor}
                size={20}
              />
            </TouchableOpacity>
          </View>
        );
      }
    

}

const styles = StyleSheet.create({
	calenderDateWrapStyle: {
    alignItems: "center",
    justifyContent: "center",
    width: 28.0,
    height: 28.0,
    borderRadius: Sizes.fixPadding - 7.0,
    borderWidth: 1.5,
  },
	sheetStyle: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: Sizes.fixPadding * 4.0,
    borderTopRightRadius: Sizes.fixPadding * 4.0,
    paddingTop: Sizes.fixPadding * 2.0,
    maxHeight: screenHeight - 150,
  },
  sheetHeader: {
    marginHorizontal: Sizes.fixPadding * 2.0,
    textAlign: "center",
    ...Fonts.primaryColor16SemiBold,
    marginBottom: Sizes.fixPadding * 2.5,
  },
  timeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    margin: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 4.0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10
  },
})