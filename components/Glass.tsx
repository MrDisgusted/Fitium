import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { BlurView } from "expo-blur";
import React from "react";

type GlassProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
};

export default function Glass({ children, style, className }: GlassProps) {
  return (
    <View style={[styles.container, style]} className={className}>
      <BlurView intensity={40} style={StyleSheet.absoluteFill} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 2,
  },
});
