"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowUpLeft, History, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [previousSearches, setPreviousSearches] = useState<string[]>([]);
  const inputCss =
    "pl-14 pr-14 py-3 w-full bg-white/5 border border-gray-400 text-gray-800 selection:bg-[#308d46] dark:text-white rounded-full placeholder-gray-400 focus:outline-none backdrop-blur-sm text-base font-semibold shadow-2xl";
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedSearches = JSON.parse(localStorage.getItem("searches") || "[]");
    setPreviousSearches(storedSearches);
  }, []);

  const handleSearch = (query: string) => {
    if (!query) {
      return;
    }

    setShowDropdown(false);

    const existingIndex = previousSearches.indexOf(query);

    let updatedSearches;
    if (existingIndex !== -1) {
      updatedSearches = [
        previousSearches[existingIndex],
        ...previousSearches.slice(0, existingIndex),
        ...previousSearches.slice(existingIndex + 1),
      ];
    } else {
      updatedSearches = [query, ...previousSearches].slice(0, 5);
    }
    localStorage.setItem("searches", JSON.stringify(updatedSearches));
    setPreviousSearches(updatedSearches);

    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
      query
    )}`;
  };

  const handleSelectSearch = (query: string) => {
    setSearchQuery(query);
    setShowDropdown(false);
    handleSearch(query);
  };

  const handleDeleteSearch = (query: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedSearches = previousSearches.filter(
      (search) => search !== query
    );
    setPreviousSearches(updatedSearches);
    localStorage.setItem("searches", JSON.stringify(updatedSearches));
    setShowDropdown(true);
  };

  const handleChangeSearch = (query: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchQuery(query);
    setShowDropdown(true);
  };

  const handleInputClick = () => {
    setShowDropdown(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchBarRef.current &&
      !searchBarRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={searchBarRef}
      className="relative w-80 sm:w-[27rem] md:w-[29rem] lg:w-[35rem]"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(searchQuery);
        }}
        className="relative"
      >
        <img
          src="/google-icon.svg"
          alt="Google"
          className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10"
        />
        <input
          type="text"
          name="q"
          placeholder="Search the web"
          autoComplete="off"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClick={handleInputClick}
          className={cn(
            inputCss,
            showDropdown && previousSearches.length > 0
              ? "rounded-none rounded-t-3xl"
              : ""
          )}
        />
        <button
          type="submit"
          className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-transparent border-none cursor-pointer"
        >
          <Search className="text-gray-300 w-5 h-5" />
        </button>
        {showDropdown && previousSearches.length > 0 && (
          <ul className="absolute w-full bg-white/5 border border-gray-400 text-gray-800 dark:text-white placeholder-gray-400 rounded-b-3xl focus:outline-none backdrop-blur-sm text-base font-semibold shadow-2xl max-h-40 overflow-y-auto z-20">
            {previousSearches.map((search, index) => (
              <li
                key={index}
                className="flex flex-row justify-between py-3 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10"
              >
                <div
                  onClick={() => handleSelectSearch(search)}
                  className="flex flex-row items-center w-full"
                >
                  <History className="ml-5 mr-4 w-5 h-5" />
                  <p className="max-w-[11rem] sm:max-w-[18rem] md:max-w-[20rem] lg:max-w-[25rem] overflow-hidden text-ellipsis whitespace-nowrap">
                    {search}
                  </p>
                </div>
                <div className="flex flex-row items-center">
                  <ArrowUpLeft
                    onClick={(e) => handleChangeSearch(search, e)}
                    className="w-5 h-5 mr-2"
                  />
                  <X
                    onClick={(e) => handleDeleteSearch(search, e)}
                    className="w-5 h-5 mr-2"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
