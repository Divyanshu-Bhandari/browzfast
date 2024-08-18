"use client";

import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { UIProvider } from "@/context/UIContext";
import { BackgroundImageProvider } from "@/context/BackgroundImageContext";

import { ModeToggle } from "@/components/mode-toggle";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { Button } from "@/components/ui/button";
import HomePageContent from "@/components/homepage-content";
import { Menu } from "lucide-react";

const HomePageLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const savedPreferences = localStorage.getItem("uiPreferences");
    if (savedPreferences) {
      const { isSidebarOpen } = JSON.parse(savedPreferences);
      setIsSidebarOpen(isSidebarOpen ?? false);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const newPreferences = {
        ...JSON.parse(localStorage.getItem("uiPreferences") || "{}"),
        isSidebarOpen: !prev,
      };
      localStorage.setItem("uiPreferences", JSON.stringify(newPreferences));
      return !prev;
    });
  };

  return (
    <UIProvider>
      <BackgroundImageProvider>
        <HomePageContent>
          <div
            className={cn(
              "hidden md:flex fixed inset-y-0 left-0 z-30 flex-col transition-transform duration-300 ease-in-out",
              isSidebarOpen ? "translate-x-0 w-60" : "-translate-x-full"
            )}
          >
            <NavigationSidebar />
          </div>

          <main
            className={cn(
              "flex-1 transition-all duration-300 ease-in-out",
              isSidebarOpen ? "md:pl-72" : "md:pl-14"
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hidden md:flex fixed top-2 left-2 z-40 hover:bg-transparent"
            >
              <Menu />
            </Button>

            <div className="fixed top-3 right-3 z-40">
              <UserButton />
            </div>

            <div className="fixed top-2 right-12 z-40">
              <ModeToggle />
            </div>

            {children}
          </main>
        </HomePageContent>
      </BackgroundImageProvider>
    </UIProvider>
  );
};

export default HomePageLayout;
