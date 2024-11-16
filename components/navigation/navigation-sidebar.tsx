import { NavigationAction } from "./navigation-action";

export const NavigationSidebar = () => {
  return (
    <div className="h-full w-full py-3 flex flex-col items-center space-y-4 text-primary bg-slate-100 dark:bg-[#171717] md:px-3 ">
      <NavigationAction />
    </div>
  );
};
