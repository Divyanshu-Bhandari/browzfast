import React, { createContext, useContext, useState } from "react";

interface UIContextProps {
  showClock: boolean;
  setShowClock: (show: boolean) => void;
  clockFormat: "12" | "24";
  setClockFormat: (format: "12" | "24") => void;
  webSiteUrl: string;
  setWebSiteUrl: (url: string) => void;
  favourites: { title: string; url: string; order: number }[];
  setFavourites: React.Dispatch<
    React.SetStateAction<{ title: string; url: string; order: number }[]>
  >;
}

const UIContext = createContext<UIContextProps | null>(null);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showClock, setShowClock] = useState(true);
  const [webSiteUrl, setWebSiteUrl] = useState("https://browzfast.netlify.app");
  const [clockFormat, setClockFormat] = useState<"12" | "24">("12");
  const [favourites, setFavourites] = useState<
    { title: string; url: string; order: number }[]
  >([]);

  return (
    <UIContext.Provider
      value={{
        showClock,
        setShowClock,
        clockFormat,
        setClockFormat,
        webSiteUrl,
        setWebSiteUrl,
        favourites,
        setFavourites,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextProps => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};
