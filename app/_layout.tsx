import { Stack } from "expo-router";
import "./global.css";
import { WorkoutProvider } from "../components/provider/WorkoutProvider";
import { NutritionProvider } from "../components/provider/NutritionProvider";

export default function RootLayout() {
  return (
    <NutritionProvider>
      <WorkoutProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="workout-planner" />
          <Stack.Screen name="custom-split" />
          <Stack.Screen name="custom-split/exercises" />
        </Stack>
      </WorkoutProvider>
    </NutritionProvider>
  );
}
