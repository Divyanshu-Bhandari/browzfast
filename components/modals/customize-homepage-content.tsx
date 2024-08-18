import { useEffect, useState } from "react";
import { useUI } from "@/context/UIContext";
import { useBackgroundImage } from "@/context/BackgroundImageContext";

import { FileUpload } from "@/components/file-upload";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomizeHomepageContentProps {
  selectedOption: string;
}

export const CustomizeHomepageContent = ({
  selectedOption,
}: CustomizeHomepageContentProps) => {
  const { backgroundImage, setBackgroundImage } = useBackgroundImage();
  const { showClock, setShowClock, clockFormat, setClockFormat } = useUI();
  const [showImages, setShowImages] = useState(false);

  useEffect(() => {
    const uiPreferences = JSON.parse(
      localStorage.getItem("uiPreferences") || "{}"
    );
    const image = localStorage.getItem("backgroundImage");

    if (uiPreferences.isClockHidden) {
      setShowClock(false);
    }

    if (uiPreferences.clockFormat) {
      setClockFormat(uiPreferences.clockFormat);
    }

    if (image) {
      setShowImages(true);
    }
  }, []);

  const fixedImages = Array.from(
    { length: 18 },
    (_, index) => `/images/${index + 1}.jpg`
  );

  const handleImageSwitchChange = () => {
    setShowImages((prev) => !prev);
    setBackgroundImage(null);
    localStorage.removeItem("backgroundImage");
  };

  const handleClockSwitchChange = (newValue: boolean) => {
    setShowClock(newValue);

    const newPreferences = {
      ...JSON.parse(localStorage.getItem("uiPreferences") || "{}"),
      isClockHidden: !newValue,
    };
    localStorage.setItem("uiPreferences", JSON.stringify(newPreferences));
  };

  const handleClockFormatChange = (value: "12" | "24") => {
    setClockFormat(value);

    const newPreferences = {
      ...JSON.parse(localStorage.getItem("uiPreferences") || "{}"),
      clockFormat: value,
    };
    localStorage.setItem("uiPreferences", JSON.stringify(newPreferences));
  };

  const handleBackgroundImage = (url: string) => {
    localStorage.setItem("backgroundImage", url);
    setBackgroundImage(url);
  };

  switch (selectedOption) {
    case "background":
      return (
        <div className="w-full flex flex-col items-center space-y-2 h-[18rem] md:h-auto">
          <div className="w-full max-w-[29rem] px-1 flex justify-between items-center md:pr-5">
            <Label>Show Background Images</Label>
            <Switch
              checked={showImages}
              onCheckedChange={handleImageSwitchChange}
            />
          </div>
          {showImages && (
            <div className="max-h-64 md:max-h-72 w-full grid grid-cols-1 place-items-center gap-2 md:grid-cols-2 overflow-y-auto p-1">
              <FileUpload
                backgroundImage={backgroundImage}
                setBackgroundImage={setBackgroundImage}
              />
              {fixedImages.map((url, index) => (
                <div
                  key={index}
                  className="cursor-pointer"
                  onClick={() => handleBackgroundImage(url)}
                >
                  <img
                    src={url}
                    alt={`Fixed ${index + 1}`}
                    className="w-[326px] h-[230px] md:w-full md:h-[140px] rounded-md shadow-sm object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      );
    case "clock":
      return (
        <div className="h-[18rem] w-full flex flex-col items-center space-y-2 md:h-auto">
          <div className="w-full max-w-[29rem] px-1 flex justify-between items-center md:pr-5">
            <Label>Show Clock</Label>
            <Switch
              checked={showClock}
              onCheckedChange={handleClockSwitchChange}
            />
          </div>

          {showClock && (
            <div className="w-full max-w-[29rem] pt-3 px-1 flex flex-row items-center justify-between md:pr-5">
              <Label>Format</Label>
              <Select
                onValueChange={handleClockFormatChange}
                value={clockFormat}
              >
                <SelectTrigger className="w-56 md:w-64 focus:ring-[#308d46]">
                  <SelectValue placeholder="Select Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="12">12-hour</SelectItem>
                    <SelectItem value="24">24-hour</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      );
    default:
      return null;
  }
};
