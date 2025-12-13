import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  PanResponder,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Glass from "../../components/Glass";
import { useWorkout } from "../../components/provider/WorkoutProvider";
import { useRouter } from "expo-router";

export default function WorkoutBuilder() {
  const router = useRouter();
  const { addSplit } = useWorkout();

  const [step, setStep] = useState(1);

  const [cycleDays, setCycleDays] = useState(3);

  const [dayNames, setDayNames] = useState(
    Array.from({ length: 3 }).map(() => "")
  );

  const [restDays, setRestDays] = useState([]);

  const [exercises, setExercises] = useState(
    Array.from({ length: 3 }).map(() => [])
  );

  const [splitName, setSplitName] = useState("");

  const goNext = () => {
    if (step === 1) {
      setDayNames(Array.from({ length: cycleDays }).map((_) => ""));
      setRestDays([]);
      setExercises(Array.from({ length: cycleDays }).map(() => []));
    }
    if (step < 4) setStep(step + 1);
    else saveSplit();
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleRest = (index) => {
    if (restDays.includes(index))
      setRestDays(restDays.filter((d) => d !== index));
    else setRestDays([...restDays, index]);
  };

  const addExercise = (dayIndex) => {
    const updated = [...exercises];
    updated[dayIndex].push({
      name: "",
      weight: "",
      reps: "",
      sets: "",
      increase: "",
    });
    setExercises(updated);
  };

  const updateExercise = (day, ex, key, value) => {
    const updated = [...exercises];
    updated[day][ex][key] = value;
    setExercises(updated);
  };

  const removeExercise = (day, ex) => {
    const updated = [...exercises];
    updated[day].splice(ex, 1);
    setExercises(updated);
  };

  const reorderExercise = (day, from, to) => {
    const arr = [...exercises[day]];
    const item = arr.splice(from, 1)[0];
    arr.splice(to, 0, item);
    const updated = [...exercises];
    updated[day] = arr;
    setExercises(updated);
  };

  const saveSplit = () => {
    const formatted = {
      id: Date.now().toString(),
      name: splitName || "My Workout Split",
      days: Array.from({ length: cycleDays }).map((_, i) => ({
        name: dayNames[i] || `Day ${i + 1}`,
        rest: restDays.includes(i),
        exercises: exercises[i].map((ex) => ({
          ...ex,
          weight: Number(ex.weight) || 0,
          reps: Number(ex.reps) || 0,
          sets: Number(ex.sets) || 0,
          increase: Number(ex.increase) || 0,
        })),
      })),
    };

    addSplit(formatted);
    router.replace("/(tabs)/workouts");
  };

  const renderStepper = () => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 25,
      }}
    >
      {[1, 2, 3, 4].map((n) => (
        <View
          key={n}
          style={{
            flex: 1,
            height: 4,
            marginHorizontal: 4,
            borderRadius: 4,
            backgroundColor: step >= n ? "white" : "rgba(255,255,255,0.25)",
          }}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <View style={{ flex: 1, padding: 20 }}>
        {renderStepper()}

        <ScrollView contentContainerStyle={{ paddingBottom: 40, gap: 20 }}>
          {step === 1 && (
            <View>
              <Text
                style={{
                  color: "white",
                  fontSize: 28,
                  fontWeight: "bold",
                  marginBottom: 20,
                }}
              >
                Choose Cycle Length
              </Text>

              <Glass style={{ padding: 20, borderRadius: 25 }}>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 10,
                    justifyContent: "center",
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                    <TouchableOpacity
                      key={n}
                      onPress={() => setCycleDays(n)}
                      style={{
                        paddingVertical: 12,
                        paddingHorizontal: 22,
                        borderRadius: 14,
                        backgroundColor:
                          cycleDays === n
                            ? "white"
                            : "rgba(255,255,255,0.15)",
                      }}
                    >
                      <Text
                        style={{
                          color: cycleDays === n ? "black" : "white",
                          fontWeight: "700",
                        }}
                      >
                        {n}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Glass>
            </View>
          )}

          {step === 2 && (
            <View>
              <Text
                style={{
                  color: "white",
                  fontSize: 28,
                  fontWeight: "bold",
                  marginBottom: 20,
                }}
              >
                Name & Rest Days
              </Text>

              {Array.from({ length: cycleDays }).map((_, i) => (
                <Glass key={i} style={{ padding: 20, borderRadius: 25 }}>
                  <Text style={{ color: "white", fontSize: 18 }}>
                    Day {i + 1}
                  </Text>

                  <TextInput
                    placeholder="Name this day"
                    placeholderTextColor="#aaa"
                    value={dayNames[i]}
                    onChangeText={(v) => {
                      const updated = [...dayNames];
                      updated[i] = v;
                      setDayNames(updated);
                    }}
                    style={{
                      marginTop: 10,
                      padding: 12,
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderRadius: 10,
                      color: "white",
                      fontSize: 16,
                    }}
                  />

                  <TouchableOpacity
                    onPress={() => toggleRest(i)}
                    style={{
                      marginTop: 10,
                      paddingVertical: 10,
                      backgroundColor: restDays.includes(i)
                        ? "#ff5577"
                        : "rgba(255,255,255,0.15)",
                      borderRadius: 10,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "700",
                      }}
                    >
                      {restDays.includes(i)
                        ? "Rest Day"
                        : "Mark as Rest Day"}
                    </Text>
                  </TouchableOpacity>
                </Glass>
              ))}
            </View>
          )}

          {step === 3 && (
            <View>
              <Text
                style={{
                  color: "white",
                  fontSize: 28,
                  fontWeight: "bold",
                  marginBottom: 20,
                }}
              >
                Exercises
              </Text>

              {Array.from({ length: cycleDays }).map((_, i) => (
                <Glass key={i} style={{ padding: 20, borderRadius: 25 }}>
                  <Text style={{ color: "white", fontSize: 20 }}>
                    {dayNames[i] || `Day ${i + 1}`}
                  </Text>

                  {restDays.includes(i) ? (
                    <Text
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        marginTop: 10,
                        fontSize: 16,
                      }}
                    >
                      Rest Day
                    </Text>
                  ) : (
                    <View style={{ marginTop: 15 }}>
                      {exercises[i].map((ex, exIndex) => (
                        <View
                          key={exIndex}
                          style={{
                            padding: 15,
                            backgroundColor: "rgba(255,255,255,0.08)",
                            borderRadius: 12,
                            marginBottom: 12,
                          }}
                        >
                          <TextInput
                            placeholder="Exercise Name"
                            placeholderTextColor="#ccc"
                            value={ex.name}
                            onChangeText={(v) =>
                              updateExercise(i, exIndex, "name", v)
                            }
                            style={{
                              padding: 10,
                              backgroundColor: "rgba(255,255,255,0.1)",
                              borderRadius: 10,
                              color: "white",
                              marginBottom: 8,
                            }}
                          />

                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              gap: 10,
                            }}
                          >
                            <InputSmall
                              value={ex.weight}
                              setValue={(v) =>
                                updateExercise(i, exIndex, "weight", v)
                              }
                              placeholder="kg"
                            />

                            <InputSmall
                              value={ex.reps}
                              setValue={(v) =>
                                updateExercise(i, exIndex, "reps", v)
                              }
                              placeholder="reps"
                            />

                            <InputSmall
                              value={ex.sets}
                              setValue={(v) =>
                                updateExercise(i, exIndex, "sets", v)
                              }
                              placeholder="sets"
                            />

                            <InputSmall
                              value={ex.increase}
                              setValue={(v) =>
                                updateExercise(i, exIndex, "increase", v)
                              }
                              placeholder="+kg"
                            />
                          </View>

                          <TouchableOpacity
                            onPress={() => removeExercise(i, exIndex)}
                            style={{
                              marginTop: 10,
                              paddingVertical: 8,
                              borderRadius: 10,
                              backgroundColor: "rgba(255,0,0,0.4)",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                color: "white",
                                fontWeight: "600",
                              }}
                            >
                              Remove Exercise
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}

                      <TouchableOpacity
                        onPress={() => addExercise(i)}
                        style={{
                          padding: 12,
                          borderRadius: 12,
                          backgroundColor: "white",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "black",
                            fontWeight: "700",
                            fontSize: 16,
                          }}
                        >
                          + Add Exercise
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </Glass>
              ))}
            </View>
          )}

          {step === 4 && (
            <View>
              <Glass style={{ padding: 20, borderRadius: 25 }}>
                <Text
                  style={{ color: "white", fontSize: 20, marginBottom: 12 }}
                >
                  Split Name
                </Text>

                <TextInput
                  placeholder="My Workout Split"
                  placeholderTextColor="#aaa"
                  value={splitName}
                  onChangeText={setSplitName}
                  style={{
                    padding: 14,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "white",
                    fontSize: 16,
                  }}
                />
              </Glass>
            </View>
          )}
        </ScrollView>

        <View style={{ flexDirection: "row", marginTop: 20 }}>
          {step > 1 && (
            <TouchableOpacity
              onPress={goBack}
              style={{
                flex: 1,
                paddingVertical: 14,
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 14,
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <Text
                style={{ color: "white", fontSize: 16, fontWeight: "700" }}
              >
                Back
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={goNext}
            style={{
              flex: 1,
              paddingVertical: 14,
              backgroundColor: "white",
              borderRadius: 14,
              alignItems: "center",
            }}
          >
            <Text
              style={{ color: "black", fontSize: 16, fontWeight: "700" }}
            >
              {step === 4 ? "Save Split" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function InputSmall({ value, setValue, placeholder }) {
  return (
    <TextInput
      value={String(value)}
      placeholder={placeholder}
      placeholderTextColor="#aaa"
      keyboardType="numeric"
      onChangeText={(v) => setValue(v)}
      style={{
        flex: 1,
        padding: 10,
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 10,
        color: "white",
      }}
    />
  );
}
