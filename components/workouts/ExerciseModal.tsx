import React, { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Glass from "../Glass";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { name: string; weight: number; reps: number; sets: number; weeklyIncrease: number }) => void;
  initial?: any | null;
};

export default function ExerciseModal({ visible, onClose, onSave, initial }: Props) {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");
  const [increase, setIncrease] = useState("");

  useEffect(() => {
    if (initial) {
      setName(initial.name || "");
      setWeight(String(initial.weight || ""));
      setReps(String(initial.reps || ""));
      setSets(String(initial.sets || ""));
      setIncrease(String(initial.weeklyIncrease || ""));
    } else {
      setName("");
      setWeight("");
      setReps("");
      setSets("");
      setIncrease("");
    }
  }, [initial, visible]);

  const handleSave = () => {
    onSave({
      name: name.trim() || "Exercise",
      weight: Number(weight) || 0,
      reps: Number(reps) || 0,
      sets: Number(sets) || 0,
      weeklyIncrease: Number(increase) || 0,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Glass style={styles.card}>
          <Text style={styles.title}>{initial ? "Edit Exercise" : "Add Exercise"}</Text>

          <TextInput
            placeholder="Exercise name"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Weight (kg)"
            placeholderTextColor="#aaa"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Reps"
            placeholderTextColor="#aaa"
            value={reps}
            onChangeText={setReps}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Sets"
            placeholderTextColor="#aaa"
            value={sets}
            onChangeText={setSets}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Weekly increase (kg)"
            placeholderTextColor="#aaa"
            value={increase}
            onChangeText={setIncrease}
            keyboardType="numeric"
            style={styles.input}
          />

          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </Glass>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    padding: 20,
    borderRadius: 24,
  },
  title: { color: "white", fontSize: 20, fontWeight: "600", marginBottom: 12 },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 10,
    color: "white",
    fontSize: 16,
    marginTop: 6,
  },
  saveBtn: {
    marginTop: 16,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: "white",
    alignItems: "center",
  },
  saveText: { color: "black", fontSize: 16, fontWeight: "600" },
  cancelBtn: { marginTop: 8, alignItems: "center" },
  cancelText: { color: "rgba(255,255,255,0.7)", fontSize: 14 },
});
