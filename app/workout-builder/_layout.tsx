import { Stack } from "expo-router";

export default function WorkoutBuilderLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="rest-days" />
      <Stack.Screen name="exercises" />
      <Stack.Screen name="review" />
      <Stack.Screen name="days" />
    </Stack>
  );
}
