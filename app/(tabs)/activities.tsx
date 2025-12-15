import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import Glass from "../../components/Glass";
import ActivityTrackerModal from "../../components/ActivityTrackerModal";
import { Pedometer } from "expo-sensors";
import { useNutrition } from "../../components/provider/NutritionProvider";
import { useWallpaper } from "../../components/provider/WallpaperProvider";

type TodoItem = { id: string; text: string; completed: boolean };

export default function Activities() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [steps, setSteps] = useState(0);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [activityTrackerVisible, setActivityTrackerVisible] = useState(false);
  const [loggedActivities, setLoggedActivities] = useState<{ duration: number; calories: number }[]>([]);

  const { setCalories } = useNutrition();
  const { wallpaper } = useWallpaper();

  useEffect(() => {
    Pedometer.isAvailableAsync().then(setIsAvailable);

    const subscription = Pedometer.watchStepCount((result) => {
      setSteps(result.steps);
    });

    return () => subscription.remove();
  }, []);

  const caloriesBurned = Math.round(steps * 0.04);

  const totalActivityCalories = loggedActivities.reduce((sum, activity) => sum + activity.calories, 0);
  const totalCaloriesBurned = caloriesBurned + totalActivityCalories;

  useEffect(() => {
    setCalories(totalCaloriesBurned);
  }, [steps, loggedActivities]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now().toString(), text: newTodo, completed: false }]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleSaveActivity = (duration: number, calories: number) => {
    setLoggedActivities([...loggedActivities, { duration, calories }]);
  };

  return (
    <ImageBackground
      source={wallpaper}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <BlurView intensity={activityTrackerVisible ? 80 : 0} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
          <ScrollView style={{ flex: 1, backgroundColor: 'transparent' }} contentContainerStyle={{ paddingBottom: 20, padding: 20, gap: 20, backgroundColor: 'transparent' }}>
          <View style={{ padding: 20, gap: 20, backgroundColor: 'transparent' }}>

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
                <Text style={{ color: "white", fontSize: 18 }}>Activity</Text>

                <TouchableOpacity
                  onPress={() => setActivityTrackerVisible(true)}
                  style={{
                    marginTop: "auto",
                    backgroundColor: "#60ffd0",
                    paddingVertical: 8,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontWeight: "700", color: "black" }}>Start Activity</Text>
                </TouchableOpacity>
              </Glass>
            </View>

            <Glass style={{ padding: 20, borderRadius: 20 }}>
              <Text style={{ color: "white", fontSize: 18 }}>
                Estimated Calories Burned
              </Text>

              <Text style={{ marginTop: 10, fontSize: 24, color: "white", fontWeight: "bold" }}>
                {totalCaloriesBurned} kcal
              </Text>

              {loggedActivities.length > 0 && (
                <View style={{ marginTop: 15, gap: 8 }}>
                  <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
                    Breakdown:
                  </Text>
                  <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
                    Steps: {caloriesBurned} kcal
                  </Text>
                  <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
                    Activities: {totalActivityCalories} kcal
                  </Text>
                </View>
              )}
            </Glass>

            <Glass style={{ padding: 20, borderRadius: 20 }}>
              <Text style={{ color: "white", fontSize: 18, marginBottom: 15, fontWeight: "600" }}>Plans</Text>

              <View style={{ flexDirection: "row", gap: 10, marginBottom: 15 }}>
                <TextInput
                  placeholder="Add a plan..."
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={newTodo}
                  onChangeText={setNewTodo}
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: 14,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.2)",
                  }}
                />
                <TouchableOpacity
                  onPress={addTodo}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 8,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>Add</Text>
                </TouchableOpacity>
              </View>

              {todos.length === 0 ? (
                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, textAlign: "center", marginTop: 20 }}>
                  No plans yet. Add one to get started!
                </Text>
              ) : (
                todos.map((todo) => (
                  <View
                    key={todo.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      backgroundColor: "rgba(255,255,255,0.05)",
                      borderRadius: 8,
                      marginBottom: 8,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => toggleTodo(todo.id)}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        borderWidth: 2,
                        borderColor: "white",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: todo.completed ? "rgba(255,255,255,0.3)" : "transparent",
                        marginRight: 12,
                      }}
                    >
                      {todo.completed && <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>✓</Text>}
                    </TouchableOpacity>
                    <Text
                      style={{
                        flex: 1,
                        color: todo.completed ? "rgba(255,255,255,0.4)" : "white",
                        fontSize: 14,
                        textDecorationLine: todo.completed ? "line-through" : "none",
                      }}
                    >
                      {todo.text}
                    </Text>
                    <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
                      <Text style={{ color: "rgba(255,100,100,0.8)", fontSize: 14, fontWeight: "600" }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </Glass>

        </View>
      </ScrollView>
      </SafeAreaView>
      </BlurView>

      <ActivityTrackerModal
        visible={activityTrackerVisible}
        onClose={() => setActivityTrackerVisible(false)}
        onSaveActivity={handleSaveActivity}
      />
    </ImageBackground>
  );
}
