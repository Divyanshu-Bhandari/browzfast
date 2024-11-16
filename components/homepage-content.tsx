"use client";

import { useBackgroundImage } from "@/context/BackgroundImageContext";

const HomePageContent = ({ children }: { children: React.ReactNode }) => {
  const { backgroundImage } = useBackgroundImage();

  return (
    <div
      style={{
        ...(backgroundImage && {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }),
      }}
      className="flex h-full min-h-screen"
    >
      {children}
    </div>
  );
};

export default HomePageContent;
