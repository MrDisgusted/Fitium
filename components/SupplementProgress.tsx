import { View, Text } from "react-native";

export default function SupplementProgress({ supplements }) {
  const total = supplements.reduce((sum, s) => sum + s.timesPerDay, 0);
  const taken = supplements.reduce((sum, s) => sum + s.takenToday, 0);
  const percent = total === 0 ? 0 : taken / total;

  return (
    <View>
      <Text style={{ color: "white", fontSize: 18, marginBottom: 10 }}>
        Daily Supplements
      </Text>

      <View
        style={{
          height: 14,
          backgroundColor: "rgba(255,255,255,0.2)",
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${percent * 100}%`,
            backgroundColor: "white",
          }}
        />
      </View>

      <Text
        style={{
          color: "white",
          fontSize: 22,
          fontWeight: "bold",
          marginTop: 8,
        }}
      >
        {Math.round(percent * 100)}%
        
      </Text>
    </View>
  );
}
