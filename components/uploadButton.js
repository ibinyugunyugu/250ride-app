import { StyleSheet, Text, Alert, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import Feather from "react-native-vector-icons/Feather";
import { Sizes, Colors } from "../constants/styles";
import * as ImagePicker from "expo-image-picker";
import '../assets/i18n/i18n';
import {useTranslation} from 'react-i18next'; 

export default function UploadButton({singleFile, setSingleFile, open = false, setOpen = ()=>{}, hasError = false}) {
  const {t} = useTranslation(); 
  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    if(open) handlePress();
  }, [open]);

  const requestPermission = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) alert("You need to enable permission to access the library.");
  };

  const handlePress = () => {
    setOpen(false);
    if (!singleFile) selectImage();
    else
      Alert.alert("Delete", "Are you sure you want to delete this image?", [
        { text: t("yes"), onPress: () => setSingleFile() },
        { text: t("no") },
      ]);
  };

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        base64:true,
        quality:0.5
      });
      

      if (!result.canceled){
        let file = result.assets[0];
        let size = file.fileSize / (1024 ** 2);
        if(size > 2) 
        {
          Alert.alert("Maximum size Exceeded", "Try selecting a file that is less 2MB in size");
        }
        else{
          setSingleFile(result.assets[0]);
        }
      } 
    } catch (error) {
      console.log("Error reading an image", error);
    }
    
  };
  return (
    <TouchableOpacity style={styles.uploadRow} onPress={handlePress}>
      <Feather
        name={singleFile ? "image" : "upload"}
        color={hasError ? Colors.redColor : Colors.blackColor}
        size={15}
      />
      <Text style={[{paddingHorizontal:Sizes.fixPadding},  hasError ? {color:Colors.redColor} : {color:Colors.blackColor}]}>
        {singleFile ? t("File Uploaded") : t("Upload image")}
      </Text>
      {singleFile ? <Text style={styles.deleteBtn}>
        {t('Remove')}
      </Text> : null}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  uploadRow:{
    flexDirection:'row', 
    alignItems:'center',
  },
  deleteBtn:{
    color:Colors.redColor,
    paddingLeft:Sizes.fixPadding * 2,
  }
})