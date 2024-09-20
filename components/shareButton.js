import { Alert, Share, TouchableOpacity, Text } from "react-native";
import { Fonts } from "../constants/styles";
import {useTranslation} from 'react-i18next'; 

const ShareButton = ({ 
  sharing = false,
  setSharing = ()=>{},
  url = 'https://250ride.rw', 
  message = '250 Rides | On Time, Every Time, In Comfort' 
}) => {
  const onShare = async () => {
    
    try {
      const result = await Share.share({ message, url });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
    finally{
      setSharing(false)
    }
  };
  if(sharing) onShare();
  const {t} = useTranslation(); 
  return (
      <TouchableOpacity onPress={onShare} style={{alignSelf:'flex-start', flexWrap: 'wrap', flexGrow:0,}}>
          <Text style={{ 
            ...Fonts.secondaryColor16Medium,
            flexWrap: 'wrap',
            flexGrow:0,
          }}
          >
            {t('share')}
          </Text>
      </TouchableOpacity>
  );
};
  
export default ShareButton;