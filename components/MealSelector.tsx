import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import Glass from "./Glass";
import { Meal } from "./provider/MealProvider";

interface MealSelectorProps {
  meals: Meal[];
  onSelectMeal: (meal: Meal) => void;
  onDeleteMeal: (mealId: string) => void;
  onCreateNew: () => void;
}

export default function MealSelector({
  meals,
  onSelectMeal,
  onDeleteMeal,
  onCreateNew,
}: MealSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meals</Text>

      {meals.length === 0 ? (
        <Glass style={styles.emptyState}>
          <Text style={styles.emptyText}>No meals yet. Create your first meal!</Text>
        </Glass>
      ) : (
        <FlatList
          scrollEnabled={false}
          data={meals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.mealCard}
              onPress={() => onSelectMeal(item)}
            >
              <Glass style={styles.cardContent}>
                <View style={styles.mealInfo}>
                  <Text style={styles.mealName}>{item.name}</Text>
                  {item.description && (
                    <Text style={styles.mealDescription}>{item.description}</Text>
                  )}
                  <View style={styles.macrosRow}>
                    <View style={styles.macroItem}>
                      <Text style={styles.macroValue}>{item.calories}</Text>
                      <Text style={styles.macroLabel}>cal</Text>
                    </View>
                    <View style={styles.macroItem}>
                      <Text style={styles.macroValue}>{item.protein}g</Text>
                      <Text style={styles.macroLabel}>P</Text>
                    </View>
                    <View style={styles.macroItem}>
                      <Text style={styles.macroValue}>{item.carbs}g</Text>
                      <Text style={styles.macroLabel}>C</Text>
                    </View>
                    <View style={styles.macroItem}>
                      <Text style={styles.macroValue}>{item.fats}g</Text>
                      <Text style={styles.macroLabel}>F</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => onDeleteMeal(item.id)}
                >
                  <Text style={styles.deleteBtnText}>✕</Text>
                </TouchableOpacity>
              </Glass>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={styles.createButton} onPress={onCreateNew}>
        <Text style={styles.createButtonText}>+ Create New Meal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  emptyState: {
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60,
  },
  emptyText: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
  },
  mealCard: {
    marginBottom: 10,
  },
  cardContent: {
    padding: 12,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  mealDescription: {
    color: "#999",
    fontSize: 12,
    marginTop: 4,
  },
  macrosRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  macroItem: {
    alignItems: "center",
  },
  macroValue: {
    color: "#60ffd0",
    fontSize: 12,
    fontWeight: "bold",
  },
  macroLabel: {
    color: "#999",
    fontSize: 10,
    marginTop: 2,
  },
  deleteBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtnText: {
    color: "#ff6b6b",
    fontSize: 18,
    fontWeight: "bold",
  },
  createButton: {
    backgroundColor: "rgba(96, 255, 208, 0.2)",
    borderWidth: 1,
    borderColor: "#60ffd0",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
  },
  createButtonText: {
    color: "#60ffd0",
    fontSize: 16,
    fontWeight: "600",
  },
});
