import { useEffect, useState } from "react";
import { useUI } from "@/context/UIContext";
import { useBackgroundImage } from "@/context/BackgroundImageContext";
import axios from "axios";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { FileUpload } from "@/components/file-upload";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UploadDropzone } from "@/lib/uploadthing";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface AllDialogContentProps {
  selectedOption: string;
}

export const AllDialogContent = ({ selectedOption }: AllDialogContentProps) => {
  const { backgroundImage, setBackgroundImage } = useBackgroundImage();
  const {
    showClock,
    setShowClock,
    clockFormat,
    setClockFormat,
    webSiteUrl,
    favourites,
    setFavourites,
  } = useUI();
  const [showImages, setShowImages] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState(
    "Download Bookmark File"
  );
  const [deleteStatus, setDeleteStatus] = useState("Delete Bookmark File");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

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

  const Spinner = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
  );

  const CopyHomePageButton = () => (
    <div className="flex justify-center">
      <div className="w-72 md:w-96 flex items-center justify-between border rounded-md bg-gray-100">
        <span className="ml-2 text-blue-700 truncate">{webSiteUrl}/home</span>
        <button
          className="w-20 p-3 text-sm text-white rounded-r bg-green-500 transition-all duration-300"
          onClick={() => {
            handleCopyFunction();
            navigator.clipboard.writeText(`${webSiteUrl}/home`);
          }}
        >
          {isCopied ? <>Copied</> : <>Copy</>}
        </button>
      </div>
    </div>
  );

  const ChromeStoreButton = () => (
    <div className="flex justify-center">
      <div className="w-72 md:w-96 flex items-center justify-between border rounded-md bg-gray-100 dark:bg-gray-700">
        <p className="ml-2 text-blue-700 dark:text-blue-400 truncate">
          https://chromewebstore.google.com/detail/custom-new-tab-url/mmjbdbjnoablegbkcklggeknkfcjkjia
        </p>
        <a
          className="p-3 text-sm text-white rounded-r bg-green-500 dark:bg-green-600 transition-all duration-300"
          href="https://chromewebstore.google.com/detail/custom-new-tab-url/mmjbdbjnoablegbkcklggeknkfcjkjia"
          target="_blank"
        >
          Visit
        </a>
      </div>
    </div>
  );

  const handleCopyFunction = () => {
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

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

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const { data: fileData } = await axios.get("/api/bookmark");

      if (fileData?.fileKey) {
        const fileUrl = `https://utfs.io/f/${fileData.fileKey}`;

        const fileResponse = await axios.get(fileUrl, {
          responseType: "blob",
        });

        const blob = fileResponse.data;
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = "bookmark-file.html";
        downloadLink.click();
        URL.revokeObjectURL(downloadLink.href);
        downloadLink.remove();

        setDownloadStatus("Download Successful");
        setTimeout(() => setDownloadStatus("Download Bookmark File"), 2000);
      } else {
        toast({
          title: "Download Failed",
          description: "No bookmarks file found. Please upload one first.",
          variant: "destructive",
        });
        setDownloadStatus("Download Bookmark File");
      }
    } catch (error) {
      console.error("Error downloading bookmark file:", error);
      toast({
        title: "Something Went Wrong",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
      setDownloadStatus("Download Bookmark File");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete("/api/bookmark");

      if (response.status === 200 || response.status === 204) {
        toast({
          title: "Deleted Successfully",
          description: "Deleted the bookmark file successfully.",
        });
        setDeleteStatus("Deleted Successfully");
      } else {
        toast({
          title: "Delete Failed",
          description: "Failed to delete the bookmark file. Please try again.",
          variant: "destructive",
        });
        setDeleteStatus("Delete Bookmark File");
      }

      setTimeout(() => setDeleteStatus("Delete Bookmark File"), 2000);
    } catch (error) {
      toast({
        title: "Something Went Wrong",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
      setDeleteStatus("Delete Bookmark File");
    } finally {
      setIsDeleting(false);
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = favourites.findIndex((fav) => fav.url === active.id);
      const newIndex = favourites.findIndex((fav) => fav.url === over.id);

      const updatedFavourites = arrayMove(favourites, oldIndex, newIndex);

      setFavourites(
        updatedFavourites.map((fav, index) => ({ ...fav, order: index }))
      );

      try {
        const response = await axios.put("/api/favouritesReorder", {
          updatedFavourites: updatedFavourites.map((fav, index) => ({
            url: fav.url,
            order: index,
          })),
        });

        if (!(response.status === 200 || response.status === 204)) {
          toast({
            title: "Reorder Failed",
            description:
              "Failed to Reorder the favourite sites. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Something Went Wrong",
          description: "An unexpected error occurred. Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  const SortableItem = ({
    id,
    fav,
  }: {
    id: string;
    fav: { title: string; url: string; order?: number };
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="p-3 md:p-4 border rounded-lg shadow-md bg-gradient-to-r from-white to-[#56f87b] dark:from-[#2d2b2b] dark:to-[#56f87b] flex items-center justify-between space-x-4 cursor-grab hover:shadow-lg transition-shadow duration-150"
      >
        <div className="w-56 md:w-60 flex flex-col">
          <span className="w-40 font-medium text-gray-700 dark:text-gray-300 truncate">
            {fav.title}
          </span>
          <a
            href={fav.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-52 hidden md:flex text-emerald-500 dark:text-emerald-400 text-sm hover:underline truncate"
          >
            {fav.url}
          </a>
        </div>
        <div className="text-gray-500 dark:text-white text-xs font-semibold">
          Drag me
        </div>
      </div>
    );
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

    case "upload":
      return (
        <div className="h-[18rem] w-full flex flex-col items-center space-y-4 md:h-auto md:space-y-6">
          <div className="w-full flex flex-col items-center">
            <h2 className="text-lg font-semibold">Upload Bookmarks</h2>
            <p className="text-sm text-gray-500 mt-1">
              Need help? Go to{" "}
              <span className="text-emerald-500 underline">How to Use</span> in
              the menu.
            </p>
            <UploadDropzone
              className="max-w-80 md:mt-5 p-6 w-full border-dashed border-2 border-gray-300 rounded-lg flex items-center justify-center text-green-700 hover:bg-green-50"
              endpoint="bookmarks"
              appearance={{
                container: "hover:bg-green-100 transition-all duration-300",
                uploadIcon: "text-green-600",
                label: "text-green-600 font-semibold hover:text-green-700",
                button:
                  "after:bg-[#1f5c2e] bg-[#308d46] hover:bg-[#27753b] text-white font-medium py-2 px-4 rounded cursor-pointer",
              }}
              onClientUploadComplete={async (res) => {
                if (res && res[0] && res[0].url) {
                  try {
                    const fileKey = res[0].key;
                    const response = await axios.post("/api/bookmark", {
                      fileKey,
                    });

                    if (response.status === 200 || response.status === 201) {
                      toast({
                        title: "Bookmark Uploaded",
                        description:
                          "Your bookmark file was uploaded and processed successfully.",
                      });
                    } else {
                      toast({
                        title: "Upload Failed",
                        description:
                          "There was an issue uploading your bookmark file. Please try again.",
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    console.error("Error uploading bookmark file:", error);
                    toast({
                      title: "Something Went Wrong",
                      description:
                        "An unexpected error occurred. Please try again later.",
                      variant: "destructive",
                    });
                  }
                }
              }}
            />
          </div>
        </div>
      );

    case "download":
      return (
        <div className="h-[18rem] w-full flex flex-col items-center space-y-4 md:h-auto md:space-y-6">
          <div className="w-full flex flex-col items-center">
            <h2 className="text-lg font-semibold">Download/Delete Bookmarks</h2>
            <div className="w-full mt-4 flex flex-col md:flex-row items-center justify-center md:space-x-3">
              <button
                onClick={handleDownload}
                className="w-80 md:w-56 px-4 py-3 text-white rounded-xl bg-[#308d46] hover:bg-[#27753b] transition flex items-center justify-center"
              >
                {isDownloading ? <Spinner /> : downloadStatus}
              </button>
              <button
                onClick={handleDelete}
                className="w-80 md:w-56 mt-4 md:mt-0 px-4 py-3 text-white rounded-xl bg-red-500 hover:bg-red-600 transition flex items-center justify-center"
              >
                {isDeleting ? <Spinner /> : deleteStatus}
              </button>
            </div>
          </div>
        </div>
      );

    case "set as default":
      return (
        <div className="h-[18rem] w-full flex flex-col items-center md:h-auto">
          <Tabs defaultValue="chrome" className="w-full max-w-[29rem] p-1">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chrome">Chrome</TabsTrigger>
              <TabsTrigger value="brave">Brave</TabsTrigger>
              <TabsTrigger value="edge">Edge</TabsTrigger>
            </TabsList>

            <TabsContent value="chrome">
              <Tabs defaultValue="desktop" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mt-3">
                  <TabsTrigger value="desktop">Chrome Desktop</TabsTrigger>
                  <TabsTrigger value="mobile"> Chrome Mobile</TabsTrigger>
                </TabsList>
                <TabsContent value="desktop">
                  <div className="w-full flex flex-col space-y-4 px-2 py-2 overflow-y-auto h-44 md:h-52">
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      Instructions for Setting BrowzFast as Default on Chrome
                      Desktop
                    </p>

                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      There are two ways to set it as default:
                    </p>

                    <div className="flex flex-col space-y-2">
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        1. With Extension (Recommended)
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Step 1: Go to the Chrome Web Store and download the
                        extension:
                      </p>

                      <ChromeStoreButton />

                      <div className="flex justify-center">
                        <img
                          src="/how-to-use-images/chrome-d-step-1.png"
                          alt="chrome-d-step-1"
                          className="w-full max-w-sm rounded-md shadow-md mt-2"
                        />
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Step 2: Open the options page from the extension
                        settings or by opening a new tab.
                      </p>

                      <div className="flex justify-center">
                        <img
                          src="/how-to-use-images/chrome-d-step-2.png"
                          alt="chrome-d-step-2"
                          className="w-full max-w-sm rounded-md shadow-md mt-2"
                        />
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Step 3: Click "Enable," then paste the BrowzFast Home
                        URL in the provided field:
                      </p>

                      <CopyHomePageButton />

                      <div className="flex justify-center">
                        <img
                          src="/how-to-use-images/chrome-d-step-3.png"
                          alt="chrome-d-step-3"
                          className="w-full max-w-sm rounded-md shadow-md mt-2"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                        2. Without Extension
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Set BrowzFast as your default homepage without an
                        extension. This will load only once at launch (not on
                        new tabs). For an always-on experience, consider using
                        the extension.
                      </p>
                      <ul className="text-sm list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-300">
                        <li>Open Chrome settings.</li>
                        <li>Select "On startup" option.</li>
                        <li>
                          Click on "Open a specific page or set of pages".
                        </li>
                        <li>Click "Add a new page".</li>
                        <li>
                          Paste the BrowzFast homepage link and click "Add".
                        </li>
                      </ul>
                      <CopyHomePageButton />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="mobile">
                  <div className="w-full flex flex-col space-y-4 px-2 py-2 overflow-y-auto h-44 md:h-52">
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      Instructions for Setting BrowzFast as Your Default
                      Homepage on Mobile
                    </p>
                    <div className="flex flex-col space-y-2">
                      <ol className="text-sm list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                        <li>Open Chrome settings on your mobile.</li>
                        <li>
                          Under the "Advanced" section, select "Homepage".
                        </li>
                        <li>Turn on the homepage option.</li>
                        <li>Choose the second option, "Enter custom URL".</li>
                        <li className="space-y-3">
                          <span>
                            Paste the BrowzFast homepage URL here and confirm.
                          </span>
                          <CopyHomePageButton />
                        </li>
                      </ol>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        For quicker access, visit the BrowzFast homepage and add
                        it to your home screen.
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Note: This will only open when launching Chrome, not on
                        new tabs.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="brave">
              <Tabs defaultValue="desktop" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mt-3">
                  <TabsTrigger value="desktop">Brave Desktop</TabsTrigger>
                  <TabsTrigger value="mobile">Brave Mobile</TabsTrigger>
                </TabsList>
                <TabsContent value="desktop">
                  <div className="w-full flex flex-col space-y-4 px-2 py-2 overflow-y-auto h-44 md:h-52">
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      Instructions for Setting BrowzFast as Default on Brave
                      Desktop
                    </p>

                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      There are two ways to set it as default:
                    </p>

                    <div className="flex flex-col space-y-2">
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        1. With Extension (Recommended)
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Step 1: Go to the Chrome Web Store and download the
                        extension:
                      </p>

                      <ChromeStoreButton />

                      <div className="flex justify-center">
                        <img
                          src="/how-to-use-images/chrome-d-step-1.png"
                          alt="chrome-d-step-1"
                          className="w-full max-w-sm rounded-md shadow-md mt-2"
                        />
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Step 2: Open the options page from the extension
                        settings or by opening a new tab.
                      </p>

                      <div className="flex justify-center">
                        <img
                          src="/how-to-use-images/chrome-d-step-2.png"
                          alt="chrome-d-step-2"
                          className="w-full max-w-sm rounded-md shadow-md mt-2"
                        />
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Step 3: Click "Enable," then paste the BrowzFast Home
                        URL in the provided field:
                      </p>

                      <CopyHomePageButton />

                      <div className="flex justify-center">
                        <img
                          src="/how-to-use-images/chrome-d-step-3.png"
                          alt="chrome-d-step-3"
                          className="w-full max-w-sm rounded-md shadow-md mt-2"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                        2. Without Extension
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Set BrowzFast as your default homepage without an
                        extension. This will load only once at launch (not on
                        new tabs). For an always-on experience, consider using
                        the extension.
                      </p>
                      <ul className="text-sm list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-300">
                        <li>Open Brave settings.</li>
                        <li>Select "Get started" option.</li>
                        <li>
                          Under On startup section, click "Open a specific page
                          or set of pages".
                        </li>
                        <li>Click "Add a new page".</li>
                        <li>
                          Paste the BrowzFast homepage link and click "Add".
                        </li>
                      </ul>
                      <CopyHomePageButton />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="mobile">
                  <div className="w-full flex flex-col space-y-4 px-2 py-2 overflow-y-auto h-44 md:h-52">
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      Instructions for Setting BrowzFast as Your Default
                      Homepage on Mobile
                    </p>
                    <div className="flex flex-col space-y-2">
                      <ol className="text-sm list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                        <li>Open Brave settings on your mobile.</li>
                        <li>Under the "Genral" section, select "Homepage".</li>
                        <li>Turn on the homepage option.</li>
                        <li>Choose the second option, "Enter custom URL".</li>
                        <li className="space-y-3">
                          <span>
                            Paste the BrowzFast homepage URL here and confirm.
                          </span>
                          <CopyHomePageButton />
                        </li>
                      </ol>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        For quicker access, visit the BrowzFast homepage and add
                        it to your home screen.
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Note: This will only open when launching brave, not on
                        new tabs.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="edge">
              <Tabs defaultValue="desktop" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mt-3">
                  <TabsTrigger value="desktop">Edge Desktop</TabsTrigger>
                  <TabsTrigger value="mobile">Edge Mobile</TabsTrigger>
                </TabsList>
                <TabsContent value="desktop">
                  <div className="w-full flex flex-col space-y-4 px-2 py-2 overflow-y-auto h-44 md:h-52">
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      Instructions for Setting BrowzFast as Default on Edge
                      Desktop
                    </p>

                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      There are two ways to set it as default:
                    </p>

                    <div className="flex flex-col space-y-2">
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        1. With Extension (Recommended)
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Step 1: Go to the Chrome Web Store and download and
                        Enable the extension:
                      </p>

                      <ChromeStoreButton />

                      <div className="flex justify-center">
                        <img
                          src="/how-to-use-images/chrome-d-step-1.png"
                          alt="chrome-d-step-1"
                          className="w-full max-w-sm rounded-md shadow-md mt-2"
                        />
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Step 2: Open the options page from the extension
                        settings or by opening a new tab.
                      </p>

                      <div className="flex justify-center">
                        <img
                          src="/how-to-use-images/chrome-d-step-2.png"
                          alt="chrome-d-step-2"
                          className="w-full max-w-sm rounded-md shadow-md mt-2"
                        />
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Step 3: Click "Enable," then paste the BrowzFast Home
                        URL in the provided field:
                      </p>

                      <CopyHomePageButton />

                      <div className="flex justify-center">
                        <img
                          src="/how-to-use-images/chrome-d-step-3.png"
                          alt="chrome-d-step-3"
                          className="w-full max-w-sm rounded-md shadow-md mt-2"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                        2. Without Extension
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Set BrowzFast as your default homepage without an
                        extension. This will load only once at launch (not on
                        new tabs). For an always-on experience, consider using
                        the extension.
                      </p>
                      <ul className="text-sm list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-300">
                        <li>Open Edge settings.</li>
                        <li>Select "Start, home, and new tab page" option.</li>
                        <li>
                          Under "When Edge starts" option click on "Open these
                          pages".
                        </li>
                        <li>Click "Add a new page".</li>
                        <li>
                          Paste the BrowzFast homepage link and click "Add".
                        </li>
                      </ul>
                      <CopyHomePageButton />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="mobile">
                  <div className="w-full flex flex-col space-y-4 px-2 py-2 overflow-y-auto h-44 md:h-52">
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      Instructions for Setting BrowzFast as Your Default
                      Homepage on Mobile
                    </p>
                    <div className="flex flex-col space-y-2">
                      <ol className="text-sm list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                        <li>Open Edge settings on your mobile.</li>
                        <li>Click the "General" option.</li>
                        <li>
                          Under Home page section, Choose the second option, "A
                          specific page".
                        </li>
                        <li></li>
                        <li className="space-y-3">
                          <span>
                            Paste the BrowzFast homepage URL here and save.
                          </span>
                          <CopyHomePageButton />
                        </li>
                      </ol>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        For quicker access, visit the BrowzFast homepage and add
                        it to your home screen.
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Note: This will only open when launching edge, not on
                        new tabs.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      );

    case "manage bookmark":
      return (
        <div className="h-[18rem] px-1 md:pl-8 md:pr-3 w-full flex flex-col items-center md:h-auto">
          <div className="max-w-[29rem] flex flex-col space-y-2">
            <p className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-100">
              How BrowzFast Helps Manage Bookmarks?
            </p>
            <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">
              BrowzFast lets you save bookmarks by exporting them, making it
              easy to use them on any device.
            </p>
            <Tabs defaultValue="upload" className="w-full max-w-[29rem]">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="upload" className="text-xs md:text-sm">
                  Upload
                </TabsTrigger>
                <TabsTrigger value="download" className="text-xs md:text-sm">
                  Download
                </TabsTrigger>
                <TabsTrigger value="delete" className="text-xs md:text-sm">
                  Delete
                </TabsTrigger>
                <TabsTrigger value="export" className="text-xs md:text-sm">
                  Expt./Imp.
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <div className="w-full flex flex-col space-y-4 overflow-y-auto h-32 md:h-44">
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Steps for Uploading Bookmark File
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    1. Create a file by exporting the bookmark file. If you're
                    unsure about the process, check the "Import/Export" section
                    for guidance.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    2. Go to "Manage Bookmarks" in the menu.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    3. Select "Upload" and choose your file.
                  </p>
                  <div className="flex justify-center">
                    <img
                      src="/how-to-use-images/bookmark-steps-1.png"
                      alt="Upload steps"
                      className="w-full max-w-sm rounded-md shadow-md"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="download">
                <div className="w-full flex flex-col space-y-4 overflow-y-auto h-32 md:h-44">
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Steps for Downloading Bookmark File
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    1. Go to "Manage Bookmarks" in the menu.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    2. Select "Download" to save your bookmarks.
                  </p>
                  <div className="flex justify-center">
                    <img
                      src="/how-to-use-images/bookmark-steps-2.png"
                      alt="Download steps"
                      className="w-full max-w-sm rounded-md shadow-md"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="delete">
                <div className="w-full flex flex-col space-y-4 overflow-y-auto h-32 md:h-44">
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Steps for Deleting Bookmark File
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    1. Go to "Manage Bookmarks" in the menu.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    2. Select "Delete" to remove your bookmarks.
                  </p>
                  <div className="flex justify-center">
                    <img
                      src="/how-to-use-images/bookmark-steps-3.png"
                      alt="Delete steps"
                      className="w-full max-w-sm rounded-md shadow-md"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="export">
                <div className="w-full flex flex-col space-y-4 overflow-y-auto h-32 md:h-44">
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Steps for Exporting Bookmark File
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    1. Open the bookmark manager.
                  </p>
                  <div className="flex justify-center">
                    <img
                      src="/how-to-use-images/bookmark-steps-4.png"
                      alt="Export steps"
                      className="w-full max-w-sm rounded-md shadow-md"
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    2. Click the menu icon, then "Export".
                  </p>
                  <div className="flex justify-center">
                    <img
                      src="/how-to-use-images/bookmark-steps-5.png"
                      alt="Export steps"
                      className="w-full max-w-sm rounded-md shadow-md"
                    />
                  </div>

                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Steps for Importing Bookmark File
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    1. Open the bookmark manager.
                  </p>
                  <div className="flex justify-center">
                    <img
                      src="/how-to-use-images/bookmark-steps-4.png"
                      alt="Import steps"
                      className="w-full max-w-sm rounded-md shadow-md"
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    2. Click the menu icon, then "Import".
                  </p>
                  <div className="flex justify-center">
                    <img
                      src="/how-to-use-images/bookmark-steps-5.png"
                      alt="Export steps"
                      className="w-full max-w-sm rounded-md shadow-md"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      );

    case "reorderFavourite":
      return (
        <div className="h-[18rem] md:h-auto py-2 w-full flex flex-col items-center overflow-hidden">
          <div className="max-w-[30rem] flex flex-col space-y-2 overflow-y-auto h-80">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={favourites.map((fav) => fav.url)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {favourites.map((fav) => (
                    <SortableItem key={fav.url} id={fav.url} fav={fav} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      );

    default:
      return null;
  }
};
