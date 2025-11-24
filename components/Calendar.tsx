import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";

type Props = {
  daysToShow?: number;
  className?: string;
  bubbleSize?: number;
  dimOpacity?: number;
};

export default function Calendar({
  daysToShow = 5,
  bubbleSize = 26,
  dimOpacity = 0.6,
}: Props) {
  const today = new Date();

  const days = Array.from({ length: daysToShow }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - 3 + i);
    return {
      key: d.toISOString().split("T")[0],
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      dayNum: d.getDate(),
    };
  });

  const monthName = today.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <View style={styles.container}>
      <Text style={styles.month}>{monthName}</Text>

      <View style={{ flexDirection: "row" }}>
        {days.map((d) => (
          <View
            key={d.key}
            style={[styles.dayContainer, { opacity: dimOpacity }]}
          >
            <Text style={styles.dayName}>{d.dayName}</Text>

            <View
              style={[
                styles.bubble,
                {
                  width: bubbleSize,
                  height: bubbleSize,
                },
              ]}
            >
              <Text style={styles.bubbleText}>{d.dayNum}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 4,
  },
  month: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dayContainer: {
    alignItems: "center",
    marginHorizontal: 5,
  },
  dayName: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 15,
  },
  bubble: {
    marginTop: 2,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
  },
  bubbleText: {
    color: "rgba(255,255,255,0.7)",
    fontWeight: "bold",
    fontSize: 18,
  },
});
