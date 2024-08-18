"use client";
import { useState } from "react";

import { Upload, X } from "lucide-react";

interface FileUploadProps {
  backgroundImage: string | null;
  setBackgroundImage: (image: string | null) => void;
}

export const FileUpload = ({
  backgroundImage,
  setBackgroundImage,
}: FileUploadProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const maxSizeMB = 4;
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        setError(`File size exceeds ${maxSizeMB} MB.`);
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setBackgroundImage(result);
        localStorage.setItem("backgroundImage", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setBackgroundImage(null);
    localStorage.removeItem("backgroundImage");
  };

  return (
    <div className="w-[320px] h-[230px] md:w-[219px] md:h-[140px] border bg-slate-200 dark:bg-[#414040] rounded-md">
      {!backgroundImage && (
        <div className="w-full h-full flex items-center justify-center">
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className=" flex flex-col items-center rounded cursor-pointer space-y-1"
          >
            <Upload />
            <p className="text-xs">Upload from Device</p>
            <p className="text-xs">Max: 4MB</p>
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </label>
        </div>
      )}
      {backgroundImage && (
        <div className="relative w-full h-full">
          <img
            src={backgroundImage}
            alt="Uploaded"
            className="rounded-md w-full h-full object-cover"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-sm"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="absolute font-semibold top-2 left-2 text-xs bg-[#308d46] rounded-lg p-1 animate-shine">
            Current
          </p>
        </div>
      )}
    </div>
  );
};
