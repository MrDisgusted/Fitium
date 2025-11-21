import { View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

export default function Glass({ children, style }) {
  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={40} style={StyleSheet.absoluteFill} />
      <View style={styles.content}>{children}</View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 2,
  },
});
