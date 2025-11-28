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
                    { tintColor: isFocused ? "#ffffff" : "#999" }
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
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 40,
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
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
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 33,
    paddingLeft: 39,
    paddingRight: 39,
    padding: 23,
    margin: -10,
  },

  icon: {
    width: 30,
    height: 30,
  },
});
