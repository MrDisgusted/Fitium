import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import Glass from "./Glass";

export default function GlassBar({ state, descriptors, navigation }) {
  return (
    <Glass style={styles.container}>
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const iconSource = descriptors[route.key].options.tabBarIcon();

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={styles.touch}
            >
              <View
                style={[
                  styles.iconWrapper,
                  isFocused && styles.iconFocused
                ]}
              >
                <Image
                  source={iconSource}
                  style={[
                    styles.icon,
                    { tintColor: isFocused ? "#5c3cff" : "#bbb" }
                  ]}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </Glass>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    marginHorizontal: 10,
    borderRadius: 40,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    alignItems: "center",
  },

  touch: {
    padding: 2,
  },

  iconWrapper: {
    width: 11,
    height: 11,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },

  iconFocused: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    borderRadius: 33,
  },

  icon: {
    width: 28,
    height: 28,
  },
});
