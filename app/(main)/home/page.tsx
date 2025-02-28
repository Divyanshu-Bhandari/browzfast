import { initialUser } from "@/lib/initial-user";
import dynamic from "next/dynamic";

import { MobileToggle } from "@/components/mobile-toggle";
import Clock from "@/components/clock";
import SearchBar from "@/components/searchbar";
const FavouriteSites = dynamic(() => import("@/components/favourite-sites"), { ssr: false });
const HomePage = async () => {
  const initializeUser = await initialUser();
  return (
    <>
      <MobileToggle />
      <div className="w-full h-auto flex flex-col items-center md:pt-14">
        <div className="mt-6 select-none w-full flex justify-center lg:justify-end lg:pr-10">
          <Clock />
        </div>
        <div className="mt-44">
          <SearchBar />
        </div>
        <div>
          <FavouriteSites />
        </div>
      </div>
    </>
  );
};

export default HomePage;