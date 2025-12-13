import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Glass from "./Glass";

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe: (months: number) => void;
}

export default function SubscriptionModal({
  visible,
  onClose,
  onSubscribe,
}: SubscriptionModalProps) {
  const [step, setStep] = useState<"months" | "payment">("months");
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset form when modal becomes visible
  useEffect(() => {
    if (visible) {
      setStep("months");
      setSelectedMonths(1);
      setCardName("");
      setCardNumber("");
      setExpiry("");
      setCvv("");
      setLoading(false);
    }
  }, [visible]);

  const monthOptions = [
    { months: 1, price: 4.99 },
    { months: 3, price: 13.99 },
    { months: 6, price: 24.99 },
    { months: 12, price: 44.99 },
  ];

  const handleContinue = () => {
    if (!selectedMonths) {
      Alert.alert("Error", "Please select a subscription plan");
      return;
    }
    setStep("payment");
  };

  const validateCardInfo = () => {
    if (!cardName.trim()) {
      Alert.alert("Error", "Please enter cardholder name");
      return false;
    }
    if (!cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) {
      Alert.alert("Error", "Please enter a valid 16-digit card number");
      return false;
    }
    if (!expiry.match(/^\d{2}\/\d{2}$/)) {
      Alert.alert("Error", "Please enter expiry in MM/YY format");
      return false;
    }
    if (!cvv.match(/^\d{3,4}$/)) {
      Alert.alert("Error", "Please enter a valid CVV");
      return false;
    }
    return true;
  };

  const handleSubscribe = async () => {
    if (!validateCardInfo()) {
      return;
    }

    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      // In a real app, you would send card details to a payment processor here
      // For now, we're making it free, so just complete the subscription
      console.log("Payment processed:", {
        cardName,
        cardNumber: cardNumber.slice(-4),
        expiry,
        months: selectedMonths,
      });

      Alert.alert("Success!", `You're now Pro for ${selectedMonths} month(s)!`, [
        {
          text: "OK",
          onPress: () => {
            setLoading(false);
            resetForm();
            onSubscribe(selectedMonths);
            onClose();
          },
        },
      ]);
    }, 1500);
  };

  const resetForm = () => {
    setStep("months");
    setSelectedMonths(1);
    setCardName("");
    setCardNumber("");
    setExpiry("");
    setCvv("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, "");
    const formatted = cleaned.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      setExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`);
    } else {
      setExpiry(cleaned);
    }
  };

  if (step === "months") {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={styles.title}>Choose Your Plan</Text>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 10, paddingBottom: 10 }} scrollEventThrottle={16}>
              {monthOptions.map((option) => (
                <TouchableOpacity
                  key={option.months}
                  onPress={() => setSelectedMonths(option.months)}
                  style={{
                    marginBottom: 10,
                  }}
                >
                  <Glass
                    style={{
                      padding: 16,
                      borderRadius: 15,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderWidth: selectedMonths === option.months ? 2 : 0,
                      borderColor: selectedMonths === option.months ? "#60ffd0" : undefined,
                    }}
                  >
                    <View>
                      <Text style={styles.planName}>
                        {option.months} Month{option.months > 1 ? "s" : ""}
                      </Text>
                      <Text style={styles.planPrice}>${option.price}</Text>
                    </View>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: selectedMonths === option.months ? "#60ffd0" : "rgba(255,255,255,0.3)",
                        backgroundColor: selectedMonths === option.months ? "#60ffd0" : "transparent",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {selectedMonths === option.months && (
                        <Text style={{ color: "#1a1a2e", fontWeight: "bold" }}>✓</Text>
                      )}
                    </View>
                  </Glass>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                <Text style={styles.continueText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  // Payment screen
  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <Text style={styles.title}>Payment Details</Text>
              <TouchableOpacity onPress={handleClose}>
                <Text style={{ color: "#999", fontSize: 24 }}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}>
              {selectedMonths} Month{selectedMonths > 1 ? "s" : ""} - $
              {monthOptions.find((o) => o.months === selectedMonths)?.price || "0"}
            </Text>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 10 }} scrollEventThrottle={16}>
              <Glass style={styles.formSection}>
              <Text style={styles.label}>Cardholder Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={cardName}
                onChangeText={setCardName}
              />

              <Text style={styles.label}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={cardNumber}
                onChangeText={formatCardNumber}
                keyboardType="numeric"
                maxLength={19}
              />

              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Expiry</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={expiry}
                    onChangeText={formatExpiry}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>
            </Glass>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setStep("months")}
              disabled={loading}
            >
              <Text style={styles.cancelText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.subscribeButton, loading && styles.loadingButton]}
              onPress={handleSubscribe}
              disabled={loading}
            >
              <Text style={styles.subscribeText}>
                {loading ? "Processing..." : "Subscribe"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </KeyboardAvoidingView>
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
    minHeight: "65%",
    maxHeight: "90%",
    gap: 15,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  formSection: {
    padding: 16,
    borderRadius: 15,
    gap: 15,
  },
  label: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "white",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    fontSize: 14,
  },
  planName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  planPrice: {
    color: "#60ffd0",
    fontSize: 18,
    fontWeight: "bold",
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
  continueButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "rgba(96, 255, 208, 0.2)",
    borderWidth: 1,
    borderColor: "#60ffd0",
    alignItems: "center",
    justifyContent: "center",
  },
  continueText: {
    color: "#60ffd0",
    fontSize: 16,
    fontWeight: "600",
  },
  subscribeButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "rgba(96, 255, 208, 0.2)",
    borderWidth: 1,
    borderColor: "#60ffd0",
    alignItems: "center",
    justifyContent: "center",
  },
  subscribeText: {
    color: "#60ffd0",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingButton: {
    opacity: 0.6,
  },
});
