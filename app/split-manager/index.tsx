import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Glass from "../../components/Glass";
import { useWorkout } from "../../components/provider/WorkoutProvider";
import { useRouter } from "expo-router";

export default function SplitManager() {
  const router = useRouter();
  const { splits, activeSplitId, activateSplit, deleteSplit } = useWorkout();

  const handleDeleteSplit = (id: string) => {
    Alert.alert(
      "Delete Split",
      "Are you sure you want to delete this split?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            await deleteSplit(id);
            router.back();
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <View style={{ flex: 1, padding: 20, gap: 20 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>
            My Splits
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: "white", fontSize: 18 }}>✕</Text>
          </TouchableOpacity>
        </View>

        {splits.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, textAlign: "center" }}>
              No splits created yet
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/workout-builder")}
              style={{
                marginTop: 20,
                backgroundColor: "white",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "black", fontWeight: "700" }}>Create New Split</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ gap: 12 }}>
            {splits.map((split) => (
              <Glass
                key={split.id}
                style={{
                  padding: 16,
                  borderRadius: 16,
                  borderWidth: activeSplitId === split.id ? 2 : 0,
                  borderColor: activeSplitId === split.id ? "#60ffd0" : "transparent",
                }}
              >
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ color: "white", fontSize: 20, fontWeight: "700" }}>
                    {split.name}
                  </Text>
                  <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 4 }}>
                    {split.days.length} days • {split.days.reduce((acc, day) => acc + (day.exercises?.length || 0), 0)} total exercises
                  </Text>
                  {activeSplitId === split.id && (
                    <Text style={{ color: "#60ffd0", fontSize: 12, marginTop: 4, fontWeight: "600" }}>
                      ✓ Active
                    </Text>
                  )}
                </View>

                <View style={{ flexDirection: "row", gap: 10 }}>
                  {activeSplitId !== split.id && (
                    <TouchableOpacity
                      onPress={() => activateSplit(split.id)}
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        borderRadius: 10,
                        backgroundColor: "rgba(96,255,208,0.2)",
                        borderWidth: 1,
                        borderColor: "rgba(96,255,208,0.5)",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "#60ffd0", fontWeight: "600", fontSize: 14 }}>
                        Activate
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => handleDeleteSplit(split.id)}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 10,
                      backgroundColor: "rgba(255,100,100,0.2)",
                      borderWidth: 1,
                      borderColor: "rgba(255,100,100,0.5)",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "rgba(255,100,100,0.8)", fontWeight: "600", fontSize: 14 }}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </Glass>
            ))}
          </ScrollView>
        )}

        <TouchableOpacity
          onPress={() => router.push("/workout-builder")}
          style={{
            backgroundColor: "white",
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text style={{ color: "black", fontSize: 16, fontWeight: "700" }}>
            Create New Split
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
