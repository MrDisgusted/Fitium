import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WallpaperContext = createContext(null);

export function WallpaperProvider({ children }) {
  const defaultWallpaper = require("../../assets/wallpaper.png");
  const [wallpaper, setWallpaperState] = useState<any>(defaultWallpaper);

  useEffect(() => {
    const loadWallpaper = async () => {
      try {
        const savedUri = await AsyncStorage.getItem("wallpaperUri");
        if (savedUri) {
          setWallpaperState({ uri: savedUri });
        } else {
          setWallpaperState(defaultWallpaper);
        }
      } catch (error) {
        console.error("Error loading wallpaper:", error);
        setWallpaperState(defaultWallpaper);
      }
    };

    loadWallpaper();
  }, []);

  const setWallpaper = async (imageUri: string | null) => {
    try {
      if (imageUri) {
        await AsyncStorage.setItem("wallpaperUri", imageUri);
        setWallpaperState({ uri: imageUri });
      } else {
        await AsyncStorage.removeItem("wallpaperUri");
        setWallpaperState(defaultWallpaper);
      }
    } catch (error) {
      console.error("Error saving wallpaper:", error);
    }
  };

  return (
    <WallpaperContext.Provider value={{ wallpaper, setWallpaper }}>
      {children}
    </WallpaperContext.Provider>
  );
}

export function useWallpaper() {
  return useContext(WallpaperContext);
}
