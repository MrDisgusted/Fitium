import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
  TextInput,
  Image,
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

// Simple barcode detection using pattern matching
const detectBarcodeFromImage = async (base64Image: string): Promise<string | null> => {
  // This is a placeholder - in production you'd use a real barcode detection library
  // For now, we'll use QuaggaJS or similar via a web service
  try {
    // You can integrate with a barcode detection API like QuaggaJS or use a cloud service
    // For this implementation, we'll use a simple approach with a web service
    const formData = new FormData();
    formData.append("file", {
      uri: base64Image,
      type: "image/jpeg",
      name: "barcode.jpg",
    } as any);

    // This would connect to a barcode detection service
    // For now, return null to indicate barcode couldn't be detected
    return null;
  } catch (error) {
    return null;
  }
};

export default function BarcodeScannerModal({
  visible,
  onClose,
  onFoodScanned,
}: BarcodeScannerModalProps) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [barcodeInput, setBarcodeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanMode, setScanMode] = useState<"input" | "camera" | "upload">("input");
  const [cameraScanned, setCameraScanned] = useState(false);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (visible && scanMode === "camera" && !cameraPermission?.granted) {
      requestCameraPermission();
    }
  }, [visible, scanMode, cameraPermission]);

  const handleBarcodeSearch = async (barcode: string) => {
    if (!barcode.trim()) {
      Alert.alert("Error", "Please enter or scan a barcode");
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
          "This barcode is not in our database. Please try another.",
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
        "Failed to look up the product. Please check your internet connection.",
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

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setLoading(true);
        // For image-based barcode detection, you would process the image here
        // This is a limitation of the current approach - we'll prompt user to enter code
        Alert.alert(
          "Barcode Detection",
          "Please enter the barcode number manually or use the camera scanner.",
          [{ text: "OK", onPress: () => setLoading(false) }]
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setLoading(true);
        // For camera-based barcode detection, you would process the image here
        Alert.alert(
          "Barcode Detection",
          "Please enter the barcode number manually or try scanning again.",
          [{ text: "OK", onPress: () => {
            setLoading(false);
            setCameraScanned(false);
          }}]
        );
      } catch (error) {
        Alert.alert("Error", "Failed to take picture");
        setLoading(false);
      }
    }
  };

  if (visible && scanMode === "camera") {
    if (!cameraPermission?.granted) {
      return (
        <Modal visible={visible} transparent animationType="slide">
          <View style={styles.overlay}>
            <Glass style={styles.permissionContainer}>
              <Text style={styles.permissionText}>
                Camera permission is required to scan barcodes.
              </Text>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={requestCameraPermission}
              >
                <Text style={styles.buttonText}>Grant Permission</Text>
              </TouchableOpacity>
            </Glass>
          </View>
        </Modal>
      );
    }

    return (
      <Modal visible={visible} transparent animationType="slide">
        <CameraView style={styles.camera} ref={cameraRef}>
          <View style={styles.scannerOverlay}>
            <View style={styles.scanFrame} />
            <Text style={styles.scanText}>Position barcode in frame</Text>
          </View>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleTakePicture}
          >
            <Text style={styles.captureText}>Capture</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setScanMode("input")}
          >
            <Text style={styles.closeButtonText}>Back</Text>
          </TouchableOpacity>
        </CameraView>
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
                <Text style={styles.title}>Scan Food Barcode</Text>

                {scanMode === "input" ? (
                  <>
                    <Text style={styles.label}>Barcode Number</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter or scan barcode..."
                      placeholderTextColor="#999"
                      value={barcodeInput}
                      onChangeText={setBarcodeInput}
                      keyboardType="number-pad"
                    />

                    <Text style={styles.info}>
                      You can manually type a barcode, use your camera to scan, or upload an image.
                    </Text>

                    <View style={styles.modeButtonsContainer}>
                      <TouchableOpacity
                        style={styles.modeButton}
                        onPress={() => setScanMode("camera")}
                      >
                        <Text style={styles.modeButtonText}>📷 Camera</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.modeButton}
                        onPress={handlePickImage}
                      >
                        <Text style={styles.modeButtonText}>🖼️ Upload</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : null}
              </Glass>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.searchButton]}
                  onPress={() => handleBarcodeSearch(barcodeInput)}
                  disabled={!barcodeInput.trim()}
                >
                  <Text style={styles.buttonText}>Search Product</Text>
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
    marginTop: 8,
    marginBottom: 15,
  },
  modeButtonsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "rgba(96, 255, 208, 0.2)",
    borderWidth: 1,
    borderColor: "#60ffd0",
    alignItems: "center",
  },
  modeButtonText: {
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 280,
    height: 150,
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
  captureButton: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#60ffd0",
    justifyContent: "center",
    alignItems: "center",
  },
  captureText: {
    color: "#1a1a2e",
    fontSize: 12,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "#60ffd0",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#60ffd0",
    fontSize: 16,
    fontWeight: "600",
  },
});
