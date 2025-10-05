import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Colors, Fonts, Size } from '../Theme/Theme';

const ButtonComponent = ({ text, loading, onPress, disabled, icon }) => {
  return (
    <TouchableOpacity
      style={[
        styles.bottonContainer,
        {
          backgroundColor: disabled
            ? '#E3E3E3'
            : Colors.primary,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {loading ? (
        <ActivityIndicator size={24} color={Colors.white_fffff} />
      ) : (
        <View style={styles.TextContainer}>
          {/* {icon && <ReDoIcon />} */}
          <Text
            style={[
              styles.btnText,
              { color: disabled ? Colors.white_fffff : Colors.white_fffff },
            ]}
          >
            {text}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ButtonComponent;

const styles = StyleSheet.create({
  bottonContainer: {
    width: '100%',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  btnText: {
    fontFamily: Fonts.medium,
    fontSize: Size.md_16,
  },
  TextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
