import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const MobileToggle = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden m-2 hover:bg-transparent"
        >
          <Menu />
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
