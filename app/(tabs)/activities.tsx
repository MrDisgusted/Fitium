import { useEffect, useState } from "react";
import { View, Text, ImageBackground, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Glass from "../../components/Glass";
import { Pedometer } from "expo-sensors";
import { useNutrition } from "../../components/provider/NutritionProvider";

export default function Activities() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [steps, setSteps] = useState(0);
  const [plans, setPlans] = useState("");

  const { setCalories } = useNutrition();

  useEffect(() => {
    Pedometer.isAvailableAsync().then(setIsAvailable);

    const subscription = Pedometer.watchStepCount((result) => {
      setSteps(result.steps);
    });

    return () => subscription.remove();
  }, []);

  const caloriesBurned = Math.round(steps * 0.04);

  useEffect(() => {
    setCalories(caloriesBurned);
  }, [steps]);

  return (
    <ImageBackground
      source={require("../../assets/wallpaper.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: 20, gap: 20 }}>

          <Text style={{ fontSize: 32, color: "white", fontWeight: "bold" }}>
            Activities
          </Text>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <Glass style={{ flex: 1, padding: 20, borderRadius: 20, height: 150 }}>
              <Text style={{ color: "white", fontSize: 18 }}>Steps</Text>
              <Text style={{ color: "white", fontSize: 40, fontWeight: "700", marginTop: 20 }}>
                {isAvailable ? steps : "N/A"}
              </Text>
            </Glass>

            <Glass style={{ flex: 1, padding: 20, borderRadius: 20, height: 150 }}>
              <Text style={{ color: "white", fontSize: 18 }}>Cardio</Text>

              <TouchableOpacity
                style={{
                  marginTop: "auto",
                  backgroundColor: "white",
                  paddingVertical: 8,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "700" }}>Start Cardio</Text>
              </TouchableOpacity>
            </Glass>
          </View>

          <Glass style={{ padding: 20, borderRadius: 20 }}>
            <Text style={{ color: "white", fontSize: 18 }}>
              Estimated Calories Burned
            </Text>

            <Text style={{ marginTop: 10, fontSize: 24, color: "white", fontWeight: "bold" }}>
              {caloriesBurned} kcal
            </Text>
          </Glass>

          <Glass style={{ padding: 20, borderRadius: 20, flex: 1 }}>
            <Text style={{ color: "white", fontSize: 18, marginBottom: 10 }}>Plans</Text>

            <TextInput
              multiline
              placeholder="Write anything..."
              placeholderTextColor="#ccc"
              value={plans}
              onChangeText={setPlans}
              style={{
                flex: 1,
                textAlignVertical: "top",
                color: "white",
                fontSize: 16,
              }}
            />
          </Glass>

        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
