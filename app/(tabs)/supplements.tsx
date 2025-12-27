import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Glass from "../../components/Glass";
import SupplementItem from "../../components/SupplementItem";
import AddSupplementModal from "../../components/AddSupplementModal";
import SupplementProgress from "../../components/SupplementProgress";
import { useWallpaper } from "../../components/provider/WallpaperProvider";

export default function Supplements() {
  const [supplements, setSupplements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { wallpaper } = useWallpaper();

  const addSupplement = (s) => {
    setSupplements([...supplements, { ...s, takenToday: 0 }]);
    setShowModal(false);
  };

  const markTaken = (index) => {
    const updated = [...supplements];
    updated[index].takenToday += 1;
    setSupplements(updated);
  };

  const deleteSupplement = (index) => {
    setSupplements(supplements.filter((_, i) => i !== index));
  };

  return (
    <ImageBackground
      source={wallpaper}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <View style={{ flex: 1, padding: 20, gap: 20, backgroundColor: 'transparent' }}>
          <Text style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>
            Supplements
          </Text>

          <Glass style={{ padding: 20, borderRadius: 25 }}>
            <SupplementProgress supplements={supplements} />
          </Glass>

          <FlatList
            data={supplements}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item, index }) => (
              <SupplementItem
                item={item}
                onTake={() => markTaken(index)}
                onDelete={() => deleteSupplement(index)}
              />
            )}
            contentContainerStyle={{ gap: 12 }}
          />

          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={{
              position: "absolute",
              bottom: 25,
              right: 25,
              backgroundColor: "white",
              width: 60,
              height: 60,
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 32, color: "black" }}>+</Text>
          </TouchableOpacity>

          <AddSupplementModal
            visible={showModal}
            onClose={() => setShowModal(false)}
            onSave={addSupplement}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
