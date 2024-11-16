import { useState, useEffect } from "react";

import { EllipsisVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface EllipsisMenuProps {
  title: string;
  url: string;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newTitle: string, newUrl: string) => void;
}

const EllipsisMenu = ({
  title,
  url,
  onDelete,
  onUpdate,
}: EllipsisMenuProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [siteName, setSiteName] = useState(title);
  const [siteUrl, setSiteUrl] = useState(url);
  const [hasChanged, setHasChanged] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const buttonCss =
    "p-2.5 pl-6 cursor-pointer text-xs hover:bg-gray-200 dark:hover:bg-[#2d2b2b]";

  useEffect(() => {
    setHasChanged(siteName !== title || siteUrl !== url);
  }, [siteName, siteUrl, title, url]);

  const updateFavourite = async () => {
    if (hasChanged) {
      setLoading(true);
      try {
        onUpdate(siteName, siteUrl, url);
        setDialogOpen(false);
        setPopoverOpen(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteFavourite = async () => {
    setLoading(true);
    try {
      onDelete(url);
      setPopoverOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <div className="p-1.5 cursor-pointer">
            <EllipsisVertical className="h-4 w-4 text-gray-600 dark:text-white" />
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-32 p-0 py-2 shadow-lg">
          <div className="flex flex-col">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger className={buttonCss} asChild>
                <div>Edit favourite</div>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit favourite</DialogTitle>
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
                    onClick={updateFavourite}
                    disabled={!hasChanged || loading}
                    className="text-black dark:text-white bg-[#308d46] hover:bg-[#27753b]"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                    ) : (
                      "Done"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div
              className={`${buttonCss} ${loading ? "opacity-50" : ""}`}
              onClick={!loading ? deleteFavourite : undefined}
            >
              Remove
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default EllipsisMenu;
