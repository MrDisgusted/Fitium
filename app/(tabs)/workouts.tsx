import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Glass from "../../components/Glass";
import { useWorkout } from "../../components/provider/WorkoutProvider";
import { useRouter } from "expo-router";

export default function Workouts() {
  const router = useRouter();
  const {
    activeSplit,
    today,
    tomorrow,
    cycleIndex,
    finishExercise,
    applyOverload,
    todayState,
  } = useWorkout();

  if (!activeSplit || !today) {
    return (
      <ImageBackground
        source={require("../../assets/wallpaper.png")}
        style={{ flex: 1 }}
      >
        <SafeAreaView
          style={{
            flex: 1,
            padding: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("../workout-builder/index.tsx")}
            style={{
              padding: 12,
              borderRadius: 12,
              backgroundColor: "white",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontWeight: "700", color: "black" }}>
              Create New Split
            </Text>
          </TouchableOpacity>

          <Text style={{ color: "white", fontSize: 22 }}>
            No split selected
          </Text>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  const totalExercises = today.rest ? 0 : today.exercises.length;
  const finished = todayState.finished.length;
  const percent =
    totalExercises === 0 ? 0 : Math.round((finished / totalExercises) * 100);

  return (
    <ImageBackground
      source={require("../../assets/wallpaper.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ padding: 20, gap: 20, flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 32, color: "white", fontWeight: "bold" }}>
              Workout
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/workout-builder/index")}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.15)",
              }}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>Planner</Text>
            </TouchableOpacity>
          </View>

          <Glass style={{ padding: 20, borderRadius: 25 }}>
            <Text style={{ fontSize: 16, color: "rgba(255,255,255,0.8)" }}>
              Today — Day {cycleIndex + 1}
            </Text>

            <Text
              style={{
                fontSize: 22,
                color: "white",
                fontWeight: "700",
                marginTop: 5,
              }}
            >
              {today.rest ? "Rest Day" : today.name}
            </Text>

            {!today.rest && (
              <>
                <Text
                  style={{
                    marginTop: 10,
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 15,
                  }}
                >
                  {finished} / {totalExercises} exercises
                </Text>

                <View
                  style={{
                    height: 8,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderRadius: 100,
                    overflow: "hidden",
                    marginTop: 8,
                  }}
                >
                  <View
                    style={{
                      width: `${percent}%`,
                      height: "100%",
                      backgroundColor: "white",
                    }}
                  />
                </View>
              </>
            )}

            <Text
              style={{
                marginTop: 10,
                color: "rgba(255,255,255,0.7)",
                fontSize: 15,
              }}
            >
              Tomorrow — {tomorrow.rest ? "Rest Day" : tomorrow.name}
            </Text>
          </Glass>

          <ScrollView contentContainerStyle={{ gap: 15 }}>
            {today.rest ? (
              <Text
                style={{
                  textAlign: "center",
                  color: "rgba(255,255,255,0.8)",
                  marginTop: 20,
                  fontSize: 18,
                }}
              >
                Enjoy your rest day.
              </Text>
            ) : (
              today.exercises.map((ex) => {
                const isDone = todayState.finished.includes(ex.id);
                const usedOverload = todayState.overloadUsed.includes(ex.id);

                return (
                  <Glass
                    key={ex.id}
                    style={{ padding: 18, borderRadius: 20 }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 18,
                          fontWeight: "600",
                        }}
                      >
                        {ex.name}
                      </Text>

                      {isDone && (
                        <Text
                          style={{
                            color: "#60ffd0",
                            fontWeight: "700",
                          }}
                        >
                          Done
                        </Text>
                      )}
                    </View>

                    <Text
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        marginBottom: 12,
                        fontSize: 15,
                      }}
                    >
                      {ex.weight}kg × {ex.reps} reps × {ex.sets} sets
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      <TouchableOpacity
                        disabled={usedOverload}
                        onPress={() => applyOverload(cycleIndex, ex.id)}
                        style={{
                          flex: 1,
                          paddingVertical: 10,
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: usedOverload
                            ? "rgba(255,255,255,0.3)"
                            : "rgba(255,255,255,0.7)",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: usedOverload
                              ? "rgba(255,255,255,0.3)"
                              : "white",
                            fontWeight: "700",
                          }}
                        >
                          +{ex.suggestedIncrease}kg
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        disabled={isDone}
                        onPress={() => finishExercise(ex.id)}
                        style={{
                          flex: 1,
                          paddingVertical: 10,
                          borderRadius: 12,
                          backgroundColor: isDone
                            ? "rgba(255,255,255,0.3)"
                            : "white",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: isDone ? "rgba(0,0,0,0.3)" : "black",
                            fontWeight: "700",
                          }}
                        >
                          {isDone ? "Finished" : "Finish"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Glass>
                );
              })
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
