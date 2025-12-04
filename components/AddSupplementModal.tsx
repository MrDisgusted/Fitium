import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import Glass from "./Glass";

export default function AddSupplementModal({ visible, onClose, onSave }) {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [timesPerDay, setTimesPerDay] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [times, setTimes] = useState([]);

  useEffect(() => {
    if (!visible) {
      setName("");
      setDosage("");
      setTimesPerDay("");
      setTimes([]);
      setTimeInput("");
    }
  }, [visible]);

  const addTime = () => {
    if (timeInput.trim().length > 0) {
      setTimes([...times, timeInput]);
      setTimeInput("");
    }
  };

  const save = () => {
    onSave({
      name,
      dosageMg: Number(dosage),
      timesPerDay: Number(timesPerDay),
      schedule: times,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.55)",
          justifyContent: "center",
          padding: 30,
        }}
      >
        <Glass style={{ padding: 20, borderRadius: 25 }}>
          <Text style={{ color: "white", fontSize: 22, marginBottom: 14 }}>
            Add Supplement
          </Text>

          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="rgba(255,255,255,0.5)"
            style={styles.input}
          />

          <TextInput
            placeholder="Dosage (mg)"
            value={dosage}
            onChangeText={setDosage}
            placeholderTextColor="rgba(255,255,255,0.5)"
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            placeholder="Times per day"
            value={timesPerDay}
            onChangeText={setTimesPerDay}
            placeholderTextColor="rgba(255,255,255,0.5)"
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            placeholder="Add time (HH:MM)"
            value={timeInput}
            onChangeText={setTimeInput}
            placeholderTextColor="rgba(255,255,255,0.5)"
            style={styles.input}
          />

          <TouchableOpacity
            onPress={addTime}
            style={{
              padding: 10,
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>Add Time</Text>
          </TouchableOpacity>

          <View style={{ marginBottom: 10 }}>
            {times.map((t, i) => (
              <Text key={i} style={{ color: "white", fontSize: 16 }}>
                {t}
              </Text>
            ))}
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <TouchableOpacity style={[styles.cancel, { width: "45%" }]} onPress={onClose}>
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.save, { width: "45%" }]} onPress={save}>
              <Text>Save</Text>
            </TouchableOpacity>
          </View>
        </Glass>
      </View>
    </Modal>
  );
}

const styles = {
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 12,
    color: "white",
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  cancel: {
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
  },
  cancelText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  save: {
    padding: 12,
    backgroundColor: "white",
    borderRadius: 12,
  },
  saveText: {
    color: "black",
    fontWeight: "800",
    textAlign: "center",
    fontSize: 16,
  },
};
