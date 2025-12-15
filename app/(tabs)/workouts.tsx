import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Glass from "../../components/Glass";
import { useWorkout } from "../../components/provider/WorkoutProvider";
import { useWallpaper } from "../../components/provider/WallpaperProvider";
import { useRouter } from "expo-router";

export default function Workouts() {
  const router = useRouter();
  const { getTodayWorkout, getTomorrowWorkout, activeSplit } = useWorkout();
  const { wallpaper } = useWallpaper();
  const [, setRefresh] = useState(0);

  // Refresh the page when the tab comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setRefresh(prev => prev + 1);
    }, [])
  );

  const today = getTodayWorkout();
  const tomorrow = getTomorrowWorkout();

  const [completedExercises, setCompletedExercises] = useState([]);
  const [appliedOverloads, setAppliedOverloads] = useState<string[]>([]);

  if (!activeSplit) {
    return (
      <ImageBackground
        source={wallpaper}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
          <View style={{ flex: 1, padding: 20, gap: 20 }}>
          <Text style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>
            No Workout Split
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/workout-builder")}
            style={{
              backgroundColor: "white",
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ color: "black", fontSize: 16, fontWeight: "700" }}>
              Create Workout Split
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/workout-planner")}
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>
              Workout Planner
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      </ImageBackground>
    );
  }

  const day = today?.day;
  const dayIndex = today?.index;

  const finishExercise = (exerciseIndex) => {
    const updated = [...completedExercises, exerciseIndex];
    setCompletedExercises(updated);
  };

  const applyOverload = (exercise) => {
    // Apply the overload to the exercise weight
    exercise.weight = Number(exercise.weight) + Number(exercise.increase || 0);
    // Track that this exercise has had overload applied using its name as key
    setAppliedOverloads([...appliedOverloads, exercise.name]);
  };

  const remainingExercises =
    day?.exercises?.filter((_, i) => !completedExercises.includes(i)) || [];

  const dayComplete =
    !day?.rest &&
    remainingExercises.length === 0 &&
    day?.exercises?.length > 0;

  return (
    <ImageBackground
      source={wallpaper}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1, padding: 20, gap: 20, backgroundColor: 'transparent' }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>
            Workouts
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/split-manager")}
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.4)",
            }}
          >
            <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>
              ⚙️ Splits
            </Text>
          </TouchableOpacity>
        </View>

        <Glass style={{ padding: 20, borderRadius: 25 }}>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 16 }}>
            Today
          </Text>

          <Text style={{ color: "white", fontSize: 24, fontWeight: "700" }}>
            {day?.rest ? "Rest Day" : day?.name}
          </Text>

          {!day?.rest && (
            <Text
              style={{
                color: "rgba(255,255,255,0.8)",
                marginTop: 5,
                fontSize: 15,
              }}
            >
              {remainingExercises.length} exercises remaining
            </Text>
          )}

          {dayComplete && (
            <Text style={{ marginTop: 10, color: "#60ffd0", fontSize: 16 }}>
              Day Complete
            </Text>
          )}

          {tomorrow && (
            <>
              <Text
                style={{
                  marginTop: 12,
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 14,
                }}
              >
                Tomorrow:
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "600",
                }}
              >
                {tomorrow.day?.rest ? "Rest Day" : tomorrow.day?.name}
              </Text>
            </>
          )}
        </Glass>

        <ScrollView contentContainerStyle={{ gap: 14 }}>
          {day?.rest && (
            <Text
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: 16,
                textAlign: "center",
                marginTop: 20,
              }}
            >
              Enjoy your rest day.
            </Text>
          )}

          {!day?.rest &&
            remainingExercises.map((ex, i) => (
              <Glass key={i} style={{ padding: 16, borderRadius: 20 }}>
                <Text style={{ color: "white", fontSize: 20, fontWeight: "700" }}>
                  {ex.name}
                </Text>

                <Text
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    marginTop: 6,
                    fontSize: 16,
                  }}
                >
                  {ex.weight} kg × {ex.reps} reps × {ex.sets} sets
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    marginTop: 14,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => applyOverload(ex)}
                    disabled={appliedOverloads.includes(ex.name)}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: appliedOverloads.includes(ex.name) ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)",
                      alignItems: "center",
                      backgroundColor: appliedOverloads.includes(ex.name) ? "rgba(255,255,255,0.05)" : "transparent",
                    }}
                  >
                    <Text
                      style={{
                        color: appliedOverloads.includes(ex.name) ? "rgba(255,255,255,0.4)" : "white",
                        fontSize: 15,
                        fontWeight: "600",
                      }}
                    >
                      {appliedOverloads.includes(ex.name) ? "Overload Applied" : `+${ex.increase || 0}kg Overload`}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      const originalIndex = day.exercises.indexOf(ex);
                      finishExercise(originalIndex);
                    }}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 12,
                      backgroundColor: "white",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                        fontSize: 15,
                        fontWeight: "700",
                      }}
                    >
                      Complete
                    </Text>
                  </TouchableOpacity>
                </View>
              </Glass>
            ))}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
