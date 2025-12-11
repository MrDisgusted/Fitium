import { Stack } from "expo-router";
import { NutritionProvider } from "../components/provider/NutritionProvider";
import { WorkoutProvider } from "../components/provider/WorkoutProvider";
import { WallpaperProvider } from "../components/provider/WallpaperProvider";
import "./global.css";

export default function RootLayout() {
  return (
    <WallpaperProvider>
      <NutritionProvider>
        <WorkoutProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="workout-builder" />
            <Stack.Screen name="split-manager" />
          </Stack>
        </WorkoutProvider>
      </NutritionProvider>
    </WallpaperProvider>
  );
}
