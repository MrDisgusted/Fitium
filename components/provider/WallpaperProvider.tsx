import React, { createContext, useContext, useState } from "react";

const WallpaperContext = createContext(null);

export function WallpaperProvider({ children }) {
  const [wallpaper, setWallpaper] = useState(
    require("../assets/wallpaper.png")
  );

  return (
    <WallpaperContext.Provider value={{ wallpaper, setWallpaper }}>
      {children}
    </WallpaperContext.Provider>
  );
}

export function useWallpaper() {
  return useContext(WallpaperContext);
}
