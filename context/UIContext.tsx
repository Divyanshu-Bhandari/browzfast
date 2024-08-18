import React, { createContext, useContext, useState, useEffect } from "react";

interface UIContextProps {
  showClock: boolean;
  setShowClock: (show: boolean) => void;
  clockFormat: "12" | "24";
  setClockFormat: (format: "12" | "24") => void;
}

const UIContext = createContext<UIContextProps | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showClock, setShowClock] = useState(true);
  const [clockFormat, setClockFormat] = useState<"12" | "24">("12");

  return (
    <UIContext.Provider
      value={{ showClock, setShowClock, clockFormat, setClockFormat }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};
