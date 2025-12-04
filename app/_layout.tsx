import { Stack } from "expo-router";
import "./global.css";
import { NutritionProvider } from "../components/provider/NutritionProvider";
import { WorkoutProvider } from "../components/provider/WorkoutProvider";

export default function RootLayout() {
  return (
    <NutritionProvider>
      <WorkoutProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
        </Stack>
      </WorkoutProvider>
    </NutritionProvider>
  );
}
