import { Tabs } from "expo-router";
import GlassBar from "../../components/GlassBar";
import { icons } from "../../constants/icons";
import { ImageBackground } from "react-native";
import { NutritionProvider } from "../../components/provider/NutritionProvider";
import { WorkoutProvider } from "../../components/provider/WorkoutProvider";
import { useWallpaper } from "../../components/provider/WallpaperProvider";
import { useState } from "react";

const tabNames = ["workouts", "activities", "index", "diet", "supplements"];
const tabIcons = {
  workouts: () => icons.weights,
  activities: () => icons.run,
  index: () => icons.menu,
  diet: () => icons.food,
  supplements: () => icons.pills,
};

export default function TabsLayout() {
  const { wallpaper } = useWallpaper();
  const [currentTab, setCurrentTab] = useState(2); // Start at index (position 2)

  return (
    <WorkoutProvider>
      <NutritionProvider>
        <ImageBackground
          source={wallpaper}
          style={{ flex: 1 }}
          resizeMode="cover"
        >
          <Tabs
            tabBar={(props) => <GlassBar {...props} />}
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: "transparent",
                position: "absolute",
                borderTopWidth: 0,
              },
            }}
            screenListeners={{
              state: (e) => {
                const index = e.data.state.index;
                setCurrentTab(index);
              },
            }}
          >
            <Tabs.Screen name="workouts" options={{ tabBarIcon: tabIcons.workouts }} />
            <Tabs.Screen name="activities" options={{ tabBarIcon: tabIcons.activities }} />
            <Tabs.Screen name="index" options={{ tabBarIcon: tabIcons.index }} />
            <Tabs.Screen name="diet" options={{ tabBarIcon: tabIcons.diet }} />
            <Tabs.Screen name="supplements" options={{ tabBarIcon: tabIcons.supplements }} />
          </Tabs>
        </ImageBackground>
      </NutritionProvider>
    </WorkoutProvider>
  );
}
