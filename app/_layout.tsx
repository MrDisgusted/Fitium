import { Stack } from "expo-router";
import { NutritionProvider } from "../components/provider/NutritionProvider";
import { WorkoutProvider } from "../components/provider/WorkoutProvider";
import { WallpaperProvider, useWallpaper } from "../components/provider/WallpaperProvider";
import { MealProvider } from "../components/provider/MealProvider";
import { ProProvider } from "../components/provider/ProProvider";
import { CalorieBankProvider } from "../components/provider/CalorieBankProvider";
import { ImageBackground } from "react-native";
import "./global.css";

function RootLayoutContent() {
  const { wallpaper } = useWallpaper();

  return (
    <ImageBackground
      source={wallpaper}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="workout-builder" />
        <Stack.Screen name="split-manager" />
      </Stack>
    </ImageBackground>
  );
}

export default function RootLayout() {
  return (
    <ProProvider>
      <WallpaperProvider>
        <CalorieBankProvider>
          <NutritionProvider>
            <WorkoutProvider>
              <MealProvider>
                <RootLayoutContent />
              </MealProvider>
            </WorkoutProvider>
          </NutritionProvider>
        </CalorieBankProvider>
      </WallpaperProvider>
    </ProProvider>
  );
}
