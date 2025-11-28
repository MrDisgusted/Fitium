import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
    //anytime you add a new folder make sure to put copy paste
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
