import { StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    // ❌ remove padding here (it caused borders)
  },
  content: {
    padding: moderateScale(16), // ✅ use this inside screen content
  },
  text: {
    fontSize: moderateScale(16),
  },
  button: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(8),
  },
});
