import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Glass from "../components/Glass";

export default function Profile() {
  const [profile, setProfile] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    occupation: "",
    illnesses: "",
    allergies: "",
  });

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("profile");
      if (saved) setProfile(JSON.parse(saved));
    })();
  }, []);

  const updateField = (key: string, value: string) => {
    setProfile({ ...profile, [key]: value });
  };

  const saveProfile = async () => {
    await AsyncStorage.setItem("profile", JSON.stringify(profile));
  };

  return (
    <ImageBackground
        source={require("../assets/wallpaper.png")}
        style={{ flex: 1 }}
        resizeMode="cover"
    >
        <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
        >
            <Text
            style={{
                color: "white",
                fontSize: 32,
                fontWeight: "bold",
                marginBottom: 20,
            }}
            >
            Profile
            </Text>
            <ProfileInputGlass
            label="Age"
            value={profile.age}
            placeholder="Enter age"
            onChange={(v) => updateField("age", v)}
            />

            <ProfileInputGlass
            label="Gender"
            value={profile.gender}
            placeholder="Male / Female"
            onChange={(v) => updateField("gender", v)}
            />

            <ProfileInputGlass
            label="Weight (kg)"
            value={profile.weight}
            placeholder="Enter weight"
            onChange={(v) => updateField("weight", v)}
            />

            <ProfileInputGlass
            label="Height (cm)"
            value={profile.height}
            placeholder="Enter height"
            onChange={(v) => updateField("height", v)}
            />

            <ProfileInputGlass
            label="Occupation"
            value={profile.occupation}
            placeholder="Your job"
            onChange={(v) => updateField("occupation", v)}
            />

            <ProfileInputGlass
            label="Illnesses"
            value={profile.illnesses}
            placeholder="List illnesses"
            onChange={(v) => updateField("illnesses", v)}
            multiline
            />

            <ProfileInputGlass
            label="Allergies"
            value={profile.allergies}
            placeholder="List allergies"
            onChange={(v) => updateField("allergies", v)}
            multiline
            />

            <TouchableOpacity
            onPress={saveProfile}
            style={{
                marginTop: 20,
                backgroundColor: "rgba(255,255,255,0.2)",
                padding: 15,
                borderRadius: 15,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.3)",
            }}
            >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
                Save Profile
            </Text>
            </TouchableOpacity>
        </ScrollView>
        </SafeAreaView>
    </ImageBackground>
  );
}

function ProfileInputGlass({
  label,
  value,
  placeholder,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <Glass style={{ padding: 15, marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={[styles.input, multiline ? styles.textArea : null]}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={value}
        onChangeText={onChange}
        multiline={multiline}
      />
    </Glass>
  );
}


const styles = {
  label: {
    color: "white",
    fontSize: 16,
    marginBottom: 6,
  },

  input: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    color: "white",
    fontSize: 16,
  },

  textArea: {
    height: 90,
    textAlignVertical: "top" as any,
  } as any,
};
