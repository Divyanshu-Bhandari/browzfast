"use client";

import { useBackgroundImage } from "@/context/BackgroundImageContext";

const HomePageContent = ({ children }: { children: React.ReactNode }) => {
  const { backgroundImage } = useBackgroundImage();

  return (
    <div
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="flex h-full min-h-screen"
    >
      {children}
    </div>
  );
};

export default HomePageContent;
