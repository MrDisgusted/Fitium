import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, Image, TouchableOpacity, Text, ImageBackground } from "react-native";
import { Link } from "expo-router";
import Glass from "../../components/Glass";
import Calendar from "../../components/Calendar";
import MacroBar from "../../components/MacroBar";
import HydrationBar from "../../components/HydrationBar";
import DailyCalories from "../../components/DailyCalories";
import CalorieBank from "../../components/CalorieBank";
import { useNutrition } from "../../components/provider/NutritionProvider";
import { usePro } from "../../components/provider/ProProvider";
import { useCalorieBank } from "../../components/provider/CalorieBankProvider";
import { useWallpaper } from "../../components/provider/WallpaperProvider";
import ProBenefitsModal from "../../components/ProBenefitsModal";
import SubscriptionModal from "../../components/SubscriptionModal";
import { useState } from "react";

export default function Index() {
  const { macros, setMacros, calories, macroGoals, hydration, hydrationGoal } = useNutrition();
  const { isPro, setPro, isCalorieBankEnabled } = usePro();
  const { calorieBank, currentWeight, weightGoal } = useCalorieBank();
  const { wallpaper } = useWallpaper();
  const [showBenefits, setShowBenefits] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);

  const handleSubscribe = (months: number) => {
    setPro(months);
  };

  return (
    <ImageBackground
      source={wallpaper}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <ScrollView
            style={{
              flex: 1,
              paddingHorizontal: 20,
              paddingTop: 10,
              backgroundColor: 'transparent',
            }}
            contentContainerStyle={{ gap: 20, backgroundColor: 'transparent' }}
          >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            {!isPro && (
              <TouchableOpacity
                onPress={() => setShowBenefits(true)}
                style={{
                  backgroundColor: "rgba(96, 255, 208, 0.2)",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#60ffd0",
                }}
              >
                <Text style={{ color: "#60ffd0", fontSize: 12, fontWeight: "600" }}>
                  Upgrade to Pro
                </Text>
              </TouchableOpacity>
            )}
            {isPro && (
              <View
                style={{
                  backgroundColor: "rgba(96, 255, 208, 0.2)",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#60ffd0",
                }}
              >
                <Text style={{ color: "#60ffd0", fontSize: 12, fontWeight: "600" }}>
                  ✓ Pro Member
                </Text>
              </View>
            )}
            <Link href="/profile" asChild>
              <TouchableOpacity>
                <Image
                  source={require("../../assets/profile.png")}
                  style={{ width: 36, height: 36, borderRadius: 99 }}
                />
              </TouchableOpacity>
            </Link>
          </View>

          <Glass style={{ padding: 10, borderRadius: 30 }}>
            <Calendar bubbleSize={50} dimOpacity={1} />
          </Glass>

          <Glass style={{ padding: 7, borderRadius: 30 }}>
            <View style={{ marginTop: 10 }}>
              <MacroBar
                label="Carbs"
                value={macros.carbs}
                goal={macroGoals.carbs}
                color="#60ffd0"
              />
              <MacroBar
                label="Protein"
                value={macros.protein}
                goal={macroGoals.protein}
                color="#2483ff"
              />
              <MacroBar
                label="Fats"
                value={macros.fats}
                goal={macroGoals.fats}
                color="#24b2ff"
              />
            </View>
          </Glass>

          <Glass style={{ padding: 7, borderRadius: 30 }}>
            {isCalorieBankEnabled ? (
              <CalorieBank calorieBank={calorieBank} weightGoal={weightGoal} currentWeight={currentWeight} />
            ) : (
              <DailyCalories calories={calories} />
            )}
          </Glass>

          <Glass style={{ padding: 7, borderRadius: 30 }}>
            <HydrationBar value={hydration} goal={hydrationGoal} />
          </Glass>

          <ProBenefitsModal
            visible={showBenefits}
            onClose={() => setShowBenefits(false)}
            onApply={() => {
              setShowBenefits(false);
              setTimeout(() => setShowSubscription(true), 200);
            }}
          />

          <SubscriptionModal
            visible={showSubscription}
            onClose={() => {
              setShowSubscription(false);
              setShowBenefits(false);
            }}
            onSubscribe={handleSubscribe}
          />
        </ScrollView>
        </SafeAreaView>
      </ImageBackground>
  );
}
