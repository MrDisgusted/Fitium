import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import Glass from "./Glass";
import { Ingredient, commonIngredients } from "../constants/ingredients";
import { useMeal, Meal, MealIngredient } from "./provider/MealProvider";

interface MealBuilderModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (meal: Meal) => void;
}

export default function MealBuilderModal({
  visible,
  onClose,
  onSave,
}: MealBuilderModalProps) {
  const { customIngredients, addCustomIngredient } = useMeal();
  const [mealName, setMealName] = useState("");
  const [mealDescription, setMealDescription] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<
    MealIngredient[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customIngredientName, setCustomIngredientName] = useState("");
  const [customServingSize, setCustomServingSize] = useState("");
  const [customCalories, setCustomCalories] = useState("");
  const [customProtein, setCustomProtein] = useState("");
  const [customCarbs, setCustomCarbs] = useState("");
  const [customFats, setCustomFats] = useState("");
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);
  const [selectedIngredientForQuantity, setSelectedIngredientForQuantity] = useState<Ingredient | null>(null);
  const [quantityInput, setQuantityInput] = useState("");

  const allIngredients = [...commonIngredients, ...customIngredients];
  const filteredIngredients = allIngredients.filter((ing) =>
    ing.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateMacros = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    selectedIngredients.forEach((ing: any) => {
      totalCalories += ing.calories * ing.quantity;
      totalProtein += ing.protein * ing.quantity;
      totalCarbs += ing.carbs * ing.quantity;
      totalFats += ing.fats * ing.quantity;
    });

    return {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein * 10) / 10,
      carbs: Math.round(totalCarbs * 10) / 10,
      fats: Math.round(totalFats * 10) / 10,
    };
  };

  const handleAddIngredient = (ingredient: Ingredient) => {
    setSelectedIngredientForQuantity(ingredient);
    setQuantityInput("");
    setQuantityModalVisible(true);
  };

  const handleConfirmQuantity = () => {
    if (selectedIngredientForQuantity && quantityInput) {
      const gramsAmount = parseFloat(quantityInput);
      if (!isNaN(gramsAmount) && gramsAmount > 0) {
        // Calculate the quantity as a multiplier of the serving size
        // For example, if serving size is 100g and user wants 126g, quantity should be 1.26
        const servingSizeNum = parseFloat(selectedIngredientForQuantity.servingSize);
        const quantity = servingSizeNum > 0 ? gramsAmount / servingSizeNum : 1;

        const existing = selectedIngredients.find((i: any) => i.id === selectedIngredientForQuantity.id);
        if (existing) {
          setSelectedIngredients(
            selectedIngredients.map((i: any) =>
              i.id === selectedIngredientForQuantity.id ? { ...i, quantity: i.quantity + quantity } : i
            )
          );
        } else {
          setSelectedIngredients([...selectedIngredients, { ...selectedIngredientForQuantity, quantity }]);
        }
      }
      setQuantityModalVisible(false);
      setSelectedIngredientForQuantity(null);
      setQuantityInput("");
    }
  };

  const handleRemoveIngredient = (ingredientId: string) => {
    setSelectedIngredients(
      selectedIngredients.filter((i: any) => i.id !== ingredientId)
    );
  };

  const handleAddCustomIngredient = () => {
    if (
      customIngredientName &&
      customServingSize &&
      customCalories &&
      customProtein &&
      customCarbs &&
      customFats
    ) {
      const newIngredient: Ingredient = {
        id: `custom-${Date.now()}`,
        name: customIngredientName,
        servingSize: customServingSize,
        calories: parseFloat(customCalories),
        protein: parseFloat(customProtein),
        carbs: parseFloat(customCarbs),
        fats: parseFloat(customFats),
      };
      addCustomIngredient(newIngredient);
      setCustomIngredientName("");
      setCustomServingSize("");
      setCustomCalories("");
      setCustomProtein("");
      setCustomCarbs("");
      setCustomFats("");
      setShowCustomForm(false);
    }
  };

  const handleSaveMeal = () => {
    if (mealName && selectedIngredients.length > 0) {
      const macros = calculateMacros();
      const newMeal: Meal = {
        id: `meal-${Date.now()}`,
        name: mealName,
        description: mealDescription,
        ingredients: selectedIngredients,
        calories: macros.calories,
        protein: macros.protein,
        carbs: macros.carbs,
        fats: macros.fats,
        isCustom: true,
      };
      onSave(newMeal);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setMealName("");
    setMealDescription("");
    setSelectedIngredients([]);
    setSearchQuery("");
  };

  const macros = calculateMacros();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Create Meal</Text>

            {/* Meal Info */}
            <Glass style={styles.section}>
              <Text style={styles.label}>Meal Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Grilled Chicken Pasta"
                placeholderTextColor="#999"
                value={mealName}
                onChangeText={setMealName}
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.input}
                placeholder="Optional description"
                placeholderTextColor="#999"
                value={mealDescription}
                onChangeText={setMealDescription}
              />
            </Glass>

            {/* Macros Summary */}
            {selectedIngredients.length > 0 && (
              <Glass style={styles.section}>
                <Text style={styles.macroTitle}>Macro Summary</Text>
                <View style={styles.macrosGrid}>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroValue}>{macros.calories}</Text>
                    <Text style={styles.macroLabel}>Calories</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroValue}>{macros.protein}g</Text>
                    <Text style={styles.macroLabel}>Protein</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroValue}>{macros.carbs}g</Text>
                    <Text style={styles.macroLabel}>Carbs</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroValue}>{macros.fats}g</Text>
                    <Text style={styles.macroLabel}>Fats</Text>
                  </View>
                </View>
              </Glass>
            )}

            {/* Selected Ingredients */}
            {selectedIngredients.length > 0 && (
              <Glass style={styles.section}>
                <Text style={styles.label}>Selected Ingredients</Text>
                <FlatList
                  scrollEnabled={false}
                  data={selectedIngredients}
                  keyExtractor={(item: any) => item.id}
                  renderItem={({ item }: { item: any }) => {
                    const servingSizeNum = parseFloat(item.servingSize);
                    const totalGrams = Math.round(item.quantity * servingSizeNum);
                    return (
                      <View style={styles.ingredientItem}>
                        <View>
                          <Text style={styles.ingredientName}>
                            {item.name}
                          </Text>
                          <Text style={styles.ingredientServing}>
                            {totalGrams}g
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleRemoveIngredient(item.id)}
                        >
                          <Text style={styles.removeBtn}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
              </Glass>
            )}

            {/* Add Ingredients */}
            <Glass style={styles.section}>
              <Text style={styles.label}>Add Ingredients</Text>

              <TextInput
                style={styles.searchInput}
                placeholder="Search ingredients..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />

              <FlatList
                scrollEnabled={false}
                data={filteredIngredients}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.ingredientOption}
                    onPress={() => handleAddIngredient(item)}
                  >
                    <View>
                      <Text style={styles.ingredientName}>{item.name}</Text>
                      <Text style={styles.ingredientMacro}>
                        {item.calories} cal • {item.protein}g P • {item.carbs}g C • {item.fats}g F
                      </Text>
                    </View>
                    <Text style={styles.addBtn}>+</Text>
                  </TouchableOpacity>
                )}
              />

              <TouchableOpacity
                style={styles.customButton}
                onPress={() => setShowCustomForm(!showCustomForm)}
              >
                <Text style={styles.customButtonText}>+ Add Custom Ingredient</Text>
              </TouchableOpacity>
            </Glass>

            {/* Custom Ingredient Form */}
            {showCustomForm && (
              <Glass style={styles.section}>
                <Text style={styles.label}>Custom Ingredient</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ingredient name"
                  placeholderTextColor="#999"
                  value={customIngredientName}
                  onChangeText={setCustomIngredientName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Serving size (e.g., 100g)"
                  placeholderTextColor="#999"
                  value={customServingSize}
                  onChangeText={setCustomServingSize}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Calories"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                  value={customCalories}
                  onChangeText={setCustomCalories}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Protein (g)"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                  value={customProtein}
                  onChangeText={setCustomProtein}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Carbs (g)"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                  value={customCarbs}
                  onChangeText={setCustomCarbs}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Fats (g)"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                  value={customFats}
                  onChangeText={setCustomFats}
                />
                <TouchableOpacity
                  style={styles.customButton}
                  onPress={handleAddCustomIngredient}
                >
                  <Text style={styles.customButtonText}>Add Ingredient</Text>
                </TouchableOpacity>
              </Glass>
            )}

            {/* Action Buttons */}
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
                  styles.saveButton,
                  !mealName || selectedIngredients.length === 0
                    ? styles.disabledButton
                    : {},
                ]}
                onPress={handleSaveMeal}
                disabled={!mealName || selectedIngredients.length === 0}
              >
                <Text style={styles.buttonText}>Save Meal</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Quantity Input Modal */}
      <Modal visible={quantityModalVisible} transparent animationType="fade">
        <View style={styles.quantityOverlay}>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityTitle}>
              How many grams of {selectedIngredientForQuantity?.name}?
            </Text>
            <TextInput
              style={styles.quantityInput}
              placeholder="e.g., 126"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
              value={quantityInput}
              onChangeText={setQuantityInput}
              autoFocus
            />
            <View style={styles.quantityButtonContainer}>
              <TouchableOpacity
                style={[styles.quantityButton, styles.cancelButton]}
                onPress={() => {
                  setQuantityModalVisible(false);
                  setSelectedIngredientForQuantity(null);
                  setQuantityInput("");
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quantityButton, styles.saveButton]}
                onPress={handleConfirmQuantity}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    maxHeight: "90%",
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 15,
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
  },
  searchInput: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: "white",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  macroTitle: {
    color: "white",
    fontSize: 16,
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
  ingredientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  ingredientName: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  ingredientServing: {
    color: "#999",
    fontSize: 12,
    marginTop: 4,
  },
  removeBtn: {
    color: "#ff6b6b",
    fontSize: 12,
    fontWeight: "600",
  },
  ingredientOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  ingredientMacro: {
    color: "#999",
    fontSize: 11,
    marginTop: 4,
  },
  addBtn: {
    color: "#60ffd0",
    fontSize: 20,
    fontWeight: "bold",
  },
  customButton: {
    backgroundColor: "rgba(96, 255, 208, 0.2)",
    borderWidth: 1,
    borderColor: "#60ffd0",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  customButtonText: {
    color: "#60ffd0",
    fontSize: 14,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  saveButton: {
    backgroundColor: "#60ffd0",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  quantityOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityContainer: {
    backgroundColor: "#1a1a2e",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  quantityTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  quantityInput: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: "white",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    fontSize: 16,
    width: "100%",
    textAlign: "center",
  },
  quantityButtonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  quantityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});
