import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import Glass from "../../components/Glass";
import EditNumberModal from "../../components/EditNumberModal";
import { useNutrition } from "../../components/provider/NutritionProvider";
import { useWallpaper } from "../../components/provider/WallpaperProvider";

export default function Profile() {
  const {
    macroGoals,
    setMacroGoals,
    calorieGoal,
    setCalorieGoal,
    userInfo,
    setUserInfo,
  } = useNutrition();

  const { setWallpaper } = useWallpaper();

  const [profile, setProfile] = useState(userInfo);
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState(0);

  const openEdit = (field: string, value: number) => {
    setEditField(field);
    setEditValue(value);
  };

  const saveEdit = (val: number) => {
    if (editField === "calorieGoal") {
      setCalorieGoal(val);
    } else {
      setMacroGoals({ ...macroGoals, [editField as keyof typeof macroGoals]: val });
    }
    setEditField(null);
  };

  const pickWallpaper = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await setWallpaper(result.assets[0].uri);
        Alert.alert("Success", "Wallpaper updated!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
      console.error(error);
    }
  };

  const resetWallpaper = async () => {
    await setWallpaper(null);
    Alert.alert("Success", "Wallpaper reset to default!");
  };

  const onSaveProfile = () => {
    setUserInfo({
      age: Number(profile.age) || 0,
      gender: profile.gender,
      weight: Number(profile.weight) || 0,
      height: Number(profile.height) || 0,
      activity: Number(profile.activity) || 1.2,
    });
  };

  const estimatedGoalCalories =
    macroGoals.carbs * 4 + macroGoals.protein * 4 + macroGoals.fats * 9;

  return (
    <ImageBackground
      source={require("../../assets/wallpaper.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
          <Text style={styles.title}>Profile</Text>

          <Glass style={{ padding: 20, borderRadius: 25 }}>
            <Text style={styles.header}>Personal Information</Text>

            <TextInput
              style={styles.input}
              placeholder="Age"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={String(profile.age ?? "")}
              onChangeText={(t) => setProfile({ ...profile, age: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Gender"
              placeholderTextColor="#aaa"
              value={profile.gender ?? ""}
              onChangeText={(t) => setProfile({ ...profile, gender: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Weight (kg)"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={String(profile.weight ?? "")}
              onChangeText={(t) => setProfile({ ...profile, weight: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Height (cm)"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={String(profile.height ?? "")}
              onChangeText={(t) => setProfile({ ...profile, height: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Activity (1.2 - 1.9)"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={String(profile.activity ?? "")}
              onChangeText={(t) => setProfile({ ...profile, activity: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Occupation"
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.input}
              placeholder="Illnesses"
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.input}
              placeholder="Allergies"
              placeholderTextColor="#aaa"
            />

            <TouchableOpacity style={styles.saveButton} onPress={onSaveProfile}>
              <Text style={styles.saveText}>Save Profile</Text>
            </TouchableOpacity>
          </Glass>

          <Glass style={{ padding: 20, borderRadius: 25 }}>
            <Text style={styles.header}>Wallpaper</Text>

            <TouchableOpacity style={styles.wallpaperButton} onPress={pickWallpaper}>
              <Text style={styles.buttonText}>📸 Choose Wallpaper</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetButton} onPress={resetWallpaper}>
              <Text style={styles.resetButtonText}>Reset to Default</Text>
            </TouchableOpacity>
          </Glass>

          <Glass style={{ padding: 20, borderRadius: 25 }}>
            <Text style={styles.header}>Nutrition Goals</Text>

            <TouchableOpacity
              onPress={() => openEdit("carbs", macroGoals.carbs)}
              style={styles.goalRow}
            >
              <Text style={styles.goalLabel}>Carbs Goal</Text>
              <View style={styles.goalValueContainer}>
                <Text style={styles.goalValue}>{macroGoals.carbs} g</Text>
                <Text style={styles.arrow}>{">"}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openEdit("protein", macroGoals.protein)}
              style={styles.goalRow}
            >
              <Text style={styles.goalLabel}>Protein Goal</Text>
              <View style={styles.goalValueContainer}>
                <Text style={styles.goalValue}>{macroGoals.protein} g</Text>
                <Text style={styles.arrow}>{">"}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openEdit("fats", macroGoals.fats)}
              style={styles.goalRow}
            >
              <Text style={styles.goalLabel}>Fats Goal</Text>
              <View style={styles.goalValueContainer}>
                <Text style={styles.goalValue}>{macroGoals.fats} g</Text>
                <Text style={styles.arrow}>{">"}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openEdit("calorieGoal", calorieGoal)}
              style={styles.goalRow}
            >
              <Text style={styles.goalLabel}>Calorie Goal</Text>
              <View style={styles.goalValueContainer}>
                <Text style={styles.goalValue}>{calorieGoal} kcal</Text>
                <Text style={styles.arrow}>{">"}</Text>
              </View>
            </TouchableOpacity>

            <View style={{ marginTop: 15 }}>
              <Text style={{ color: "white", opacity: 0.8, fontSize: 16 }}>
                Estimated calories from goals:{" "}
                <Text style={{ fontWeight: "700", color: "white" }}>
                  {estimatedGoalCalories} kcal
                </Text>
              </Text>
            </View>
          </Glass>

          <EditNumberModal
            visible={!!editField}
            label={editField || ""}
            value={editValue}
            onClose={() => setEditField(null)}
            onSave={saveEdit}
          />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  header: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 14,
    borderRadius: 12,
    marginVertical: 6,
    color: "white",
    fontSize: 16,
  },
  saveButton: {
    marginTop: 12,
    backgroundColor: "white",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  saveText: {
    color: "black",
    fontSize: 16,
    fontWeight: "700",
  },
  wallpaperButton: {
    backgroundColor: "rgba(96,255,208,0.2)",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(96,255,208,0.5)",
  },
  buttonText: {
    color: "#60ffd0",
    fontSize: 16,
    fontWeight: "700",
  },
  resetButton: {
    backgroundColor: "rgba(255,100,100,0.2)",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,100,100,0.5)",
  },
  resetButtonText: {
    color: "rgba(255,100,100,0.8)",
    fontSize: 14,
    fontWeight: "600",
  },
  goalRow: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    marginBottom: 10,
  },
  goalLabel: {
    color: "white",
    fontSize: 18,
  },
  goalValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  goalValue: {
    color: "white",
    opacity: 0.85,
    fontSize: 18,
    fontWeight: "700",
  },
  arrow: {
    color: "white",
    opacity: 0.5,
    fontSize: 20,
    marginLeft: 6,
  },
});
