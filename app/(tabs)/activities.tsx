import { useEffect, useState } from "react";
import { View, Text, ImageBackground, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Glass from "../../components/Glass";
import { Pedometer } from "expo-sensors";
import { useNutrition } from "../../components/provider/NutritionProvider";

type TodoItem = { id: string; text: string; completed: boolean };

export default function Activities() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [steps, setSteps] = useState(0);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");

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

            <ScrollView style={{ flex: 1 }}>
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
            </ScrollView>
          </Glass>

        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
