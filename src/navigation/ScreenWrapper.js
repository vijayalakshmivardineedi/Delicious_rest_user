import React from "react";
import { View, useColorScheme } from "react-native";
import { globalStyles } from "../../src/navigation/GlobalStyles";

const ScreenWrapper = ({ children }) => {
  const scheme = useColorScheme();

  return (
    <View
      style={[
        globalStyles.container,
        { backgroundColor: scheme === "dark" ? "#000" : "#fff" },
      ]}
    >
      {children}
    </View>
  );
};

export default ScreenWrapper;
