import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Glass from "./Glass";
import { usePro } from "./provider/ProProvider";

interface BarcodeScannerSectionProps {
  onOpenScanner: () => void;
}

export default function BarcodeScannerSection({
  onOpenScanner,
}: BarcodeScannerSectionProps) {
  const { isPro } = usePro();

  const handlePress = () => {
    if (!isPro) {
      Alert.alert(
        "Pro Feature",
        "Barcode scanner is a Pro feature. Upgrade to Pro to unlock it!",
        [{ text: "OK" }]
      );
      return;
    }
    onOpenScanner();
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Text style={styles.title}>Scan Food Barcode</Text>
        {!isPro && (
          <View
            style={{
              backgroundColor: "rgba(255, 100, 100, 0.3)",
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: "rgba(255, 100, 100, 0.5)",
            }}
          >
            <Text style={{ color: "rgba(255, 100, 100, 0.8)", fontSize: 10, fontWeight: "600" }}>
              PRO
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity onPress={handlePress} disabled={!isPro}>
        <Glass style={[styles.scanButton, !isPro && styles.disabledButton]}>
          <Text style={styles.scanIcon}>{isPro ? "📱" : "🔒"}</Text>
          <Text style={styles.scanText}>
            {isPro ? "Tap to Enter Barcode" : "Upgrade to Pro"}
          </Text>
          <Text style={styles.scanSubtext}>
            {isPro
              ? "Type or paste the barcode number from your food package"
              : "Unlock advanced barcode scanning with Pro"}
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
  disabledButton: {
    borderColor: "rgba(255, 100, 100, 0.3)",
    opacity: 0.6,
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
