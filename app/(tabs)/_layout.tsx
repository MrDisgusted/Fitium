import { Tabs } from "expo-router";
import GlassBar from "../../components/GlassBar";
import { icons } from "../../constants/icons";
import { ImageBackground } from "react-native";
import { NutritionProvider } from "../../components/provider/NutritionProvider";

export default function TabsLayout() {
  return (
    <NutritionProvider>
      <ImageBackground
        source={require("../../assets/wallpaper.png")}
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
        >
          <Tabs.Screen name="workouts" options={{ tabBarIcon: () => icons.weights }} />
          <Tabs.Screen name="activities" options={{ tabBarIcon: () => icons.run }} />
          <Tabs.Screen name="index" options={{ tabBarIcon: () => icons.menu }} />
          <Tabs.Screen name="diet" options={{ tabBarIcon: () => icons.food }} />
          <Tabs.Screen name="supplements" options={{ tabBarIcon: () => icons.pills }} />
        </Tabs>
      </ImageBackground>
    </NutritionProvider>
  );
}
