import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WallpaperContext = createContext(null);

export function WallpaperProvider({ children }) {
  const [wallpaper, setWallpaperState] = useState(
    require("../../assets/wallpaper.png")
  );
  const [wallpaperUri, setWallpaperUri] = useState<string | null>(null);

  // Load wallpaper from AsyncStorage on mount
  useEffect(() => {
    const loadWallpaper = async () => {
      try {
        const savedUri = await AsyncStorage.getItem("wallpaperUri");
        if (savedUri) {
          setWallpaperUri(savedUri);
          setWallpaperState({ uri: savedUri });
        }
      } catch (error) {
        console.error("Error loading wallpaper:", error);
      }
    };

    loadWallpaper();
  }, []);

  const setWallpaper = async (imageUri: string | null) => {
    try {
      if (imageUri) {
        // Save the URI to AsyncStorage
        await AsyncStorage.setItem("wallpaperUri", imageUri);
        setWallpaperUri(imageUri);
        setWallpaperState({ uri: imageUri });
      } else {
        // Reset to default
        await AsyncStorage.removeItem("wallpaperUri");
        setWallpaperUri(null);
        setWallpaperState(require("../../assets/wallpaper.png"));
      }
    } catch (error) {
      console.error("Error saving wallpaper:", error);
    }
  };

  return (
    <WallpaperContext.Provider value={{ wallpaper, setWallpaper, wallpaperUri }}>
      {children}
    </WallpaperContext.Provider>
  );
}

export function useWallpaper() {
  return useContext(WallpaperContext);
}
