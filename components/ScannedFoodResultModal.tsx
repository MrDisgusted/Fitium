import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import Glass from "./Glass";

interface ScannedFood {
  barcode: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface ScannedFoodResultModalProps {
  visible: boolean;
  food: ScannedFood | null;
  onConsume: (food: ScannedFood) => void;
  onDiscard: () => void;
}

export default function ScannedFoodResultModal({
  visible,
  food,
  onConsume,
  onDiscard,
}: ScannedFoodResultModalProps) {
  if (!food) return null;

  const handleConsume = () => {
    onConsume(food);
    Alert.alert("Success", `${food.name} added to your daily intake!`);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Glass style={styles.contentSection}>
            <Text style={styles.title}>Product Scanned</Text>

            <View style={styles.productInfo}>
              <Text style={styles.productName}>{food.name}</Text>
              {food.brand && (
                <Text style={styles.productBrand}>Brand: {food.brand}</Text>
              )}
              <Text style={styles.barcode}>Barcode: {food.barcode}</Text>
            </View>

            <Glass style={styles.macrosSection}>
              <Text style={styles.macrosTitle}>Nutrition (per serving)</Text>
              <View style={styles.macrosGrid}>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{food.calories}</Text>
                  <Text style={styles.macroLabel}>Calories</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{food.protein}g</Text>
                  <Text style={styles.macroLabel}>Protein</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{food.carbs}g</Text>
                  <Text style={styles.macroLabel}>Carbs</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{food.fats}g</Text>
                  <Text style={styles.macroLabel}>Fats</Text>
                </View>
              </View>
            </Glass>
          </Glass>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.discardButton]}
              onPress={onDiscard}
            >
              <Text style={styles.buttonText}>Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.consumeButton]}
              onPress={handleConsume}
            >
              <Text style={styles.buttonText}>Consume</Text>
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
    gap: 20,
  },
  contentSection: {
    padding: 15,
    borderRadius: 15,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  productInfo: {
    marginBottom: 15,
  },
  productName: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  productBrand: {
    color: "#999",
    fontSize: 14,
    marginBottom: 8,
  },
  barcode: {
    color: "#666",
    fontSize: 12,
    fontFamily: "monospace",
  },
  macrosSection: {
    padding: 12,
    marginTop: 10,
    borderRadius: 12,
  },
  macrosTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  macrosGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  macroItem: {
    alignItems: "center",
  },
  macroValue: {
    color: "#60ffd0",
    fontSize: 18,
    fontWeight: "bold",
  },
  macroLabel: {
    color: "#999",
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  discardButton: {
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    borderWidth: 1,
    borderColor: "#ff6b6b",
  },
  consumeButton: {
    backgroundColor: "rgba(96, 255, 208, 0.2)",
    borderWidth: 1,
    borderColor: "#60ffd0",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
