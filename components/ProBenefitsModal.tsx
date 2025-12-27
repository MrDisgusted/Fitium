import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Glass from "./Glass";

interface ProBenefitsModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
}

export default function ProBenefitsModal({
  visible,
  onClose,
  onApply,
}: ProBenefitsModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={[styles.overlay, { paddingBottom: insets.bottom }]}>
        <View style={styles.container}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
            <Text style={styles.title}>Upgrade to Pro</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: "#999", fontSize: 24 }}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} scrollEventThrottle={16}>

            <Glass style={styles.benefit}>
              <View style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
                <Text style={styles.benefitIcon}>📊</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitTitle}>Calorie Debt Tracking</Text>
                  <Text style={styles.benefitDesc}>
                    Advanced calorie tracking that shows your weekly calorie deficit/surplus for more accurate results
                  </Text>
                </View>
              </View>
            </Glass>

            <Glass style={styles.benefit}>
              <View style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
                <Text style={styles.benefitIcon}>🎨</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitTitle}>Custom Wallpapers</Text>
                  <Text style={styles.benefitDesc}>
                    Change the app wallpaper to personalize your fitness experience
                  </Text>
                </View>
              </View>
            </Glass>

            <Glass style={styles.benefit}>
              <View style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
                <Text style={styles.benefitIcon}>📱</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitTitle}>Barcode Scanner</Text>
                  <Text style={styles.benefitDesc}>
                    Scan product barcodes instantly to log nutrition data with auto-detected product information
                  </Text>
                </View>
              </View>
            </Glass>

            <Text style={styles.pricing}>
              Starting at just $4.99/month
            </Text>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={onApply}>
              <Text style={styles.applyText}>Get Pro</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#1a1a2e",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    minHeight: "60%",
    maxHeight: "85%",
    gap: 15,
  },
  scrollContent: {
    gap: 15,
    paddingBottom: 10,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  benefit: {
    padding: 16,
    borderRadius: 15,
  },
  benefitIcon: {
    fontSize: 28,
    marginTop: 2,
  },
  benefitTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  benefitDesc: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    lineHeight: 18,
  },
  pricing: {
    color: "#60ffd0",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "rgba(96, 255, 208, 0.2)",
    borderWidth: 1,
    borderColor: "#60ffd0",
    alignItems: "center",
    justifyContent: "center",
  },
  applyText: {
    color: "#60ffd0",
    fontSize: 16,
    fontWeight: "600",
  },
});
