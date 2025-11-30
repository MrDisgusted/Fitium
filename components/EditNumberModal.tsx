import React from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import Glass from "./Glass";

export default function EditNumberModal({
  visible,
  value,
  label,
  onClose,
  onSave,
}) {
  const [input, setInput] = React.useState(String(value));

  React.useEffect(() => {
    setInput(String(value));
  }, [value]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.55)",
          justifyContent: "center",
          padding: 30,
        }}
      >
        <Glass style={{ padding: 20, borderRadius: 25 }}>
          <Text style={{ color: "white", fontSize: 20, marginBottom: 12 }}>
            Set {label}
          </Text>

          <TextInput
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: 12,
              color: "white",
              fontSize: 18,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.3)",
            }}
            keyboardType="numeric"
            value={input}
            onChangeText={setInput}
            autoFocus
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              style={{
                padding: 12,
                width: "45%",
                borderRadius: 12,
                backgroundColor: "rgba(255,255,255,0.15)",
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onSave(Number(input))}
              style={{
                padding: 12,
                width: "45%",
                borderRadius: 12,
                backgroundColor: "white",
              }}
            >
              <Text style={{ color: "black", textAlign: "center", fontWeight: "700" }}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </Glass>
      </View>
    </Modal>
  );
}
