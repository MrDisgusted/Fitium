import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Glass from "../../components/Glass";
import { useWorkout } from "../../components/provider/WorkoutProvider";
import { useRouter } from "expo-router";

export default function Workouts() {
  const {
    todayWorkout,
    todayKey,
    todayState,
    progress,
    applyOverload,
    finishExercise,
    canOverload,
    tomorrowWorkout,
  } = useWorkout();

  const router = useRouter();

  const isCompletedDay =
    progress.total > 0 && progress.completed === progress.total;

  const progressPercent = Math.round(progress.ratio * 100);

  return (
    <ImageBackground
      source={require("../../assets/wallpaper.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Workouts</Text>
            <TouchableOpacity
              style={styles.plannerButton}
              onPress={() => router.push("/workout-planner")}
            >
              <Text style={styles.plannerText}>Planner</Text>
            </TouchableOpacity>
          </View>

          <Glass style={styles.todayCard}>
            {todayWorkout ? (
              <>
                <Text style={styles.todayLabel}>Today</Text>
                <Text style={styles.workoutName}>{todayWorkout.name}</Text>

                {progress.total > 0 && (
                  <>
                    <Text style={styles.progressText}>
                      {progress.completed} / {progress.total} exercises
                    </Text>
                    <View style={styles.progressBarOuter}>
                      <View
                        style={[
                          styles.progressBarInner,
                          { width: `${progressPercent}%` },
                        ]}
                      />
                    </View>
                  </>
                )}

                {isCompletedDay && tomorrowWorkout && (
                  <Text style={styles.tomorrowText}>
                    Completed. Tomorrow: {tomorrowWorkout.name}
                  </Text>
                )}
              </>
            ) : (
              <>
                <Text style={styles.todayLabel}>Today</Text>
                <Text style={styles.workoutName}>Rest Day</Text>
                {tomorrowWorkout && (
                  <Text style={styles.tomorrowText}>
                    Next: {tomorrowWorkout.name}
                  </Text>
                )}
              </>
            )}
          </Glass>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 12 }}>
            {todayWorkout &&
              todayWorkout.exercises.map((ex: any) => {
                const completed = todayState.completedExerciseIds.includes(
                  ex.id
                );
                const overloadAvailable = canOverload(todayKey, ex);
                return (
                  <Glass key={ex.id} style={styles.exerciseCard}>
                    <View
                      style={[
                        styles.exerciseHeaderRow,
                        completed && { opacity: 0.5 },
                      ]}
                    >
                      <Text style={styles.exerciseName}>{ex.name}</Text>
                      {completed && (
                        <Text style={styles.completedTag}>Done</Text>
                      )}
                    </View>

                    <View style={styles.exerciseInfoRow}>
                      <Text style={styles.exerciseInfo}>
                        {ex.weight} kg × {ex.reps} reps
                      </Text>
                    </View>

                    <View style={styles.buttonsRow}>
                      <TouchableOpacity
                        disabled={!overloadAvailable}
                        onPress={() => applyOverload(todayKey, ex.id)}
                        style={[
                          styles.overloadButton,
                          !overloadAvailable && styles.overloadButtonDisabled,
                        ]}
                      >
                        <Text
                          style={[
                            styles.overloadText,
                            !overloadAvailable && styles.overloadTextDisabled,
                          ]}
                        >
                          Overload +{ex.suggestedIncrease}kg
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => finishExercise(ex.id)}
                        style={styles.finishButton}
                      >
                        <Text style={styles.finishText}>
                          {completed ? "Finished" : "Finish"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Glass>
                );
              })}

            {!todayWorkout && (
              <Text style={styles.noWorkoutText}>
                No workout scheduled for today.
              </Text>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  plannerButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  plannerText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  todayCard: {
    padding: 18,
    borderRadius: 25,
  },
  todayLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    marginBottom: 4,
  },
  workoutName: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  progressText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
    marginBottom: 6,
  },
  progressBarOuter: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
  },
  progressBarInner: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "white",
  },
  tomorrowText: {
    marginTop: 10,
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  exerciseCard: {
    padding: 16,
    borderRadius: 20,
  },
  exerciseHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  exerciseName: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  completedTag: {
    color: "#60ffd0",
    fontSize: 14,
    fontWeight: "600",
  },
  exerciseInfoRow: {
    marginBottom: 10,
  },
  exerciseInfo: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  overloadButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
  },
  overloadButtonDisabled: {
    borderColor: "rgba(255,255,255,0.25)",
  },
  overloadText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  overloadTextDisabled: {
    color: "rgba(255,255,255,0.4)",
  },
  finishButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "white",
    alignItems: "center",
  },
  finishText: {
    color: "black",
    fontSize: 14,
    fontWeight: "700",
  },
  noWorkoutText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
  },
});
