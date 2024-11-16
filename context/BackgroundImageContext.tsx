import React, { createContext, useContext, useState, useEffect } from "react";

interface BackgroundImageContextProps {
  backgroundImage: string | null;
  setBackgroundImage: (url: string | null) => void;
}

const BackgroundImageContext = createContext<
  BackgroundImageContextProps | undefined
>(undefined);

export const BackgroundImageProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    const storedImage = localStorage.getItem("backgroundImage");
    if (storedImage) {
      setBackgroundImage(storedImage);
    }
  }, []);

  return (
    <BackgroundImageContext.Provider
      value={{ backgroundImage, setBackgroundImage }}
    >
      {children}
    </BackgroundImageContext.Provider>
  );
};

export const useBackgroundImage = () => {
  const context = useContext(BackgroundImageContext);
  if (!context) {
    throw new Error(
      "useBackgroundImage must be used within a BackgroundImageProvider"
    );
  }
  return context;
};
