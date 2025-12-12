import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Glass from "./Glass";

interface BarcodeScannerSectionProps {
  onOpenScanner: () => void;
}

export default function BarcodeScannerSection({
  onOpenScanner,
}: BarcodeScannerSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Food Barcode</Text>

      <TouchableOpacity onPress={onOpenScanner}>
        <Glass style={styles.scanButton}>
          <Text style={styles.scanIcon}>📱</Text>
          <Text style={styles.scanText}>Tap to Scan Barcode</Text>
          <Text style={styles.scanSubtext}>
            Instantly get nutrition info for any packaged food
          </Text>
        </Glass>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    gap: 10,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  scanButton: {
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    gap: 10,
    borderWidth: 2,
    borderColor: "rgba(96, 255, 208, 0.3)",
  },
  scanIcon: {
    fontSize: 40,
  },
  scanText: {
    color: "#60ffd0",
    fontSize: 16,
    fontWeight: "600",
  },
  scanSubtext: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
});
