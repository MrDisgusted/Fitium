import { View, Text, TouchableOpacity } from "react-native";
import Glass from "./Glass";

export default function SupplementItem({ item, onTake, onDelete }) {
  return (
    <Glass style={{ padding: 15, borderRadius: 15 }}>
      <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
        {item.name}
      </Text>

      <Text style={{ color: "white", opacity: 0.7 }}>
        {item.dosageMg} mg × {item.timesPerDay} / day
      </Text>

      <Text style={{ color: "white", opacity: 0.7 }}>
        Taken: {item.takenToday}/{item.timesPerDay}
      </Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
        <TouchableOpacity
          onPress={onTake}
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: "white",
            borderRadius: 10,
            marginRight: 8,
          }}
        >
          <Text style={{ textAlign: "center", fontWeight: "800" }}>Take</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDelete}
          style={{
            width: 50,
            backgroundColor: "rgba(255,0,0,0.75)",
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 20, fontWeight: "900" }}>✕</Text>
        </TouchableOpacity>
      </View>
    </Glass>
  );
}
