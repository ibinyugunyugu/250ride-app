import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {
	Colors,
	Sizes,
	Fonts,
	CommonStyles,
	screenHeight,
} from "../constants/styles";
import ScrollPicker from "react-native-wheel-scrollview-picker";

export default function CustomScrollPicker({list, selected, setSelected, prePend=''}) {
	
  return (
    <ScrollPicker
        dataSource={list}
        selectedIndex={list.indexOf(selected)}
        renderItem={(data) => {
          return (
            <Text
              style={
                data == selected
                  ? { ...Fonts.primaryColor18SemiBold }
                  : { ...Fonts.grayColor15SemiBold }
              }
            >
              {data.toString().length == 1 ? `${prePend}${data}` : data}
            </Text>
          );
        }}
        onValueChange={(data) => {
          setSelected(data);
        }}
        wrapperColor={Colors.whiteColor}
        wrapperHeight={60}
        itemHeight={60}
        highlightColor={Colors.grayColor}
        highlightBorderWidth={1}
      />
  )
}

const styles = StyleSheet.create({})