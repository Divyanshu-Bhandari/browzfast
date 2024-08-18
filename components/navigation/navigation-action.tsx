"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Clock, Image, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CustomizeHomepageContent } from "@/components/modals/customize-homepage-content";
import { NavButton } from "./navigation-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const NavigationAction = () => {
  const [selectedOption, setSelectedOption] = useState<"background" | "clock">(
    "background"
  );

  const handleSelectChange = (value: string) => {
    setSelectedOption(value as "background" | "clock");
  };

  return (
    <div className="w-full space-y-4">
      <div className="w-full flex items-center justify-center pt-1 text-lg font-bold">
        Home Launch Pad
      </div>

      <div className="mt-6 space-y-2">
        <Dialog>
          <DialogTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center justify-start px-4 py-4 md:py-2.5 md:rounded-xl transition",
                "hover:bg-gray-200 dark:hover:bg-[#2d2b2b]"
              )}
            >
              <Settings className="mr-3 h-6" />
              <span className="text-base font-semibold md:text-sm">
                Customize Homepage
              </span>
            </button>
          </DialogTrigger>

          <DialogContent className="max-w-[44rem] h-[27rem] p-0 pb-3">
            <DialogHeader className="p-4 pb-0 md:mt-1 md:pl-6">
              <DialogTitle className="text-xl font-bold">
                Customize Homepage
              </DialogTitle>
            </DialogHeader>

            <Separator />

            <div className="flex flex-col md:flex-row">
              <div className="flex justify-center md:justify-normal flex-row md:flex-col md:space-y-3">
                <NavButton
                  isSelected={selectedOption === "background"}
                  onClick={() => setSelectedOption("background")}
                  icon={<Image className="mr-1" />}
                  label="Background Image"
                  ariaLabel="Customize Background Image"
                />

                <NavButton
                  isSelected={selectedOption === "clock"}
                  onClick={() => setSelectedOption("clock")}
                  icon={<Clock className="mr-1" />}
                  label="Clock"
                  ariaLabel="Customize Clock"
                />

                <div className="md:hidden flex items-center w-full max-w-[30rem] m-2 mb-4 px-3">
                  <Select onValueChange={handleSelectChange}>
                    <SelectTrigger className="w-full focus:ring-[#308d46]">
                      <SelectValue placeholder="Background Image" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="background">
                          Background Image
                        </SelectItem>
                        <SelectItem value="clock">Clock</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator
                className="hidden md:flex mx-6 h-[20rem] bg-transparent"
                orientation="vertical"
              />

              <div className="px-4 md:p-0 flex-1">
                <CustomizeHomepageContent selectedOption={selectedOption} />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
