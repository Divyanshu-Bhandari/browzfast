"use client";

import { useState } from "react";
import {
  Album,
  CircleHelp,
  Clock,
  CloudUpload,
  Download,
  Image as LucidImage,
  LucideBookmark,
  Settings,
  Shuffle,
  Star,
} from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { AllDialogContent } from "@/components/modals/all-dialog-content";
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
  const [selectedOptionCustomizeHomepage, setSelectedOptionCustomizeHomepage] =
    useState<"background" | "clock" | "reorderFavourite">("background");
  const [selectedOptionManageBookmark, setSelectedOptionManageBookmark] =
    useState<"upload" | "download">("upload");
  const [selectedOptionHowToUse, setSelectedOptionHowToUse] = useState<
    "set as default" | "manage bookmark"
  >("set as default");

  const handleSelectCustomizeHomepageChange = (value: string) => {
    setSelectedOptionCustomizeHomepage(
      value as "background" | "clock" | "reorderFavourite"
    );
  };
  const handleSelectManageBookmarkChange = (value: string) => {
    setSelectedOptionManageBookmark(value as "upload" | "download");
  };
  const handleSelectHowToUseChange = (value: string) => {
    setSelectedOptionHowToUse(value as "set as default" | "manage bookmark");
  };

  return (
    <div className="navigation-menu w-full">
      <button className="w-full mt-10 md:mb-1 flex items-center justify-start p-4 md:py-2.5 md:rounded-xl transition hover:bg-gray-200 dark:hover:bg-[#2d2b2b]">
      <Image
        src="/favicon.ico"
        alt="Logo"
        width={24}
        height={24}
        className="mr-3 h-6 rounded-full"
      />

        <span className="text-base font-semibold md:text-sm">BrowzFast</span>
      </button>

      <div className="md:space-y-1">
        <Dialog>
          <DialogTrigger asChild>
            <button className="manage-bookmark-button w-full flex items-center justify-start p-4 md:py-2.5 md:rounded-xl transition hover:bg-gray-200 dark:hover:bg-[#2d2b2b]">
              <LucideBookmark className="mr-3 h-6" />
              <span className="text-base font-semibold md:text-sm">
                Manage Bookmark
              </span>
            </button>
          </DialogTrigger>

          <DialogContent className="max-w-[44rem] h-[27rem] p-0 pb-3">
            <DialogHeader className="p-4 pb-0 md:mt-1 md:pl-6">
              <DialogTitle className="text-xl font-bold">
                Manage Bookmark
              </DialogTitle>
            </DialogHeader>

            <Separator />

            <div className="flex flex-col md:flex-row">
              <div className="min-w-44 flex justify-center md:justify-normal flex-row md:flex-col md:space-y-3">
                <NavButton
                  isSelected={selectedOptionManageBookmark === "upload"}
                  onClick={() => setSelectedOptionManageBookmark("upload")}
                  icon={<CloudUpload className="mr-1" />}
                  label="Upload"
                  ariaLabel="Upload bookmark"
                />

                <NavButton
                  isSelected={selectedOptionManageBookmark === "download"}
                  onClick={() => setSelectedOptionManageBookmark("download")}
                  icon={<Download className="mr-1" />}
                  label="Download"
                  ariaLabel="Download bookmark"
                />

                <div className="md:hidden flex items-center w-full max-w-[30rem] m-2 mb-4 px-3">
                  <Select onValueChange={handleSelectManageBookmarkChange}>
                    <SelectTrigger className="w-full focus:ring-[#308d46]">
                      <SelectValue placeholder="Upload" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="upload">Upload</SelectItem>
                        <SelectItem value="download">Download</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator
                className="hidden md:flex h-[20rem] bg-transparent"
                orientation="vertical"
              />

              <div className="px-4 md:p-0 flex-1">
                <AllDialogContent
                  selectedOption={selectedOptionManageBookmark}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <button className="customize-homepage-button w-full flex items-center justify-start p-4 md:py-2.5 md:rounded-xl transition hover:bg-gray-200 dark:hover:bg-[#2d2b2b]">
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
              <div className="min-w-44 flex justify-center md:justify-normal flex-row md:flex-col md:space-y-3">
                <NavButton
                  isSelected={selectedOptionCustomizeHomepage === "background"}
                  onClick={() =>
                    setSelectedOptionCustomizeHomepage("background")
                  }
                  icon={<LucidImage className="mr-1"/>}
                  label="Background Image"
                  ariaLabel="Customize Background Image"
                />

                <NavButton
                  isSelected={selectedOptionCustomizeHomepage === "clock"}
                  onClick={() => setSelectedOptionCustomizeHomepage("clock")}
                  icon={<Clock className="mr-1" />}
                  label="Clock"
                  ariaLabel="Customize Clock"
                />

                <NavButton
                  isSelected={
                    selectedOptionCustomizeHomepage === "reorderFavourite"
                  }
                  onClick={() =>
                    setSelectedOptionCustomizeHomepage("reorderFavourite")
                  }
                  icon={<Shuffle className="mr-1" />}
                  label="Reorder Favourite"
                  ariaLabel="Reorder favourite on homepage"
                />

                <div className="md:hidden flex items-center w-full max-w-[30rem] m-2 mb-4 px-3">
                  <Select onValueChange={handleSelectCustomizeHomepageChange}>
                    <SelectTrigger className="w-full focus:ring-[#308d46]">
                      <SelectValue placeholder="Background Image" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="background">
                          Background Image
                        </SelectItem>
                        <SelectItem value="clock">Clock</SelectItem>
                        <SelectItem value="reorderFavourite">
                          Reorder Favourite
                        </SelectItem>
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
                <AllDialogContent
                  selectedOption={selectedOptionCustomizeHomepage}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <button className="how-to-use-button w-full flex items-center justify-start p-4 md:py-2.5 md:rounded-xl transition hover:bg-gray-200 dark:hover:bg-[#2d2b2b]">
              <CircleHelp className="mr-3 h-6" />
              <span className="text-base font-semibold md:text-sm">
                How to use
              </span>
            </button>
          </DialogTrigger>

          <DialogContent className="max-w-[44rem] h-[27rem] p-0 pb-3">
            <DialogHeader className="p-4 pb-0 md:mt-1 md:pl-6">
              <DialogTitle className="text-xl font-bold">
                How to use
              </DialogTitle>
            </DialogHeader>

            <Separator />

            <div className="flex flex-col md:flex-row">
              <div className="flex justify-center md:justify-normal flex-row md:flex-col md:space-y-3">
                <NavButton
                  isSelected={selectedOptionHowToUse === "set as default"}
                  onClick={() => setSelectedOptionHowToUse("set as default")}
                  icon={<Star className="mr-1" />}
                  label="Set as default"
                  ariaLabel="Set as Default Homepage"
                />

                <NavButton
                  isSelected={selectedOptionHowToUse === "manage bookmark"}
                  onClick={() => setSelectedOptionHowToUse("manage bookmark")}
                  icon={<Album className="mr-1" />}
                  label="Manage Bookmark"
                  ariaLabel="Manage Bookmark"
                />

                <div className="md:hidden flex items-center w-full max-w-[30rem] m-2 mb-4 px-3">
                  <Select onValueChange={handleSelectHowToUseChange}>
                    <SelectTrigger className="w-full focus:ring-[#308d46]">
                      <SelectValue placeholder="Set as default" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="set as default">
                          Set as default
                        </SelectItem>
                        <SelectItem value="manage bookmark">
                          Manage Bookmark
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator
                className="hidden md:flex h-[20rem] bg-transparent"
                orientation="vertical"
              />

              <div className="px-4 md:p-0 flex-1">
                <AllDialogContent selectedOption={selectedOptionHowToUse} />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
