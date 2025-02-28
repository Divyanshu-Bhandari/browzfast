"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Image from "next/image";
import { useUI } from "@/context/UIContext";

import { Plus } from "lucide-react";
import EllipsisMenu from "@/components/ellipsisMenu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const FavouriteSites = () => {
  const { favourites, setFavourites } = useUI();
  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Debounced resize listener to update itemsPerPage
  useEffect(() => {
    const updateItemsPerPage = () => {
      let newItemsPerPage = itemsPerPage;
      if (window.innerWidth >= 1024) {
        newItemsPerPage = 10;
      } else if (window.innerWidth >= 640) {
        newItemsPerPage = 8;
      } else {
        newItemsPerPage = 9;
      }
      if (newItemsPerPage !== itemsPerPage) {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(0);
      }
    };

    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateItemsPerPage, 200);
    };

    window.addEventListener("resize", handleResize);
    updateItemsPerPage(); // initial call

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [itemsPerPage, favourites.length]);

  // Fetch favourites on mount
  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const { data } = await axios.get("/api/favourites");
        if (data) {
          setFavourites(data);
        }
      } catch (error) {
        toast({
          title: "Failed to Load Favorites",
          description:
            "Unable to fetch your favorites. Please check your connection or try again later.",
          variant: "destructive",
        });
      }
    };

    fetchFavourites();
  }, [setFavourites, toast]);

  const dataClean = (siteName: string, siteUrl: string) => {
    const cleanedSiteName = siteName.trim() || siteUrl;
    let cleanedSiteUrl = siteUrl.trim().toLowerCase();
    if (
      !cleanedSiteUrl.startsWith("http://") &&
      !cleanedSiteUrl.startsWith("https://")
    ) {
      cleanedSiteUrl = `https://${cleanedSiteUrl}/`;
    }
    return { cleanedSiteName, cleanedSiteUrl };
  };

  const addFavourite = async () => {
    if (siteUrl && !loading) {
      const { cleanedSiteName, cleanedSiteUrl } = dataClean(siteName, siteUrl);
      const isDuplicate = favourites.some((fav) => fav.url === cleanedSiteUrl);
      if (isDuplicate) {
        toast({
          title: "Duplicate Favorite",
          description: `"${cleanedSiteName}" is already in your favorites.`,
          variant: "destructive",
        });
        return;
      }

      setLoading(true);
      try {
        const { data } = await axios.post("/api/favourites", {
          title: cleanedSiteName,
          url: cleanedSiteUrl,
        });
        setFavourites([...favourites, data]);
        setSiteName("");
        setSiteUrl("");
        toast({
          title: "Favorite Added",
          description: `"${cleanedSiteName}" has been successfully added to your favorites!`,
        });
        setDialogOpen(false);
      } catch (error) {
        toast({
          title: "Failed to Add Favorite",
          description:
            "Something went wrong while saving your favorite. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const updateFavourite = async (
    newTitle: string,
    newUrl: string,
    oldUrl: string
  ) => {
    const { cleanedSiteName, cleanedSiteUrl } = dataClean(newTitle, newUrl);
    try {
      const { data } = await axios.put(`/api/favourites`, {
        title: cleanedSiteName,
        url: cleanedSiteUrl,
        oldUrl: oldUrl,
      });
      toast({
        title: "Favorite Updated",
        description: `"${cleanedSiteName}" has been successfully updated!`,
      });
      setFavourites((prevFavourites) =>
        prevFavourites.map((fav) =>
          fav.url === oldUrl ? { ...fav, title: data.title, url: data.url } : fav
        )
      );
    } catch (error) {
      toast({
        title: "Failed to Update Favorite",
        description:
          "An error occurred while updating your favorite. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteFavourite = async (url: string) => {
    try {
      await axios.delete(`/api/favourites?url=${url}`);
      setFavourites((prevFavourites) =>
        prevFavourites.filter((fav) => fav.url !== url)
      );
      toast({
        title: "Favorite Deleted",
        description: "The favorite has been successfully removed.",
      });
    } catch (error) {
      toast({
        title: "Failed to Delete Favorite",
        description:
          "An error occurred while deleting your favorite. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getFaviconUrl = (url: string) => {
    const domain = encodeURIComponent(url);
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  };

  const totalItems = favourites.length;
  const totalPages = useMemo(
    () => Math.ceil((totalItems < 20 ? totalItems + 1 : totalItems) / itemsPerPage),
    [totalItems, itemsPerPage]
  );

  const displayFavourites = useMemo(
    () =>
      favourites.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage),
    [favourites, currentPage, itemsPerPage]
  );

  const shouldDisplayAddFavouriteButton =
    favourites.length < 20 && displayFavourites.length < itemsPerPage;

  return (
    <div className="favorite-website-section h-[23rem] sm:h-[16rem] flex flex-col justify-between mt-4">
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5">
        {displayFavourites.map((fav) => (
          <div
            key={fav.url}
            className="relative flex flex-col items-center justify-center p-4 h-28 w-28 rounded-lg text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 group"
          >
            <a
              href={fav.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-full flex flex-col items-center justify-center"
            >
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-black/10 dark:bg-white/10 backdrop-blur-sm">
                <Image
                  src={getFaviconUrl(fav.url)}
                  alt={`${fav.title.charAt(0)}`}
                  width={28}
                  height={28}
                  className="w-7 h-7"
                />
              </div>
              <p className="mt-4 text-xs font-semibold text-black dark:text-white overflow-hidden whitespace-nowrap text-ellipsis w-full text-center">
                {fav.title}
              </p>
            </a>
            <div className="absolute top-1 right-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 md:opacity-0 md:group-hover:opacity-100 md:transition-opacity md:duration-200 cursor-pointer">
              <EllipsisMenu
                title={fav.title}
                url={fav.url}
                onDelete={deleteFavourite}
                onUpdate={updateFavourite}
              />
            </div>
          </div>
        ))}

        {shouldDisplayAddFavouriteButton && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <div className="flex flex-col items-center justify-center h-28 w-28 p-3 border-none rounded-lg text-white cursor-pointer hover:bg-black/10 dark:hover:bg-white/10">
                <div className="p-3 rounded-full bg-black/10 dark:bg-white/10 backdrop-blur-sm">
                  <Plus className="w-6 h-6 text-black dark:text-white" />
                </div>
                <p className="mt-4 text-xs font-semibold text-black dark:text-white ">
                  Add favourite
                </p>
              </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add favourite</DialogTitle>
              </DialogHeader>

              <div>
                <div className="pb-4">
                  <Label htmlFor="site-name" className="text-xs p-1">
                    Name
                  </Label>
                  <Input
                    id="site-name"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="mt-1 focus-visible:ring-[#308d46] selection:bg-[#308d46]"
                    maxLength={100}
                  />
                </div>

                <div>
                  <Label htmlFor="site-url" className="text-xs p-1">
                    URL
                  </Label>
                  <Input
                    id="site-url"
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                    className="mt-1 focus-visible:ring-[#308d46] selection:bg-[#308d46]"
                    maxLength={255}
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={addFavourite}
                  disabled={!siteUrl}
                  className="text-black dark:text-white bg-[#308d46] hover:bg-[#27753b]"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-black dark:border-white" />
                  ) : (
                    "Add"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`h-2 w-2 rounded-full ${
              currentPage === index
                ? "bg-[#308d46]"
                : "bg-gray-400 dark:bg-gray-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FavouriteSites;