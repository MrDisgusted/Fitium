import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";
import Glass from "./Glass";
import { useNutrition } from "./provider/NutritionProvider";

interface ActivityTrackerModalProps {
  visible: boolean;
  onClose: () => void;
  onSaveActivity: (duration: number, caloriesBurned: number) => void;
}

export default function ActivityTrackerModal({
  visible,
  onClose,
  onSaveActivity,
}: ActivityTrackerModalProps) {
  const { userInfo } = useNutrition();
  const [speed, setSpeed] = useState("5"); 
  const [incline, setIncline] = useState("0"); 
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const calculateCalories = () => {
    const speedNum = parseFloat(speed) || 0;
    const inclineNum = parseFloat(incline) || 0;
    const durationMinutes = duration / 60;


    let bmr = 0;
    const weight = userInfo?.weight || 70;
    const height = userInfo?.height || 175;
    const age = userInfo?.age || 30;
    const gender = userInfo?.gender || "male";

    if (gender?.toLowerCase() === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    let met = 2.8;
    if (speedNum >= 3 && speedNum < 5) met = 3.5;
    else if (speedNum >= 5 && speedNum < 8) met = (3.5 + 6) / 2;
    else if (speedNum >= 8 && speedNum < 10) met = 6;
    else if (speedNum >= 10) met = 8;

    met += inclineNum * 0.25;

    const caloriesPerMinute = (bmr / 1440) * met;
    return Math.round(caloriesPerMinute * durationMinutes);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSave = () => {
    if (duration > 0) {
      onSaveActivity(duration, calculateCalories());
      setDuration(0);
      setIsRunning(false);
      setSpeed("5");
      setIncline("0");
      onClose();
    }
  };

  const handleReset = () => {
    setDuration(0);
    setIsRunning(false);
    setSpeed("5");
    setIncline("0");
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <BlurView intensity={90} style={styles.blurContainer}>
        <View style={styles.overlay}>
          <View style={styles.content}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              <Text style={styles.title}>Activity Tracker</Text>

              <Glass style={styles.settingsSection}>
                <View style={styles.settingRow}>
                  <Text style={styles.label}>Speed (km/h)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="5"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={speed}
                    onChangeText={setSpeed}
                    keyboardType="decimal-pad"
                    editable={!isRunning}
                  />
                </View>

                <View style={styles.settingRow}>
                  <Text style={styles.label}>Incline (%)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={incline}
                    onChangeText={setIncline}
                    keyboardType="decimal-pad"
                    editable={!isRunning}
                  />
                </View>
              </Glass>

              <Glass style={styles.timerSection}>
                <Text style={styles.timerDisplay}>{formatTime(duration)}</Text>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[
                      styles.controlButton,
                      isRunning ? styles.stopButton : styles.startButton,
                    ]}
                    onPress={() => setIsRunning(!isRunning)}
                  >
                    <Text style={styles.controlButtonText}>
                      {isRunning ? "Stop" : "Start"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.controlButton, styles.resetButton]}
                    onPress={handleReset}
                  >
                    <Text style={styles.controlButtonText}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </Glass>

            </ScrollView>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.actionButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.saveButton,
                  duration === 0 && styles.disabledButton,
                ]}
                onPress={handleSave}
                disabled={duration === 0}
              >
                <Text style={[styles.actionButtonText, { color: "black", fontWeight: "700" }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    flex: 1,
    justifyContent: "flex-end",
  },
  content: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 20,
    maxHeight: "90%",
    backgroundColor: "rgba(20, 20, 40, 0.95)",
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  settingsSection: {
    padding: 16,
    borderRadius: 20,
    gap: 12,
  },
  timerSection: {
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  label: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(96, 255, 208, 0.15)",
    color: "#60ffd0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "rgba(96, 255, 208, 0.3)",
  },
  timerDisplay: {
    color: "#60ffd0",
    fontSize: 52,
    fontWeight: "bold",
    marginVertical: 20,
    letterSpacing: 2,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  controlButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  startButton: {
    backgroundColor: "rgba(96, 255, 208, 0.2)",
    borderColor: "#60ffd0",
  },
  stopButton: {
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    borderColor: "rgba(255, 107, 107, 0.5)",
  },
  resetButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  controlButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  cancelButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.2)",
  },
  saveButton: {
    backgroundColor: "#60ffd0",
    borderColor: "#60ffd0",
  },
  disabledButton: {
    opacity: 0.4,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
