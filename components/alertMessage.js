import { StyleSheet, Text, View } from 'react-native'
import React, {useEffect} from 'react'
import {
	Colors,
	Sizes,
	Fonts,
} from "../constants/styles";

export default function AlertMessage({visible = false, errorMessage, setVisible}) {
    useEffect(() => {
        if(!visible) return;
        const timeOut = setTimeout(() => {
            setVisible(false);
        }, 5000);
    
      return () => {
        clearTimeout(timeOut)
      }
    }, [visible])
    
    if (!visible) return null;
    return (
        <Text style={styles.alertTextStyle}>
            {errorMessage}
        </Text>
    )
}

const styles = StyleSheet.create({
    alertTextStyle: {
        ...Fonts.whiteColor14Medium,
        backgroundColor: Colors.blackColor,
        position: "absolute",
        bottom: 40.0,
        alignSelf: "center",
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding - 5.0,
        borderRadius: Sizes.fixPadding - 5.0,
        overflow: "hidden",
        zIndex: 100.0,
    },
})