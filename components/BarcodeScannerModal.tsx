import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
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

interface BarcodeScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onFoodScanned: (food: ScannedFood) => void;
}

export default function BarcodeScannerModal({
  visible,
  onClose,
  onFoodScanned,
}: BarcodeScannerModalProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [barcodeInput, setBarcodeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanMode, setScanMode] = useState<"input" | "camera">("input");
  const cameraRef = useRef<any>(null);

  const handleBarcodeSearch = async (barcode: string) => {
    if (!barcode.trim()) {
      Alert.alert("Error", "Please enter a barcode");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const json = await response.json();

      if (json.status === 1 && json.product) {
        const product = json.product;
        const nutrition = product.nutriments || {};

        let calories = 0;
        if (nutrition["energy-kcal"]) {
          calories = Math.round(nutrition["energy-kcal"]);
        } else if (nutrition["energy-kcal_100g"]) {
          calories = Math.round(nutrition["energy-kcal_100g"]);
        } else if (nutrition["energy_100g"]) {
          calories = Math.round(nutrition["energy_100g"] / 4.184);
        }

        const scannedFood: ScannedFood = {
          barcode: barcode,
          name: product.product_name || "Unknown Product",
          brand: product.brands,
          calories: calories || 0,
          protein: Math.round((nutrition.proteins_100g || 0) * 10) / 10,
          carbs: Math.round((nutrition.carbohydrates_100g || 0) * 10) / 10,
          fats: Math.round((nutrition.fat_100g || 0) * 10) / 10,
        };

        onFoodScanned(scannedFood);
        setBarcodeInput("");
        setScanMode("input");
        setLoading(false);
      } else {
        Alert.alert(
          "Product Not Found",
          "This barcode is not in our database. Try another.",
          [
            {
              text: "Try Again",
              onPress: () => setLoading(false),
            },
          ]
        );
        setLoading(false);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to look up the product. Check your internet connection.",
        [
          {
            text: "Try Again",
            onPress: () => setLoading(false),
          },
        ]
      );
      setLoading(false);
    }
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        setLoading(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: true,
        });

        await detectBarcodeFromImage(photo.uri);
      } catch (error) {
        Alert.alert("Error", "Failed to take picture. Try again.");
        setLoading(false);
      }
    }
  };

  const detectBarcodeFromImage = async (imageUri: string) => {
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "barcode.jpg",
      } as any);

      const response = await fetch("https://api.barcodepulse.com/scan", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data && data.code) {
        setBarcodeInput(data.code);
        setScanMode("input");
        await handleBarcodeSearch(data.code);
      } else {
        Alert.alert(
          "No Barcode Detected",
          "Could not detect a barcode in the image. Please try:\n• Better lighting\n• Closer to the barcode\n• Or enter manually",
          [
            {
              text: "Try Again",
              onPress: () => setLoading(false),
            },
            {
              text: "Enter Manually",
              onPress: () => {
                setScanMode("input");
                setLoading(false);
              },
            },
          ]
        );
        setLoading(false);
      }
    } catch (error) {
      Alert.alert(
        "Detection Error",
        "Could not process the image. Please enter the barcode manually.",
        [
          {
            text: "Enter Manually",
            onPress: () => {
              setScanMode("input");
              setLoading(false);
            },
          },
        ]
      );
      setLoading(false);
    }
  };

  if (scanMode === "camera") {
    if (!permission?.granted) {
      return (
        <Modal visible={visible} transparent animationType="slide">
          <View style={styles.overlay}>
            <Glass style={styles.permissionContainer}>
              <Text style={styles.permissionText}>
                Camera permission is required to scan barcodes.
              </Text>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={requestPermission}
              >
                <Text style={styles.buttonText}>Grant Permission</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelPermissionButton}
                onPress={() => setScanMode("input")}
              >
                <Text style={styles.cancelText}>Use Manual Entry</Text>
              </TouchableOpacity>
            </Glass>
          </View>
        </Modal>
      );
    }

    return (
      <Modal visible={visible} transparent animationType="slide">
        {loading ? (
          <View style={styles.loadingOverlay}>
            <Glass style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#60ffd0" />
              <Text style={styles.loadingText}>Detecting barcode...</Text>
            </Glass>
          </View>
        ) : (
          <>
            <CameraView style={styles.camera} ref={cameraRef}>
              <View style={styles.cameraOverlay}>
                <View style={styles.scanFrame} />
                <Text style={styles.scanText}>Position barcode in frame</Text>
              </View>
              <View style={styles.controlsContainer}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {
                    setScanMode("input");
                    setBarcodeInput("");
                  }}
                >
                  <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={handleTakePicture}
                >
                  <Text style={styles.captureText}>📷</Text>
                </TouchableOpacity>
              </View>
            </CameraView>
          </>
        )}
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {loading ? (
            <Glass style={styles.contentSection}>
              <ActivityIndicator size="large" color="#60ffd0" />
              <Text style={styles.loadingText}>Looking up product...</Text>
            </Glass>
          ) : (
            <>
              <Glass style={styles.contentSection}>
                <Text style={styles.title}>Scan Barcode</Text>

                <Text style={styles.label}>Barcode Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter barcode..."
                  placeholderTextColor="#999"
                  value={barcodeInput}
                  onChangeText={setBarcodeInput}
                  keyboardType="number-pad"
                />

                <Text style={styles.info}>
                  Enter the barcode or use your camera to scan it automatically.
                </Text>

                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={() => {
                    setScanMode("camera");
                    setBarcodeInput("");
                  }}
                >
                  <Text style={styles.cameraButtonText}>📷 Open Camera</Text>
                </TouchableOpacity>
              </Glass>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.searchButton,
                    !barcodeInput.trim() && styles.disabledButton,
                  ]}
                  onPress={() => handleBarcodeSearch(barcodeInput)}
                  disabled={!barcodeInput.trim()}
                >
                  <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
  label: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: "white",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    fontSize: 16,
  },
  info: {
    color: "#999",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  cameraButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "rgba(96, 255, 208, 0.2)",
    borderWidth: 1,
    borderColor: "#60ffd0",
  },
  cameraButtonText: {
    color: "#60ffd0",
    fontSize: 14,
    fontWeight: "600",
  },
  loadingText: {
    color: "white",
    fontSize: 16,
    marginTop: 12,
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
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  searchButton: {
    backgroundColor: "rgba(96, 255, 208, 0.2)",
    borderWidth: 1,
    borderColor: "#60ffd0",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  permissionContainer: {
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    gap: 20,
  },
  permissionText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  permissionButton: {
    backgroundColor: "rgba(96, 255, 208, 0.2)",
    borderWidth: 1,
    borderColor: "#60ffd0",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  cancelPermissionButton: {
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  cancelText: {
    color: "#999",
    fontSize: 14,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  scanFrame: {
    width: 300,
    height: 120,
    borderWidth: 3,
    borderColor: "#60ffd0",
    borderRadius: 15,
    backgroundColor: "transparent",
  },
  scanText: {
    color: "#60ffd0",
    fontSize: 14,
    marginTop: 20,
    textAlign: "center",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 30,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#60ffd0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  captureText: {
    fontSize: 32,
  },
  backButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "#60ffd0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  backButtonText: {
    color: "#60ffd0",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    gap: 15,
  },
});
