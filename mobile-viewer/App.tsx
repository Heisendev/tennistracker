import { BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue/400Regular";
import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { RobotoMono_500Medium, RobotoMono_700Bold } from "@expo-google-fonts/roboto-mono";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";

import LiveMatchesScreen from "./src/screens/LiveMatchesScreen";
import LiveMatchScreen from "./src/screens/LiveMatchScreen";
import { colors, typography } from "./src/theme";
import type { RootStackParamList } from "./src/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    RobotoMono_500Medium,
    RobotoMono_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
      card: colors.surface,
      border: colors.border,
      text: colors.textPrimary,
      primary: colors.accent,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style="dark" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTitleStyle: {
            ...typography.display,
            fontSize: 28,
          },
          headerTintColor: colors.textPrimary,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="LiveMatches" component={LiveMatchesScreen} options={{ title: "Tennis Lab" }} />
        <Stack.Screen name="LiveMatch" component={LiveMatchScreen} options={{ title: "Live Match" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
