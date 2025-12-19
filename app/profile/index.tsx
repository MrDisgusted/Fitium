import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Glass from "../../components/Glass";
import EditNumberModal from "../../components/EditNumberModal";
import { useNutrition } from "../../components/provider/NutritionProvider";
import { useWallpaper } from "../../components/provider/WallpaperProvider";
import { usePro } from "../../components/provider/ProProvider";

const ACTIVITY_LEVELS = [
  { id: "sedentary", label: "Sedentary (little exercise)", value: 1.2 },
  { id: "light", label: "Light (1-3 days/week)", value: 1.375 },
  { id: "moderate", label: "Moderate (3-5 days/week)", value: 1.55 },
  { id: "very", label: "Very Active (6-7 days/week)", value: 1.725 },
  { id: "extra", label: "Extra Active (physical job)", value: 1.9 },
];

const OCCUPATIONS = [
  { id: "sedentary-job", label: "Office Worker", activityMultiplier: 1.2 },
  { id: "light-job", label: "Teacher/Nurse", activityMultiplier: 1.4 },
  { id: "moderate-job", label: "Construction/Manual Labor", activityMultiplier: 1.6 },
  { id: "active-job", label: "Athlete/Sports Professional", activityMultiplier: 1.9 },
];

export default function Profile() {
  const router = useRouter();
  const {
    macroGoals,
    setMacroGoals,
    calorieGoal,
    setCalorieGoal,
    userInfo,
    setUserInfo,
  } = useNutrition();

  const { setWallpaper } = useWallpaper();
  const { isPro, expirationDate, cancelSubscription } = usePro();

  const [profile, setProfile] = useState(userInfo);
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState(0);
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [occupationModalVisible, setOccupationModalVisible] = useState(false);

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
    if (!isPro) {
      Alert.alert(
        "Pro Feature",
        "Custom wallpapers are a Pro feature. Upgrade to Pro to unlock it!",
        [{ text: "OK" }]
      );
      return;
    }
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
    if (!isPro) {
      Alert.alert(
        "Pro Feature",
        "Custom wallpapers are a Pro feature. Upgrade to Pro to unlock it!",
        [{ text: "OK" }]
      );
      return;
    }
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

  const getActivityLabel = (value: number) => {
    const activity = ACTIVITY_LEVELS.find((a) => Math.abs(a.value - value) < 0.01);
    return activity?.label || `${value}`;
  };

  const getOccupationLabel = (multiplier: number) => {
    const occupation = OCCUPATIONS.find((o) => Math.abs(o.activityMultiplier - multiplier) < 0.01);
    return occupation?.label || "Not selected";
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      "Cancel Subscription",
      "Are you sure you want to cancel your Pro subscription? You will lose access to Pro features.",
      [
        {
          text: "Keep Subscription",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Cancel Subscription",
          onPress: async () => {
            await cancelSubscription();
            Alert.alert("Success", "Your Pro subscription has been cancelled.");
          },
          style: "destructive",
        },
      ]
    );
  };

  const formatExpirationDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
          <View style={{ width: 60 }} />
        </View>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 40 }}>

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

            <Text style={{ color: "white", fontSize: 14, marginTop: 12, marginBottom: 8 }}>
              Activity Level
            </Text>
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => setActivityModalVisible(true)}
            >
              <Text style={styles.selectorButtonText}>
                {getActivityLabel(Number(profile.activity) || 1.2)}
              </Text>
              <Text style={{ color: "#60ffd0", fontSize: 18 }}>{">"}</Text>
            </TouchableOpacity>

            <Text style={{ color: "white", fontSize: 14, marginTop: 12, marginBottom: 8 }}>
              Occupation
            </Text>
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => setOccupationModalVisible(true)}
            >
              <Text style={styles.selectorButtonText}>
                {getOccupationLabel(Number(profile.activity) || 1.2)}
              </Text>
              <Text style={{ color: "#60ffd0", fontSize: 18 }}>{">"}</Text>
            </TouchableOpacity>

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
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 15 }}>
              <Text style={styles.header}>Wallpaper</Text>
              {!isPro && (
                <View
                  style={{
                    backgroundColor: "rgba(255, 100, 100, 0.3)",
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: "rgba(255, 100, 100, 0.5)",
                  }}
                >
                  <Text style={{ color: "rgba(255, 100, 100, 0.8)", fontSize: 10, fontWeight: "600" }}>
                    PRO
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity style={[styles.wallpaperButton, !isPro && { opacity: 0.5 }]} onPress={pickWallpaper} disabled={!isPro}>
              <Text style={styles.buttonText}>{isPro ? "📸" : "🔒"} {isPro ? "Choose Wallpaper" : "Upgrade to Pro"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.resetButton, !isPro && { opacity: 0.5 }]} onPress={resetWallpaper} disabled={!isPro}>
              <Text style={styles.resetButtonText}>Reset to Default</Text>
            </TouchableOpacity>
          </Glass>

          {isPro && (
            <Glass style={{ padding: 20, borderRadius: 25 }}>
              <Text style={styles.header}>Pro Subscription</Text>
              
              <View style={{ marginBottom: 15, gap: 8 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ color: "white", fontSize: 14 }}>Status</Text>
                  <View
                    style={{
                      backgroundColor: "rgba(96, 255, 208, 0.3)",
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: "#60ffd0",
                    }}
                  >
                    <Text style={{ color: "#60ffd0", fontSize: 12, fontWeight: "600" }}>
                      ✓ Active
                    </Text>
                  </View>
                </View>

                {expirationDate && (
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ color: "white", fontSize: 14 }}>Expires</Text>
                    <Text style={{ color: "#60ffd0", fontSize: 14, fontWeight: "600" }}>
                      {formatExpirationDate(expirationDate)}
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={{
                  padding: 12,
                  backgroundColor: "rgba(255, 100, 100, 0.2)",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "rgba(255, 100, 100, 0.4)",
                }}
                onPress={handleCancelSubscription}
              >
                <Text style={{ color: "rgba(255, 100, 100, 0.8)", textAlign: "center", fontSize: 16, fontWeight: "600" }}>
                  Cancel Subscription
                </Text>
              </TouchableOpacity>
            </Glass>
          )}

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

          <Modal visible={activityModalVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Activity Level</Text>
                <FlatList
                  scrollEnabled={false}
                  data={ACTIVITY_LEVELS}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.modalOption,
                        Number(profile.activity) === item.value &&
                          styles.modalOptionSelected,
                      ]}
                      onPress={() => {
                        setProfile({ ...profile, activity: String(item.value) });
                        setActivityModalVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          Number(profile.activity) === item.value &&
                            styles.modalOptionTextSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>

          <Modal visible={occupationModalVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Occupation</Text>
                <FlatList
                  scrollEnabled={false}
                  data={OCCUPATIONS}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.modalOption,
                        Number(profile.activity) === item.activityMultiplier &&
                          styles.modalOptionSelected,
                      ]}
                      onPress={() => {
                        setProfile({
                          ...profile,
                          activity: String(item.activityMultiplier),
                        });
                        setOccupationModalVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          Number(profile.activity) === item.activityMultiplier &&
                            styles.modalOptionTextSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    color: "#60ffd0",
    fontSize: 16,
    fontWeight: "600",
  },
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
  selectorButton: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 14,
    borderRadius: 12,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorButtonText: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1a1a2e",
    borderRadius: 20,
    padding: 20,
    width: "85%",
    maxHeight: "70%",
  },
  modalTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  modalOptionSelected: {
    backgroundColor: "rgba(96,255,208,0.3)",
    borderWidth: 2,
    borderColor: "#60ffd0",
  },
  modalOptionText: {
    color: "white",
    fontSize: 16,
  },
  modalOptionTextSelected: {
    color: "#60ffd0",
    fontWeight: "600",
  },
});
