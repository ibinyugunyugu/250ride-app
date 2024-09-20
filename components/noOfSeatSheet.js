import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { BottomSheet } from "@rneui/themed";
import {
    Colors,
    Sizes,
    Fonts,
    CommonStyles,
    screenHeight,
  } from "../constants/styles";
import '../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

const seats = [...range(1, 30)];

function range(start, end) {
    return Array(end - start + 1)
      .fill()
      .map((_, idx) => start + idx);
  }
  
export default function NoOfSeatSheet({
    showNoOfSeatSheet, 
    setshowNoOfSeatSheet, 
    setselectedSeat, 
    selectedSeat
}) {
  const {t, i18n} = useTranslation();
  return (
    <BottomSheet
        scrollViewProps={{ scrollEnabled: false }}
        isVisible={showNoOfSeatSheet}
        onBackdropPress={() => {
          setshowNoOfSeatSheet(false);
        }}
      >
        <View style={{ ...styles.sheetStyle }}>
          <Text style={styles.sheetHeader}>{t('Number of seats')}</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 3.0 }}
          >
            <View>
              {seats.map((item, index) => (
                <View key={`${index}`}>
                  <Text
                    onPress={() => {
                      setselectedSeat(item);
                      setshowNoOfSeatSheet(false);
                    }}
                    style={{
                      ...(selectedSeat == item
                        ? { ...Fonts.secondaryColor16SemiBold }
                        : { ...Fonts.blackColor16SemiBold }),
                      textAlign: "center",
                    }}
                  >
                    {i18n.language !== 'kiny' ? item+' '+t(item > 1 ? 'seats' : 'seat') : t(item > 1 ? 'seats' : 'seat')+' '+item }

                  </Text>
                  {index == seats.length - 1 ? null : (
                    <View
                      style={{
                        height: 1.0,
                        backgroundColor: Colors.lightGrayColor,
                        marginVertical: Sizes.fixPadding * 2.0,
                      }}
                    />
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </BottomSheet>
  )
}

const styles = StyleSheet.create({
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
})