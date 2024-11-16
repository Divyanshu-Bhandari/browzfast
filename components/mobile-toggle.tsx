"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";

export const MobileToggle = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSheetOpen = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleMediaChange = () => {
      if (mediaQuery.matches) {
        setIsOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden m-2 hover:bg-transparent"
        >
          <Menu onClick={handleSheetOpen} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 max-w-full h-full p-0 flex gap-0"
      >
        <NavigationSidebar />
      </SheetContent>
    </Sheet>
  );
};
