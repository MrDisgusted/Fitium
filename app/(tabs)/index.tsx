import { SafeAreaView } from "react-native-safe-area-context";
import { ImageBackground, View, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import Glass from "../../components/Glass";
import Calendar from "../../components/Calendar";
import MacroBar from "../../components/MacroBar";
import DailyCalories from "../../components/DailyCalories";
import { useNutrition } from "../../components/provider/NutritionProvider";

export default function Index() {
  const { macros, setMacros, calories } = useNutrition();

  return (
    <ImageBackground
      source={require("../../assets/wallpaper.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 10,
            gap: 20,
          }}
        >
          <View style={{ alignItems: "flex-end" }}>
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

          <Glass style={{ padding: 10, borderRadius: 30 }}>
            <View style={{ marginTop: 20 }}>
              <MacroBar
                label="Carbs"
                value={macros.carbs}
                goal={200}
                color="#60ffd0"
              />
              <MacroBar
                label="Protein"
                value={macros.protein}
                goal={180}
                color="#2483ff"
              />
              <MacroBar
                label="Fats"
                value={macros.fats}
                goal={70}
                color="#24b2ff"
              />
            </View>
          </Glass>

          <Glass style={{ padding: 10, borderRadius: 30 }}>
            <DailyCalories calories={calories} />
          </Glass>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
