import { DefaultTheme, DarkTheme } from "@react-navigation/native";

export const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#FFFFFF",
    text: "#000000",
    primary: "#ffba00",
    card: "#f8f8f8",
    border: "#e0e0e0",
  },
};

export const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#000000",
    text: "#FFFFFF",
    primary: "#ffba00",
    card: "#1c1c1c",
    border: "#333333",
  },
};
