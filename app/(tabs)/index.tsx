import { SafeAreaView } from "react-native-safe-area-context";
import { ImageBackground, View } from "react-native";
import Glass from "../../components/Glass";
import Calendar from "../../components/Calendar";

export default function Index() {
  return (
    <ImageBackground
      source={require("../../assets/wallpaper.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            paddingHorizontal: 20,
            paddingTop: 10,
          }}
        >
          <Glass style={{ padding: 20, borderRadius: 30 }}>
            <Calendar bubbleSize={50} dimOpacity={1} />
          </Glass>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
