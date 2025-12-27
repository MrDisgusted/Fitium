import { Stack } from "expo-router";
import { ImageBackground } from "react-native";
import { NutritionProvider } from "../../components/provider/NutritionProvider";
import { useWallpaper } from "../../components/provider/WallpaperProvider";

function ProfileLayoutContent() {
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
        <Stack.Screen name="index" />
      </Stack>
    </ImageBackground>
  );
}

export default function ProfileLayout() {
  return (
    <NutritionProvider>
      <ProfileLayoutContent />
    </NutritionProvider>
  );
}
