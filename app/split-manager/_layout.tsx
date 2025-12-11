import { Stack } from "expo-router";
import { ImageBackground } from "react-native";
import { WorkoutProvider } from "../../components/provider/WorkoutProvider";
import { useWallpaper } from "../../components/provider/WallpaperProvider";

function SplitManagerLayoutContent() {
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

export default function SplitManagerLayout() {
  return (
    <WorkoutProvider>
      <SplitManagerLayoutContent />
    </WorkoutProvider>
  );
}
