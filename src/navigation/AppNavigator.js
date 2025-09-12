import React, { useState } from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { LightTheme, CustomDarkTheme } from "../../src/navigation/theme";

// your screens...
import HomeScreen from "../screens/HomeScreens";
import MenuScreen from "../screens/MenuScreen";
import CartScreen from "../screens/CartScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/Authentication/LoginScreen";
import OnboardingScreen from "../screens/Onboarding/OnboardingScreen";
import OtpScreen from "../screens/Authentication/OtpScreen";
import RegistrationScreen from "../screens/Authentication/RegistrationScreen";
import LocationPermissionScreen from "../screens/Authentication/LocationPermissionScreen";
import ManualLocationScreen from "../screens/Authentication/ManualLocationScreen ";
import NotificationScreen from "../screens/Authentication/NotificationScreen";
import OrderSuccessScreen from "../screens/Menu/OrderSuccessScreen";
import OrderHistoryScreen from "../screens/Menu/OrderHistoryScreen";
import RestaurantDetailsScreen from "../screens/Menu/RestaurantDetailsScreen";
import SearchScreen from "../screens/Menu/SearchScreen";
import OffersScreen from "../screens/Menu/OffersScreen";
import SettingsScreen from "../screens/Menu/SettingsScreen";
import TrackOrderScreen from "../screens/Menu/TrackOrderScreen";
import FavoritesScreen from "../screens/Menu/FavoritesScreen";
import EditProfileScreen from "../screens/Menu/EditProfileScreen";
import SavedAddressesScreen from "../screens/Menu/SavedAddressesScreen";
import RatingReviewScreen from "../screens/Menu/RatingReviewScreen";
import CheckoutScreen from "../screens/Menu/CheckoutScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const scheme = useColorScheme(); // ✅ auto detects system dark/light

  const TabNavigator = () => {
    return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ navigation }) => ({
          tabBarActiveTintColor: "#ffba00",
          tabBarInactiveTintColor: scheme === "dark" ? "#aaa" : "white",
          tabBarStyle: {
            height: 70,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            backgroundColor: scheme === "dark" ? "#1c1c1c" : "#0c3b2e",
            position: "absolute",
            overflow: "hidden",
          },
          headerStyle: {
            backgroundColor: scheme === "dark" ? "#000" : "#fff",
          },
          headerTitleStyle: {
            color: scheme === "dark" ? "#fff" : "#000",
            fontWeight: "bold",
            fontSize: 20,
          },
          headerRight: () => (
            <Ionicons
              name="cart"
              size={24}
              color={scheme === "dark" ? "#fff" : "#000"}
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate("Cart")}
            />
          ),
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "Home", 
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Menu"
          component={MenuScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer
      theme={scheme === "dark" ? CustomDarkTheme : LightTheme}
    >
      <Stack.Navigator initialRouteName="Onboard">
        <Stack.Screen
          name="Onboard"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OTP Verification"
          component={OtpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RegistrationScreen"
          component={RegistrationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LocationPermissionScreen"
          component={LocationPermissionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ManualLocationScreen"
          component={ManualLocationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AppTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen
          name="OrderSuccess"
          component={OrderSuccessScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
        <Stack.Screen
          name="RestaurantDetails"
          component={RestaurantDetailsScreen}
        />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Offers" component={OffersScreen} />
        <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
        <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
        <Stack.Screen name="RatingReview" component={RatingReviewScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
