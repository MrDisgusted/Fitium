import { Tabs } from "expo-router";
import GlassBar from "../../components/GlassBar";
import { icons } from "../../constants/icons";

export default function _layout() {
  return (
    <Tabs
      tabBar={(props) => <GlassBar {...props} />}
      screenOptions={{ tabBarShowLabel: false, headerShown: false }}
    >
      <Tabs.Screen
        name="workouts"
        options={{
          tabBarIcon: () => icons.weights,
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          tabBarIcon: () => icons.run,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: () => icons.menu,
        }}
      />
      <Tabs.Screen
        name="diet"
        options={{
          tabBarIcon: () => icons.food,
        }}
      />
      <Tabs.Screen
        name="supplements"
        options={{
          tabBarIcon: () => icons.pills,
        }}
      />
    </Tabs>
  );
}
